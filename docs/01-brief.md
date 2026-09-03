# La Ribera — Brief del proyecto

Fuentes: `Contenidos RRSS_LaRibera.pptx` (agencia Pámpano, lanzamiento de RRSS) y
`Presentación_Loteo La Ribera.pptx` (agosto 2026), que es la más reciente y manda cuando
los datos no coinciden.

## Qué es

Loteo costero **La Ribera**, en **Villa Gobernador Gálvez (VGG)**, provincia de Santa Fe,
ubicado sobre la vera del **río Paraná**. Está en etapa de **lanzamiento**: las piezas de
RRSS son de expectativa ("muy pronto, más información").

## Datos duros confirmados por la presentación

| Dato | Valor |
|---|---|
| Cantidad de lotes | 269 |
| Superficie por lote | **211 a 240 m²** |
| Superficie total s/mensura | 105.593 m² |
| Lotes | 60.253 m² |
| Calles | 31.355 m² |
| Espacios verdes | 6.027 m² |
| Reservorio | 4.240 m² |
| Infraestructura comunitaria | 3.003 m² |
| Espacio cedido | 715 m² |
| Servicios | Gas natural, electricidad, red de agua, cloacas |
| Ubicación | Villa Gobernador Gálvez, sobre el río Paraná |
| Coordenadas | -33.0261908, -60.6073826 |
| Contacto en las piezas | +54 9 3385 43-7168 |

La presentación de agosto corrige la superficie: las piezas de RRSS decían 200 a 220 m².
El dato bueno es **211 a 240 m²**, y el titular oficial del cartel es "de hasta 240 m²".

## Infraestructura proyectada

| Ítem | Cantidad |
|---|---|
| Red de gas | 3.800 m |
| Red cloacal | 4.120 m |
| Red de agua | 3.750 m |
| Cordón cuneta | 4.640 m |
| Colector pluvial | 640 m |
| Columnas de iluminación | 107 |
| Columnas de baja tensión | 112 |

El plan de obras tiene cinco capítulos: infraestructura vial, saneamiento hidráulico y
pluvial, redes de servicios, electrificación e iluminación, y espacios públicos. Este último
suma **plaza de juegos infantiles y estación de musculación al aire libre**, más forestación
con especies nativas.

## Factibilidades — estado a agosto 2026

| Servicio | Estado |
|---|---|
| Energía eléctrica | Otorgada por la Cooperativa Integral de VGG (17/12/2025) |
| Gas natural | Otorgada por Litoral Gas, anteproyecto P/RO/25/173, **vence 16/06/2026** |
| Agua y cloacas | **Solicitada** a Aguas Santafesinas el 16/12/2025, sin respuesta |
| Hídrica | En trámite, informe de área de riesgo hídrico presentado |
| Municipalidad | Expediente N° 61528/25, iniciado 18/12/2025 |
| Medio ambiente | En trámite, categorización y estudio de impacto |

Esto es material sensible para los legales del sitio: **no se puede afirmar que el barrio
"tiene" los servicios**, sólo que están proyectados y con factibilidad donde corresponda.
El copy actual usa "contará con", que es la forma correcta.

## Público y promesa

El material apunta a **familias que compran su primer terreno para construir**, no a
inversores. Los ejes que repite la campaña:

1. **Proyectar** — "el lugar donde proyectar tus sueños", "acá empieza tu futuro".
2. **Crecer en familia** — "un lugar para crecer hoy, un hogar para recordar mañana".
3. **Infraestructura resuelta** — "todo lo que necesitás, en un solo lugar".
4. **Accesibilidad** — "el sueño de la casa propia ya no es una idea lejana".

El tono es cercano, en voseo rioplatense, en segunda persona.

## Identidad visual

Colores muestreados directamente de los PNG de las piezas:

| Rol | Hex |
|---|---|
| Crema (fondo base) | `#E6E6DB` |
| Verde oscuro (fondos y texto) | `#063424` |
| Lima (titulares sobre oscuro) | `#99C561` |
| Naranja (acento y CTA) | `#FC6011` |

**Posicionamiento oficial:** "Barrio Residencial Abierto". El cartel de vía pública remata
con "269 Lotes · De hasta 240 m² · Con todos los servicios · Financiación disponible".

**Marca:** wordmark "LA RIBERA" en mayúsculas con tracking amplio; la última A es una
**Λ sin travesaño** con una **onda naranja** apoyada abajo. Esa onda es el recurso gráfico
que se repite en todas las piezas cortando fotos contra bloques de color — la tomamos como
el motivo estructural de la web.

**Tipografía:** grotesca geométrica pesada, tipo Gilroy/Sofia Pro. En la maqueta usamos
**Figtree** (Google Fonts) como aproximación.

## Copies aprovechables de las piezas

- "Descubrí el lugar donde proyectar tus sueños."
- "Acá empieza tu futuro."
- "269 lotes para empezar a proyectar lo que viene."
- "Todo lo que necesitás, en un solo lugar."
- "Un lugar creado para cumplir el sueño de tu familia."
- "Un lugar para crecer hoy. Un hogar para recordar mañana."
- "El sueño de la casa propia ya no es una idea lejana."
- "Loteo costero de Villa Gobernador Gálvez (VGG), ubicado sobre la vera del río Paraná."

## Lo que la presentación NO dice

Ninguno de estos datos aparece en el material y todos hacen falta para una landing que
convierta:

- Precio por lote, anticipo, cantidad de cuotas, ajuste y vigencia.
- Fecha de posesión, estado de la obra de infraestructura y etapas.
- Domicilio exacto, accesos, distancias reales a VGG y a Rosario.
- Nombre del desarrollador y de la inmobiliaria que comercializa.
- Masterplan / plano de loteo con numeración y disponibilidad.
- Amenities o espacios comunes (las piezas muestran plazas y juegos, pero no se afirman).
- Datos societarios y legales para el pie de página.

## Advertencias sobre el material

- **Las fotos de las piezas son renders/imágenes generadas, no fotos del predio.** Muestran
  un barrio consolidado que todavía no existe. Sirven para la maqueta, pero para publicar
  necesitamos material propio o un disclaimer claro de "imágenes ilustrativas".
- **Todas las imágenes vienen con tipografía quemada encima.** Para la maqueta recortamos
  las zonas limpias (`tools/prep-images.mjs`); hacen falta los originales sin texto.
- **El teléfono `+54 9 3385...` no corresponde a VGG** (característica 341). Hay que
  confirmarlo antes de publicar.
- **La dupla lima + naranja sobre crema no pasa contraste AA.** Ver `docs/02-plan.md`.
