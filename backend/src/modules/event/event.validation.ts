import { z } from "zod";

export const createEventSchema = z.object({
  titulo: z.string().trim().min(3, "Mínimo 3 caracteres").max(120, "Máximo 120 caracteres"),
  descripcion: z.string().trim().max(2000, "Máximo 2000 caracteres").default(""),
  fecha: z.coerce
    .date("Debe ser una fecha válida (ISO 8601)")
    .refine((d) => d.getTime() > Date.now(), "Debe ser una fecha futura"),
  ubicacion: z.object({
    nombreLugar: z.string().trim().min(2, "Mínimo 2 caracteres").max(120),
    ciudad: z.string().trim().min(2, "Mínimo 2 caracteres").max(80),
    coordenadas: z.tuple(
      [
        z.number("Longitud inválida").min(-180, "Longitud entre -180 y 180").max(180, "Longitud entre -180 y 180"),
        z.number("Latitud inválida").min(-90, "Latitud entre -90 y 90").max(90, "Latitud entre -90 y 90"),
      ],
      "Las coordenadas deben ser [longitud, latitud]",
    ),
  }),
  esLocal: z.boolean("Debe ser true o false").default(true),
  precio: z.number("Debe ser un número").min(0, "El precio no puede ser negativo"),
  stockDisponible: z.number("Debe ser un número").int("Debe ser entero").min(0).max(1_000_000),
});

/** Filtros de GET /api/events?ciudad=&titulo=&esLocal= */
export const eventQuerySchema = z.object({
  ciudad: z.string().trim().min(1).max(80).optional(),
  titulo: z.string().trim().min(1).max(120).optional(),
  esLocal: z
    .enum(["true", "false"], "Debe ser true o false")
    .transform((v) => v === "true")
    .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type EventQuery = z.infer<typeof eventQuerySchema>;
