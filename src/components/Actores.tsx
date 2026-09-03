import Image from "next/image";
import { Eyebrow } from "./ui";
import { actores } from "@/content/site";

/**
 * Quién desarrolla y quién comercializa. Mientras no tengamos los logos en
 * archivo, el nombre se muestra compuesto con la tipografía del proyecto.
 */
export function Actores() {
  return (
    <section className="border-y border-verde/10 bg-crema-100 py-16 md:py-20">
      <div className="contenedor">
        <Eyebrow className="text-verde/55">{actores.eyebrow}</Eyebrow>

        <ul className="mt-8 grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {actores.items.map((a, i) => (
            <li
              key={a.rol}
              className="flex flex-col gap-3 border-t border-verde/15 pt-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              <span className="text-xs font-semibold tracking-[0.18em] text-naranja-600 uppercase">
                {a.rol}
              </span>

              {a.logo ? (
                <Image
                  src={a.logo}
                  alt={a.nombre}
                  width={280}
                  height={72}
                  className="h-12 w-auto object-contain object-left md:h-14"
                />
              ) : (
                <span className="text-2xl leading-tight font-extrabold tracking-[-0.02em] text-verde md:text-3xl">
                  {a.nombre}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
