# La Ribera

Landing del loteo costero **La Ribera** — Villa Gobernador Gálvez, Santa Fe.

## Desarrollo

```bash
npm install
npm run dev
```

## Documentación

- [`docs/01-brief.md`](docs/01-brief.md) — qué es el proyecto, identidad y datos confirmados.
- [`docs/02-plan.md`](docs/02-plan.md) — stack, estructura, pendientes y próximas iteraciones.

## Imágenes

Las de `public/img` se generan recortando las zonas sin tipografía de las piezas de RRSS:

```bash
SRC_DIR=<carpeta ppt/media del pptx descomprimido> node tools/prep-images.mjs
```
