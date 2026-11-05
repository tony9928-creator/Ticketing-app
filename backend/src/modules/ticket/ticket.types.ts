export const TICKET_STATES = ["ACTIVO", "USADO", "CANCELADO"] as const;
export type TicketState = (typeof TICKET_STATES)[number];

/** Comprobante emitido al completarse el pago de una reserva. */
export interface Ticket {
  id: string;
  id_reserva: string;
  /** Código único e impredecible: es lo que se codifica en la imagen QR. */
  codigoQR: string;
  estado: TicketState;
  montoPagado: number;
  fechaCompra: Date;
}

export type NewTicket = Pick<Ticket, "id_reserva" | "codigoQR" | "montoPagado">;
