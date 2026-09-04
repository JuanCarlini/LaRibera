"use client";

import { useState } from "react";
import { Eyebrow, Flecha } from "./ui";
import { Mapa, comoLlegarHref, type Resalte } from "./Mapa";
import { ubicacion as s } from "@/content/site";

export function Ubicacion() {
  const [resalte, setResalte] = useState<Resalte>(null);

  return (
    <section id="ubicacion" className="bg-crema py-24 md:py-32">
      <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:order-2" data-reveal>
          <Mapa resalte={resalte} />
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

          {/* Cada fila es un botón y no sólo un hover: en mobile no hay puntero,
              así que se resalta al tocar y se vuelve atrás tocando de nuevo. */}
          <dl className="mt-10 divide-y divide-verde/15 border-y border-verde/15">
            {s.datos.map((d, i) => {
              const activo = resalte === d.resalte;
              return (
                <div
                  key={d.titulo}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
                >
                  <button
                    type="button"
                    aria-pressed={activo}
                    onMouseEnter={() => setResalte(d.resalte)}
                    onMouseLeave={() => setResalte(null)}
                    onFocus={() => setResalte(d.resalte)}
                    onBlur={() => setResalte(null)}
                    onClick={() => setResalte(activo ? null : d.resalte)}
                    className={`flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 text-left transition-colors ${
                      activo ? "text-naranja-600" : "text-verde"
                    }`}
                  >
                    <dt className="text-lg font-bold">{d.titulo}</dt>
                    <dd
                      className={`text-sm transition-colors ${
                        activo ? "text-naranja-600" : "text-verde/60"
                      }`}
                    >
                      {d.detalle}
                    </dd>
                  </button>
                </div>
              );
            })}
          </dl>

          <a
            href={comoLlegarHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-verde/25 px-6 py-3 text-sm font-bold text-verde transition-colors hover:border-verde hover:bg-verde hover:text-crema"
            data-reveal
          >
            Cómo llegar
            <Flecha />
          </a>
        </div>
      </div>
    </section>
  );
}
