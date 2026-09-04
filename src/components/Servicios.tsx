import Image from "next/image";
import { Wave } from "./Wave";
import { Eyebrow } from "./ui";
import { servicios as s } from "@/content/site";

// Íconos de trazo, mismo grosor y caja, para que se lean como una familia.
const iconos: Record<string, React.ReactNode> = {
  "Gas natural": (
    <>
      <path d="M12 2.5c.4 3-1.4 4.2-2.8 5.6C7.6 9.6 6.2 11.2 6.2 13.8a5.8 5.8 0 0 0 11.6 0c0-2.3-1-3.9-2.2-5.2" />
      <path d="M12 20a2.6 2.6 0 0 1-2.6-2.6c0-1.6 2.6-3.7 2.6-3.7s2.6 2.1 2.6 3.7A2.6 2.6 0 0 1 12 20Z" />
    </>
  ),
  Electricidad: <path d="M13.4 2 4.8 13.2h6L10.6 22l8.6-11.2h-6L13.4 2Z" />,
  "Red de agua": (
    <>
      <path d="M12 3c3.3 3.9 5.8 7 5.8 10a5.8 5.8 0 1 1-11.6 0c0-3 2.5-6.1 5.8-10Z" />
      <path d="M14.6 14.6a2.7 2.7 0 0 1-2.4 2.5" />
    </>
  ),
  Cloacas: (
    <>
      <path d="M3 9.5h6.5a2 2 0 0 1 2 2V21" />
      <path d="M3 6.5v6M20.5 15.5H14a2 2 0 0 1-2-2V3" />
      <path d="M20.5 12.5v6" />
    </>
  ),
};

export function Servicios() {
  return (
    <section id="servicios" className="relative bg-verde text-crema">
      <div className="relative h-[42vw] max-h-[520px] min-h-56 w-full bg-verde">
        <Image
          src="/img/masterplan-aereo.webp"
          alt="Vista aérea del barrio con sus manzanas, calles y espacios verdes"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <Wave className="absolute inset-x-0 bottom-0 text-verde" />
      </div>

      <div className="contenedor pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7" data-reveal>
            <Eyebrow className="text-lima">{s.eyebrow}</Eyebrow>
            <h2 className="titular mt-5">
              <span className="block text-lima">{s.titulo[0]}</span>
              <span className="block text-naranja">{s.titulo[1]}</span>
            </h2>
          </div>
          <p
            className="self-end text-crema/70 md:col-span-5"
            data-reveal
            style={
              {
                fontSize: "var(--text-bajada)",
                "--reveal-delay": "140ms",
              } as React.CSSProperties
            }
          >
            {s.bajada}
          </p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((item, i) => (
            <li
              key={item.nombre}
              className="border-t-2 border-crema/15 pt-6"
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-9 text-naranja"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {iconos[item.nombre]}
              </svg>
              <h3 className="mt-5 text-2xl font-extrabold text-lima">{item.nombre}</h3>
              <p className="mt-2 text-sm text-crema/60">{item.detalle}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
