import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginInput, RegisterInput } from "./auth.validation";

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.auth.register(req.body as RegisterInput));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.auth.login(req.body as LoginInput));
    } catch (error) {
      next(error);
    }
  };
}
