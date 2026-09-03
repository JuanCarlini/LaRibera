# La Ribera — Brief del proyecto

Todo lo de este documento sale de `Contenidos RRSS_LaRibera.pptx` (agencia Pámpano,
lanzamiento de RRSS). Es la única fuente de verdad que tenemos hasta ahora.

## Qué es

Loteo costero **La Ribera**, en **Villa Gobernador Gálvez (VGG)**, provincia de Santa Fe,
ubicado sobre la vera del **río Paraná**. Está en etapa de **lanzamiento**: las piezas de
RRSS son de expectativa ("muy pronto, más información").

## Datos duros confirmados por la presentación

| Dato | Valor |
|---|---|
| Cantidad de lotes | 269 |
| Superficie por lote | 200 a 220 m² |
| Servicios | Gas natural, electricidad, red de agua, cloacas |
| Ubicación | Villa Gobernador Gálvez, sobre el río Paraná |
| Contacto en las piezas | +54 9 3385 43-7168 |

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
