import { z } from "zod";
import { objectId } from "../../utils/validation";

/** Máximo de entradas por reserva (evita acaparar el stock de un evento). */
export const MAX_TICKETS_PER_BOOKING = 10;

export const createBookingSchema = z.object({
  id_evento: objectId,
  cantidad: z
    .number("Debe ser un número")
    .int("Debe ser un entero")
    .min(1, "Mínimo 1 entrada")
    .max(MAX_TICKETS_PER_BOOKING, `Máximo ${MAX_TICKETS_PER_BOOKING} entradas por reserva`),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
