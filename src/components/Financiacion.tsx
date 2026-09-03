import Image from "next/image";
import { BotonPrimario, Eyebrow, Flecha, IconoWhatsapp, waHref } from "./ui";
import { financiacion as s, proyecto } from "@/content/site";

export function Financiacion() {
  return (
    <section className="relative isolate overflow-hidden bg-lima">
      <Image
        src="/img/calle-atardecer.webp"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="object-cover opacity-15 mix-blend-multiply"
      />

      <div className="contenedor relative grid gap-10 py-24 md:grid-cols-12 md:gap-16 md:py-32">
        <div className="md:col-span-7" data-reveal>
          <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
          {/* Sobre lima el naranja no llega al contraste mínimo: el acento
              lo damos con el subrayado y el botón, y el texto va en verde. */}
          <h2 className="titular mt-5 text-verde">
            <span className="block">{s.titulo[0]}</span>
            <span className="block underline decoration-naranja decoration-[0.09em] underline-offset-[0.14em]">
              {s.titulo[1]}
            </span>
          </h2>
        </div>

        <div
          className="flex flex-col items-start justify-end md:col-span-5"
          data-reveal
          style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
        >
          <p className="text-verde/80" style={{ fontSize: "var(--text-bajada)" }}>
            {s.bajada}
          </p>
          <BotonPrimario href="#contacto" className="mt-8">
            {s.cta}
            <Flecha />
          </BotonPrimario>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-verde underline underline-offset-4 hover:text-naranja"
          >
            <IconoWhatsapp />
            {proyecto.whatsappVisible}
          </a>
        </div>
      </div>
    </section>
  );
}
