import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

/** Rutas inexistentes -> 404 con el formato estándar. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

/** express.json() marca así un body que no es JSON válido. */
const isMalformedJson = (err: unknown) =>
  err instanceof SyntaxError && (err as SyntaxError & { type?: string }).type === "entity.parse.failed";

function toAppError(err: unknown): AppError | undefined {
  if (err instanceof AppError) return err;
  if (err instanceof ZodError) return AppError.fromZod(err);
  if (isMalformedJson(err)) return AppError.badRequest("El cuerpo de la petición no es un JSON válido");
  return undefined;
}

/**
 * Manejador global de errores. Todas las respuestas de error tienen la forma:
 * { "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }
 */
export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  const appError = toAppError(err);
  if (appError) {
    res.status(appError.status).json({ success: false, message: appError.message, errors: appError.errors });
    return;
  }
  console.error("Error no controlado:", err);
  res.status(500).json({ success: false, message: "Error interno del servidor", errors: [] });
};
