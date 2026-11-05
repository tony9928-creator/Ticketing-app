import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookingForm } from "@/components/events/BookingForm";
import { EventPoster } from "@/components/events/EventPoster";
import { StockBadge } from "@/components/events/StockBadge";
import { TravelLinks } from "@/components/events/TravelLinks";
import { EventMap } from "@/components/map/EventMap";
import { getEvento } from "@/lib/data";
import { formatFecha, formatHora, formatPrecio } from "@/lib/format";

type Props = PageProps<"/eventos/[id]">;

/** Título de la pestaña del navegador con el nombre del evento. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const evento = await getEvento(id);
  return { title: evento.titulo, description: evento.descripcion || undefined };
}

/** Detalle de un evento: /eventos/<id> */
export default function EventoPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Volver a la cartelera
      </Link>
      <Suspense fallback={<DetalleSkeleton />}>
        <Detalle params={params} />
      </Suspense>
    </div>
  );
}

async function Detalle({ params }: { params: Props["params"] }) {
  const { id } = await params;
  const evento = await getEvento(id);
  const { nombreLugar, ciudad, coordenadas } = evento.ubicacion;

  return (
    <div className="mt-4">
      <EventPoster evento={evento} size="hero" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{evento.titulo}</h1>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Dato titulo="Cuándo">
                <span className="first-letter:uppercase">{formatFecha(evento.fecha)}</span> · {formatHora(evento.fecha)} h
              </Dato>
              <Dato titulo="Dónde">
                {nombreLugar}, {ciudad}
              </Dato>
            </dl>
          </div>

          {evento.descripcion && (
            <section>
              <h2 className="font-display text-xl font-semibold">Sobre el evento</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">{evento.descripcion}</p>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold">Ubicación</h2>
            <EventMap coordenadas={coordenadas} label={`${nombreLugar} · ${ciudad}`} />
          </section>

          {!evento.esLocal && <TravelLinks evento={evento} />}
        </div>

        {/* Columna de compra: queda fija al hacer scroll en pantallas grandes */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_12px_30px_-18px_rgba(23,20,31,0.3)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted">Precio por entrada</div>
                <div className="font-display text-3xl font-bold">{formatPrecio(evento.precio)}</div>
              </div>
              <StockBadge stock={evento.stockDisponible} />
            </div>
            <div className="ticket-cut my-6" />
            <BookingForm eventoId={evento.id} precio={evento.precio} stock={evento.stockDisponible} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Dato({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{titulo}</dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}

function DetalleSkeleton() {
  return (
    <div className="mt-4 animate-pulse" aria-busy="true">
      <div className="aspect-[16/7] rounded-3xl bg-line/60" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="h-10 w-2/3 rounded-xl bg-line/60" />
          <div className="h-20 rounded-2xl bg-line/60" />
          <div className="h-72 rounded-3xl bg-line/60" />
        </div>
        <div className="h-80 rounded-3xl bg-line/60" />
      </div>
    </div>
  );
}
