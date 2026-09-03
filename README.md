# La Ribera

Landing del loteo costero **La Ribera** — Villa Gobernador Gálvez, Santa Fe.

## Ramas

Se trabaja sobre `dev`. `main` es producción y recibe merges desde `dev`.
Vercel despliega las dos automáticamente en cada push.

## Desarrollo

```bash
npm install
npm run dev
```

Para el mapa de la sección de ubicación, copiar `.env.example` a `.env.local` y cargar la
clave de la Maps JavaScript API. Sin clave la sección cae a la satelital estática.

## Documentación

- [`docs/01-brief.md`](docs/01-brief.md) — qué es el proyecto, identidad y datos confirmados.
- [`docs/02-plan.md`](docs/02-plan.md) — stack, estructura, pendientes y próximas iteraciones.

## Imágenes

Las de `public/img` se generan recortando las zonas sin tipografía de las piezas de RRSS:

```bash
SRC_DIR=<carpeta ppt/media del pptx descomprimido> node tools/prep-images.mjs
```
