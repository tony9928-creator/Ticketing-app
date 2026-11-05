import { randomBytes } from "node:crypto";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { Actor } from "../auth/auth.types";
import { EventRepository } from "../event/event.repository";
import { TicketRepository } from "../ticket/ticket.repository";
import { Ticket } from "../ticket/ticket.types";
import { BookingRepository } from "./booking.repository";
import { Booking } from "./booking.types";
import { CreateBookingInput } from "./booking.validation";

export interface PaymentResult {
  booking: Booking;
  ticket: Ticket;
}

export class BookingService {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly events: EventRepository,
    private readonly tickets: TicketRepository,
  ) {}

  listMine(userId: string): Promise<Booking[]> {
    return this.bookings.findByUser(userId);
  }

  /**
   * Crea una reserva PENDING y bloquea el stock durante BOOKING_HOLD_MINUTES.
   * 1) Descuenta el stock con una operación atómica (si no alcanza, 409 y no se crea nada).
   * 2) Crea la reserva. Si este paso falla, devuelve el stock para no perderlo.
   */
  async reserve(userId: string, { id_evento, cantidad }: CreateBookingInput): Promise<Booking> {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      throw AppError.badRequest("La cantidad debe ser un entero mayor a 0");
    }
    const event = await this.events.findById(id_evento);
    if (!event) throw AppError.notFound("Evento no encontrado");
    if (event.fecha.getTime() <= Date.now()) {
      throw AppError.badRequest("No se pueden reservar entradas de un evento que ya comenzó o terminó");
    }

    // Antes de decidir si hay stock, libera el de las reservas vencidas que el job aún no procesó.
    await this.expireStale();

    if (!(await this.events.reserveStock(id_evento, cantidad))) {
      throw AppError.conflict("No hay stock suficiente para la cantidad solicitada");
    }
    try {
      const expiresAt = new Date(Date.now() + env.bookingHoldMinutes * 60_000);
      return await this.bookings.create({ id_usuario: userId, id_evento, cantidad, expiresAt });
    } catch (error) {
      await this.events.releaseStock(id_evento, cantidad);
      throw error;
    }
  }

  /**
   * Pago (simulado): PENDING vigente -> COMPLETED y emisión del ticket con su código QR.
   * La transición es atómica: si dos pagos llegan a la vez, solo uno la gana.
   */
  async pay(actor: Actor, bookingId: string): Promise<PaymentResult> {
    const booking = await this.bookings.findById(bookingId);
    if (!booking) throw AppError.notFound("Reserva no encontrada");
    if (booking.id_usuario !== actor.userId) throw AppError.forbidden("Solo puedes pagar tus propias reservas");
    if (booking.estado === "COMPLETED") throw AppError.conflict("La reserva ya fue pagada");

    const completed = await this.bookings.complete(bookingId, new Date());
    if (!completed) {
      // Venció (o la venció el job justo ahora): se repone el stock y se informa.
      await this.expireOne(bookingId);
      throw AppError.conflict("La reserva expiró: vuelve a reservar para continuar");
    }

    try {
      const event = await this.events.findById(completed.id_evento);
      const ticket = await this.tickets.create({
        id_reserva: completed.id,
        codigoQR: randomBytes(24).toString("base64url"),
        montoPagado: (event?.precio ?? 0) * completed.cantidad,
      });
      return { booking: completed, ticket };
    } catch (error) {
      await this.bookings.revertToPending(completed.id);
      throw error;
    }
  }

  /**
   * Marca como EXPIRED las reservas PENDING vencidas y repone su stock.
   * Lo llama el job periódico y, además, cada reserva nueva. Devuelve cuántas expiró.
   */
  async expireStale(): Promise<number> {
    let count = 0;
    for (let b = await this.bookings.claimExpired(new Date()); b; b = await this.bookings.claimExpired(new Date())) {
      await this.events.releaseStock(b.id_evento, b.cantidad);
      count++;
    }
    return count;
  }

  private async expireOne(bookingId: string): Promise<void> {
    const expired = await this.bookings.claimExpired(new Date(), bookingId);
    if (expired) await this.events.releaseStock(expired.id_evento, expired.cantidad);
  }
}
