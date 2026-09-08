import Image from "next/image";
import { actores } from "@/content/site";

/**
 * Quién desarrolla y quién comercializa.
 * Fondo verde porque los logos entregados son blancos sobre transparente.
 */
export function Actores() {
  return (
    <section className="bg-verde pt-24 text-crema md:pt-32">
      <div className="contenedor">
        <p className="eyebrow text-crema/65">{actores.eyebrow}</p>

        <ul className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
          {actores.items.map((a, i) => (
            <li
              key={a.rol}
              className="border-t border-crema/20 pt-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <p className="eyebrow text-lima">{a.rol}</p>

              {/* Caja de alto fijo para que los dos logos queden alineados
                  aunque tengan proporciones muy distintas. El enlace la ocupa
                  entera, así el área táctil no se limita al dibujo del logo. */}
              <a
                href={a.sitio}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ir al sitio de ${a.nombre}`}
                className="mt-6 flex h-12 w-fit items-center rounded transition-opacity hover:opacity-70 md:h-16"
              >
                <Image
                  src={a.logo}
                  alt={a.nombre}
                  width={a.ancho}
                  height={a.alto}
                  sizes="(min-width: 640px) 220px, 180px"
                  className="w-auto max-w-full object-contain object-left"
                  style={{ height: `${a.escala * 100}%` }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
