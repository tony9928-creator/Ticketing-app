import Link from "next/link";
import { formatHora, formatPrecio } from "@/lib/format";
import type { Evento } from "@/lib/types";
import { EventPoster } from "./EventPoster";
import { StockBadge } from "./StockBadge";

/** Tarjeta de la cartelera: afiche, lugar, precio y disponibilidad. */
export function EventCard({ evento }: { evento: Evento }) {
  return (
    <Link
      href={`/eventos/${evento.id}`}
      prefetch={true}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(23,20,31,0.25)]"
    >
      <EventPoster evento={evento} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-sm text-muted">
          {evento.ubicacion.nombreLugar} · {evento.ubicacion.ciudad} · {formatHora(evento.fecha)} h
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-lg font-semibold">{formatPrecio(evento.precio)}</span>
          <StockBadge stock={evento.stockDisponible} />
        </div>
      </div>
    </Link>
  );
}
