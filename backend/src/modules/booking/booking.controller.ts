import { NextFunction, Request, Response } from "express";
import { BookingService } from "./booking.service";
import { CreateBookingInput } from "./booking.validation";

export class BookingController {
  constructor(private readonly bookings: BookingService) {}

  listMine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.bookings.listMine(req.auth!.userId));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.bookings.reserve(req.auth!.userId, req.body as CreateBookingInput));
    } catch (error) {
      next(error);
    }
  };

  pay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.bookings.pay(req.auth!, String(req.params.id)));
    } catch (error) {
      next(error);
    }
  };
}
