import { model, Schema, Types } from "mongoose";
import { Booking, BOOKING_STATES } from "./booking.types";

export type BookingDoc = Omit<Booking, "id" | "id_usuario" | "id_evento"> & {
  id_usuario: Types.ObjectId;
  id_evento: Types.ObjectId;
};

const bookingSchema = new Schema<BookingDoc>(
  {
    id_usuario: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    id_evento: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    cantidad: { type: Number, required: true, min: 1 },
    estado: { type: String, enum: [...BOOKING_STATES], default: "PENDING", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Acelera la búsqueda de reservas vencidas (estado PENDING y expiresAt <= ahora).
bookingSchema.index({ estado: 1, expiresAt: 1 });

export const BookingModel = model<BookingDoc>("Booking", bookingSchema);
