// Recorta las zonas limpias (sin tipografía) de las piezas de RRSS
// y las exporta optimizadas a /public/img. Fuente: Contenidos RRSS_LaRibera.pptx
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.env.SRC_DIR;
const OUT = "public/img";
mkdirSync(OUT, { recursive: true });

/** @type {{out:string,src:string,crop:[number,number,number,number],w:number,note:string}[]} */
const jobs = [
  { out: "hero-loteo",      src: "image8.png",  crop: [0, 0, 1080, 440], w: 2160, note: "Aérea del loteo al atardecer" },
  { out: "aerial-cenital",  src: "image9.png",  crop: [0, 0, 1080, 550], w: 2160, note: "Cenital de manzanas y lotes" },
  { out: "aerial-barrio",   src: "image3.png",  crop: [0, 0, 1080, 350], w: 2160, note: "Cenital con barrio consolidado" },
  { out: "parque-familia",  src: "image11.png", crop: [0, 0, 1080, 865], w: 1440, note: "Familia en el parque, otoño" },
  { out: "chicos-jugando",  src: "image10.png", crop: [0, 0, 1080, 875], w: 1440, note: "Chicos jugando en la calle" },
  { out: "calle-parque",    src: "image5.png",  crop: [0, 155, 1080, 470], w: 2160, note: "Vereda y espacio verde" },
  { out: "mapa-ubicacion",  src: "image6.png",  crop: [0, 0, 1080, 780], w: 1440, note: "Satelital con el predio marcado" },
  { out: "calle-atardecer", src: "image12.png", crop: [0, 0, 1080, 285], w: 2160, note: "Calle arbolada al atardecer" },
];

for (const j of jobs) {
  const [left, top, width, height] = j.crop;
  const base = sharp(join(SRC, j.src)).extract({ left, top, width, height }).resize({ width: j.w, withoutEnlargement: false });
  await base.clone().webp({ quality: 78 }).toFile(join(OUT, `${j.out}.webp`));
  const m = await sharp(join(OUT, `${j.out}.webp`)).metadata();
  console.log(`${j.out.padEnd(16)} ${m.width}x${m.height}  ${j.note}`);
}
