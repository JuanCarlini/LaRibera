"use client";

import { useEffect } from "react";

/**
 * Eventos de lectura para Umami. La landing es una sola URL, así que sin esto
 * el panel no puede distinguir a alguien que se fue en el hero de alguien que
 * leyó hasta Contacto: las dos visitas son un pageview de `/` y un rebote.
 *
 * Manda dos familias de eventos, las dos una sola vez por visita:
 *   · `seccion-<id>` cuando la sección se queda en el centro de la pantalla,
 *     o sea qué leyó.
 *   · `scroll-25` / `-50` / `-75` / `-100`, o sea hasta dónde llegó.
 *
 * Con los `seccion-*` se arma el embudo en Umami (hero → proyecto →
 * financiación → contacto) y ahí se ve en qué escalón se cae la gente.
 *
 * Si un adblocker bloquea el script, `window.umami` no existe: los observers
 * siguen corriendo pero no reportan nada. Nunca se asume que está.
 */

/** Hitos de scroll, en porcentaje de página recorrido. Ordenados de menor a mayor. */
const HITOS = [25, 50, 75, 100];

/**
 * Cuánto tiene que quedarse una sección en el centro de la pantalla para que
 * cuente como leída. Sin esta espera, clickear "Contacto" en el menú marcaba
 * toda la página como vista: el scroll a las anclas es animado y pasa por
 * encima de cada sección, así que el que va derecho al formulario parecía
 * haber leído todo y el embudo daba cualquier cosa. Medio segundo alcanza
 * para distinguir leer de pasar de largo.
 */
const PERMANENCIA = 600;

export function Analitica() {
  useEffect(() => {
    // ---------- secciones vistas ----------
    // Sólo las de <main>: el footer y la barra de navegación no son lectura.
    const secciones = document.querySelectorAll<HTMLElement>("main section[id]");

    // Secciones que entraron al centro y están esperando cumplir la permanencia.
    const esperando = new Map<Element, ReturnType<typeof setTimeout>>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (esperando.has(entry.target)) continue;
            esperando.set(
              entry.target,
              setTimeout(() => {
                esperando.delete(entry.target);
                window.umami?.track(`seccion-${entry.target.id}`);
                // Una vez por visita: si no, bastaría con scrollear para
                // arriba y para abajo para inflar la sección.
                io.unobserve(entry.target);
              }, PERMANENCIA),
            );
          } else {
            // Se fue antes de tiempo: pasó de largo, no la leyó.
            clearTimeout(esperando.get(entry.target));
            esperando.delete(entry.target);
          }
        }
      },
      // El margen recorta la pantalla a una línea en el medio, así que la
      // sección cuenta como vista cuando el centro de la pantalla cae sobre
      // ella. Da igual cuánto mida: con `threshold` habría que adivinar un
      // porcentaje distinto para el hero (una pantalla justa) y para Ubicación
      // (varias), porque una sección más alta que la pantalla nunca llega a
      // estar visible en un 50%.
      { rootMargin: "-50% 0px -50% 0px" },
    );

    secciones.forEach((s) => io.observe(s));

    // ---------- profundidad de scroll ----------
    const pendientes = [...HITOS];
    let cuadro = 0;

    const revisar = () => {
      cuadro = 0;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      if (alto <= 0) return;

      // 0 arriba de todo, 100 abajo de todo: cuánto de la página recorrió.
      const recorrido = (window.scrollY / alto) * 100;

      // Los hitos están ordenados, así que alcanza con mirar el primero. El
      // `while` cubre el salto de clickear un ancla del menú: los hitos que
      // quedaron atrás se reportan igual, en la misma pasada.
      while (pendientes.length > 0 && recorrido >= pendientes[0]) {
        window.umami?.track(`scroll-${pendientes.shift()}`);
      }

      if (pendientes.length === 0) window.removeEventListener("scroll", alScrollear);
    };

    // El scroll dispara decenas de veces por segundo; medir una vez por cuadro
    // alcanza de sobra y evita leer el layout en cada evento.
    const alScrollear = () => {
      if (cuadro) return;
      cuadro = requestAnimationFrame(revisar);
    };

    window.addEventListener("scroll", alScrollear, { passive: true });

    return () => {
      io.disconnect();
      esperando.forEach(clearTimeout);
      window.removeEventListener("scroll", alScrollear);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  return null;
}
