/**
 * Últimas publicaciones de la cuenta de Instagram del loteo.
 *
 * Se traen desde el servidor y se dibujan con el HTML de la página: nada del
 * embed oficial de Instagram, que carga ~100 KB de JavaScript de Meta y deja
 * cookies de terceros al renderizar. La política de privacidad promete que el
 * sitio no usa cookies, así que esa vía está descartada.
 *
 * Setup: Instagram API con inicio de sesión unificado (Unified Login) sobre
 * una cuenta profesional. Es lo único disponible en las apps creadas desde
 * 2026: la variante con inicio de sesión de Instagram —`graph.instagram.com`
 * y `/me/media`— ya no se puede configurar. El token es de usuario del sistema
 * y no caduca. Ver docs/03-instagram.md.
 *
 * Si falta el token o el id de la cuenta, o la API falla, estas funciones
 * devuelven una lista vacía y la sección no se dibuja: la página nunca se cae
 * por esto.
 */

/**
 * Unified Login va por el host de la Graph API, con el id de la cuenta en la
 * ruta. La versión va fija porque sin ella Meta sirve la más vieja que siga
 * viva; conviene revisarla cuando quede fuera de soporte (unos dos años).
 */
const HOST = "https://graph.facebook.com/v27.0";

const CAMPOS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

/**
 * Cada cuánto se vuelve a preguntar por el feed, en segundos.
 *
 * Seis horas y no una: cada relectura devuelve URLs nuevas del CDN de Meta
 * —vienen firmadas— y para `next/image` cada URL es una imagen distinta que
 * hay que volver a optimizar. A una hora serían ~5.800 optimizaciones al mes,
 * por encima de las 5.000 que incluye el plan Hobby de Vercel. A seis horas
 * son menos de 1.000, y una obra no publica más seguido que eso.
 */
const REVALIDAR = 21600;

/** Una publicación ya normalizada, lista para la grilla. */
export type Publicacion = {
  id: string;
  /** URL del post en Instagram. Es el único destino: no reproducimos acá. */
  permalink: string;
  /** Imagen de portada. */
  portada: string;
  /** Marca el ícono de play sobre la miniatura. */
  esVideo: boolean;
  /** Texto para el alt, derivado del epígrafe. */
  alt: string;
};

type MediaCruda = {
  id?: string;
  caption?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
};

/**
 * Qué imagen mostrar.
 *
 * Desde el 30/07/2026 Meta omite `media_url` en todo el media de video —reels,
 * posts de video e historias— incluso en el de la propia cuenta. Para video la
 * portada sale de `thumbnail_url`, que es justamente el campo que la API
 * devuelve sólo en videos.
 */
function portadaDe(m: MediaCruda) {
  return m.media_type === "VIDEO"
    ? (m.thumbnail_url ?? m.media_url)
    : (m.media_url ?? m.thumbnail_url);
}

/**
 * Epígrafe convertido en texto alternativo: sin hashtags, sin arrobas y sin
 * saltos de línea, que leídos por un lector de pantalla son ruido.
 */
function altDe(caption: string | undefined, respaldo: string) {
  const limpio = (caption ?? "")
    .replace(/[#@][\p{L}\p{N}_.]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!limpio) return respaldo;
  return limpio.length > 120 ? `${limpio.slice(0, 119).trimEnd()}…` : limpio;
}

/**
 * Las últimas `cantidad` publicaciones. Devuelve `[]` ante cualquier problema
 * —falta el token o el id, la API responde mal— y nunca lanza: la sección que
 * la consume decide no dibujarse y el resto de la página sigue igual.
 */
export async function ultimasPublicaciones(cantidad = 8): Promise<Publicacion[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  const cuenta = process.env.INSTAGRAM_ACCOUNT_ID;
  if (!token || !cuenta) return [];

  const url = new URL(`${HOST}/${cuenta}/media`);
  url.searchParams.set("fields", CAMPOS);
  url.searchParams.set("limit", String(cantidad));
  url.searchParams.set("access_token", token);

  try {
    const respuesta = await fetch(url, { next: { revalidate: REVALIDAR } });

    if (!respuesta.ok) {
      // El cuerpo del error trae el motivo (token revocado, permiso que falta).
      // Va a los logs del servidor; el visitante sólo ve la página sin sección.
      console.error(
        `Instagram respondió ${respuesta.status}:`,
        await respuesta.text().catch(() => "(sin cuerpo)"),
      );
      return [];
    }

    const { data } = (await respuesta.json()) as { data?: MediaCruda[] };

    return (data ?? [])
      .map((m) => {
        const portada = portadaDe(m);
        if (!m.id || !m.permalink || !portada) return null;

        return {
          id: m.id,
          permalink: m.permalink,
          portada,
          esVideo: m.media_type === "VIDEO",
          alt: altDe(m.caption, "Publicación de La Ribera en Instagram"),
        } satisfies Publicacion;
      })
      .filter((p): p is Publicacion => p !== null);
  } catch (error) {
    console.error("No se pudo leer el feed de Instagram:", error);
    return [];
  }
}
