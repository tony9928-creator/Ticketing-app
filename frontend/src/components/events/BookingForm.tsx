"use client";

import { useActionState, useState } from "react";
import { reservar } from "@/actions/bookings";
import { MAX_ENTRADAS_POR_RESERVA } from "@/lib/config";
import { formatPrecio } from "@/lib/format";
import { Alert } from "../ui/Alert";
import { SubmitButton } from "../ui/SubmitButton";

/**
 * Selector de cantidad + botón "Reservar".
 * useActionState conecta el formulario con la Server Action `reservar` y guarda
 * el error que devuelva (por ejemplo, "no hay stock suficiente").
 */
export function BookingForm({ eventoId, precio, stock }: { eventoId: string; precio: number; stock: number }) {
  const [state, action] = useActionState(reservar, undefined);
  const max = Math.min(stock, MAX_ENTRADAS_POR_RESERVA);
  const [cantidad, setCantidad] = useState(1);

  if (stock === 0) {
    return (
      <div className="rounded-xl bg-line/60 px-4 py-3 text-center font-semibold text-muted">
        Entradas agotadas
      </div>
    );
  }

  const boton = "grid h-11 w-11 place-items-center rounded-xl border border-line text-xl hover:bg-line/40 disabled:opacity-40";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id_evento" value={eventoId} />
      <input type="hidden" name="cantidad" value={cantidad} />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Cantidad</span>
        <div className="flex items-center gap-3">
          <button type="button" className={boton} onClick={() => setCantidad((c) => c - 1)} disabled={cantidad <= 1} aria-label="Quitar una">
            −
          </button>
          <span className="w-6 text-center font-display text-xl font-semibold" aria-live="polite">
            {cantidad}
          </span>
          <button type="button" className={boton} onClick={() => setCantidad((c) => c + 1)} disabled={cantidad >= max} aria-label="Agregar una">
            +
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-muted">Total</span>
        <span className="font-display text-2xl font-bold">{formatPrecio(precio * cantidad)}</span>
      </div>

      {state?.message && <Alert tone="error">{state.message}</Alert>}

      <SubmitButton className="w-full" pendingText="Reservando…">
        Reservar {cantidad === 1 ? "entrada" : `${cantidad} entradas`}
      </SubmitButton>
      <p className="text-center text-xs text-muted">Tenés 5 minutos para pagar antes de que se liberen.</p>
    </form>
  );
}
