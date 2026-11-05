import { partesFecha } from "@/lib/format";
import type { Evento } from "@/lib/types";

/**
 * "Afiche" del evento. Como la API no guarda imágenes, se genera un degradado
 * a partir del id: cada evento tiene siempre los mismos colores.
 */
const PALETAS = [
  ["#ff5a36", "#ffb347"],
  ["#5b3cc4", "#ff5a8a"],
  ["#0f766e", "#a3e635"],
  ["#1e3a8a", "#38bdf8"],
  ["#9f1239", "#fb923c"],
  ["#14532d", "#facc15"],
] as const;

function paletaDe(id: string) {
  let hash = 0;
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return PALETAS[hash % PALETAS.length];
}

export function EventPoster({ evento, size = "card" }: { evento: Evento; size?: "card" | "hero" }) {
  const [desde, hasta] = paletaDe(evento.id);
  const { dia, mes, semana } = partesFecha(evento.fecha);
  const hero = size === "hero";

  return (
    <div
      className={`relative overflow-hidden ${hero ? "aspect-[16/7] rounded-3xl" : "aspect-[16/10]"}`}
      style={{ background: `linear-gradient(135deg, ${desde}, ${hasta})` }}
    >
      {/* Formas decorativas */}
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/15" />
      <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-black/10" />
      <span
        className={`absolute bottom-3 left-4 right-24 font-display font-bold leading-none text-white/90 ${
          hero ? "text-4xl sm:text-6xl" : "line-clamp-2 text-2xl"
        }`}
      >
        {evento.titulo}
      </span>

      {/* Bloque de fecha */}
      <div
        className={`absolute right-3 top-3 rounded-2xl bg-white/95 text-center text-ink shadow-sm ${
          hero ? "px-4 py-3" : "px-3 py-2"
        }`}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{semana}</div>
        <div className={`font-display font-bold leading-none ${hero ? "text-4xl" : "text-2xl"}`}>{dia}</div>
        <div className="text-xs font-semibold uppercase text-accent">{mes}</div>
      </div>
    </div>
  );
}
