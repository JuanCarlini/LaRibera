"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "./ui";
import { vida as s } from "@/content/site";

/** Alto de reserva hasta que podemos medir el recorrido real del riel. */
const SVH_POR_CARD = 62;

/**
 * Las cards avanzan en horizontal a medida que se scrollea la página: la
 * sección queda fijada y el riel se desplaza según el progreso del scroll.
 * Con `prefers-reduced-motion` no se fija nada y el riel se recorre a dedo.
 */
export function Vida() {
  const seccion = useRef<HTMLElement>(null);
  const ventana = useRef<HTMLDivElement>(null);
  const riel = useRef<HTMLUListElement>(null);
  const [reducido, setReducido] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [altoPx, setAltoPx] = useState<number | null>(null);

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

    /** Recorrido horizontal pendiente del riel, en píxeles. */
    const medirMaxX = () => {
      const rl = riel.current;
      const vt = ventana.current;
      if (!rl || !vt) return 0;
      return Math.max(rl.scrollWidth - vt.clientWidth, 0);
    };

    const actualizar = () => {
      raf = 0;
      const sec = seccion.current;
      const rl = riel.current;
      if (!sec || !rl) return;

      const recorrido = sec.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return;

      const p = Math.min(Math.max(-sec.getBoundingClientRect().top / recorrido, 0), 1);
      rl.style.transform = `translate3d(${-(p * medirMaxX()).toFixed(1)}px,0,0)`;
      setProgreso(p);
    };

    // El alto de la sección sigue al recorrido del riel: así un píxel de
    // scroll mueve un píxel de card y el gesto se siente parejo en cualquier
    // pantalla. Con alto fijo, en desktop se scrolleaba de más para nada.
    const ajustarAlto = () => setAltoPx(window.innerHeight + medirMaxX());

    const alScrollear = () => {
      if (!raf) raf = requestAnimationFrame(actualizar);
    };

    const alRedimensionar = () => {
      ajustarAlto();
      alScrollear();
    };

    raf = requestAnimationFrame(() => {
      ajustarAlto();
      actualizar();
    });

    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alRedimensionar);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alRedimensionar);
      cancelAnimationFrame(raf);
    };
  }, [reducido]);

  const alto = reducido
    ? undefined
    : altoPx
      ? `${altoPx}px`
      : `${100 + s.cards.length * SVH_POR_CARD}svh`;

  return (
    <section
      id="vida"
      ref={seccion}
      className="relative bg-crema-100"
      style={{ height: alto }}
    >
      <div
        className={
          reducido
            ? "py-20"
            : "sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-16"
        }
      >
        <header className="contenedor shrink-0" data-reveal>
          <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
          <h2 className="titular mt-4">
            <span className="block text-verde">{s.titulo[0]}</span>
            <span className="block text-naranja-600">{s.titulo[1]}</span>
          </h2>
          <p className="mt-4 max-w-md text-verde/70">{s.bajada}</p>
        </header>

        <div
          ref={ventana}
          className={`mt-8 md:mt-12 ${reducido ? "snap-x snap-mandatory overflow-x-auto" : "overflow-hidden"}`}
        >
          <ul
            ref={riel}
            className="flex w-max gap-4 px-6 will-change-transform md:gap-6 md:px-10"
          >
            {s.cards.map((c) => (
              <li
                key={c.titulo}
                className="w-[78vw] max-w-[26rem] shrink-0 snap-center sm:w-[52vw] lg:w-[30vw]"
              >
                <article className="overflow-hidden rounded-3xl bg-crema">
                  <div className="relative aspect-4/3">
                    <Image
                      src={c.img}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 52vw, 78vw"
                      className="object-cover"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-verde/90 px-3 py-1.5 text-xs font-bold text-lima backdrop-blur">
                      {c.dato}
                    </span>
                  </div>
                  <div className="p-6 md:p-7">
                    <h3 className="text-xl leading-tight font-extrabold text-verde md:text-2xl">
                      {c.titulo}
                    </h3>
                    <p className="mt-3 text-sm text-verde/70 md:text-base">{c.texto}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {!reducido && (
          <div className="contenedor mt-8 shrink-0 md:mt-10">
            <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-verde/15">
              <div
                className="h-full rounded-full bg-naranja transition-[width] duration-100 ease-out"
                style={{ width: `${Math.max(progreso * 100, 4)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
