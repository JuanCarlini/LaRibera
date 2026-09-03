import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("src/components/Mapa.tsx", "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NO MATCH:\n" + a.slice(0,70)); process.exit(1); } s = s.replace(a, b); };

rep(`import { ubicacion, proyecto } from "@/content/site";`,
    `import { PlanoAmpliado } from "./PlanoAmpliado";\nimport { ubicacion, proyecto } from "@/content/site";`);

rep(`const PROPORCION = { zona: "4 / 3", predio: "2048 / 868" } as const;`,
    `const PROPORCION = { zona: "4 / 3", predio: "1872 / 796" } as const;`);

// el plano ya no lleva padding: le comía ancho al dibujo
rep(`    <div className="flex h-full w-full items-center justify-center bg-crema p-3">
      <Image
        src="/img/plano-loteo.webp"
        alt={\`Plano de mensura de La Ribera con los 269 lotes, en \${proyecto.ubicacion}\`}
        width={2048}
        height={868}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-auto w-full object-contain"
      />
    </div>`,
`    <div className="flex h-full w-full items-center justify-center bg-crema">
      <Image
        src="/img/plano-loteo.webp"
        alt={\`Plano de mensura de La Ribera con los 269 lotes, en \${proyecto.ubicacion}\`}
        width={1872}
        height={796}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-auto w-full object-contain"
      />
    </div>`);

// el enlace al archivo suelto pasa a ser botón de vista ampliada
rep(`function PieDePlano() {
  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-verde/55">
      <span>Plano de mensura · 269 lotes de 211 a 240 m²</span>
      <a
        href="/img/plano-loteo.webp"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-naranja-600 underline underline-offset-2"
      >
        Ver plano completo
      </a>
    </p>
  );
}`,
`function PieDePlano({ onAmpliar }: { onAmpliar: () => void }) {
  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-verde/55">
      <span>Plano de mensura · 269 lotes de 211 a 240 m²</span>
      <button
        type="button"
        onClick={onAmpliar}
        className="font-bold text-naranja-600 underline underline-offset-2"
      >
        Ampliar plano
      </button>
    </p>
  );
}`);

writeFileSync("src/components/Mapa.tsx", s);
console.log("ok");
