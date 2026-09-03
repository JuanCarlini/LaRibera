import { Contador } from "./Contador";
import { Eyebrow } from "./ui";
import { cifras, proyectoSeccion as s } from "@/content/site";

export function Proyecto() {
  return (
    <section id="proyecto" className="bg-crema py-24 md:py-32">
      <div className="contenedor">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7" data-reveal>
            <Eyebrow className="text-verde/65">{s.eyebrow}</Eyebrow>
            {/* Sobre fondo claro usamos verde + naranja oscuro: el lima y el
                naranja puro de las piezas de RRSS no llegan al contraste AA. */}
            <h2 className="titular mt-5">
              <span className="block text-verde">{s.titulo[0]}</span>
              <span className="block text-naranja-600">{s.titulo[1]}</span>
            </h2>
          </div>

          <div
            className="space-y-5 self-end text-verde/80 md:col-span-5"
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            {s.parrafos.map((p) => (
              <p key={p} style={{ fontSize: "var(--text-bajada)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <dl className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-verde/15 sm:grid-cols-3">
          {cifras.map((c, i) => (
            <div
              key={c.label}
              className="bg-crema p-8 md:p-10"
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <dd className="text-5xl leading-none font-extrabold tracking-[-0.03em] text-verde md:text-6xl">
                <Contador valor={c.valor} sufijo={c.hasta ? "" : c.sufijo} />
                {c.hasta && (
                  <>
                    <span className="text-naranja">–</span>
                    <Contador valor={c.hasta} sufijo={c.sufijo} />
                  </>
                )}
              </dd>
              <dt className="mt-4">
                <span className="block text-lg font-bold text-verde">{c.label}</span>
                <span className="block text-sm text-verde/60">{c.detalle}</span>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
