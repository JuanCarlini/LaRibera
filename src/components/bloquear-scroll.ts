"use client";

import { useEffect } from "react";

/**
 * Congela el scroll de la página mientras hay una capa encima (el menú mobile,
 * el plano ampliado).
 *
 * El bloqueo va en <html> y no en <body>: en body el navegador clampea el
 * scroll a 0 y al cerrar el visitante aparece arriba de todo.
 */
export function useBloquearScroll(activo: boolean) {
  useEffect(() => {
    if (!activo) return;

    const raiz = document.documentElement;
    const previo = raiz.style.overflow;
    raiz.style.overflow = "hidden";

    return () => {
      raiz.style.overflow = previo;
    };
  }, [activo]);
}
