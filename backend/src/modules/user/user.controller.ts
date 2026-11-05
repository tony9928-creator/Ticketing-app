import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { UpdateRolInput } from "./user.validation";

export class UserController {
  constructor(private readonly users: UserService) {}

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.users.getById(req.auth!.userId));
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.users.list());
    } catch (error) {
      next(error);
    }
  };

  updateRol = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rol } = req.body as UpdateRolInput;
      res.status(200).json(await this.users.updateRol(String(req.params.id), rol));
    } catch (error) {
      next(error);
    }
  };
}
