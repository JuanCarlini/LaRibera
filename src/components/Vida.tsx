import Image from "next/image";
import { Eyebrow } from "./ui";
import { vida as s } from "@/content/site";

export function Vida() {
  return (
    <section id="vida" className="bg-crema-100 py-24 md:py-32">
      <div className="contenedor">
        <div className="max-w-3xl" data-reveal>
          <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
          <h2 className="titular mt-5">
            <span className="block text-verde">{s.titulo[0]}</span>
            <span className="block text-naranja-600">{s.titulo[1]}</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
          {s.bloques.map((b, i) => (
            <article
              key={b.titulo}
              data-reveal
              style={{ "--reveal-delay": `${i * 150}ms` } as React.CSSProperties}
              className={i === 1 ? "md:mt-20" : undefined}
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                <Image
                  src={b.img}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] hover:scale-105"
                />
              </div>
              <h3 className="mt-8 max-w-md text-2xl leading-tight font-extrabold text-verde md:text-3xl">
                {b.titulo}
              </h3>
              <p className="mt-3 max-w-md text-verde/70">{b.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
