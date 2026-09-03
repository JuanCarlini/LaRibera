/**
 * Recorta y optimiza los renders de "Presentación_Loteo La Ribera.pptx"
 * hacia /public/img. SRC_DIR apunta a la carpeta ppt/media del pptx abierto.
 */
import sharp from "sharp";
const SRC = process.env.SRC_DIR;

const jobs = [
  { src: "image3.png",  out: "hero-aerea-rio",   w: 2400, nota: "Aérea del loteo con el Paraná al fondo" },
  { src: "image2.png",  out: "masterplan-aereo", w: 2400, nota: "Cenital del barrio completo" },
  { src: "image1.png",  out: "familia-calle",    w: 1800, nota: "Familia caminando por la calle" },
  { src: "image7.png",  out: "parque-juegos",    w: 1800, nota: "Parque con juegos y forestación" },
  { src: "image9.png",  out: "reservorio-gym",   w: 1800, nota: "Reservorio y estación de musculación" },
  { src: "image17.jpg", out: "plano-loteo",      w: 2048, nota: "Plano de mensura con los 269 lotes" },
];

for (const j of jobs) {
  await sharp(`${SRC}/${j.src}`)
    .resize({ width: j.w, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public/img/${j.out}.webp`);
  const m = await sharp(`public/img/${j.out}.webp`).metadata();
  console.log(`${j.out}.webp`.padEnd(24), `${m.width}x${m.height}`.padEnd(12), j.nota);
}
