"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ubicacion, proyecto } from "@/content/site";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
  }
}

const CLAVE = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** Paleta del mapa derivada de los tokens de marca. */
const estilo = [
  { elementType: "geometry", stylers: [{ color: "#ecebde" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a6355" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f4f2e9" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9c8ba" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e3e2d3" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#cfe0b4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7b8f81" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f7cdaf" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9b791" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#a9c4c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#63848a" }] },
];

/** Inyecta el SDK de Google Maps una sola vez y resuelve cuando está listo. */
let cargando: Promise<void> | null = null;
function cargarSdk(clave: string) {
  if (window.google?.maps) return Promise.resolve();
  if (cargando) return cargando;

  cargando = new Promise<void>((resolver, rechazar) => {
    // loading=async + callback es el patrón que pide Google; sin él tira un
    // warning de performance en consola.
    const nombreCallback = "__mapaRiberaListo";
    (window as any)[nombreCallback] = () => resolver();

    const s = document.createElement("script");
    s.src =
      `https://maps.googleapis.com/maps/api/js?key=${clave}` +
      `&v=weekly&language=es-419&region=AR&loading=async&callback=${nombreCallback}`;
    s.async = true;
    s.onerror = () => rechazar(new Error("No se pudo cargar Google Maps"));
    document.head.appendChild(s);
  });

  return cargando;
}

const { centro, zoom, radioMetros, preciso, etiqueta } = ubicacion.mapa;

/** Abre las indicaciones en Google Maps. Funciona con o sin clave de API. */
export const comoLlegarHref = `https://www.google.com/maps/dir/?api=1&destination=${centro.lat},${centro.lng}`;

export function Mapa() {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const [vista, setVista] = useState<"mapa" | "satelite">("mapa");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!CLAVE || !contenedor.current) return;
    let vivo = true;

    cargarSdk(CLAVE)
      .then(() => {
        if (!vivo || !contenedor.current) return;
        const g = window.google.maps;

        mapa.current = new g.Map(contenedor.current, {
          center: centro,
          zoom,
          styles: estilo,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        // Círculo en lugar de pin: comunica "esta zona" y no un punto exacto.
        new g.Circle({
          map: mapa.current,
          center: centro,
          radius: radioMetros,
          strokeColor: "#fc6011",
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: "#99c561",
          fillOpacity: 0.35,
        });
      })
      .catch(() => vivo && setError(true));

    return () => {
      vivo = false;
    };
  }, []);

  // El estilo custom sólo aplica al mapa de calles; en satelital se saca.
  useEffect(() => {
    if (!mapa.current) return;
    mapa.current.setMapTypeId(vista === "mapa" ? "roadmap" : "hybrid");
    mapa.current.setOptions({ styles: vista === "mapa" ? estilo : null });
  }, [vista]);

  if (!CLAVE || error) return <MapaEstatico />;

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-verde/10">
      <div ref={contenedor} className="absolute inset-0" />

      <div className="absolute top-4 left-4 flex overflow-hidden rounded-full bg-crema/95 p-1 shadow-sm backdrop-blur">
        {(["mapa", "satelite"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVista(v)}
            aria-pressed={vista === v}
            className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide capitalize transition-colors ${
              vista === v ? "bg-verde text-crema" : "text-verde/70 hover:text-verde"
            }`}
          >
            {v === "mapa" ? "Mapa" : "Satélite"}
          </button>
        ))}
      </div>

      {!preciso && (
        <p className="absolute right-4 bottom-4 left-4 rounded-xl bg-crema/95 px-3 py-2 text-xs text-verde/70 backdrop-blur">
          Ubicación aproximada. El plano definitivo del loteo se publica al lanzamiento.
        </p>
      )}
    </div>
  );
}

/** Sin clave configurada mostramos la satelital de las piezas, que ya marca el predio. */
function MapaEstatico() {
  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-verde/10">
      <Image
        src="/img/mapa-ubicacion.webp"
        alt={`Vista satelital de ${proyecto.ubicacion} con el predio de ${etiqueta} marcado`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
