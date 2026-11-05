import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { Rol } from "../modules/user/user.types";

/** Permite el paso solo a los roles indicados. Debe ir después de authenticate. */
export const authorize =
  (...roles: Rol[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth) throw AppError.unauthorized();
    if (!roles.includes(req.auth.rol)) throw AppError.forbidden();
    next();
  };
