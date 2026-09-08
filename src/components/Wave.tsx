/**
 * La onda del isotipo usada como transición entre bloques.
 * `position="bottom"` la apoya al pie de una foto; `"top"` la invierte para
 * que muerda el bloque siguiente.
 *
 * La altura se calcula en vw: cae en un píxel fraccionario y en la costura
 * asomaba una línea de la foto de arriba. El filete de 2px que va debajo de la
 * onda —del mismo color— la tapa sin cambiar el dibujo.
 */
export function Wave({
  className = "",
  position = "bottom",
}: {
  className?: string;
  position?: "top" | "bottom";
}) {
  return (
    <div
      className={`pointer-events-none ${position === "top" ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[6vw] max-h-28 min-h-10 w-full"
      >
        <path
          d="M0,120 L0,62 C240,-10 470,-6 720,50 C970,106 1210,110 1440,44 L1440,120 Z"
          fill="currentColor"
        />
      </svg>
      <div className="-mt-px h-0.5 w-full bg-current" />
    </div>
  );
}
