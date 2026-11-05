import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TicketStateBadge } from "@/components/tickets/TicketStateBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMisTickets, requireUser } from "@/lib/data";
import { formatFecha, formatHora, formatPrecio, partesFecha } from "@/lib/format";

export const metadata: Metadata = { title: "Mis tickets" };

/** Lista de entradas compradas + reservas que todavía se pueden pagar. */
export default function MisTicketsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">Mis tickets</h1>
      <p className="mt-1 text-muted">Mostrá el QR en la entrada del evento.</p>
      <Suspense fallback={<ListaSkeleton />}>
        <Lista />
      </Suspense>
    </div>
  );
}

async function Lista() {
  await requireUser("/mis-tickets");
  const { tickets, pendientes } = await getMisTickets();

  return (
    <div className="mt-8 space-y-10">
      {pendientes.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Reservas sin pagar</h2>
          <div className="space-y-3">
            {pendientes.map(({ reserva, evento }) => (
              <Link
                key={reserva.id}
                href={`/reservas/${reserva.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-warn/40 bg-warn-soft/60 px-5 py-4 hover:bg-warn-soft"
              >
                <span>
                  <span className="block font-semibold">{evento?.titulo ?? "Evento"}</span>
                  <span className="text-sm text-muted">
                    {reserva.cantidad} {reserva.cantidad === 1 ? "entrada" : "entradas"} · vence a las {formatHora(reserva.expiresAt)} h
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-warn">Pagar →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        {tickets.length === 0 ? (
          <EmptyState title="Todavía no tenés entradas" action={{ href: "/", label: "Ver eventos" }}>
            Cuando compres una entrada, va a aparecer acá con su código QR.
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {tickets.map(({ ticket, reserva, evento }) => {
              const fecha = evento ? partesFecha(evento.fecha) : null;
              return (
                <Link
                  key={ticket.id}
                  href={`/mis-tickets/${ticket.id}`}
                  className={`flex overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(23,20,31,0.25)] ${
                    ticket.estado !== "ACTIVO" ? "opacity-70" : ""
                  }`}
                >
                  <div className="grid w-24 shrink-0 place-items-center border-r-2 border-dashed border-line bg-accent-soft/50 text-center">
                    {fecha && (
                      <div>
                        <div className="font-display text-3xl font-bold leading-none">{fecha.dia}</div>
                        <div className="text-xs font-semibold uppercase text-accent">{fecha.mes}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <div className="font-display text-lg font-semibold">{evento?.titulo ?? "Evento no disponible"}</div>
                      {evento && (
                        <div className="text-sm text-muted first-letter:uppercase">
                          {formatFecha(evento.fecha)} · {evento.ubicacion.nombreLugar}
                        </div>
                      )}
                      <div className="mt-1 text-sm text-muted">
                        {reserva?.cantidad ?? 1} {reserva?.cantidad === 1 ? "entrada" : "entradas"} · {formatPrecio(ticket.montoPagado)}
                      </div>
                    </div>
                    <TicketStateBadge estado={ticket.estado} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ListaSkeleton() {
  return (
    <div className="mt-8 space-y-4" aria-busy="true">
      {[0, 1].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-3xl bg-line/60" />
      ))}
    </div>
  );
}
