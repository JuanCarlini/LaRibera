"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cuenta hasta `valor` cuando el número entra en pantalla.
 *
 * El estado arranca en `valor` y no en cero: así el número real viaja en el
 * HTML del servidor —lo ve Google y lo ve cualquiera antes de que hidrate— en
 * lugar de un "0" que sólo se corrige al ejecutarse el JavaScript. La cuenta
 * se prepara recién en el cliente, y sólo para los números que todavía están
 * fuera de la pantalla: si ya se están viendo, no hay animación que mirar y
 * bajarlos a cero sería un parpadeo gratis.
 */
export function Contador({
  valor,
  sufijo = "",
  duracion = 1400,
}: {
  valor: number;
  sufijo?: string;
  duracion?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const caja = el.getBoundingClientRect();
    const yaSeVe = caja.top < window.innerHeight && caja.bottom > 0;
    if (yaSeVe) return;

    setN(0);

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min((t - inicio) / duracion, 1);
          // easeOutExpo: arranca rápido y frena, se lee mejor que lineal
          const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setN(Math.round(valor * e));
          if (p < 1) raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor, duracion]);

  return (
    <span ref={ref}>
      {n}
      {sufijo}
    </span>
  );
}
