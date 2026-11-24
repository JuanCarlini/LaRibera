# Sección de obra desde Instagram

> **Estado: no implementada.** Se intentó en noviembre de 2026 y se revirtió:
> con la sección puesta la página se clavaba, y el código quedó fuera. Esto es
> lo que se aprendió, para no volver a investigarlo de cero. Lo revertido está
> en la historia de git, entre `75d5d7f` y `e407c9b` de la rama `dev`.
>
> Lo que **sí** quedó resuelto y sirve tal cual: la app de Meta está creada y
> configurada, el token existe y funciona, y `tools/instagram.mjs` lo
> comprueba. Lo que falta entender está en "Lo que quedó sin resolver", al
> final.

La idea: una sección **Obra en marcha** con las últimas publicaciones de la
cuenta, que además lleve tráfico al perfil. El lugar pensado era entre
Ubicación y La vida acá, para cerrar el "dónde queda" con cómo está el loteo
hoy, justo antes de los renders.

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

## El token no puede ser "Sensitive" en Vercel

La portada se prerenderiza durante el build, así que el token tiene que estar
disponible **en el build**, no sólo en runtime. Las variables de tipo
**Sensitive** de Vercel no se exponen al build: con ese tipo,
`ultimasPublicaciones()` no encuentra el token, devuelve una lista vacía y la
sección desaparece sin dejar ningún error en los logs —sale por la rama "falta
el token" antes de llamar a la API—. Cuesta de diagnosticar justamente porque
no falla: degrada en silencio.

`INSTAGRAM_TOKEN` va como **Encrypted**, igual que
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Vercel no deja cambiarle el tipo a una
variable que ya es Sensitive: hay que volver a crearla.

Y al cargarla o cambiarla, **no alcanza con un redeploy**: hereda la
configuración del deployment original. Hay que disparar un deploy nuevo desde
git para que el build tome los valores actuales.

## Si la sección no aparece

En orden, lo que conviene mirar:

1. Que `INSTAGRAM_TOKEN` esté como **Encrypted** y no como Sensitive, y que
   junto con `INSTAGRAM_ACCOUNT_ID` esté en el entorno correcto.
2. Que el deploy sea un build nuevo posterior al cambio, no un redeploy.
3. `node tools/instagram.mjs`, que dice si el token sigue sirviendo.
4. Los logs del build en Vercel: si la API falló, `ultimasPublicaciones()` deja
   ahí el motivo que devolvió Meta. Si no hay ningún error, el problema es que
   el token no llegó.

## Lo que quedó sin resolver

Esto es lo que hay que entender **antes** de volver a intentarlo.

**La página se clava con la sección puesta.** Chrome llega a mostrar "La
página no responde". Pasa en el deploy y también en local, con el build de
producción. Producción sin la sección no se clava. No se identificó la causa.
Lo que se descartó con pruebas, para no repetirlo:

- No son las imágenes: se clavaba igual con los `src` anulados a mano.
- No es la cantidad: igual con dos piezas que con ocho.
- No es la grilla: igual dejando sólo el encabezado.
- No es JavaScript de la página: un `PerformanceObserver` de `longtask` no
  registró una sola tarea larga.
- No es el grabador de Umami: producción lo carga y dev no, al revés de lo que
  haría falta para culparlo.
- No es el reorden de secciones ni la onda del hero: producción los tiene.

**Cuidado con cómo se mide.** Un `window.scrollTo` de varios miles de píxeles
cuelga la pestaña por sí solo, con sección o sin ella, y eso mandó la
investigación por el camino equivocado un buen rato. Hay que probar con la
rueda, a mano. Las métricas de DevTools en vivo (INP, CLS) y la consola del
navegador dijeron la verdad mucho antes que cualquier herramienta automática.

**El reveal tiene una carrera latente, y sigue ahí.** `RevealProvider` cancela
su temporizador de respaldo y después busca los `[data-reveal]`. Si el árbol
no está completo —y no lo está en cuanto una sección espera datos del
servidor— observa de menos o nada, y lo que llega tarde queda en `opacity: 0`
para siempre: página en blanco, sin ningún error. Se intentó arreglarlo de dos
formas y después reemplazarlo por `animation-timeline: view()`; todo eso se
revirtió junto con la sección, así que **el bug sigue presente**. No lo
dispara nada de lo que hay hoy en la página, pero lo va a disparar cualquier
componente async que se agregue.

**Las imágenes del CDN nunca llegaron a verse.** En la última prueba las
piezas se dibujaban vacías. Puede ser consecuencia del cuelgue y no una causa
aparte, pero no se comprobó.

Una pista para la próxima: `<Instagram />` era un Server Component async sin
`<Suspense>` alrededor. Eso parte el renderizado en dos tiempos y es
exactamente lo que destapa la carrera del reveal. Vale la pena empezar por
ahí, y probar la sección aislada en una página vacía antes de meterla en la
portada.
