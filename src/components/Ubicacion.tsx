import Image from "next/image";
import { Eyebrow } from "./ui";
import { ubicacion as s } from "@/content/site";

export function Ubicacion() {
  return (
    <section id="ubicacion" className="bg-crema py-24 md:py-32">
      <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div
          className="relative aspect-4/3 overflow-hidden rounded-3xl bg-verde/10 lg:order-2"
          data-reveal
        >
          <Image
            src="/img/mapa-ubicacion.webp"
            alt="Vista satelital de Villa Gobernador Gálvez con el predio de La Ribera marcado"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="lg:order-1">
          <div data-reveal>
            <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
            <h2 className="titular mt-5">
              <span className="block text-verde">{s.titulo[0]}</span>
              <span className="block text-naranja-600">{s.titulo[1]}</span>
            </h2>
            <p
              className="mt-6 max-w-lg text-verde/75"
              style={{ fontSize: "var(--text-bajada)" }}
            >
              {s.bajada}
            </p>
          </div>

          <dl className="mt-10 divide-y divide-verde/15 border-y border-verde/15">
            {s.datos.map((d, i) => (
              <div
                key={d.titulo}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
                data-reveal
                style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              >
                <dt className="text-lg font-bold text-verde">{d.titulo}</dt>
                <dd className="text-sm text-verde/60">{d.detalle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
