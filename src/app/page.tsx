import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Proyecto } from "@/components/Proyecto";
import { Ticker } from "@/components/Ticker";
import { Servicios } from "@/components/Servicios";
import { Ubicacion } from "@/components/Ubicacion";
import { Vida } from "@/components/Vida";
import { Financiacion } from "@/components/Financiacion";
import { Contacto } from "@/components/Contacto";
import { Footer } from "@/components/Footer";
import { RevealProvider } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Proyecto />
        <Ticker />
        <Servicios />
        <Ubicacion />
        <Vida />
        <Financiacion />
        <Contacto />
      </main>
      <Footer />
      <RevealProvider />
    </>
  );
}
