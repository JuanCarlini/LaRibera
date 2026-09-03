import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("tools/prep-renders.mjs", "utf8");
const a = `  { src: "image17.jpg", out: "plano-loteo",      w: 2048, nota: "Plano de mensura con los 269 lotes" },`;
const b = `  // El plano trae 176px muertos a la derecha y 72 arriba: recortarlos le da
  // un 13% más de dibujo en la misma caja.
  { src: "image17.jpg", out: "plano-loteo", w: 1872, nota: "Plano de mensura con los 269 lotes",
    recorte: { left: 0, top: 72, width: 1872, height: 796 } },`;
if (!s.includes(a)) { console.error("NO MATCH jobs"); process.exit(1); }
s = s.replace(a, b);

const c = `for (const j of jobs) {
  await sharp(\`\${SRC}/\${j.src}\`)
    .resize({ width: j.w, withoutEnlargement: true })`;
const d = `for (const j of jobs) {
  const base = sharp(\`\${SRC}/\${j.src}\`);
  await (j.recorte ? base.extract(j.recorte) : base)
    .resize({ width: j.w, withoutEnlargement: true })`;
if (!s.includes(c)) { console.error("NO MATCH loop"); process.exit(1); }
s = s.replace(c, d);
writeFileSync("tools/prep-renders.mjs", s);
console.log("script actualizado");
