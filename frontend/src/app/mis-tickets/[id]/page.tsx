import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TicketQR } from "@/components/tickets/TicketQR";
import { TicketStateBadge } from "@/components/tickets/TicketStateBadge";
import { Alert } from "@/components/ui/Alert";
import { getTicketDetalle, requireUser } from "@/lib/data";
import { formatFecha, formatHora, formatPrecio } from "@/lib/format";

export const metadata: Metadata = { title: "Mi entrada" };

type Props = PageProps<"/mis-tickets/[id]">;

/** Entrada con su QR: /mis-tickets/<id> (?nuevo=1 cuando se acaba de pagar). */
export default function TicketPage({ params, searchParams }: Props) {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link href="/mis-tickets" className="text-sm text-muted hover:text-ink">
        ← Mis tickets
      </Link>
      <Suspense fallback={<div className="mt-4 h-[560px] animate-pulse rounded-3xl bg-line/60" />}>
        <Entrada params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Entrada({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  await requireUser(`/mis-tickets/${id}`);
  const { ticket, reserva, evento } = await getTicketDetalle(id);
  const cantidad = reserva?.cantidad ?? 1;

  return (
    <div className="mt-4 space-y-4">
      {sp.nuevo && <Alert tone="ok">¡Listo! Tu pago se acreditó. Esta es tu entrada.</Alert>}

      <article className="overflow-hidden rounded-3xl bg-ink text-paper shadow-[0_30px_60px_-30px_rgba(23,20,31,0.6)]">
        <div className="space-y-1 p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold leading-tight">{evento?.titulo ?? "Evento"}</h1>
            <TicketStateBadge estado={ticket.estado} />
          </div>
          {evento && (
            <>
              <p className="text-paper/70 first-letter:uppercase">
                {formatFecha(evento.fecha)} · {formatHora(evento.fecha)} h
              </p>
              <p className="text-paper/70">
                {evento.ubicacion.nombreLugar}, {evento.ubicacion.ciudad}
              </p>
            </>
          )}
        </div>

        {/* El troquel se dibuja con el color del fondo de la página */}
        <div className="ticket-cut border-paper/25" />

        <div className="p-6">
          <TicketQR value={ticket.codigoQR} apagado={ticket.estado !== "ACTIVO"} />
          <p className="mt-3 break-all text-center font-mono text-[11px] text-paper/50">{ticket.codigoQR}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-paper/50">Entradas</dt>
              <dd className="font-semibold">{cantidad}</dd>
            </div>
            <div className="text-right">
              <dt className="text-paper/50">Pagado</dt>
              <dd className="font-semibold">{formatPrecio(ticket.montoPagado)}</dd>
            </div>
          </dl>
        </div>
      </article>

      {ticket.estado === "USADO" && (
        <Alert tone="info">Esta entrada ya se usó para ingresar al evento.</Alert>
      )}
      {ticket.estado === "ACTIVO" && (
        <p className="text-center text-sm text-muted">
          Este código vale para {cantidad === 1 ? "1 persona" : `${cantidad} personas`} y se escanea una sola vez.
        </p>
      )}
    </div>
  );
}
