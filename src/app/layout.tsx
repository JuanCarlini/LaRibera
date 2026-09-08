import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { armarReveal } from "@/components/Reveal";
import { proyecto, sitio, ubicacion } from "@/content/site";
import "./globals.css";

// Figtree se aproxima al grotesco geométrico de las piezas de RRSS.
// Reemplazar por la tipografía del manual de marca cuando esté disponible.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const titulo = "La Ribera | Loteo costero en Villa Gobernador Gálvez";
const descripcion =
  "269 lotes de 211 a 240 m² sobre la vera del río Paraná, con gas natural, electricidad, red de agua y cloacas. Acá empieza tu futuro.";

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    title: titulo,
    description:
      "269 lotes de 211 a 240 m² con todos los servicios, sobre la vera del río Paraná.",
    url: sitio,
    siteName: proyecto.nombre,
    locale: "es_AR",
    type: "website",
    images: ["/img/hero-aerea-rio.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descripcion,
    images: ["/img/hero-aerea-rio.webp"],
  },
};

/**
 * Datos estructurados del predio. Sólo hechos que ya están en `site.ts`: dónde
 * queda y en qué coordenadas. Nada de precios ni disponibilidad, que están
 * sujetos a evaluación comercial y cambian sin que la página se entere.
 */
const datosEstructurados = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: proyecto.nombre,
  description: descripcion,
  url: sitio,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Villa Gobernador Gálvez",
    addressRegion: "Santa Fe",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ubicacion.mapa.centro.lat,
    longitude: ubicacion.mapa.centro.lng,
  },
};

// El script de abajo le agrega `reveal-armado` al <html> antes de que React
// hidrate, así que el className del servidor y el del cliente no coinciden a
// propósito. `suppressHydrationWarning` silencia sólo los atributos de este
// elemento, no los de sus hijos.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${figtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {/* Primero de todo: corre mientras el navegador todavía está parseando
            el documento, así ningún [data-reveal] alcanza a pintarse sin la
            clase y no hay parpadeo. */}
        <script dangerouslySetInnerHTML={{ __html: armarReveal }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
        />
        {children}
      </body>
    </html>
  );
}
