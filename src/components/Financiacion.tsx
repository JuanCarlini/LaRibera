"use client";

import { useEffect, useMemo, useState } from "react";
import { Eyebrow, Flecha, IconoWhatsapp } from "./ui";
import { financiacion as f, proyecto } from "@/content/site";

const usd = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const pesos = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const metros = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 });

type Cotizacion = { valor: number; envivo: boolean; fecha: string };

/** Cotización de dolarapi.com. Si falla, queda el valor de respaldo del contenido. */
function useCotizacion(): Cotizacion {
  const [cot, setCot] = useState<Cotizacion>({
    valor: f.cotizacion.respaldo,
    envivo: false,
    fecha: f.cotizacion.respaldoFecha,
  });

  useEffect(() => {
    let vivo = true;
    fetch(`https://dolarapi.com/v1/dolares/${f.cotizacion.casa}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("sin respuesta"))))
      .then((d) => {
        if (!vivo || typeof d?.venta !== "number") return;
        setCot({
          valor: d.venta,
          envivo: true,
          fecha: new Date(d.fechaActualizacion).toLocaleDateString("es-AR"),
        });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  return cot;
}

export function Financiacion() {
  const [lote, setLote] = useState(f.lotes[0]);
  const [anticipo, setAnticipo] = useState(String(f.anticipoMinimo));
  const [plazo, setPlazo] = useState(24);
  const cotizacion = useCotizacion();

  const plan = useMemo(() => {
    const entrega = Math.min(Math.max(Number(anticipo) || 0, 0), lote.precio);
    const aFinanciar = lote.precio - entrega;
    return {
      entrega,
      aFinanciar,
      cuotaUsd: aFinanciar / plazo,
      bajoMinimo: entrega < f.anticipoMinimo,
    };
  }, [anticipo, lote, plazo]);

  const cuotaPesos = plan.cuotaUsd * cotizacion.valor;

  const consulta = `https://wa.me/${proyecto.whatsapp}?text=${encodeURIComponent(
    [
      `Hola, armé un plan de pago en la web de ${proyecto.nombre}:`,
      `Lote de ${metros.format(lote.m2)} m² — USD ${usd.format(lote.precio)}`,
      `Entrega inicial: USD ${usd.format(plan.entrega)}`,
      `${plazo} cuotas de USD ${usd.format(plan.cuotaUsd)}`,
      "Quiero que me confirmen disponibilidad y condiciones.",
    ].join("\n"),
  )}`;

  return (
    <section id="financiacion" className="bg-verde py-20 text-crema md:py-28">
      <div className="contenedor">
        <header className="max-w-2xl" data-reveal>
          <Eyebrow className="text-lima">{f.eyebrow}</Eyebrow>
          <h2 className="titular mt-4">
            <span className="block text-lima">{f.titulo[0]}</span>
            <span className="block text-naranja">{f.titulo[1]}</span>
          </h2>
          <p className="mt-5 text-crema/70" style={{ fontSize: "var(--text-bajada)" }}>
            {f.bajada}
          </p>
        </header>

        <div
          className="mt-10 overflow-hidden rounded-3xl bg-verde-900 md:mt-14 md:grid md:grid-cols-[1.05fr_1fr]"
          data-reveal
        >
          {/* ---------- lo que elige el visitante ---------- */}
          <div className="space-y-8 p-6 md:p-9">
            <Campo etiqueta="Lote">
              <div className="grid gap-2 sm:grid-cols-3">
                {f.lotes.map((l) => {
                  const activo = l.precio === lote.precio;
                  return (
                    <button
                      key={l.precio}
                      type="button"
                      onClick={() => setLote(l)}
                      aria-pressed={activo}
                      className={`rounded-2xl border-2 p-3 text-left transition-colors ${
                        activo
                          ? "border-naranja bg-naranja/10"
                          : "border-crema/15 hover:border-crema/35"
                      }`}
                    >
                      <span className="block font-bold">USD {usd.format(l.precio)}</span>
                      <span className="mt-1 block text-xs text-crema/55">
                        {metros.format(l.m2)} m² · {l.disponibles} disponibles
                      </span>
                      <span className="mt-0.5 block text-xs text-crema/40">{l.detalle}</span>
                    </button>
                  );
                })}
              </div>
            </Campo>

            <Campo etiqueta="Cuánto podés entregar">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-crema/15 px-4 focus-within:border-naranja">
                <span className="text-sm font-bold text-crema/40">USD</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={lote.precio}
                  step={100}
                  value={anticipo}
                  onChange={(e) => setAnticipo(e.target.value)}
                  className="w-full bg-transparent py-3.5 text-lg font-bold outline-none"
                />
              </div>
              <p className={`mt-2 text-xs ${plan.bajoMinimo ? "text-naranja" : "text-crema/50"}`}>
                {plan.bajoMinimo
                  ? `El anticipo sugerido es de USD ${usd.format(f.anticipoMinimo)}. Con menos, consultá condiciones.`
                  : `Anticipo de referencia: USD ${usd.format(f.anticipoMinimo)}.`}
              </p>
            </Campo>

            <Campo etiqueta="Plazo">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {f.plazos.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlazo(p)}
                    aria-pressed={p === plazo}
                    className={`rounded-2xl border-2 py-3 text-sm font-bold transition-colors ${
                      p === plazo
                        ? "border-naranja bg-naranja/10"
                        : "border-crema/15 hover:border-crema/35"
                    }`}
                  >
                    {p} meses
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-crema/50">{f.notaPlazo}</p>
            </Campo>
          </div>

          {/* ---------- lo que le devolvemos ---------- */}
          <div className="border-t border-crema/10 bg-verde p-6 md:border-t-0 md:border-l md:p-9">
            <p className="eyebrow text-crema/45">Tu cuota estimada</p>

            <p className="mt-3 text-4xl leading-none font-extrabold tracking-[-0.03em] text-lima md:text-5xl">
              ${pesos.format(cuotaPesos)}
              <span className="text-lg font-semibold text-crema/50"> /mes</span>
            </p>
            <p className="mt-2 text-sm text-crema/60">
              Equivale a <strong className="text-crema">USD {usd.format(plan.cuotaUsd)}</strong> por
              mes
            </p>

            <dl className="mt-7 space-y-2.5 border-t border-crema/10 pt-6 text-sm">
              <Fila termino="Valor del lote" valor={`USD ${usd.format(lote.precio)}`} />
              <Fila termino="Entrega inicial" valor={`USD ${usd.format(plan.entrega)}`} />
              <Fila termino="Total a financiar" valor={`USD ${usd.format(plan.aFinanciar)}`} />
              <Fila
                termino="Cuotas"
                valor={`${plazo} de USD ${usd.format(plan.cuotaUsd)}`}
              />
            </dl>

            <div className="mt-6 space-y-1.5 border-t border-crema/10 pt-5 text-xs text-crema/50">
              <p>
                {f.cotizacion.nombre}:{" "}
                <strong className="text-crema/75">${pesos.format(cotizacion.valor)}</strong>{" "}
                {cotizacion.envivo
                  ? `· cotización del ${cotizacion.fecha}`
                  : `· valor de referencia al ${cotizacion.fecha}`}
              </p>
              <p>
                Las cuotas se abonan en pesos y se actualizan mes a mes por el índice CAC
                (CAMARCO).
                {f.cac.variacion !== null &&
                  ` Última variación informada: ${f.cac.variacion > 0 ? "+" : ""}${f.cac.variacion}% (${f.cac.periodo}).`}{" "}
                No se proyectan valores futuros.
              </p>
            </div>

            <a
              href={consulta}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-naranja px-6 py-4 font-bold text-crema transition-colors hover:bg-naranja-600"
            >
              <IconoWhatsapp />
              {f.cta}
              <Flecha />
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-crema/45">{f.legales}</p>
      </div>
    </section>
  );
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-crema/45">{etiqueta}</p>
      {children}
    </div>
  );
}

function Fila({ termino, valor }: { termino: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-crema/55">{termino}</dt>
      <dd className="font-bold tabular-nums">{valor}</dd>
    </div>
  );
}
