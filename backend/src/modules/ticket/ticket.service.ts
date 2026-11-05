import { AppError } from "../../errors/AppError";
import { Actor } from "../auth/auth.types";
import { BookingRepository } from "../booking/booking.repository";
import { TicketRepository } from "./ticket.repository";
import { Ticket } from "./ticket.types";

export class TicketService {
  constructor(
    private readonly tickets: TicketRepository,
    private readonly bookings: BookingRepository,
  ) {}

  /** Tickets del usuario: los de sus reservas completadas. */
  async listMine(userId: string): Promise<Ticket[]> {
    const mine = (await this.bookings.findByUser(userId)).filter((b) => b.estado === "COMPLETED");
    return this.tickets.findByReservas(mine.map((b) => b.id));
  }

  /** Un ticket lo ve su dueño o un admin. */
  async get(actor: Actor, id: string): Promise<Ticket> {
    const ticket = await this.tickets.findById(id);
    if (!ticket) throw AppError.notFound("Ticket no encontrado");
    const booking = await this.bookings.findById(ticket.id_reserva);
    if (actor.rol !== "admin" && booking?.id_usuario !== actor.userId) {
      throw AppError.forbidden("Solo puedes ver tus propios tickets");
    }
    return ticket;
  }

  /**
   * Control de acceso (admin/organizer): consume el QR. ACTIVO -> USADO de forma atómica,
   * por lo que un mismo código no puede entrar dos veces aunque se escanee en simultáneo.
   */
  async validate(codigoQR: string): Promise<Ticket> {
    const used = await this.tickets.markUsed(codigoQR);
    if (used) return used;

    const ticket = await this.tickets.findByCode(codigoQR);
    if (!ticket) throw AppError.notFound("Ticket no encontrado");
    throw AppError.conflict(
      ticket.estado === "USADO" ? "El ticket ya fue utilizado" : `El ticket está ${ticket.estado.toLowerCase()}`,
    );
  }
}
