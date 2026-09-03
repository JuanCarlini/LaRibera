"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "./ui";
import { vida as s } from "@/content/site";

/** Escala mínima de una card cuando está lejos del centro del viewport. */
const MIN_MOBILE = 0.86;
const MIN_DESKTOP = 0.74;

/**
 * Cada card ocupa una pantalla y se desliza en vertical con la página,
 * creciendo a medida que llega al centro del viewport y achicándose al salir.
 * El encabezado queda fijo detrás y las cards pasan por encima.
 */
export function Vida() {
  const lista = useRef<HTMLUListElement>(null);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setReducido(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    if (reducido) return;
    let raf = 0;

    const actualizar = () => {
      raf = 0;
      const cards = lista.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards?.length) return;

      const alto = window.innerHeight;
      const centroVp = alto / 2;
      const min = window.innerWidth < 768 ? MIN_MOBILE : MIN_DESKTOP;

      for (const card of cards) {
        const r = card.getBoundingClientRect();
        // Distancia al centro del viewport, normalizada a una pantalla.
        const d = Math.min(Math.abs(r.top + r.height / 2 - centroVp) / alto, 1);
        card.style.transform = `scale(${(1 - d * (1 - min)).toFixed(4)})`;
      }
    };

    const alScrollear = () => {
      if (!raf) raf = requestAnimationFrame(actualizar);
    };

    raf = requestAnimationFrame(actualizar);
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      cancelAnimationFrame(raf);
    };
  }, [reducido]);

  return (
    <section id="vida" className="relative overflow-clip bg-crema-100">
      {/* En flujo normal: fijarlo dejaba el titular asomando por detrás de las
          cards, que son más angostas que el viewport, y se leía como un error. */}
      <div className="contenedor pt-20 pb-2 md:pt-28">
        <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
        <h2 className="titular mt-4">
          <span className="block text-verde">{s.titulo[0]}</span>
          <span className="block text-naranja-600">{s.titulo[1]}</span>
        </h2>
        <p className="mt-4 max-w-md text-verde/70">{s.bajada}</p>
      </div>

      <ul ref={lista} className="relative">
        {s.cards.map((c) => (
          <li
            key={c.titulo}
            className={
              reducido
                ? "px-6 py-8 md:px-10"
                : "flex h-svh items-center justify-center px-6 md:px-10"
            }
          >
            <article
              data-card
              style={{ transform: reducido ? undefined : `scale(${MIN_MOBILE})` }}
              className="mx-auto w-full max-w-md origin-center overflow-hidden rounded-3xl bg-crema shadow-[0_18px_50px_-24px_rgba(6,52,36,0.45)] will-change-transform md:flex md:max-w-4xl lg:min-h-[26rem] lg:max-w-5xl"
            >
              <div className="relative aspect-4/3 md:aspect-auto md:w-3/5 md:self-stretch">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 90vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 rounded-full bg-verde/90 px-3 py-1.5 text-xs font-bold text-lima backdrop-blur">
                  {c.dato}
                </span>
              </div>

              <div className="p-6 md:flex md:w-2/5 md:flex-col md:justify-center md:p-9">
                <h3 className="text-xl leading-tight font-extrabold text-verde md:text-3xl">
                  {c.titulo}
                </h3>
                <p className="mt-3 text-sm text-verde/70 md:mt-4 md:text-base">{c.texto}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
