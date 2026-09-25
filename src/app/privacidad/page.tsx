import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { privacidad, proyecto } from "@/content/site";

export const metadata: Metadata = {
  title: `Política de privacidad | ${proyecto.nombre}`,
  description: `Cómo trata ${proyecto.nombre} los datos personales de quienes nos consultan por la web y por WhatsApp.`,
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <>
      <header className="bg-verde-900 py-6">
        <div className="contenedor">
          <Link href="/" aria-label={`Volver a ${proyecto.nombre}`}>
            <Logo variante="lima" alto={22} />
          </Link>
        </div>
      </header>

      <main className="contenedor max-w-3xl py-16 text-verde-900">
        <h1 className="text-3xl font-extrabold md:text-4xl">Política de privacidad</h1>
        <p className="mt-3 text-sm opacity-70">
          Última actualización: {privacidad.actualizada}
        </p>

        {privacidad.secciones.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-8">
            <h2 className="text-xl font-bold">{s.titulo}</h2>
            {s.parrafos.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed">
                {p}
              </p>
            ))}
            {s.items && (
              <ul className="mt-3 list-disc space-y-1 pl-6 leading-relaxed">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-12 leading-relaxed">
          Consultas sobre esta política:{" "}
          <a
            href={`mailto:${proyecto.email}`}
            className="font-bold underline underline-offset-4"
          >
            {proyecto.email}
          </a>
        </p>

        <p className="mt-10">
          <Link href="/" className="text-sm font-bold underline underline-offset-4">
            ← Volver al inicio
          </Link>
        </p>
      </main>
    </>
  );
}
