import { HydratedDocument, Types } from "mongoose";
import { AppError } from "../../errors/AppError";
import { TicketDoc, TicketModel } from "./ticket.model";
import { NewTicket, Ticket } from "./ticket.types";

export interface TicketRepository {
  findById(id: string): Promise<Ticket | undefined>;
  findByCode(codigoQR: string): Promise<Ticket | undefined>;
  findByReservas(reservaIds: string[]): Promise<Ticket[]>;
  /** Lanza AppError 409 si la reserva ya tiene ticket. */
  create(data: NewTicket): Promise<Ticket>;
  /** Pasa ACTIVO -> USADO de forma atómica. Devuelve undefined si no estaba ACTIVO. */
  markUsed(codigoQR: string): Promise<Ticket | undefined>;
}

const toDomain = (doc: HydratedDocument<TicketDoc>): Ticket => ({
  id: doc.id,
  id_reserva: doc.id_reserva.toString(),
  codigoQR: doc.codigoQR,
  estado: doc.estado,
  montoPagado: doc.montoPagado,
  fechaCompra: doc.fechaCompra,
});

export class MongoTicketRepository implements TicketRepository {
  async findById(id: string) {
    const doc = await TicketModel.findById(id);
    return doc ? toDomain(doc) : undefined;
  }

  async findByCode(codigoQR: string) {
    const doc = await TicketModel.findOne({ codigoQR });
    return doc ? toDomain(doc) : undefined;
  }

  async findByReservas(reservaIds: string[]) {
    if (reservaIds.length === 0) return [];
    const docs = await TicketModel.find({ id_reserva: { $in: reservaIds.map((id) => new Types.ObjectId(id)) } }).sort({
      fechaCompra: -1,
    });
    return docs.map(toDomain);
  }

  async create(data: NewTicket) {
    try {
      return toDomain(await TicketModel.create(data));
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        throw AppError.conflict("Esta reserva ya tiene un ticket emitido");
      }
      throw err;
    }
  }

  async markUsed(codigoQR: string) {
    const doc = await TicketModel.findOneAndUpdate(
      { codigoQR, estado: "ACTIVO" },
      { estado: "USADO" },
      { returnDocument: "after" },
    );
    return doc ? toDomain(doc) : undefined;
  }
}
