import { RequestHandler } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
}

/** Valida params y/o body con Zod antes del controlador. El body se reemplaza por el valor ya parseado. */
export const validate =
  ({ body, params }: Schemas): RequestHandler =>
  (req, _res, next) => {
    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) throw AppError.fromZod(result.error, "Parámetros de ruta inválidos");
    }
    if (body) {
      const result = body.safeParse(req.body ?? {});
      if (!result.success) throw AppError.fromZod(result.error);
      req.body = result.data;
    }
    next();
  };
