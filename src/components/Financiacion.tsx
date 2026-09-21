"use client";

import { useEffect, useMemo, useState } from "react";
import { Encabezado, Flecha, IconoWhatsapp, superficieNaranja } from "./ui";
import { financiacion as f, proyecto } from "@/content/site";
import cac from "@/content/cac.json";

const usd = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const pesos = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const metros = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 });
const puntos = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 1 });

type Cotizacion = { valor: number; envivo: boolean; fecha: string; vieja: boolean };

/** A partir de acá el respaldo deja de ser una referencia razonable. */
const DIAS_DE_TOLERANCIA = 45;

// Formateado a mano y no con toLocaleDateString: esto corre igual en el
// servidor y en el cliente, y con la zona horaria de por medio no coincidían.
const [anio, mes, dia] = f.cotizacion.respaldoDesde.split("-");
const FECHA_RESPALDO = `${dia}/${mes}/${anio}`;

/**
 * El anticipo nunca baja del mínimo ni supera el valor del lote. Si el
 * visitante escribe menos (o deja el campo vacío mientras tipea), el plan se
 * calcula igual con el mínimo y al salir del campo el valor se corrige solo.
 */
function acotarAnticipo(valor: string, precioLote: number) {
  return Math.min(Math.max(Number(valor) || 0, f.anticipoMinimo), precioLote);
}

/** Cotización de dolarapi.com. Si falla, queda el valor de respaldo del contenido. */
function useCotizacion(): Cotizacion {
  const [cot, setCot] = useState<Cotizacion>({
    valor: f.cotizacion.respaldo,
    envivo: false,
    fecha: FECHA_RESPALDO,
    vieja: false,
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
          vieja: false,
        });
      })
      .catch(() => {
        // Si la API no responde mostramos el respaldo, pero avisando cuando ya
        // quedó viejo: si no, la página sigue calculando cuotas en pesos con un
        // dólar de hace meses y nadie se entera. El cálculo va acá y no en el
        // render para que el HTML del servidor y el del cliente coincidan.
        if (!vivo) return;
        const dias =
          (Date.now() - new Date(`${f.cotizacion.respaldoDesde}T12:00:00`).getTime()) / 86_400_000;
        if (dias > DIAS_DE_TOLERANCIA) setCot((c) => ({ ...c, vieja: true }));
      });
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
    const entrega = acotarAnticipo(anticipo, lote.precio);
    const aFinanciar = lote.precio - entrega;
    return {
      entrega,
      aFinanciar,
      cuotaUsd: aFinanciar / plazo,
    };
  }, [anticipo, lote, plazo]);

  const cuotaPesos = plan.cuotaUsd * cotizacion.valor;
  // Lo que suma el ajuste por CAC sobre la cuota, con la última variación
  // publicada. Es un mes de ajuste, no una proyección hacia adelante.
  const ajusteCac = cuotaPesos * (cac.variacionMensual / 100);

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
    <section id="financiacion" className="seccion bg-verde text-crema">
      <div className="contenedor">
        <Encabezado
          eyebrow={f.eyebrow}
          titulo={f.titulo}
          bajada={<p>{f.bajada}</p>}
          tono="oscuro"
          dividido
        />

        {/* El panel de resultado llevaba el mismo verde que la sección y la
            tarjeta parecía cortada al medio. Ahora las dos mitades apoyan
            sobre verde-900 y el resultado se separa por una superficie
            apenas más clara, no por el fondo de la página. */}
        <div
          className="mt-16 overflow-hidden rounded-3xl bg-verde-900 ring-1 ring-crema/10 md:grid md:grid-cols-[1.05fr_1fr]"
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
                      <span className="mt-1 block text-xs text-crema/65">
                        {metros.format(l.m2)} m² · {l.disponibles} disponibles
                      </span>
                      <span className="mt-0.5 block text-xs text-crema/60">{l.detalle}</span>
                    </button>
                  );
                })}
              </div>
            </Campo>

            <Campo etiqueta="Cuánto podés entregar">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-crema/15 px-4 focus-within:border-naranja">
                <span className="text-sm font-bold text-crema/60">USD</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={f.anticipoMinimo}
                  max={lote.precio}
                  step={100}
                  value={anticipo}
                  onChange={(e) => setAnticipo(e.target.value)}
                  onBlur={(e) => setAnticipo(String(acotarAnticipo(e.target.value, lote.precio)))}
                  className="w-full bg-transparent py-3.5 text-lg font-bold outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-crema/65">
                Anticipo mínimo: USD {usd.format(f.anticipoMinimo)}.
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
              <p className="mt-2 text-xs text-crema/65">{f.notaPlazo}</p>
            </Campo>
          </div>

          {/* ---------- lo que le devolvemos ---------- */}
          <div className="border-t border-crema/10 bg-crema/[0.045] p-6 md:border-t-0 md:border-l md:p-9">
            <p className="eyebrow text-crema/60">Tu cuota estimada</p>

            <p className="mt-3 text-4xl leading-none font-extrabold tracking-[-0.03em] text-lima md:text-5xl">
              ${pesos.format(cuotaPesos)}
              <span className="ml-1.5 text-lg font-semibold text-crema/60">/mes</span>
            </p>
            <p className="mt-1.5 text-base font-bold text-naranja">
              + ${pesos.format(ajusteCac)} de CAC en pesos estimado
            </p>
            <p className="mt-3 text-sm text-crema/70">
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

            <div className="mt-6 space-y-1.5 border-t border-crema/10 pt-5 text-xs text-crema/65">
              <p className={cotizacion.vieja ? "text-naranja" : undefined}>
                {f.cotizacion.nombre}:{" "}
                <strong className={cotizacion.vieja ? "font-bold" : "text-crema/75"}>
                  ${pesos.format(cotizacion.valor)}
                </strong>{" "}
                {cotizacion.envivo
                  ? `· cotización del ${cotizacion.fecha}`
                  : `· valor de referencia al ${cotizacion.fecha}`}
                {cotizacion.vieja &&
                  ". No pudimos actualizarla y ya quedó vieja: consultá el valor de la cuota antes de decidir."}
              </p>
              <p>
                Índice CAC (CAMARCO) de {cac.periodo}:{" "}
                <strong className="text-crema/75">
                  {cac.variacionMensual > 0 ? "+" : ""}
                  {String(cac.variacionMensual).replace(".", ",")}% mensual
                </strong>
                , {puntos.format(cac.valor)} puntos. Las cuotas se abonan en pesos y se
                actualizan con esa variación. No se proyectan valores futuros.
              </p>
            </div>

            <a
              href={consulta}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-bold ${superficieNaranja}`}
            >
              <IconoWhatsapp />
              {f.cta}
              <Flecha />
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-crema/60">{f.legales}</p>
      </div>
    </section>
  );
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-crema/60">{etiqueta}</p>
      {children}
    </div>
  );
}

function Fila({ termino, valor }: { termino: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-crema/65">{termino}</dt>
      <dd className="font-bold tabular-nums">{valor}</dd>
    </div>
  );
}
