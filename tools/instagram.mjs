/**
 * Comprueba el token de la API de Instagram antes de cargarlo en Vercel.
 *
 * Dice de qué cuenta es, si es profesional y qué publicaciones va a mostrar la
 * grilla. Con el inicio de sesión unificado el token es de usuario del sistema
 * y no caduca, así que no hay nada que renovar: esto se usa una vez al
 * configurar, y después sólo si algo deja de verse.
 *
 *   node tools/instagram.mjs
 *   node tools/instagram.mjs <token> <id-de-cuenta>
 *
 * Sin argumentos toma INSTAGRAM_TOKEN e INSTAGRAM_ACCOUNT_ID del entorno o de
 * .env.local. No escribe nada. Ver docs/03-instagram.md.
 */
import { readFileSync } from "node:fs";

/** Los mismos host, versión y campos que src/lib/instagram.ts. */
const HOST = "https://graph.facebook.com/v27.0";
const CAMPOS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

const fallar = (motivo) => {
  console.error(`\n  ✖ ${motivo}\n`);
  process.exit(1);
};

/** Lee una variable del argumento, del entorno o de .env.local, en ese orden. */
function leer(nombre, posicion) {
  const delArgumento = process.argv[posicion];
  if (delArgumento) return delArgumento;
  if (process.env[nombre]) return process.env[nombre];

  try {
    const env = readFileSync(".env.local", "utf8");
    const linea = env.match(new RegExp(`^${nombre}=(.+)$`, "m"));
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

const token = leer("INSTAGRAM_TOKEN", 2);
const cuenta = leer("INSTAGRAM_ACCOUNT_ID", 3);

if (!token || !cuenta) {
  fallar(
    "Faltan el token o el id de la cuenta. Pasalos como argumentos,\n    exportalos o ponelos en .env.local. Cómo obtenerlos: docs/03-instagram.md",
  );
}

const perfil = await pedir(
  `${HOST}/${cuenta}?fields=username,name&access_token=${token}`,
);

console.log(`\n  Cuenta:  @${perfil?.username ?? "?"}`);
if (perfil?.name) console.log(`  Nombre:  ${perfil.name}`);

const feed = await pedir(
  `${HOST}/${cuenta}/media?fields=${CAMPOS}&limit=8&access_token=${token}`,
);
const medias = feed?.data ?? [];

const portadaDe = (m) =>
  m.media_type === "VIDEO"
    ? (m.thumbnail_url ?? m.media_url)
    : (m.media_url ?? m.thumbnail_url);

console.log(`\n  Últimas ${medias.length} publicaciones:\n`);

for (const m of medias) {
  const portada = portadaDe(m);
  const fecha = m.timestamp ? m.timestamp.slice(0, 10) : "?";
  const marca = portada ? (m.media_type === "VIDEO" ? "▶" : "■") : "✖";

  console.log(`    ${marca} ${fecha}  ${m.media_type ?? "?"}`);
  if (!portada) console.log("        sin imagen de portada: esta pieza se descarta");
}

const sinPortada = medias.filter((m) => !portadaDe(m)).length;
console.log(
  `\n  ✔ El token sirve. La grilla va a mostrar ${medias.length - sinPortada} de ${medias.length}.\n`,
);
