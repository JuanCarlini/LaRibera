"use client";

import { useState } from "react";
import { Encabezado, Flecha, IconoWhatsapp, superficieNaranja } from "./ui";
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
  // `window.open` es lo único que hace el envío, y los navegadores mobile lo
  // bloquean seguido. Sin este estado el visitante apretaba Enviar, no pasaba
  // nada visible y el lead se perdía en silencio.
  const [envio, setEnvio] = useState<{ estado: "abierto" | "bloqueado"; url: string } | null>(null);

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

    const url = `https://wa.me/${proyecto.whatsapp}?text=${encodeURIComponent(texto)}`;
    const ventana = window.open(url, "_blank", "noopener,noreferrer");
    setEnvio({ estado: ventana ? "abierto" : "bloqueado", url });
    // Recién acá: el submit ya pasó la validación nativa del form. Si Umami
    // está bloqueado por un adblocker, `window.umami` no existe y no pasa nada.
    window.umami?.track("form-contacto");
  };

  // pt-0 / pb-2: con el campo vacío, la etiqueta tiene que quedar más cerca
  // de su propia línea que de la del campo anterior, o se lee agrupada al revés.
  const inputClass =
    "w-full border-b-2 border-crema/30 bg-transparent pt-0 pb-2 text-lg leading-tight text-crema placeholder-crema/45 transition-colors outline-none focus:border-naranja";

  return (
    <section id="contacto" className="seccion bg-verde text-crema">
      <div className="contenedor grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <Encabezado
            eyebrow={s.eyebrow}
            titulo={s.titulo}
            bajada={<p>{s.bajada}</p>}
            tono="oscuro"
            anchoBajada="max-w-md"
          />

          <a
            href={`https://wa.me/${proyecto.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="wsp-contacto"
            className="mt-10 inline-flex items-center gap-3 rounded-full border-2 border-crema/30 px-6 py-3.5 font-bold transition-colors hover:border-lima hover:text-lima"
            data-reveal
          >
            <IconoWhatsapp className="size-5" />
            {proyecto.whatsappVisible}
          </a>
        </div>

        <form
          onSubmit={enviar}
          className="space-y-11"
          data-reveal
          style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
        >
          {campos.map((c) => (
            <div key={c.id}>
              <label htmlFor={c.id} className="eyebrow mb-1 block text-crema/65">
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
            <label htmlFor="mensaje" className="eyebrow mb-1 block text-crema/65">
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

          <div>
            <button
              type="submit"
              className={`inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold ${superficieNaranja}`}
            >
              Enviar consulta
              <Flecha />
            </button>

            <p className="mt-4 max-w-md text-xs text-crema/65">{s.datos}</p>

            {/* role="status" para que el lector de pantalla anuncie el resultado
                sin que el visitante tenga que ir a buscarlo. Queda siempre en el
                DOM y visible: una live region que aparece recién con el mensaje
                no se anuncia. */}
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm ${envio?.estado === "bloqueado" ? "text-naranja" : "text-lima"}`}
            >
              {envio && (
                <>
                  {envio.estado === "abierto" ? s.abierto : s.bloqueado}{" "}
                  <a
                    href={envio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline underline-offset-2"
                  >
                    {s.reintento}
                  </a>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
