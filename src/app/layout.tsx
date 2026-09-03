import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

// Figtree se aproxima al grotesco geométrico de las piezas de RRSS.
// Reemplazar por la tipografía del manual de marca cuando esté disponible.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lariberavgg.com.ar"),
  title: "La Ribera | Loteo costero en Villa Gobernador Gálvez",
  description:
    "269 lotes de 211 a 240 m² sobre la vera del río Paraná, con gas natural, electricidad, red de agua y cloacas. Acá empieza tu futuro.",
  openGraph: {
    title: "La Ribera | Loteo costero en Villa Gobernador Gálvez",
    description:
      "269 lotes de 211 a 240 m² con todos los servicios, sobre la vera del río Paraná.",
    locale: "es_AR",
    type: "website",
    images: ["/img/hero-aerea-rio.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
