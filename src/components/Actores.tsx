import Image from "next/image";
import { actores } from "@/content/site";

/**
 * Quién desarrolla y quién comercializa.
 * Fondo verde porque los logos entregados son blancos sobre transparente.
 */
export function Actores() {
  return (
    <section className="bg-verde pt-14 pb-4 text-crema md:pt-20 md:pb-6">
      <div className="contenedor">
        <p className="eyebrow text-crema/45">{actores.eyebrow}</p>

        <ul className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-12 md:mt-10">
          {actores.items.map((a, i) => (
            <li
              key={a.rol}
              className="border-t border-crema/15 pt-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-lima uppercase">
                {a.rol}
              </p>

              {/* Caja de alto fijo para que los dos logos queden alineados
                  aunque tengan proporciones muy distintas. */}
              <div className="mt-5 flex h-12 items-center md:h-16">
                <Image
                  src={a.logo}
                  alt={a.nombre}
                  width={a.ancho}
                  height={a.alto}
                  sizes="(min-width: 640px) 220px, 180px"
                  className="w-auto max-w-full object-contain object-left"
                  style={{ height: `${a.escala * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
