import { ZodError } from "zod";

/** Detalle de un error puntual (por ejemplo, un campo inválido). */
export interface ErrorDetail {
  field?: string;
  message: string;
}

/** Error de aplicación con código HTTP. El middleware global lo convierte en JSON. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors: ErrorDetail[] = [],
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message = "Solicitud inválida", errors: ErrorDetail[] = []) {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = "No autenticado") {
    return new AppError(401, message);
  }

  static forbidden(message = "No tienes permisos para realizar esta acción") {
    return new AppError(403, message);
  }

  static notFound(message = "Recurso no encontrado") {
    return new AppError(404, message);
  }

  static conflict(message = "Conflicto con el estado actual del recurso") {
    return new AppError(409, message);
  }

  /** Convierte un error de Zod en un 400 con un detalle por cada campo inválido. */
  static fromZod(error: ZodError, message = "Datos de entrada inválidos") {
    return AppError.badRequest(
      message,
      error.issues.map((issue) => ({
        field: issue.path.length ? issue.path.map(String).join(".") : undefined,
        message: issue.message,
      })),
    );
  }
}
