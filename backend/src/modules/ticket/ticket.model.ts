import { model, Schema, Types } from "mongoose";
import { Ticket, TICKET_STATES } from "./ticket.types";

export type TicketDoc = Omit<Ticket, "id" | "id_reserva"> & { id_reserva: Types.ObjectId };

const ticketSchema = new Schema<TicketDoc>({
  // unique: una reserva solo puede emitir un ticket (evita duplicados si el pago se reintenta).
  id_reserva: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
  codigoQR: { type: String, required: true, unique: true },
  estado: { type: String, enum: [...TICKET_STATES], default: "ACTIVO", required: true },
  montoPagado: { type: Number, required: true, min: 0 },
  fechaCompra: { type: Date, default: Date.now, required: true },
});

export const TicketModel = model<TicketDoc>("Ticket", ticketSchema);
