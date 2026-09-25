import Link from "next/link";
import { Logo } from "./Logo";
import { legales, nav, proyecto } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-verde-900 py-16 text-crema/70">
      <div className="contenedor">
        {/* Grilla de 12 columnas, la misma del resto de la página: con
            justify-between los tres bloques caían en posiciones arbitrarias. */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Logo variante="lima" alto={26} />
            <p className="mt-5 text-sm">{proyecto.bajada}</p>
            <p className="text-sm">{proyecto.ubicacion}</p>
          </div>

          <nav className="flex flex-col gap-2 text-sm md:col-span-3">
            {nav.map((i) => (
              <a key={i.href} href={i.href} className="transition-colors hover:text-lima">
                {i.label}
              </a>
            ))}
          </nav>

          <div className="text-sm md:col-span-4">
            <a
              href={`https://wa.me/${proyecto.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="wsp-footer"
              className="block font-bold text-crema transition-colors hover:text-lima"
            >
              {proyecto.whatsappVisible}
            </a>
            <a
              href={`mailto:${proyecto.email}`}
              data-umami-event="email-footer"
              className="block transition-colors hover:text-lima"
            >
              {proyecto.email}
            </a>
          </div>
        </div>

        {/* La regla va suelta y a todo el ancho: antes era el border-top del
            párrafo de legales y se cortaba donde terminaba su medida. */}
        <hr className="mt-16 border-crema/15" />
        <p className="mt-8 max-w-3xl text-xs leading-relaxed">{legales}</p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} {proyecto.nombre} ·{" "}
          <Link href="/privacidad" className="transition-colors hover:text-lima">
            Política de privacidad
          </Link>
        </p>
      </div>
    </footer>
  );
}
