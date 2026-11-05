import { HydratedDocument } from "mongoose";
import { escapeRegex } from "../../utils/validation";
import { EventDoc, EventModel } from "./event.model";
import { Coordenadas, Event, EventFilters, NewEvent } from "./event.types";

export interface EventRepository {
  findById(id: string): Promise<Event | undefined>;
  findAll(filters?: EventFilters): Promise<Event[]>;
  create(data: NewEvent): Promise<Event>;
  /**
   * Descuenta stock de forma atómica, solo si alcanza.
   * Devuelve false (sin tocar nada) cuando no hay stock suficiente o el evento no existe.
   */
  reserveStock(id: string, quantity: number): Promise<boolean>;
  /** Repone stock (reserva vencida). */
  releaseStock(id: string, quantity: number): Promise<void>;
}

const toDomain = (doc: HydratedDocument<EventDoc>): Event => ({
  id: doc.id,
  titulo: doc.titulo,
  descripcion: doc.descripcion,
  fecha: doc.fecha,
  ubicacion: {
    nombreLugar: doc.ubicacion.nombreLugar,
    ciudad: doc.ubicacion.ciudad,
    coordenadas: [doc.ubicacion.coordenadas[0], doc.ubicacion.coordenadas[1]] as Coordenadas,
  },
  esLocal: doc.esLocal,
  precio: doc.precio,
  stockDisponible: doc.stockDisponible,
  createdAt: doc.createdAt,
});

export class MongoEventRepository implements EventRepository {
  async findById(id: string) {
    const doc = await EventModel.findById(id);
    return doc ? toDomain(doc) : undefined;
  }

  async findAll(filters: EventFilters = {}) {
    const docs = await EventModel.find({
      ...(filters.ciudad ? { "ubicacion.ciudad": { $regex: escapeRegex(filters.ciudad), $options: "i" } } : {}),
      ...(filters.titulo ? { titulo: { $regex: escapeRegex(filters.titulo), $options: "i" } } : {}),
      ...(filters.esLocal !== undefined ? { esLocal: filters.esLocal } : {}),
    }).sort({ fecha: 1 });
    return docs.map(toDomain);
  }

  async create(data: NewEvent) {
    return toDomain(await EventModel.create(data));
  }

  async reserveStock(id: string, quantity: number) {
    // Filtro + $inc en una sola operación: dos compradores simultáneos nunca pueden
    // llevarse la misma última entrada (MongoDB serializa la escritura sobre el documento).
    const updated = await EventModel.findOneAndUpdate(
      { _id: id, stockDisponible: { $gte: quantity } },
      { $inc: { stockDisponible: -quantity } },
    );
    return updated !== null;
  }

  async releaseStock(id: string, quantity: number) {
    await EventModel.updateOne({ _id: id }, { $inc: { stockDisponible: quantity } });
  }
}
