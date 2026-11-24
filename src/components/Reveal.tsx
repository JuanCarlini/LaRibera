"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /** Temporizador de seguridad que arma el script en línea de `layout`. */
    __revealSeguro?: ReturnType<typeof setTimeout>;
  }
}

/**
 * Script que corre antes de que el navegador pinte nada: es lo primero dentro
 * de <body>, así que ningún [data-reveal] llega a dibujarse sin la clase.
 *
 * La animación tiene que sumar, no condicionar. El CSS sólo esconde el
 * contenido cuando esta clase está puesta, de modo que:
 *   · sin JavaScript      → la clase no se pone → todo visible
 *   · sin IntersectionObserver → tampoco se pone → todo visible
 *   · con JS pero sin hidratar → el temporizador la saca a los 3s → visible
 * En los tres casos el peor resultado es una página sin animación, nunca una
 * página en blanco.
 */
export const armarReveal = `(function(){
if(!("IntersectionObserver" in window))return;
var r=document.documentElement;
r.classList.add("reveal-armado");
window.__revealSeguro=setTimeout(function(){r.classList.remove("reveal-armado")},3000);
})();`;

/**
 * Marca con .is-visible todo lo que tenga [data-reveal] al entrar en pantalla.
 * Un solo observer para toda la página; el CSS hace la animación.
 */
export function RevealProvider() {
  useEffect(() => {
    // Llegamos a hidratar: el respaldo ya no hace falta.
    clearTimeout(window.__revealSeguro);

    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      // El margen inferior negativo retrasa la entrada hasta que el bloque
      // está bien dentro de la pantalla. El superior, enorme, hace que todo lo
      // que quedó por encima cuente como visible: si no, al llegar por un
      // ancla (#servicios), al recargar con el scroll restaurado o al volver
      // con el botón atrás, el bloque se saltea y no vuelve a entrar nunca.
      // El scroll a un ancla es animado, así que arranca en cero y el primer
      // callback llega cuando el hero ya pasó de largo.
      { rootMargin: "9999px 0px -12% 0px", threshold: 0.1 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return null;
}
