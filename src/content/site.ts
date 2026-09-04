/**
 * Contenido de la landing en un solo lugar.
 * Los copies salen de "Contenidos RRSS_LaRibera.pptx" (Pámpano).
 * Todo lo marcado con TODO: espera dato firme del cliente.
 */

export const proyecto = {
  nombre: "La Ribera",
  bajada: "Barrio Residencial Abierto",
  // TODO: confirmar el número con el cliente — el 3385 no corresponde a VGG (área 341).
  whatsapp: "5493385437168",
  whatsappVisible: "+54 9 3385 43-7168",
  email: "ventas@lariberavgg.com.ar", // TODO: casilla real
  ubicacion: "Villa Gobernador Gálvez, Santa Fe",
};

export const mensajeWhatsapp =
  "Hola, quiero información sobre los lotes de La Ribera.";

export const nav = [
  { href: "#proyecto", label: "El proyecto" },
  { href: "#financiacion", label: "Financiación" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#vida", label: "La vida acá" },
  { href: "#contacto", label: "Contacto" },
];

export const hero = {
  kicker: "Barrio residencial abierto · Villa Gobernador Gálvez",
  titulo: ["Tu futuro", "empieza acá"],
  bajada:
    "269 lotes desde 211 m² a 240 m² a la vera del río Paraná, con todos los servicios y la infraestructura necesaria para tu próximo hogar.",
  ctaPrimario: "Quiero mi lote",
  ctaSecundario: "Calculá tu cuota",
};

export const ticker = [
  "269 lotes",
  "211 a 240 m²",
  "Gas natural",
  "Electricidad",
  "Red de agua",
  "Cloacas",
  "Villa Gobernador Gálvez",
  "Sobre el río Paraná",
];

export const cifras: {
  valor: number;
  hasta?: number;
  sufijo?: string;
  label: string;
  detalle: string;
}[] = [
  { valor: 269, label: "Lotes", detalle: "en el nuevo loteo" },
  { valor: 211, hasta: 240, sufijo: " m²", label: "Superficie", detalle: "por lote" },
  { valor: 4, label: "Servicios", detalle: "de red incluidos" },
];

export const proyectoSeccion = {
  eyebrow: "El proyecto",
  titulo: ["Descubrí el lugar donde", "proyectar tus sueños"],
  parrafos: [
    "En La Ribera pensamos en un lugar que acompañe cada etapa de tu vida: un espacio para crecer, compartir y construir esos recuerdos que mañana vas a querer volver a vivir.",
    "269 lotes de entre 211 m² y 240 m², pensados para construir, crecer y hacer realidad tu próximo hogar.",
  ],
};

export const servicios = {
  eyebrow: "Servicios",
  titulo: ["Todo lo que necesitás,", "en un solo lugar"],
  bajada:
    "La Ribera cuenta con la infraestructura completa de red, para que puedas pensar en tu futuro sin resolverlo por tu cuenta.",
  items: [
    { nombre: "Gas natural", detalle: "Red domiciliaria en todo el loteo" },
    { nombre: "Electricidad", detalle: "Tendido y alumbrado público" },
    { nombre: "Red de agua", detalle: "Agua potable de red" },
    { nombre: "Cloacas", detalle: "Conexión a red cloacal" },
  ],
};

export const ubicacion = {
  eyebrow: "Ubicación",
  titulo: ["Loteo costero de", "Villa Gobernador Gálvez"],
  bajada:
    "Ubicado a la vera del río Paraná, a minutos del centro de VGG y con acceso directo a Rosario.",
  // Calles y accesos tomados del plano de mensura y del plan de obras.
  // TODO: sumar distancias y tiempos verificados cuando el cliente los confirme.
  datos: [
    { titulo: "Av. Alem y José Ingenieros", detalle: "Frentes del loteo" },
    { titulo: "Rotonda de calle Ecuador", detalle: "Acceso principal" },
    { titulo: "Río Paraná", detalle: "El barrio se apoya sobre la ribera" },
  ],
  mapa: {
    // Coordenadas del predio confirmadas por el cliente (03/09/2026).
    centro: { lat: -33.0261908, lng: -60.6073826 },
    zoom: 16,
    preciso: true,
  },
};

/** Quién está detrás del proyecto. */
export const actores = {
  eyebrow: "Quiénes lo hacen",
  // ancho/alto son los del archivo, para que next/image sirva la resolución
  // correcta. `escala` es la fracción de la caja que ocupa cada logo: el de
  // Mutual es una tira larga y el de Qala compacto, así que emparejarlos por
  // altura pura dejaría a Qala visualmente chico.
  items: [
    {
      rol: "Desarrolla",
      nombre: "Asociación Mutual 18 de Julio",
      logo: "/img/logo-mutual.webp",
      ancho: 700,
      alto: 179,
      escala: 0.9,
    },
    {
      rol: "Comercializa",
      nombre: "Qala Desarrollos",
      logo: "/img/logo-qala.webp",
      ancho: 292,
      alto: 151,
      escala: 1,
    },
  ],
};

export const vida = {
  eyebrow: "La vida acá",
  titulo: ["Un lugar para crecer hoy,", "un hogar para recordar mañana."],
  bajada:
    "El barrio no es sólo el lote. Es todo lo que pasa alrededor, todos los días.",
  /** Cards del carrusel. Los datos duros salen del plan de obras (agosto 2026). */
  cards: [
    {
      img: "/img/parque-juegos.webp",
      alt: "Parque del barrio con juegos infantiles, bancos y forestación",
      dato: "6.027 m²",
      titulo: "Espacios verdes propios",
      texto:
        "Áreas parquizadas, juegos para niños y un plan de forestación con especies nativas, para que el barrio crezca a la sombra.",
    },
    {
      img: "/img/reservorio-gym.webp",
      alt: "Reservorio de agua con estación de musculación al aire libre",
      dato: "4.240 m²",
      titulo: "Área recreativa",
      texto:
        "El reservorio regula los caudales de lluvia y ordena el agua del barrio. Alrededor, una estación de musculación abierta a todos.",
    },
    {
      img: "/img/familia-calle.webp",
      alt: "Familia caminando por una calle arbolada del barrio al atardecer",
      dato: "4.640 m",
      titulo: "Calles para caminar",
      texto:
        "Cordón cuneta de hormigón en todas las arterias del loteo, con 107 columnas de iluminación LED para moverse tranquilo a cualquier hora.",
    },
    {
      img: "/img/masterplan-aereo.webp",
      alt: "Vista aérea cenital del barrio con sus manzanas y espacios verdes",
      dato: "105.593 m²",
      titulo: "Un barrio completo",
      texto:
        "Entre lotes, calles, espacios verdes, reservorio e infraestructura comunitaria. Un barrio abierto, integrado a la trama de VGG.",
    },
  ],
};

export const financiacion = {
  eyebrow: "Financiación",
  titulo: ["El sueño de la casa propia", "ya no es una idea lejana."],
  bajada:
    "Completá cuánto podés entregar y mirá cómo queda tu cuota.",
  cta: "Quiero asesoramiento",

  /**
   * Precios de "La Ribera COMERCIAL Lotes Manzana C.xlsx".
   * Son 39 lotes (70 al 108) en tres valores según orientación y esquina.
   * TODO: al abrir otras manzanas, sumar sus tramos acá.
   */
  lotes: [
    { precio: 14900, m2: 211.64, disponibles: 32, detalle: "Frentes norte y sur" },
    { precio: 15400, m2: 220.44, disponibles: 4, detalle: "Frentes este y oeste" },
    { precio: 16400, m2: 220.44, disponibles: 3, detalle: "Lotes en esquina" },
  ],

  anticipoMinimo: 6900,
  plazos: [6, 12, 18, 24],
  notaPlazo:
    "El plazo máximo de financiación es de 24 meses, el mismo tiempo que dura la obra del loteo.",

  /**
   * Cotización usada para pesificar. Se pide en vivo a dolarapi.com y, si falla,
   * se cae al valor de referencia de abajo.
   * TODO: confirmar con Comercial qué cotización rige en el contrato.
   */
  cotizacion: {
    casa: "blue" as const,
    nombre: "Dólar blue",
    respaldo: 1545,
    respaldoFecha: "3 de septiembre de 2026",
  },

  // El índice CAC vive en `cac.json` y lo refresca `tools/actualizar-cac.mjs`,
  // que corre por GitHub Actions todos los meses contra la nota de CAMARCO.

  legales:
    "Simulación orientativa: no constituye oferta comercial ni obligación de financiación. Los montos definitivos, el anticipo y las condiciones de cada operación quedan sujetos a evaluación comercial. Las cuotas se abonan en pesos y se actualizan según la variación del índice de la Cámara Argentina de la Construcción (CAC). La cotización del dólar es de referencia y varía a diario.",
};

export const contacto = {
  eyebrow: "Contacto",
  titulo: ["Dejanos tus datos", "y te contactamos"],
  bajada:
    "Consultanos por la disponibilidad, los valores y el detalle de la financiación.",
};

export const legales =
  "Las imágenes son ilustrativas y no constituyen oferta contractual. Superficies, servicios y plazos sujetos a aprobación de los organismos competentes.";
