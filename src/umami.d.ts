/**
 * Lo que expone el script de Umami en el navegador. Es opcional a propósito:
 * si un adblocker bloquea el script, `window.umami` no existe, y todo uso
 * tiene que ir con `window.umami?.`.
 */
interface Window {
  umami?: {
    track(evento: string, datos?: Record<string, string | number | boolean>): void;
  };
}
