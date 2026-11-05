import { NextFunction, Request, Response } from "express";
import { TicketService } from "./ticket.service";
import { ValidateTicketInput } from "./ticket.validation";

export class TicketController {
  constructor(private readonly tickets: TicketService) {}

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.tickets.listMine(req.auth!.userId));
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.tickets.get(req.auth!, String(req.params.id)));
    } catch (error) {
      next(error);
    }
  };

  validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { codigoQR } = req.body as ValidateTicketInput;
      res.status(200).json(await this.tickets.validate(codigoQR));
    } catch (error) {
      next(error);
    }
  };
}
