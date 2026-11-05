import { RequestHandler } from "express";

/** Registra cada petición al terminar: [MÉTODO] URL - status - tiempo de respuesta. */
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${ms.toFixed(1)} ms`);
  });
  next();
};
