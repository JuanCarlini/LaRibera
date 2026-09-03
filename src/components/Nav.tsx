"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { IconoWhatsapp, waHref } from "./ui";
import { nav } from "@/content/site";

export function Nav() {
  const [pegado, setPegado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setPegado(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menú mobile abierto no queremos que el fondo scrollee.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        pegado || abierto
          ? "bg-crema/95 text-verde shadow-[0_1px_0_rgba(6,52,36,0.1)] backdrop-blur"
          : "bg-transparent text-crema"
      }`}
    >
      <div className="contenedor flex h-18 items-center justify-between gap-6">
        <a href="#top" className="shrink-0" onClick={() => setAbierto(false)}>
          {/* Sobre la foto del hero va la versión lima; al fijarse el fondo
              pasa a crema y necesita el wordmark verde. */}
          <Logo
            variante={pegado || abierto ? "verde" : "lima"}
            alto={18}
            priority
            className="md:!h-[22px]"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
            >
              {i.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-naranja px-5 py-2.5 text-sm font-bold text-crema transition-colors hover:bg-naranja-600 sm:inline-flex"
          >
            <IconoWhatsapp />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 place-items-center rounded-full border border-current/30 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  abierto ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  abierto ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {abierto && (
        <nav className="contenedor flex flex-col gap-1 border-t border-verde/10 pb-8 lg:hidden">
          {nav.map((i) => (
            <a
              key={i.href}
              href={i.href}
              onClick={() => setAbierto(false)}
              className="border-b border-verde/10 py-4 text-xl font-bold"
            >
              {i.label}
            </a>
          ))}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-naranja px-6 py-3.5 font-bold text-crema"
          >
            <IconoWhatsapp />
            Escribinos por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
