import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Checkout } from "@/components/bookings/Checkout";
import { EventPoster } from "@/components/events/EventPoster";
import { Alert } from "@/components/ui/Alert";
import { getReservaConEvento, getTicketDeReserva, requireUser } from "@/lib/data";
import { formatFecha, formatHora, formatPrecio } from "@/lib/format";

export const metadata: Metadata = { title: "Tu reserva" };

type Props = PageProps<"/reservas/[id]">;

/** Pantalla de pago de una reserva: /reservas/<id> */
export default function ReservaPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Checkout</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Confirmá tu compra</h1>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-3xl bg-line/60" />}>
        <Resumen params={params} />
      </Suspense>
    </div>
  );
}

async function Resumen({ params }: { params: Props["params"] }) {
  const { id } = await params;
  await requireUser(`/reservas/${id}`);
  const { reserva, evento } = await getReservaConEvento(id);
  const total = evento.precio * reserva.cantidad;
  // La API marca EXPIRED con un job cada 30 s; mientras tanto, la fecha manda.
  const vencida = reserva.estado === "EXPIRED" || (reserva.estado === "PENDING" && new Date(reserva.expiresAt) <= new Date());

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[1fr_340px]">
      {/* Resumen con forma de entrada */}
      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        <EventPoster evento={evento} />
        <div className="space-y-1 p-6">
          <h2 className="font-display text-2xl font-semibold">{evento.titulo}</h2>
          <p className="text-muted first-letter:uppercase">
            {formatFecha(evento.fecha)} · {formatHora(evento.fecha)} h
          </p>
          <p className="text-muted">
            {evento.ubicacion.nombreLugar}, {evento.ubicacion.ciudad}
          </p>
        </div>
        <div className="ticket-cut mx-0" />
        <dl className="space-y-2 p-6">
          <Linea label={`${reserva.cantidad} × ${formatPrecio(evento.precio)}`} valor={formatPrecio(total)} />
          <Linea label="Cargo por servicio" valor={formatPrecio(0)} />
          <div className="flex justify-between border-t border-line pt-3 font-display text-xl font-bold">
            <dt>Total</dt>
            <dd>{formatPrecio(total)}</dd>
          </div>
        </dl>
      </div>

      <div className="md:pt-2">
        {reserva.estado === "COMPLETED" ? (
          <Pagada reservaId={reserva.id} />
        ) : vencida ? (
          <div className="space-y-4">
            <Alert tone="warn">Esta reserva venció y las entradas se liberaron.</Alert>
            <Link href={`/eventos/${evento.id}`} className="flex justify-center rounded-xl bg-ink px-5 py-3 font-semibold text-paper">
              Volver al evento
            </Link>
          </div>
        ) : (
          <Checkout reservaId={reserva.id} expiresAt={reserva.expiresAt} eventoId={evento.id} />
        )}
      </div>
    </div>
  );
}

async function Pagada({ reservaId }: { reservaId: string }) {
  const ticket = await getTicketDeReserva(reservaId);
  return (
    <div className="space-y-4">
      <Alert tone="ok">Esta reserva ya está pagada.</Alert>
      {ticket && (
        <Link href={`/mis-tickets/${ticket.id}`} className="flex justify-center rounded-xl bg-accent px-5 py-3 font-semibold text-white">
          Ver mi entrada
        </Link>
      )}
    </div>
  );
}

function Linea({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between text-muted">
      <dt>{label}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
