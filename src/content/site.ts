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
  kicker: "Nuevo loteo · Villa Gobernador Gálvez",
  titulo: ["Acá empieza", "tu futuro"],
  bajada:
    "269 lotes sobre la vera del río Paraná, con todos los servicios y la infraestructura que importa desde el primer día.",
  ctaPrimario: "Quiero mi lote",
  ctaSecundario: "Conocé el barrio",
};

export const ticker = [
  "269 lotes",
  "200 a 220 m²",
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
  { valor: 200, hasta: 220, sufijo: " m²", label: "Superficie", detalle: "por lote" },
  { valor: 4, label: "Servicios", detalle: "de red incluidos" },
];

export const proyectoSeccion = {
  eyebrow: "01 / El proyecto",
  titulo: ["Descubrí el lugar donde", "proyectar tus sueños"],
  parrafos: [
    "En La Ribera pensamos en un lugar que acompañe cada etapa de tu vida: un espacio para crecer, compartir y construir esos recuerdos que mañana vas a querer volver a vivir.",
    "269 lotes de entre 200 y 220 m², pensados para construir, crecer y hacer realidad tu próximo hogar.",
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
  // TODO: reemplazar por distancias y accesos reales verificados con el cliente.
  datos: [
    { titulo: "Villa Gobernador Gálvez", detalle: "Centro a pocos minutos" },
    { titulo: "Rosario", detalle: "Acceso directo por la costa" },
    { titulo: "Río Paraná", detalle: "El loteo se apoya sobre la ribera" },
  ],
  mapa: {
    // TODO: cargar el centro del plano de mensura y poner `preciso: true`.
    // Mientras sea false no se dibuja ninguna marca sobre el mapa: el mapa
    // ubica la zona y el predio se ve en la vista satelital de las piezas.
    centro: { lat: -33.0246, lng: -60.6289 },
    zoom: 13,
    preciso: false,
  },
};

export const vida = {
  eyebrow: "04 / La vida acá",
  titulo: ["Un lugar para crecer hoy.", "Un hogar para recordar mañana."],
  bloques: [
    {
      img: "/img/parque-familia.webp",
      alt: "Familia caminando por el parque del barrio al atardecer",
      titulo: "Un lugar creado para cumplir el sueño de tu familia",
      texto:
        "La Ribera nace para que puedas proyectar tu hogar, compartir nuevos momentos y construir una historia que se disfrute todos los días.",
    },
    {
      img: "/img/chicos-jugando.webp",
      alt: "Chicos jugando a la pelota en la calle del barrio",
      titulo: "Espacio para crecer y compartir",
      texto:
        "Calles arboladas, veredas y espacios verdes pensados para que la vida del barrio pase también puertas afuera.",
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
