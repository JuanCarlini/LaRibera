"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlanoAmpliado } from "./PlanoAmpliado";
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

const marco =
  "relative overflow-hidden rounded-3xl bg-verde/10 transition-[aspect-ratio] duration-300";
/** El plano es mucho más apaisado que el mapa: si lo metemos en 4:3 queda
    diminuto y con dos franjas vacías. El marco toma la proporción de la vista. */
const PROPORCION = { zona: "4 / 3", predio: "1872 / 796" } as const;

export function Mapa() {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const [vista, setVista] = useState<"zona" | "predio">("zona");
  const [error, setError] = useState(false);
  const [ampliado, setAmpliado] = useState(false);

  useEffect(() => {
    if (!CLAVE || !contenedor.current) return;
    let vivo = true;

    // Google avisa por acá cuando la clave no autoriza este dominio, venció o
    // le falta facturación. Sin esto pinta su propio cartel de error adentro
    // del marco; con esto caemos al plano, que al menos es contenido útil.
    (window as any).gm_authFailure = () => {
      if (vivo) setError(true);
    };

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

        // Sólo marcamos cuando la ubicación está confirmada. Usamos el Marker
        // clásico —y no AdvancedMarker— porque éste exige un mapId de Cloud,
        // que anula el estilo JSON con la paleta de marca.
        if (preciso) {
          new g.Marker({
            map: mapa.current,
            position: centro,
            title: proyecto.nombre,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="54" viewBox="0 0 42 54">
                     <path d="M21 53C21 53 39 32.6 39 20.6A18 18 0 1 0 3 20.6C3 32.6 21 53 21 53Z"
                           fill="#fc6011" stroke="#e6e6db" stroke-width="3"/>
                     <circle cx="21" cy="20" r="6.5" fill="#e6e6db"/>
                   </svg>`,
                ),
              scaledSize: new g.Size(42, 54),
              anchor: new g.Point(21, 54),
            },
          });
        }
      })
      .catch(() => vivo && setError(true));

    return () => {
      vivo = false;
    };
  }, []);

  if (!CLAVE || error) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setAmpliado(true)}
          className={`${marco} block w-full cursor-zoom-in`}
          style={{ aspectRatio: PROPORCION.predio }}
          aria-label="Ampliar el plano de mensura"
        >
          <Predio />
        </button>
        <PieDePlano onAmpliar={() => setAmpliado(true)} />
        {ampliado && <PlanoAmpliado onCerrar={() => setAmpliado(false)} />}
      </div>
    );
  }

  return (
    <div>
      <div className={marco} style={{ aspectRatio: PROPORCION[vista] }}>
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
          <button
            type="button"
            onClick={() => setAmpliado(true)}
            className="block h-full w-full cursor-zoom-in"
            aria-label="Ampliar el plano de mensura"
            tabIndex={vista === "predio" ? 0 : -1}
          >
            <Predio />
          </button>
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
      {vista === "predio" ? (
        <PieDePlano onAmpliar={() => setAmpliado(true)} />
      ) : (
        <Aclaracion />
      )}
      {ampliado && <PlanoAmpliado onCerrar={() => setAmpliado(false)} />}
    </div>
  );
}

/**
 * Plano de mensura. Va contenido y no recortado: es un plano técnico y
 * perder los bordes se lleva puestas las calles que lo delimitan.
 */
function Predio() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-crema">
      <Image
        src="/img/plano-loteo.webp"
        alt={`Plano de mensura de La Ribera con los 269 lotes, en ${proyecto.ubicacion}`}
        width={1872}
        height={796}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

function PieDePlano({ onAmpliar }: { onAmpliar: () => void }) {
  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-verde/55">
      <span>Plano de mensura · 269 lotes de 211 a 240 m²</span>
      <button
        type="button"
        onClick={onAmpliar}
        className="font-bold text-naranja-600 underline underline-offset-2"
      >
        Ampliar plano
      </button>
    </p>
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
