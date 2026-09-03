"use client";

import { useState } from "react";
import { Eyebrow, Flecha, IconoWhatsapp } from "./ui";
import { contacto as s, proyecto } from "@/content/site";

const campos = [
  { id: "nombre", label: "Nombre y apellido", type: "text", autoComplete: "name" },
  { id: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

/**
 * Maqueta: el formulario arma el mensaje y abre WhatsApp con los datos cargados.
 * Cuando definamos el destino de los leads (CRM / base / mail) esto pasa a un
 * server action y WhatsApp queda sólo como atajo alternativo.
 */
export function Contacto() {
  const [datos, setDatos] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = [
      `Hola, soy ${datos.nombre}.`,
      "Quiero información sobre los lotes de La Ribera.",
      datos.telefono && `Tel: ${datos.telefono}`,
      datos.email && `Email: ${datos.email}`,
      datos.mensaje,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${proyecto.whatsapp}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const inputClass =
    "w-full border-b-2 border-crema/25 bg-transparent pt-2 pb-3 text-lg text-crema placeholder-crema/35 transition-colors outline-none focus:border-naranja";

  return (
    <section id="contacto" className="bg-verde py-24 text-crema md:py-32">
      <div className="contenedor grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div data-reveal>
          <Eyebrow className="text-lima">{s.eyebrow}</Eyebrow>
          <h2 className="titular mt-5">
            <span className="block text-lima">{s.titulo[0]}</span>
            <span className="block text-naranja">{s.titulo[1]}</span>
          </h2>
          <p
            className="mt-6 max-w-md text-crema/70"
            style={{ fontSize: "var(--text-bajada)" }}
          >
            {s.bajada}
          </p>

          <a
            href={`https://wa.me/${proyecto.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full border-2 border-crema/25 px-6 py-3.5 font-bold transition-colors hover:border-lima hover:text-lima"
          >
            <IconoWhatsapp className="size-5" />
            {proyecto.whatsappVisible}
          </a>
        </div>

        <form
          onSubmit={enviar}
          className="space-y-8"
          data-reveal
          style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
        >
          {campos.map((c) => (
            <div key={c.id}>
              <label
                htmlFor={c.id}
                className="eyebrow text-crema/50"
              >
                {c.label}
              </label>
              <input
                id={c.id}
                name={c.id}
                type={c.type}
                autoComplete={c.autoComplete}
                required={c.id === "nombre"}
                value={datos[c.id]}
                onChange={(e) => setDatos({ ...datos, [c.id]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}

          <div>
            <label htmlFor="mensaje" className="eyebrow text-crema/50">
              Mensaje (opcional)
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={3}
              value={datos.mensaje}
              onChange={(e) => setDatos({ ...datos, mensaje: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-naranja px-8 py-4 font-bold text-crema transition-colors hover:bg-naranja-600"
          >
            Enviar consulta
            <Flecha />
          </button>
        </form>
      </div>
    </section>
  );
}
