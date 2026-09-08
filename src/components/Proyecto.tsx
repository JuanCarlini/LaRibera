import { Contador } from "./Contador";
import { Encabezado } from "./ui";
import { cifras, proyectoSeccion as s } from "@/content/site";

export function Proyecto() {
  return (
    <section id="proyecto" className="seccion bg-crema">
      <div className="contenedor">
        {/* Sobre fondo claro usamos verde + naranja oscuro: el lima y el
            naranja puro de las piezas de RRSS no llegan al contraste AA. */}
        <Encabezado
          eyebrow={s.eyebrow}
          titulo={s.titulo}
          dividido
          bajada={s.parrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        />

        {/* Filetes en lugar de una caja redondeada: así la primera cifra
            arranca en la misma vertical que el titular y la franja comparte
            el sistema de reglas de Servicios y Ubicación. */}
        <dl className="mt-20 grid divide-y divide-verde/20 border-y border-verde/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {cifras.map((c, i) => (
            <div
              key={c.label}
              className="flex flex-col py-8 sm:px-10 sm:first:pl-0 sm:last:pr-0 md:py-10"
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <dd className="order-1 text-5xl leading-none font-extrabold tracking-[-0.03em] text-verde md:text-6xl">
                <Contador valor={c.valor} sufijo={c.hasta ? "" : c.sufijo} />
                {c.hasta && (
                  <>
                    <span className="text-naranja-600">–</span>
                    <Contador valor={c.hasta} sufijo={c.sufijo} />
                  </>
                )}
              </dd>
              <dt className="order-2 mt-5 text-lg font-bold text-verde">{c.label}</dt>
              <dd className="order-3 text-sm text-verde/70">{c.detalle}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
