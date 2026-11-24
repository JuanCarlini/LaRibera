# Sección de obra desde Instagram

La sección **Obra en marcha** muestra las últimas publicaciones de la cuenta y
lleva tráfico al perfil. Va entre Ubicación y La vida acá: cierra el "dónde
queda" con cómo está el loteo hoy, justo antes de los renders.

## Por qué no usamos el embed oficial

El embed de Instagram (`oEmbed` + `embed.js`) reproduce los videos dentro de la
página, y desde el 15/05/2026 ni siquiera pide token. Quedó descartado igual:

- Carga más de 100 KB de JavaScript de Meta y ocupa el hilo principal. Medimos
  Web Vitals, así que se nota.
- Deja cookies de Meta (`_fbp`, `datr`) al renderizar, antes de que el visitante
  toque nada. `/privacidad` promete que el sitio **no usa cookies**: habría que
  reescribir esa promesa y sumar un consentimiento previo.
- Las tarjetas vienen con el blanco y la tipografía de Instagram, que sobre el
  verde y el crema de La Ribera se leen como un parche.
- Prohíbe cachear: la doc permite usar el contenido sólo como "front-end view".

En cambio traemos el feed por API desde el servidor y lo dibujamos con el HTML
y la paleta del sitio: cero scripts de terceros, cero cookies.

**El costo de esta decisión:** desde el 30/07/2026 Meta omite `media_url` en
todo el media de video —reels, posts de video e historias— *incluso en el de la
cuenta propia*. Los videos van como portada con un play encima y se reproducen
en Instagram. Para el objetivo de llevar gente a la cuenta, juega a favor.

## Requisitos

1. **Cuenta profesional** (Business o Creator) y **pública**. Con una cuenta
   personal la API no devuelve nada, y una privada no se puede agregar a la
   app. Se convierte gratis desde la app de Instagram, en Configuración.
2. Una app de tipo **Business** en
   [developers.facebook.com](https://developers.facebook.com). Ya existe una app
   de Meta para WhatsApp Business: conviene una aparte, para no mezclar
   permisos.
3. Un **portfolio comercial** de Meta al que conectar la app. No hace falta que
   esté verificado: la verificación sólo se exige para publicar la app, y esta
   no se publica.

Lo que **no** hace falta: ni página de Facebook, ni App Review. Mientras la app
sirva sólo a la cuenta propia alcanza con **Standard Access**. Tampoco hay que
registrar URLs de redireccionamiento: eso es para apps que leen cuentas de
terceros.

## Instagram Login ya no existe para apps nuevas

La documentación de Meta describe un flujo con *API setup with Instagram login*
sobre `graph.instagram.com`, tokens de 60 días y un endpoint `/me/media`. **Ese
camino no está disponible en las apps creadas desde 2026.** El panel lo dice
sin vueltas:

> La configuración de la API con inicio de sesión con Instagram no está
> disponible en las apps más recientes. Tu app usa la configuración de la API
> con inicio de sesión unificado.

Lo que vale es **Unified Login**: host `graph.facebook.com`, el id de la cuenta
en la ruta y un **token de usuario del sistema (SUAT) que no caduca nunca**. Lo
bueno es que desaparece el mantenimiento: no hay token que renovar ni
recordatorio que poner.

## Crear la app

El asistente de [developers.facebook.com/apps](https://developers.facebook.com/apps)
pregunta, en este orden:

1. **Detalles de la app** — nombre y mail de contacto.
2. **Casos de uso** — *Administrar mensajes y contenido en Instagram*, bajo el
   filtro **Todo**. Hay también un caso *Otro*, que es el que pide la
   documentación vieja, pero el panel avisa que está por desaparecer.
3. **Negocio** — el portfolio comercial.
4. **Requisitos** — para este caso de uso no hay ninguno.

El botón final, **Crear app**, acepta las Condiciones de la plataforma de Meta.

## Configurar la API

En **Casos de uso → Personalizar**, paso *1. Configurar tu app*, clickear
**Crear nueva configuración** y confirmar la plantilla. Conviene mirar que diga
*El token no caducará nunca*.

La plantilla trae permisos de más —`ads_management`, `ads_read`,
`instagram_manage_messages`, `instagram_manage_comments`,
`instagram_content_publish`— junto al único que usamos, `instagram_basic`. Con
Standard Access eso es inofensivo: sólo se piden a quien tenga un rol en la app.

La *URL de redireccionamiento* se deja vacía. Los pasos *3. Configurar
webhooks* y *4. Completar la revisión de la app* no corresponden a este caso.

## Obtener el token

Paso *2. Generar tokens de acceso*:

1. **Agregar cuenta**, y asignarle el rol **Evaluador de Instagram** (el de
   "Roles adicionales para esta app", no el *Evaluador* genérico).
2. Aceptar la invitación **desde Instagram**, con la cuenta del loteo:
   Configuración → *Apps y sitios web*. Hasta que no se acepta, la cuenta no
   aparece en el panel.
3. Generar el token y copiar también el **id de la cuenta de Instagram**.

Antes de tocar Vercel, comprobarlo:

```bash
node tools/instagram.mjs <token> <id-de-cuenta>
```

Dice de qué cuenta es y qué publicaciones va a mostrar la grilla. Si algo
falla, explica el motivo que devuelve Meta.

Después:

4. Cargar `INSTAGRAM_TOKEN` e `INSTAGRAM_ACCOUNT_ID` en Vercel (Settings →
   Environment Variables), en Production y Preview. Son secretos: no van al repo.
5. Redeployar. La sección aparece sola; sin las variables, no se dibuja.

Para trabajar en local, los mismos valores en `.env.local`.

**Si el token deja de servir** —lo revocan, sacan la cuenta del portfolio— no se
rompe nada: `ultimasPublicaciones()` devuelve una lista vacía, la sección
desaparece y el resto de la página queda igual. El motivo queda en los logs del
servidor en Vercel.

## Qué mira el código

`src/lib/instagram.ts` pide `GET /<id-de-cuenta>/media` a `graph.facebook.com`,
con la versión de la API fija —sin ella Meta sirve la más vieja que siga viva—
y revalida **cada seis horas**, no una vez por visita.

Seis y no una por una razón de costo: cada relectura devuelve URLs nuevas del
CDN de Meta, porque vienen firmadas, y para `next/image` cada URL es una imagen
distinta que hay que volver a optimizar. A una hora serían unas 5.800
optimizaciones al mes, por encima de las 5.000 que incluye el plan Hobby de
Vercel; a seis horas son menos de 1.000. Una obra tampoco publica más seguido
que eso.

Las imágenes pasan por `next/image` y no directo: las URLs del CDN caducan, así
que servirlas crudas dejaría imágenes rotas. Los hosts permitidos están en
`next.config.ts`.

## Qué cuesta

Nada. La API de Meta no se cobra, y el camino de la grilla propia se eligió en
parte para no pagar un servicio de terceros: Behold, que es el que mejor
encajaba, sale unos 10–12 USD por mes.

Lo único que consume cuota es la optimización de imágenes de Vercel, y por eso
la revalidación es cada seis horas en lugar de cada hora. Si el sitio está en
plan Hobby conviene no bajar ese número sin rehacer la cuenta de arriba.

## Verificado contra la API real

Con el token cargado, `node tools/instagram.mjs` devuelve la cuenta
`@laribera.vgg` y sus ocho últimas publicaciones —cuatro videos, dos carruseles
y dos fotos—, las ocho con portada. Los videos llegan sin `media_url`, como
estaba previsto, y resuelven por `thumbnail_url`.

La página servida trae la sección con las ocho piezas, cada una enlazada a su
post, y las imágenes salen por `/_next/image` desde `scontent.cdninstagram.com`:
una petición de prueba devolvió 200 y un JPEG de 159 KB, así que los
`remotePatterns` de `next.config.ts` están bien y Next puede bajarlas y
re-encodarlas. En un navegador real salen en WebP o AVIF, bastante más livianas.

## Si la sección no aparece

En orden, lo que conviene mirar:

1. Que `INSTAGRAM_TOKEN` e `INSTAGRAM_ACCOUNT_ID` estén cargadas en el entorno
   correcto de Vercel y que el deploy sea posterior.
2. `node tools/instagram.mjs`, que dice si el token sigue sirviendo.
3. Los logs del servidor en Vercel: ante un error, `ultimasPublicaciones()` deja
   ahí el motivo que devolvió Meta.
