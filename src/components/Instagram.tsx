import Image from "next/image";
import { Encabezado, BotonSecundario, IconoInstagram } from "./ui";
import { instagram as s } from "@/content/site";
import { ultimasPublicaciones } from "@/lib/instagram";

/** Cuántas publicaciones trae la grilla: 2 columnas en mobile, 4 en desktop. */
const CANTIDAD = 8;

/**
 * Avances de obra tomados de la cuenta de Instagram.
 *
 * Server Component: el feed se pide desde el servidor una vez por hora y llega
 * al navegador como HTML ya dibujado con la paleta del sitio. No hay script de
 * Instagram ni cookies de Meta, y cada pieza enlaza al post.
 *
 * Los videos van como portada con un play encima: desde julio de 2026 la API
 * no entrega el archivo de video ni para la cuenta propia, así que se
 * reproducen en Instagram. Para el objetivo de llevar gente a la cuenta, mejor.
 *
 * Sin token, o si la API falla, `ultimasPublicaciones` devuelve `[]` y la
 * sección no se dibuja. Preferimos que no esté a que quede un hueco vacío.
 */
export async function Instagram() {
  const publicaciones = await ultimasPublicaciones(CANTIDAD);
  if (publicaciones.length === 0) return null;

  return (
    <section id="instagram" className="seccion bg-verde text-crema">
      <div className="contenedor">
        <Encabezado
          eyebrow={s.eyebrow}
          titulo={s.titulo}
          tono="oscuro"
          dividido
          bajada={<p>{s.bajada}</p>}
        />

        <ul className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-5">
          {publicaciones.map((p, i) => (
            <li
              key={p.id}
              data-reveal
              style={{ "--reveal-delay": `${(i % 4) * 90}ms` } as React.CSSProperties}
            >
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="instagram-post"
                className="group relative block aspect-square overflow-hidden rounded-xl bg-verde-900"
              >
                <Image
                  src={p.portada}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 23vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Velo sólo en hover: sobre la foto en reposo restaría luz a
                    la única parte de la página que muestra la obra real. */}
                <span className="absolute inset-0 bg-verde-900/0 transition-colors duration-300 group-hover:bg-verde-900/25" />

                {p.esVideo && (
                  <span className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-verde-900/70 backdrop-blur md:size-8">
                    <svg viewBox="0 0 24 24" className="size-3.5 text-crema md:size-4" fill="currentColor" aria-hidden>
                      <path d="M8 5.14v13.72c0 .4.44.65.78.44l11.1-6.86a.52.52 0 0 0 0-.88L8.78 4.7a.52.52 0 0 0-.78.44Z" />
                    </svg>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center md:mt-16">
          <BotonSecundario
            href={s.perfil}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="instagram-perfil"
            className="text-crema"
          >
            <IconoInstagram />
            {s.cta}
          </BotonSecundario>
        </div>
      </div>
    </section>
  );
}
