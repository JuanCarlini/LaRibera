"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlanoAmpliado } from "./PlanoAmpliado";
import { ubicacion, proyecto } from "@/content/site";
import geo from "@/content/mapa.json";

/**
 * El SDK de Maps se inyecta por <script> y no trae tipos: acotamos el `any` a
 * este alias en vez de apagar la regla en todo el archivo.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sdk = any;

declare global {
  interface Window {
    google?: { maps: Sdk };
    /** Lo llama Google cuando la clave no autoriza el dominio, venció o le falta facturación. */
    gm_authFailure?: () => void;
    /** Callback que le pasamos a la URL del SDK para saber cuándo terminó de cargar. */
    __mapaRiberaListo?: () => void;
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
    window.__mapaRiberaListo = () => resolver();
    const nombreCallback = "__mapaRiberaListo";

    const s = document.createElement("script");
    s.src =
      `https://maps.googleapis.com/maps/api/js?key=${clave}` +
      `&v=weekly&language=es-419&region=AR&loading=async&callback=${nombreCallback}`;
    s.async = true;
    s.onerror = () => {
      // Sin esto la promesa rechazada queda cacheada para siempre y un fallo
      // de red pasajero deja el mapa muerto hasta recargar la página.
      cargando = null;
      rechazar(new Error("No se pudo cargar Google Maps"));
    };
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

/** Qué resalta el mapa cuando se recorre la lista de accesos. */
export type Resalte = "frentes" | "rotonda" | "rio" | null;

export function Mapa({ resalte = null }: { resalte?: Resalte }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<Sdk>(null);
  const [vistaElegida, setVista] = useState<"zona" | "predio">("zona");
  // Con el plano a la vista el resalte no se vería, así que mientras haya uno
  // activo mandamos el mapa. Derivado y no seteado: evita un render de más.
  const vista = resalte ? "zona" : vistaElegida;
  const [error, setError] = useState(false);
  const [ampliado, setAmpliado] = useState(false);
  const trazos = useRef<Sdk[]>([]);

  useEffect(() => {
    if (!CLAVE || !contenedor.current) return;
    let vivo = true;

    // Google avisa por acá cuando la clave no autoriza este dominio, venció o
    // le falta facturación. Sin esto pinta su propio cartel de error adentro
    // del marco; con esto caemos al plano, que al menos es contenido útil.
    window.gm_authFailure = () => {
      if (vivo) setError(true);
    };

    cargarSdk(CLAVE)
      .then(() => {
        if (!vivo || !contenedor.current || !window.google) return;
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
      delete window.gm_authFailure;
    };
  }, []);

  useEffect(() => {
    const g = window.google?.maps;
    const m = mapa.current;
    if (!g || !m) return;

    for (const t of trazos.current) t.setMap(null);
    trazos.current = [];

    if (!resalte) {
      m.setCenter(centro);
      m.setZoom(zoom);
      return;
    }

    const limites = new g.LatLngBounds();
    limites.extend(centro);

    if (resalte === "rio") {
      // Alejar hasta que entren el predio y el río en el mismo encuadre.
      limites.extend(geo.rio);
    } else {
      for (const linea of resalte === "frentes" ? geo.frentes : geo.rotonda) {
        trazos.current.push(
          new g.Polyline({
            map: m,
            path: linea,
            strokeColor: "#fc6011",
            strokeOpacity: 0.95,
            strokeWeight: 7,
            zIndex: 5,
          }),
        );
        for (const punto of linea) limites.extend(punto);
      }
    }

    m.fitBounds(limites, 48);
  }, [resalte]);

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
          role="region"
          aria-label={`Mapa de ${proyecto.nombre} y su zona`}
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
    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-verde/70">
      <span>Plano de mensura · 269 lotes de 211 a 240 m²</span>
      <button
        type="button"
        onClick={onAmpliar}
        // A este cuerpo el naranja oscuro sobre crema da 3,14:1: el texto va
        // en verde y el naranja queda en el subrayado.
        className="font-bold text-verde underline decoration-naranja-600 decoration-2 underline-offset-2 hover:decoration-verde"
      >
        Ampliar plano
      </button>
    </p>
  );
}

/** Fuera del mapa: tapar la atribución de Google va contra sus condiciones. */
function Aclaracion() {
  return (
    <p className="mt-3 text-xs text-verde/70">
      {!preciso && "El plano definitivo del loteo se publica al lanzamiento. "}
      {/* El trazado de las calles sale de OpenStreetMap, que es ODbL y pide
          atribución en las obras derivadas. */}
      Trazado de calles © colaboradores de OpenStreetMap.
    </p>
  );
}
