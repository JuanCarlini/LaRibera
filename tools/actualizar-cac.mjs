/**
 * Actualiza src/content/cac.json con el último Indicador CAMARCO publicado.
 *
 * CAMARCO no expone una API del índice, pero su sitio corre WordPress y publica
 * el dato en una nota mensual. Leemos esa nota por la REST API de WP en lugar de
 * scrapear el HTML del tema: el marcado del theme cambia seguido, el JSON no.
 *
 * Si algo no se puede parsear, sale con error y NO toca el archivo: preferimos
 * quedarnos con el dato viejo antes que escribir uno inventado.
 *
 *   node tools/actualizar-cac.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const API = "https://www.camarco.org.ar/wp-json/wp/v2/posts";
const NOTA = "https://www.camarco.org.ar/indicadores/indicadores-de-costos/";
const DESTINO = "src/content/cac.json";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const aNumero = (txt) => {
  // "21.960,7" y "21.960.7" conviven en el sitio. El último separador seguido
  // de una o dos cifras es el decimal; el resto son miles.
  const limpio = txt.trim();
  const m = limpio.match(/^(.*)[.,](\d{1,2})$/);
  return m ? Number(m[1].replace(/[.,]/g, "") + "." + m[2]) : Number(limpio.replace(/[.,]/g, ""));
};

const textoPlano = (html) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/\s+/g, " ");

function periodoDesdeTitulo(titulo) {
  const m = titulo.match(new RegExp(`(${MESES.join("|")})\\s+(\\d{4})`, "i"));
  if (!m) return null;
  const mes = m[1].toLowerCase();
  return {
    etiqueta: `${mes[0].toUpperCase()}${mes.slice(1)} ${m[2]}`,
    orden: `${m[2]}-${String(MESES.indexOf(mes) + 1).padStart(2, "0")}`,
  };
}

const fallar = (motivo) => {
  console.error(`No se pudo actualizar el CAC: ${motivo}`);
  console.error(`Revisar a mano en ${NOTA}`);
  process.exit(1);
};

const url = `${API}?search=${encodeURIComponent("Indicador CAMARCO")}&per_page=20&_fields=slug,date,title,content`;
const resp = await fetch(url, { headers: { "user-agent": "la-ribera/actualizador-cac" } });
if (!resp.ok) fallar(`la API respondió ${resp.status}`);

const notas = (await resp.json())
  .filter((p) => /^indicador-camarco-/.test(p.slug))
  .sort((a, b) => b.date.localeCompare(a.date));

if (!notas.length) fallar("no apareció ninguna nota con slug indicador-camarco-*");

const nota = notas[0];
const periodo = periodoDesdeTitulo(nota.title.rendered);
if (!periodo) fallar(`no pude leer el período de "${nota.title.rendered}"`);

const texto = textoPlano(nota.content.rendered);

// "registró un incremento del 1,5% respecto al mes anterior, alcanzando los 21.960,7 puntos"
const mVariacion = texto.match(
  /costo de la construcci[oó]n[^.]*?(incremento|aumento|suba|descenso|ca[ií]da|baja|variaci[oó]n)\s+del?\s+([\d.,]+)\s*%/i,
);
const mValor = texto.match(/alcanzando los\s+([\d.,]+)\s+puntos/i);

if (!mVariacion || !mValor) fallar("cambió la redacción de la nota y no encontré el valor o la variación");

const signo = /descenso|ca[ií]da|baja/i.test(mVariacion[1]) ? -1 : 1;
const variacion = signo * aNumero(mVariacion[2]);
const valor = aNumero(mValor[1]);

if (!Number.isFinite(valor) || !Number.isFinite(variacion)) fallar("los números no se parsearon bien");
if (Math.abs(variacion) > 25) fallar(`variación sospechosa: ${variacion}%`);

const previo = JSON.parse(readFileSync(DESTINO, "utf8"));
if (previo.periodoOrden === periodo.orden && previo.valor === valor) {
  console.log(`Sin cambios: ${periodo.etiqueta} sigue en ${valor}.`);
  process.exit(0);
}

const nuevo = {
  periodo: periodo.etiqueta,
  periodoOrden: periodo.orden,
  valor,
  variacionMensual: variacion,
  fuente: `https://www.camarco.org.ar/${nota.slug}/`,
  actualizado: new Date().toISOString().slice(0, 10),
};

writeFileSync(DESTINO, JSON.stringify(nuevo, null, 2) + "\n");
console.log(`Actualizado: ${nuevo.periodo} · ${nuevo.valor} puntos · ${nuevo.variacionMensual}% mensual`);
