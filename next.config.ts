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
  images: {
    /**
     * CDN de Instagram, para las fotos de la sección de obra. Las sirve
     * `next/image`, que las re-encoda y las cachea: las URLs de Meta vienen
     * firmadas y caducan, así que servirlas directo dejaría imágenes rotas.
     *
     * `search` y `pathname` quedan sin declarar —y por lo tanto en `**`— a
     * propósito: la firma viaja en la query y cambia en cada lectura del
     * feed, así que no hay valor fijo que anotar. El permiso queda acotado a
     * estos dos hosts.
     */
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },

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
