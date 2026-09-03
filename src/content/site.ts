/**
 * Contenido de la landing en un solo lugar.
 * Los copies salen de "Contenidos RRSS_LaRibera.pptx" (Pámpano).
 * Todo lo marcado con TODO: espera dato firme del cliente.
 */

export const proyecto = {
  nombre: "La Ribera",
  bajada: "Loteo costero en Villa Gobernador Gálvez",
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
  { href: "#servicios", label: "Servicios" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#vida", label: "La vida acá" },
  { href: "#contacto", label: "Contacto" },
];

export const hero = {
  kicker: "Barrio residencial abierto · Villa Gobernador Gálvez",
  titulo: ["Acá empieza", "tu futuro"],
  bajada:
    "269 lotes de 211 a 240 m² sobre la vera del río Paraná, con todos los servicios y la infraestructura que importa desde el primer día.",
  ctaPrimario: "Quiero mi lote",
  ctaSecundario: "Conocé el barrio",
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
  eyebrow: "01 / El proyecto",
  titulo: ["Descubrí el lugar donde", "proyectar tus sueños"],
  parrafos: [
    "En La Ribera pensamos en un lugar que acompañe cada etapa de tu vida: un espacio para crecer, compartir y construir esos recuerdos que mañana vas a querer volver a vivir.",
    "269 lotes de entre 211 y 240 m², pensados para construir, crecer y hacer realidad tu próximo hogar.",
  ],
};

export const servicios = {
  eyebrow: "02 / Servicios",
  titulo: ["Todo lo que necesitás,", "en un solo lugar"],
  bajada:
    "La Ribera contará con la infraestructura completa de red, para que puedas pensar en tu futuro sin resolverlo por tu cuenta.",
  items: [
    { nombre: "Gas natural", detalle: "Red domiciliaria en todo el loteo" },
    { nombre: "Electricidad", detalle: "Tendido y alumbrado público" },
    { nombre: "Red de agua", detalle: "Agua potable de red" },
    { nombre: "Cloacas", detalle: "Conexión a red cloacal" },
  ],
};

export const ubicacion = {
  eyebrow: "03 / Ubicación",
  titulo: ["Loteo costero de Villa", "Gobernador Gálvez"],
  bajada:
    "Ubicado sobre la vera del río Paraná, a minutos del centro de VGG y con acceso directo a Rosario.",
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
  eyebrow: "04 / La vida acá",
  titulo: ["Un lugar para crecer hoy.", "Un hogar para recordar mañana."],
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
        "Áreas públicas parquizadas y un plan de forestación con especies nativas, para que el barrio crezca a la sombra.",
    },
    {
      img: "/img/reservorio-gym.webp",
      alt: "Reservorio de agua con estación de musculación al aire libre",
      dato: "4.240 m²",
      titulo: "Reservorio y gimnasio al aire libre",
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
  eyebrow: "05 / Financiación",
  titulo: ["El sueño de la casa propia", "ya no es una idea lejana."],
  bajada:
    "Consultá por los planes de financiación disponibles para la etapa de lanzamiento.",
  // TODO: cargar valores, anticipo, cantidad de cuotas y vigencia cuando el cliente los confirme.
  cta: "Conocé la financiación",
};

export const contacto = {
  eyebrow: "06 / Contacto",
  titulo: ["Dejanos tus datos", "y te contactamos"],
  bajada:
    "Te escribimos con disponibilidad, valores y el detalle de la financiación de la etapa de lanzamiento.",
};

export const legales =
  "Las imágenes son ilustrativas y no constituyen oferta contractual. Superficies, servicios y plazos sujetos a aprobación de los organismos competentes.";
