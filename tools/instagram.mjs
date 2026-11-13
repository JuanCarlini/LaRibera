/**
 * Comprueba y renueva el token de la API de Instagram.
 *
 * Son las dos únicas tareas manuales que tiene la sección de obra: verificar
 * que un token recién generado sirve, y renovarlo antes de que venza a los 60
 * días. Un token vencido no se recupera: hay que generar otro a mano desde el
 * panel de Meta.
 *
 *   node tools/instagram.mjs probar      # ¿sirve? ¿qué devuelve?
 *   node tools/instagram.mjs renovar     # otros 60 días
 *
 * Toma el token del argumento, de INSTAGRAM_TOKEN en el entorno o de
 * .env.local, en ese orden:
 *
 *   node tools/instagram.mjs probar EAAG...
 *
 * No escribe nada: el token nuevo se copia a mano a Vercel y a .env.local.
 * Ver docs/03-instagram.md.
 */
import { readFileSync } from "node:fs";

/** Los mismos campos que pide src/lib/instagram.ts. */
const CAMPOS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

const fallar = (motivo) => {
  console.error(`\n  ✖ ${motivo}\n`);
  process.exit(1);
};

/** El token, de donde aparezca primero. */
function leerToken() {
  const delArgumento = process.argv[3];
  if (delArgumento) return delArgumento;
  if (process.env.INSTAGRAM_TOKEN) return process.env.INSTAGRAM_TOKEN;

  try {
    const env = readFileSync(".env.local", "utf8");
    const linea = env.match(/^INSTAGRAM_TOKEN=(.+)$/m);
    if (linea?.[1].trim()) return linea[1].trim();
  } catch {
    // Sin .env.local no pasa nada: cae en el mensaje de abajo.
  }

  return null;
}

/** GET que explica el error de Meta en lugar de tirar un stack. */
async function pedir(url) {
  const respuesta = await fetch(url);
  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const motivo = cuerpo?.error?.message ?? `HTTP ${respuesta.status}`;
    fallar(`Instagram rechazó la llamada: ${motivo}`);
  }

  return cuerpo;
}

async function probar(token) {
  const cuenta = await pedir(
    `https://graph.instagram.com/me?fields=user_id,username,account_type&access_token=${token}`,
  );

  // /me devuelve el objeto suelto o dentro de data según la versión.
  const datos = Array.isArray(cuenta?.data) ? cuenta.data[0] : cuenta;
  console.log(`\n  Cuenta:  @${datos?.username ?? "?"}`);
  console.log(`  Tipo:    ${datos?.account_type ?? "?"}`);

  if (datos?.account_type && !/business|creator/i.test(datos.account_type)) {
    console.log("\n  ⚠ La API sólo devuelve media de cuentas profesionales.");
  }

  const feed = await pedir(
    `https://graph.instagram.com/me/media?fields=${CAMPOS}&limit=8&access_token=${token}`,
  );
  const medias = feed?.data ?? [];

  console.log(`\n  Últimas ${medias.length} publicaciones:\n`);

  for (const m of medias) {
    const esVideo = m.media_type === "VIDEO";
    const portada = esVideo ? (m.thumbnail_url ?? m.media_url) : (m.media_url ?? m.thumbnail_url);
    const fecha = m.timestamp ? m.timestamp.slice(0, 10) : "?";
    const marca = portada ? (esVideo ? "▶" : "■") : "✖";

    console.log(`    ${marca} ${fecha}  ${m.media_type ?? "?"}`);
    if (!portada) {
      console.log("        sin imagen de portada: esta pieza se descarta");
    }
  }

  const sinPortada = medias.filter(
    (m) => !(m.media_type === "VIDEO" ? (m.thumbnail_url ?? m.media_url) : (m.media_url ?? m.thumbnail_url)),
  ).length;

  console.log(
    `\n  ✔ El token sirve. La grilla va a mostrar ${medias.length - sinPortada} de ${medias.length}.\n`,
  );
}

async function renovar(token) {
  const nuevo = await pedir(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
  );

  const dias = Math.round((nuevo.expires_in ?? 0) / 86400);
  const vence = new Date(Date.now() + (nuevo.expires_in ?? 0) * 1000);

  console.log(`\n  Token nuevo, vence en ${dias} días (${vence.toLocaleDateString("es-AR")}):\n`);
  console.log(`    ${nuevo.access_token}\n`);
  console.log("  Copialo en Vercel (Settings → Environment Variables → INSTAGRAM_TOKEN)");
  console.log("  y redeployá. Si lo usás en local, también en .env.local.\n");
}

const accion = process.argv[2];
if (!["probar", "renovar"].includes(accion)) {
  fallar("Uso: node tools/instagram.mjs probar|renovar [token]");
}

const token = leerToken();
if (!token) {
  fallar(
    "No hay token. Pasalo como argumento, exportá INSTAGRAM_TOKEN\n    o ponelo en .env.local. Cómo generarlo: docs/03-instagram.md",
  );
}

await (accion === "probar" ? probar(token) : renovar(token));
