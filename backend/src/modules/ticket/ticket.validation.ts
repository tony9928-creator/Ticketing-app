import { z } from "zod";

/** Body de POST /api/tickets/validate (lo que se lee del QR). */
export const validateTicketSchema = z.object({
  codigoQR: z.string().trim().min(10, "Código QR inválido").max(200, "Código QR inválido"),
});

export type ValidateTicketInput = z.infer<typeof validateTicketSchema>;
