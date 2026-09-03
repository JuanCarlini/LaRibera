import Image from "next/image";
import { Wave } from "./Wave";
import { BotonPrimario, BotonSecundario, Flecha } from "./ui";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <Image
        src="/img/hero-loteo.webp"
        alt="Vista aérea del loteo La Ribera al atardecer"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* El degradado sostiene la legibilidad del titular sobre la foto */}
      <div className="absolute inset-0 bg-gradient-to-t from-verde-900/90 via-verde-900/30 to-verde-900/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-verde-900/65 via-verde-900/15 to-transparent" />

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
            className="mt-10 flex flex-wrap gap-3"
            data-reveal
            style={{ "--reveal-delay": "440ms" } as React.CSSProperties}
          >
            <BotonPrimario href="#contacto">
              {hero.ctaPrimario}
              <Flecha />
            </BotonPrimario>
            <BotonSecundario href="#proyecto" className="text-crema">
              {hero.ctaSecundario}
            </BotonSecundario>
          </div>
        </div>
      </div>

      <Wave className="absolute inset-x-0 bottom-0 text-crema" />
    </section>
  );
}
