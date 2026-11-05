import { NextFunction, Request, Response } from "express";
import { EventService } from "./event.service";
import { CreateEventInput, eventQuerySchema } from "./event.validation";

export class EventController {
  constructor(private readonly events: EventService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Si la query es inválida, Zod lanza y el middleware de errores responde 400.
      const query = eventQuerySchema.parse(req.query);
      res.status(200).json(await this.events.list(query));
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.events.get(String(req.params.id)));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.events.create(req.body as CreateEventInput));
    } catch (error) {
      next(error);
    }
  };
}
