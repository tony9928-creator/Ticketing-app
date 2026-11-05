import { AppError } from "../../errors/AppError";
import { EventRepository } from "./event.repository";
import { Event } from "./event.types";
import { CreateEventInput, EventQuery } from "./event.validation";

export class EventService {
  constructor(private readonly events: EventRepository) {}

  list(query: EventQuery): Promise<Event[]> {
    return this.events.findAll(query);
  }

  async get(id: string): Promise<Event> {
    const event = await this.events.findById(id);
    if (!event) throw AppError.notFound("Evento no encontrado");
    return event;
  }

  /** Reglas de negocio validadas aquí aunque Zod ya las controle en la ruta. */
  create(input: CreateEventInput): Promise<Event> {
    if (input.fecha.getTime() <= Date.now()) {
      throw AppError.badRequest("La fecha del evento debe ser futura");
    }
    if (!Number.isInteger(input.stockDisponible) || input.stockDisponible < 0) {
      throw AppError.badRequest("El stock debe ser un entero mayor o igual a 0");
    }
    return this.events.create(input);
  }
}
