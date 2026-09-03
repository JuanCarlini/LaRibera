import Image from "next/image";
import { Eyebrow } from "./ui";
import { vida as s } from "@/content/site";

/**
 * Cards apiladas: cada una se congela en el centro del viewport y la siguiente
 * sube y la tapa. Al pasar la última, el scroll se libera.
 *
 * Es CSS puro: cada <li> mide una pantalla y queda `sticky`, así que la primera
 * se frena mientras las que siguen entran desde abajo. No hace falta ni un
 * listener de scroll. Cada card se pega unos píxeles más abajo que la anterior
 * para que asome el borde de la que quedó debajo y se lea como pila.
 */
const DESFASE_PX = 10;

export function Vida() {
  return (
    <section id="vida" className="relative bg-crema-100">
      <div className="contenedor pt-20 pb-2 md:pt-28">
        <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
        <h2 className="titular mt-4">
          <span className="block text-verde">{s.titulo[0]}</span>
          <span className="block text-naranja-600">{s.titulo[1]}</span>
        </h2>
        <p className="mt-4 max-w-md text-verde/70">{s.bajada}</p>
      </div>

      <ul className="relative">
        {s.cards.map((c, i) => (
          <li
            key={c.titulo}
            style={{ top: i * DESFASE_PX }}
            className="sticky flex h-svh items-center justify-center px-6 motion-reduce:static motion-reduce:h-auto motion-reduce:py-6 md:px-10"
          >
            <article className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-crema shadow-[0_18px_50px_-24px_rgba(6,52,36,0.45)] md:flex md:max-w-4xl lg:max-w-5xl lg:min-h-[26rem]">
              <div className="relative aspect-4/3 md:aspect-auto md:w-3/5 md:self-stretch">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 90vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 rounded-full bg-verde/90 px-3 py-1.5 text-xs font-bold text-lima backdrop-blur">
                  {c.dato}
                </span>
              </div>

              <div className="p-6 md:flex md:w-2/5 md:flex-col md:justify-center md:p-9">
                <h3 className="text-xl leading-tight font-extrabold text-verde md:text-3xl">
                  {c.titulo}
                </h3>
                <p className="mt-3 text-sm text-verde/70 md:mt-4 md:text-base">{c.texto}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
