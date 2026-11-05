"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { pagar } from "@/actions/bookings";
import { Alert } from "../ui/Alert";
import { SubmitButton } from "../ui/SubmitButton";

/** Milisegundos que faltan hasta `iso` (nunca negativo). */
const restante = (iso: string) => Math.max(new Date(iso).getTime() - Date.now(), 0);

/**
 * Cuenta regresiva + botón de pago de una reserva PENDING.
 * Cuando el tiempo llega a cero, se bloquea el pago: la API ya liberó (o liberará) el stock.
 */
export function Checkout({ reservaId, expiresAt, eventoId }: { reservaId: string; expiresAt: string; eventoId: string }) {
  // Arranca en null para que el servidor y el navegador dibujen lo mismo (el reloj solo corre en el navegador).
  const [ms, setMs] = useState<number | null>(null);
  const [state, action] = useActionState(pagar, undefined);

  useEffect(() => {
    const tick = () => setMs(restante(expiresAt));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const vencida = ms === 0;
  const minutos = ms === null ? "–" : Math.floor(ms / 60000);
  const segundos = ms === null ? "––" : String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const urgente = ms !== null && ms < 60_000;

  if (vencida) {
    return (
      <div className="space-y-4">
        <Alert tone="warn">
          Se terminó el tiempo para pagar y las entradas se liberaron. Podés volver a reservar si todavía hay lugar.
        </Alert>
        <Link
          href={`/eventos/${eventoId}`}
          className="flex w-full justify-center rounded-xl bg-ink px-5 py-3 font-semibold text-paper hover:bg-ink/85"
        >
          Volver al evento
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="reservaId" value={reservaId} />

      <div className={`rounded-2xl px-5 py-4 text-center ${urgente ? "bg-danger-soft text-danger" : "bg-warn-soft text-warn"}`}>
        <div className="text-xs font-semibold uppercase tracking-wide">Tus entradas están reservadas por</div>
        <div className="mt-1 font-mono text-4xl font-bold tabular-nums" aria-live="off">
          {minutos}:{segundos}
        </div>
      </div>

      {state?.message && <Alert tone="error">{state.message}</Alert>}

      <SubmitButton className="w-full" pendingText="Procesando pago…">
        Pagar ahora
      </SubmitButton>
      <p className="text-center text-xs text-muted">Pago simulado: no se cobra nada real.</p>
    </form>
  );
}
