export const BOOKING_STATES = ["PENDING", "COMPLETED", "EXPIRED"] as const;
export type BookingState = (typeof BOOKING_STATES)[number];

/** Reserva temporal: mientras está PENDING mantiene bloqueado el stock del evento. */
export interface Booking {
  id: string;
  id_usuario: string;
  id_evento: string;
  cantidad: number;
  estado: BookingState;
  /** Momento en que la reserva vence si no se paga (creación + BOOKING_HOLD_MINUTES). */
  expiresAt: Date;
  createdAt: Date;
}

export type NewBooking = Pick<Booking, "id_usuario" | "id_evento" | "cantidad" | "expiresAt">;
