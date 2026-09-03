import { Logo } from "./Logo";
import { legales, nav, proyecto } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-verde-900 py-16 text-crema/60">
      <div className="contenedor">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <Logo variante="lima" alto={26} />
            <p className="mt-4 text-sm">{proyecto.bajada}</p>
            <p className="text-sm">{proyecto.ubicacion}</p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {nav.map((i) => (
              <a key={i.href} href={i.href} className="transition-colors hover:text-lima">
                {i.label}
              </a>
            ))}
          </nav>

          <div className="text-sm">
            <a
              href={`https://wa.me/${proyecto.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-bold text-crema transition-colors hover:text-lima"
            >
              {proyecto.whatsappVisible}
            </a>
            <a
              href={`mailto:${proyecto.email}`}
              className="block transition-colors hover:text-lima"
            >
              {proyecto.email}
            </a>
          </div>
        </div>

        <p className="mt-14 max-w-3xl border-t border-crema/10 pt-8 text-xs leading-relaxed">
          {legales}
        </p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} {proyecto.nombre}
        </p>
      </div>
    </footer>
  );
}
