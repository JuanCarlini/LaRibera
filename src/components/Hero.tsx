import Image from "next/image";
import { Wave } from "./Wave";
import { BotonPrimario, BotonSecundario, Flecha } from "./ui";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-crema">
      <Image
        src="/img/hero-aerea-rio.webp"
        alt="Vista aérea de La Ribera con el río Paraná al fondo"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Dos degradados sostienen la legibilidad sobre la foto: el vertical
          apoya el bloque de texto y el lateral protege la columna izquierda,
          que cae sobre los campos claros de la vista aérea. */}
      <div className="absolute inset-0 bg-gradient-to-t from-verde-900/95 via-verde-900/55 to-verde-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-verde-900/75 via-verde-900/30 to-transparent" />

      <div className="contenedor relative flex min-h-[100svh] flex-col justify-end pt-32 pb-[14vw]">
        <div className="max-w-3xl">
          <p
            className="eyebrow text-lima"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {hero.kicker}
          </p>

          <h1
            className="mt-5 font-extrabold tracking-[-0.03em] text-balance"
            style={{ fontSize: "var(--text-display)", lineHeight: 0.95 }}
          >
            <span
              className="block text-lima"
              data-reveal
              style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            >
              {hero.titulo[0]}
            </span>
            <span
              className="block text-naranja"
              data-reveal
              style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
            >
              {hero.titulo[1]}
            </span>
          </h1>

          <p
            className="mt-7 max-w-xl text-crema/85"
            data-reveal
            style={
              {
                fontSize: "var(--text-bajada)",
                "--reveal-delay": "360ms",
              } as React.CSSProperties
            }
          >
            {hero.bajada}
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            data-reveal
            style={{ "--reveal-delay": "440ms" } as React.CSSProperties}
          >
            <BotonPrimario href="#contacto">
              {hero.ctaPrimario}
              <Flecha />
            </BotonPrimario>
            <BotonSecundario href="#financiacion" className="text-crema">
              {hero.ctaSecundario}
            </BotonSecundario>
          </div>
        </div>
      </div>

      <Wave className="absolute inset-x-0 bottom-0 text-crema" />
    </section>
  );
}
