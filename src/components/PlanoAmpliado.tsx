"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * El plano a pantalla completa. En la sección entra a la mitad del ancho y los
 * números de lote no se leen; acá se puede recorrer y hacer zoom.
 */
export function PlanoAmpliado({ onCerrar }: { onCerrar: () => void }) {
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);

    // El bloqueo va en <html> y no en <body>: en body el navegador clampea el
    // scroll a 0 y al cerrar el visitante aparecía arriba de todo.
    const raiz = document.documentElement;
    const previo = raiz.style.overflow;
    raiz.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", alTeclear);
      raiz.style.overflow = previo;
    };
  }, [onCerrar]);

  // Va por portal al body: la sección de ubicación tiene un ancestro con
  // transform, que le crea bloque contenedor a los position:fixed y dejaba el
  // panel encerrado dentro de la tarjeta.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Plano de mensura de La Ribera"
      className="fixed inset-0 z-[60] flex flex-col bg-verde-900/95 backdrop-blur"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 text-crema md:px-8">
        <p className="text-xs md:text-sm">
          <span className="font-bold">Plano de mensura</span>
          <span className="text-crema/60"> · 269 lotes de 211 a 240 m²</span>
        </p>
        <button
          type="button"
          onClick={onCerrar}
          className="inline-flex items-center gap-2 rounded-full border-2 border-crema/25 px-4 py-2 text-xs font-bold transition-colors hover:border-crema"
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

      <p className="shrink-0 px-5 pb-5 text-xs text-crema/50 md:px-8">
        Deslizá para recorrerlo. Las medidas del plano son las de mensura y pueden
        ajustarse en la escrituración.
      </p>
    </div>,
    document.body,
  );
}
