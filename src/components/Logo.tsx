import Image from "next/image";

/** Wordmark oficial. Las tres variantes salen del manual de marca. */
const variantes = {
  lima: "/img/logo-lima.webp", // lima con la onda naranja: sobre fondos oscuros y fotos
  crema: "/img/logo-crema.webp", // monocromo claro: sobre verde
  verde: "/img/logo-verde.webp", // monocromo oscuro: sobre crema
} as const;

// Proporción del archivo (760x100), para reservar el espacio y evitar saltos.
const RATIO = 7.6;

export function Logo({
  variante = "verde",
  className = "",
  alto = 24,
  priority = false,
}: {
  variante?: keyof typeof variantes;
  className?: string;
  /** Alto en píxeles del wordmark. El ancho se deriva de la proporción. */
  alto?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={variantes[variante]}
      alt="La Ribera"
      width={Math.round(alto * RATIO)}
      height={alto}
      priority={priority}
      className={className}
      style={{ height: alto, width: "auto" }}
    />
  );
}
