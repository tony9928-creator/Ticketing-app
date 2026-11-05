"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { FormState, PagoResponse, Reserva } from "@/lib/types";

/** Reserva entradas: la API descuenta el stock y lo bloquea por unos minutos. */
export async function reservar(_prev: FormState, formData: FormData): Promise<FormState> {
  const id_evento = String(formData.get("id_evento") ?? "");
  const cantidad = Number(formData.get("cantidad"));

  // Sin sesión: al login, y después de ingresar vuelve a este evento.
  if (!(await getSessionUser())) redirect(`/login?next=${encodeURIComponent(`/eventos/${id_evento}`)}`);

  let reserva: Reserva;
  try {
    reserva = await api<Reserva>("/bookings", { method: "POST", auth: true, body: { id_evento, cantidad } });
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message, fieldErrors: e.fieldErrors };
    throw e;
  }
  redirect(`/reservas/${reserva.id}`);
}

/** Pago simulado: completa la reserva y la API emite el ticket con su código QR. */
export async function pagar(_prev: FormState, formData: FormData): Promise<FormState> {
  const reservaId = String(formData.get("reservaId") ?? "");

  let pago: PagoResponse;
  try {
    pago = await api<PagoResponse>(`/bookings/${reservaId}/pay`, { method: "POST", auth: true });
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message };
    throw e;
  }
  redirect(`/mis-tickets/${pago.ticket.id}?nuevo=1`);
}
