# La Ribera — Plan de la landing

## Dónde estamos

**Iteración 1 terminada:** maqueta navegable de la landing completa, con la identidad de las
piezas de RRSS y los datos que hoy tenemos. Corre con `npm run dev`.

## Stack

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | Next.js 16 (App Router) | Estático por defecto, SEO, deploy directo a Vercel |
| Estilos | Tailwind v4 con tokens de marca en `globals.css` | Paleta y escalas tipográficas en un solo lugar |
| Tipografía | Figtree vía `next/font` | Sin request externo, sin CLS |
| Imágenes | `next/image` + WebP | Ya optimizadas en `public/img` |
| Animación | IntersectionObserver + CSS | Sin GSAP: menos peso y respeta `prefers-reduced-motion` |
| Hosting | Vercel | Preview por rama para revisar con el cliente |

Sin dependencias de runtime más allá de Next y React.

## Estructura de la página

Un scroll único con secciones numeradas, al estilo de la referencia de CondoPyme, pero con
la calidez de las piezas de La Ribera.

| # | Sección | Estado |
|---|---|---|
| — | Hero: aérea + "Acá empieza tu futuro" + 2 CTA | ✅ maqueta |
| — | Cinta de datos duros (marquee) | ✅ maqueta |
| 01 | El proyecto: relato + contadores (269 / 200–220 m² / 4 servicios) | ✅ maqueta |
| 02 | Servicios: aérea cortada por la onda + 4 servicios de red | ✅ maqueta |
| 03 | Ubicación: satelital con el predio marcado + accesos | ⚠️ faltan distancias reales |
| 04 | La vida acá: galería con los copies de campaña | ✅ maqueta |
| 05 | Financiación: statement + CTA | ⚠️ faltan valores y condiciones |
| 06 | Contacto: formulario + WhatsApp | ⚠️ falta destino de los leads |

Todo el texto vive en `src/content/site.ts`. Cambiar un copy no requiere tocar componentes.

## Decisiones de diseño que se apartan de las piezas

**Contraste.** La dupla lima `#99C561` + naranja `#FC6011` sobre crema `#E6E6DB` da 1.8:1 y
2.8:1 — no llega ni al 3:1 que WCAG AA pide para texto grande. En impresión y en un feed de
Instagram no molesta; en una landing sí. La regla que aplicamos:

- **Fondo oscuro (verde) → lima + naranja**, tal cual las piezas. Pasa cómodo (6.4:1).
- **Fondo claro (crema, lima) → verde + naranja oscuro `#E14F06`.** Pasa 3:1 en titulares.
- Nada de texto chico en naranja sobre crema.

Conviene validarlo con Pámpano: es un ajuste de medio, no un cambio de marca.

**Logo.** Está reconstruido en SVG (`src/components/Logo.tsx`) a partir de las piezas.
Necesitamos el archivo vectorial original del manual de marca.

**Tipografía.** Figtree aproxima la grotesca de las piezas. Si el manual define otra
tipografía, se cambia en un solo lugar (`src/app/layout.tsx`).

## Qué necesitamos del cliente

Bloqueantes para publicar:

1. **Precios y financiación** — valor del lote, anticipo, cuotas, ajuste, vigencia.
2. **Destino de los leads** — CRM, casilla de mail o planilla. Hoy el formulario abre
   WhatsApp con los datos cargados; funciona, pero no deja registro.
3. **Teléfono y mail definitivos** — confirmar el `+54 9 3385 43-7168`.
4. **Dominio** — no hay ninguno reservado.
5. **Razón social y legales** para el pie.

Importantes, no bloqueantes:

6. Fotos y renders **sin tipografía encima**, y el masterplan del loteo.
7. Distancias y accesos verificados (a VGG, a Rosario, a la autopista).
8. Logo vectorial y manual de marca.
9. Definir si se muestra disponibilidad por lote o sólo un formulario general.

## Próximas iteraciones

**Iteración 2 — contenido real.** Cargar precios, financiación, ubicación y legales.
Reemplazar imágenes por material propio. Ajustar copys con Pámpano.

**Iteración 3 — captura de leads.** Server action que guarde el lead (Supabase o Google
Sheets) y avise por mail; validación y anti-spam; WhatsApp como atajo alternativo.
Google Analytics / Meta Pixel para medir la campaña de lanzamiento.

**Iteración 4 — a producción.** Dominio, deploy en Vercel, `sitemap.xml`, `robots.txt`,
Open Graph con imagen propia, JSON-LD de `RealEstateListing`, y una pasada de Lighthouse.

**Backlog.** Masterplan interactivo con lotes disponibles; galería de avance de obra;
sección de preguntas frecuentes; versión en inglés si apuntan a compradores de afuera.

## Cómo trabajar el repo

```bash
npm run dev      # desarrollo en localhost:3000
npm run build    # build de producción
npm run lint     # eslint
```

`tools/prep-images.mjs` regenera las imágenes desde el PPTX; necesita `SRC_DIR` apuntando a
la carpeta `ppt/media` del archivo descomprimido.
