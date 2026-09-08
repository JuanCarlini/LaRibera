import { ticker } from "@/content/site";

/**
 * Cinta continua con los datos duros del loteo.
 * La lista se duplica y la animación corre -50%, así el loop no tiene costura.
 * El texto va en verde profundo: crema sobre el naranja de marca queda en
 * 2,45:1 y a este cuerpo de letra no se lee.
 */
export function Ticker() {
  const vuelta = (llave: string) => (
    <ul key={llave} className="flex shrink-0 items-center" aria-hidden={llave === "b"}>
      {ticker.map((t) => (
        <li key={t} className="flex items-center gap-6 px-6 whitespace-nowrap">
          <span className="text-sm font-bold tracking-[0.16em] uppercase">{t}</span>
          <span className="size-1.5 rounded-full bg-current/50" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden bg-naranja py-4 text-verde-900">
      <div className="animate-marquee flex w-max [animation:marquee_38s_linear_infinite]">
        {vuelta("a")}
        {vuelta("b")}
      </div>
    </div>
  );
}
