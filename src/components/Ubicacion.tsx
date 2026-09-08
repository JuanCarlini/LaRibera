"use client";

import { useState } from "react";
import { Encabezado, Flecha } from "./ui";
import { Mapa, comoLlegarHref, type Resalte } from "./Mapa";
import { ubicacion as s } from "@/content/site";

export function Ubicacion() {
  const [resalte, setResalte] = useState<Resalte>(null);

  return (
    <section id="ubicacion" className="seccion bg-crema">
      {/* La columna de texto va algo más ancha que la del mapa: con las dos
          iguales, "Villa Gobernador Gálvez" partía en tres líneas. */}
      <div className="contenedor grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="lg:order-2" data-reveal>
          <Mapa resalte={resalte} />
        </div>

        <div className="lg:order-1">
          <Encabezado
            eyebrow={s.eyebrow}
            titulo={s.titulo}
            bajada={<p>{s.bajada}</p>}
            anchoBajada="max-w-lg"
          />

          {/* Cada fila es un botón y no sólo un hover: en mobile no hay puntero,
              así que se resalta al tocar y se vuelve atrás tocando de nuevo.

              Va como lista y no como <dl>: un <button> sólo admite contenido de
              frase, así que el <dt>/<dd> que había adentro era HTML inválido y
              rompía la lista de definiciones para los lectores de pantalla. */}
          <ul className="mt-12 divide-y divide-verde/20 border-y border-verde/20">
            {s.datos.map((d, i) => {
              const activo = resalte === d.resalte;
              return (
                <li
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
                    className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 text-left"
                  >
                    {/* text-xl y no text-lg: el naranja oscuro sobre crema da
                        3,14:1 y sólo pasa AA como texto grande (≥18,66px bold). */}
                    <span
                      className={`text-xl font-bold transition-colors ${
                        activo ? "text-naranja-600" : "text-verde"
                      }`}
                    >
                      {d.titulo}
                    </span>
                    <span className="text-sm text-verde/70">{d.detalle}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <a
            href={comoLlegarHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-verde/25 px-6 py-3 text-sm font-bold text-verde transition-colors hover:border-verde hover:bg-verde hover:text-crema"
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
