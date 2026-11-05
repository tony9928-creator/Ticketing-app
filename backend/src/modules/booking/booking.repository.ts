import { HydratedDocument, Types } from "mongoose";
import { BookingDoc, BookingModel } from "./booking.model";
import { Booking, NewBooking } from "./booking.types";

export interface BookingRepository {
  findById(id: string): Promise<Booking | undefined>;
  findByUser(userId: string): Promise<Booking[]>;
  create(data: NewBooking): Promise<Booking>;
  /** PENDING vigente (expiresAt > now) -> COMPLETED, atómico. Devuelve undefined si no se pudo. */
  complete(id: string, now: Date): Promise<Booking | undefined>;
  /** Deshace un complete() cuando falla la emisión del ticket. */
  revertToPending(id: string): Promise<void>;
  /**
   * Reclama de forma atómica UNA reserva PENDING vencida y la pasa a EXPIRED.
   * Solo quien la reclama repone su stock, así nunca se repone dos veces.
   */
  claimExpired(now: Date, id?: string): Promise<Booking | undefined>;
}

const toDomain = (doc: HydratedDocument<BookingDoc>): Booking => ({
  id: doc.id,
  id_usuario: doc.id_usuario.toString(),
  id_evento: doc.id_evento.toString(),
  cantidad: doc.cantidad,
  estado: doc.estado,
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
});

export class MongoBookingRepository implements BookingRepository {
  async findById(id: string) {
    const doc = await BookingModel.findById(id);
    return doc ? toDomain(doc) : undefined;
  }

  async findByUser(userId: string) {
    return (await BookingModel.find({ id_usuario: new Types.ObjectId(userId) }).sort({ createdAt: -1 })).map(toDomain);
  }

  async create(data: NewBooking) {
    return toDomain(await BookingModel.create(data));
  }

  async complete(id: string, now: Date) {
    const doc = await BookingModel.findOneAndUpdate(
      { _id: id, estado: "PENDING", expiresAt: { $gt: now } },
      { estado: "COMPLETED" },
      { returnDocument: "after" },
    );
    return doc ? toDomain(doc) : undefined;
  }

  async revertToPending(id: string) {
    await BookingModel.updateOne({ _id: id, estado: "COMPLETED" }, { estado: "PENDING" });
  }

  async claimExpired(now: Date, id?: string) {
    const doc = await BookingModel.findOneAndUpdate(
      { estado: "PENDING", expiresAt: { $lte: now }, ...(id ? { _id: id } : {}) },
      { estado: "EXPIRED" },
      { returnDocument: "after" },
    );
    return doc ? toDomain(doc) : undefined;
  }
}
