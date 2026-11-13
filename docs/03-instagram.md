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
   [developers.facebook.com](https://developers.facebook.com), con el producto
   **Instagram** agregado. Ya existe una app de Meta para WhatsApp Business:
   conviene una aparte, para no mezclar permisos.

Lo que **no** hace falta: ni página de Facebook, ni business portfolio, ni App
Review. Mientras la app sirva sólo a la cuenta propia alcanza con **Standard
Access**. Tampoco hay que implementar el login de Instagram ni configurar
redirect URIs: eso es para apps que leen cuentas de terceros.

## Crear la app

El asistente de [developers.facebook.com/apps](https://developers.facebook.com/apps)
pregunta, en este orden:

1. **Connect a business** — opcional por ahora. Sólo hace falta para publicar
   la app, y se conecta después desde *App settings → Basic*.
2. **Select your use case** — **Other**. Es el único que habilita el producto
   Instagram; los demás arman apps de mensajería.
3. **Select your app type** — **Business**. Obligatorio: con otro tipo el
   producto Instagram no se puede agregar.
4. **Add app details** — nombre y mail de contacto.

Ya en el panel, bajar hasta el producto **Instagram** y clickear **Set up**.
Eso agrega *API setup with Instagram login* solo.

A partir de ahí el asistente ofrece tres pasos que **no corresponden a este
caso** y conviene saltear: *Configure webhooks* (son para mensajería),
*Set up Instagram business login* (redirect URLs, para apps que leen cuentas
de terceros) y *Complete App Review* (no se necesita para la cuenta propia).

## Obtener el token

En el panel de la app, menú izquierdo, **Instagram → API setup with Instagram
business login** (en algunas pantallas el menú lo llama *API setup with
Instagram login*; es el mismo lugar):

1. **Generate token**, al lado de la cuenta que se quiere leer.
2. Iniciar sesión en Instagram con esa cuenta.
3. Copiar el token. El del panel ya es de larga duración —**60 días**—, no hay
   que canjearlo por otro.

Antes de tocar Vercel, comprobarlo:

```bash
node tools/instagram.mjs probar <token>
```

Dice de qué cuenta es, si es profesional y qué publicaciones va a mostrar la
grilla. Si algo falla, explica el motivo que devuelve Meta.

Después:

4. Cargarlo en Vercel como `INSTAGRAM_TOKEN` (Settings → Environment Variables),
   en Production y Preview. Es un secreto: no va al repo.
5. Redeployar. La sección aparece sola; sin la variable, no se dibuja.

Para trabajar en local, el mismo valor en `.env.local`.

## Mantener el token vivo

Es el único punto frágil de todo esto. A los 60 días el token vence, y **un
token vencido no se recupera**: hay que volver a generarlo a mano.

Renovarlo (sirve a partir de las 24 h de emitido y antes de que venza):

```bash
node tools/instagram.mjs renovar
```

Devuelve un token nuevo, válido por otros 60 días, que hay que volver a cargar
en Vercel y redeployar.

Por ahora el procedimiento es manual: **poner un recordatorio cada 50 días**.
Para un sitio de este tamaño es más barato que automatizarlo, pero si se vuelve
un problema hay dos caminos:

- Un Route Handler + Vercel Cron que refresque solo. Necesita dónde guardar el
  token nuevo (Edge Config o KV), porque un deploy no puede reescribir sus
  propias variables de entorno.
- Migrar a **Instagram API with Unified Login**, que Meta recomienda para
  integraciones nuevas. Usa `graph.facebook.com`, el scope `instagram_basic` y
  un token de sistema cuya expiración se elige al crear la configuración, con
  lo cual el vencimiento deja de ser un problema. A cambio pide un business
  portfolio y es más trabajo de configurar.

**Si el token vence** no se rompe nada: `ultimasPublicaciones()` devuelve una
lista vacía, la sección desaparece y el resto de la página queda igual. El
motivo queda en los logs del servidor en Vercel.

## Qué mira el código

`src/lib/instagram.ts` pide `GET /me/media` sin fijar número de versión —Meta
sirve la vigente— y revalida **una vez por hora**, no una vez por visita. Las
imágenes pasan por `next/image`, que las re-encoda y las cachea: las URLs del
CDN de Meta vienen firmadas y caducan, así que servirlas directo dejaría
imágenes rotas. Los hosts permitidos están en `next.config.ts`.

## Pendiente

- Confirmar el usuario de la cuenta. En `site.ts` figura `lariberavgg`, deducido
  del dominio y del mail, pero nadie lo verificó contra la cuenta real.
- Probar contra la API de verdad. El layout se verificó con datos de muestra; la
  forma de la respuesta y el paso de las imágenes del CDN por `next/image` no se
  pudieron probar sin un token.
