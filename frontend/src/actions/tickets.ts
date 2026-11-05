"use server";

import { api, ApiError } from "@/lib/api";
import type { Ticket } from "@/lib/types";

export type ResultadoValidacion =
  | { ok: true; ticket: Ticket }
  | { ok: false; message: string };

/**
 * Control de acceso en la puerta: consume el QR (ACTIVO -> USADO).
 * La llama el escáner directamente desde el navegador (una Server Action también
 * se puede invocar como una función común, no solo desde un <form>).
 */
export async function validarTicket(codigoQR: string): Promise<ResultadoValidacion> {
  const codigo = codigoQR.trim();
  if (!codigo) return { ok: false, message: "Ingresá un código" };
  try {
    const ticket = await api<Ticket>("/tickets/validate", { method: "POST", auth: true, body: { codigoQR: codigo } });
    return { ok: true, ticket };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
}
