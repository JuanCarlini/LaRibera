/**
 * La onda del isotipo usada como transición entre bloques.
 * `position="bottom"` la apoya al pie de una foto; `"top"` la invierte para
 * que muerda el bloque siguiente.
 */
export function Wave({
  className = "",
  position = "bottom",
}: {
  className?: string;
  position?: "top" | "bottom";
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[6vw] max-h-28 min-h-10 w-full ${
        position === "top" ? "rotate-180" : ""
      } ${className}`}
      aria-hidden
    >
      <path
        d="M0,120 L0,62 C240,-10 470,-6 720,50 C970,106 1210,110 1440,44 L1440,120 Z"
        fill="currentColor"
      />
    </svg>
  );
}
