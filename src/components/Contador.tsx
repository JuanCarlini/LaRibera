"use client";

import { useEffect, useRef, useState } from "react";

/** Cuenta desde 0 hasta `valor` la primera vez que el número entra en pantalla. */
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
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setN(valor);
          return;
        }

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
