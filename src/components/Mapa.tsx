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

const { centro, zoom, preciso } = ubicacion.mapa;

/** Abre las indicaciones en Google Maps. Funciona con o sin clave de API. */
export const comoLlegarHref = `https://www.google.com/maps/dir/?api=1&destination=${centro.lat},${centro.lng}`;

const marco = "relative aspect-4/3 overflow-hidden rounded-3xl bg-verde/10";

export function Mapa() {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const [vista, setVista] = useState<"zona" | "predio">("zona");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!CLAVE || !contenedor.current) return;
    let vivo = true;

    cargarSdk(CLAVE)
      .then(() => {
        if (!vivo || !contenedor.current) return;
        mapa.current = new window.google.maps.Map(contenedor.current, {
          center: centro,
          zoom,
          styles: estilo,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });
        // No dibujamos nada encima: sin el plano de mensura, cualquier marca
        // sobre el mapa sería inventada. El predio se ve en la vista satelital.
      })
      .catch(() => vivo && setError(true));

    return () => {
      vivo = false;
    };
  }, []);

  if (!CLAVE || error) {
    return (
      <div>
        <div className={marco}>
          <Predio />
        </div>
        <Aclaracion />
      </div>
    );
  }

  return (
    <div>
      <div className={marco}>
        {/* Las dos vistas quedan montadas y se alternan con opacidad, así el
            mapa no necesita reinicializarse ni recalcular su tamaño. */}
        <div
          ref={contenedor}
          className={`absolute inset-0 transition-opacity duration-300 ${
            vista === "zona" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            vista === "predio" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={vista !== "predio"}
        >
          <Predio />
        </div>

        <div className="absolute top-4 left-4 z-10 flex rounded-full bg-crema/95 p-1 shadow-sm backdrop-blur">
          {(
            [
              ["zona", "La zona"],
              ["predio", "El predio"],
            ] as const
          ).map(([v, texto]) => (
            <button
              key={v}
              type="button"
              onClick={() => setVista(v)}
              aria-pressed={vista === v}
              className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-colors ${
                vista === v ? "bg-verde text-crema" : "text-verde/70 hover:text-verde"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>
      </div>
      <Aclaracion />
    </div>
  );
}

function Predio() {
  return (
    <Image
      src="/img/mapa-ubicacion.webp"
      alt={`Vista satelital de ${proyecto.ubicacion} con el predio de La Ribera marcado`}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover"
    />
  );
}

/** Fuera del mapa: tapar la atribución de Google va contra sus condiciones. */
function Aclaracion() {
  if (preciso) return null;
  return (
    <p className="mt-3 text-xs text-verde/55">
      El plano definitivo del loteo se publica al lanzamiento.
    </p>
  );
}
