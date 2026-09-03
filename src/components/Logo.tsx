/**
 * Wordmark "LA RIBERA": la última A es una Λ con la onda naranja apoyada abajo.
 * Reconstruido a partir de las piezas de RRSS — reemplazar por el SVG original
 * del manual de marca cuando la agencia lo entregue.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-extrabold tracking-[0.14em] select-none ${className}`}
      aria-label="La Ribera"
      role="img"
    >
      <span aria-hidden>LA RIBER</span>
      <svg
        viewBox="-6 0 96 116"
        className="ml-[0.02em] h-[1em] w-[0.82em] shrink-0 translate-y-[0.11em] overflow-visible"
        fill="none"
        aria-hidden
      >
        <path
          d="M7 80 L42 6 L77 80"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinejoin="miter"
        />
        <path
          d="M-2 98 q22 -20 44 0 t44 0"
          stroke="var(--color-naranja)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
