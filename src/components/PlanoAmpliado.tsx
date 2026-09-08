"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useBloquearScroll } from "./bloquear-scroll";

const FOCALIZABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * El plano a pantalla completa. En la sección entra a la mitad del ancho y los
 * números de lote no se leen; acá se puede recorrer y hacer zoom.
 */
export function PlanoAmpliado({ onCerrar }: { onCerrar: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useBloquearScroll(true);

  useEffect(() => {
    // Un aria-modal sin manejo de foco deja al visitante de teclado tabulando
    // por detrás del panel. Al abrir mandamos el foco adentro, lo mantenemos
    // en ciclo mientras dure, y al cerrar lo devolvemos a donde estaba.
    const previo = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>(FOCALIZABLES)?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const focos = [...panel.current.querySelectorAll<HTMLElement>(FOCALIZABLES)];
      if (!focos.length) return;

      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      const actual = document.activeElement;

      if (e.shiftKey && (actual === primero || !panel.current.contains(actual))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && actual === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", alTeclear);
    return () => {
      window.removeEventListener("keydown", alTeclear);
      previo?.focus();
    };
  }, [onCerrar]);

  // Va por portal al body: la sección de ubicación tiene un ancestro con
  // transform, que le crea bloque contenedor a los position:fixed y dejaba el
  // panel encerrado dentro de la tarjeta.
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Plano de mensura de La Ribera"
      className="fixed inset-0 z-[60] flex flex-col bg-verde-900/95 backdrop-blur"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 text-crema md:px-8">
        <p className="text-xs md:text-sm">
          <span className="font-bold">Plano de mensura</span>
          <span className="text-crema/70"> · 269 lotes de 211 a 240 m²</span>
        </p>
        <button
          type="button"
          onClick={onCerrar}
          className="inline-flex items-center gap-2 rounded-full border-2 border-crema/30 px-4 py-2 text-xs font-bold transition-colors hover:border-crema"
        >
          Cerrar
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* En mobile el plano se sale del ancho a propósito: se recorre a dedo. */}
      <div className="flex grow items-center overflow-auto overscroll-contain px-3 pb-5 md:px-8 md:pb-8">
        <Image
          src="/img/plano-loteo.webp"
          alt="Plano de mensura de La Ribera con los 269 lotes numerados"
          width={1872}
          height={796}
          // Sin optimizar: es un plano técnico y queremos el archivo entero,
          // no una versión reescalada que borronea los números de lote.
          unoptimized
          className="h-auto w-[220vw] max-w-none rounded-xl bg-crema sm:w-[140vw] lg:w-full"
        />
      </div>

      <p className="shrink-0 px-5 pb-5 text-xs text-crema/65 md:px-8">
        Deslizá para recorrerlo. Las medidas del plano son las de mensura y pueden
        ajustarse en la escrituración.
      </p>
    </div>,
    document.body,
  );
}
