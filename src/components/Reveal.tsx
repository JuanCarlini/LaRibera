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
    let io: IntersectionObserver | null = null;

    const armar = () => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!nodes.length) return false;

      // El respaldo se cancela recién acá, con los nodos ya en la mano.
      // Cancelarlo antes dejaba la página en blanco para siempre cuando este
      // efecto corría primero: la clase quedaba puesta, nadie marcaba nada y
      // el temporizador que lo arreglaba ya no existía. Pasa en cuanto algo
      // del árbol llega después —una sección que espera datos del servidor—,
      // y el síntoma es toda la página invisible, sin un solo error.
      clearTimeout(window.__revealSeguro);

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            io?.unobserve(entry.target);
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

      nodes.forEach((n) => io!.observe(n));
      return true;
    };

    if (armar()) return () => io?.disconnect();

    // Todavía no hay nada que animar. Esperamos a que el resto del árbol
    // aparezca en lugar de rendirnos: mientras tanto el respaldo sigue vivo,
    // así que el peor caso es una página sin animación, nunca una en blanco.
    const mo = new MutationObserver(() => {
      if (armar()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, []);

  return null;
}
