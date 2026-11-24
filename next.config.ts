import type { NextConfig } from "next";

/**
 * Origen del panel de Umami, derivado de la URL del script para no repetir el
 * host. Se usa en `frame-ancestors`: el mapa de calor muestra la página de
 * fondo dentro de un iframe, y sin este permiso se ve sobre un fondo vacío.
 */
const panelAnalitica = process.env.NEXT_PUBLIC_UMAMI_SRC
  ? new URL(process.env.NEXT_PUBLIC_UMAMI_SRC).origin
  : null;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // Sólo `frame-ancestors`: no restringe scripts ni estilos, nada
            // más que quién puede embeber la página. Sin la variable queda
            // en 'self', que es el comportamiento de siempre.
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self'${panelAnalitica ? ` ${panelAnalitica}` : ""};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
