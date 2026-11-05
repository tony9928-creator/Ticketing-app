import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { AuthService } from "../modules/auth/auth.service";

/** Exige "Authorization: Bearer <token>", verifica el JWT y deja el usuario en req.auth. */
export const authenticate =
  (authService: AuthService): RequestHandler =>
  (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw AppError.unauthorized("Falta el token Bearer");
    const payload = authService.verify(header.slice(7));
    req.auth = { userId: payload.sub, rol: payload.rol };
    next();
  };
