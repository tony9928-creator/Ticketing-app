import { z } from "zod";

/** Id de MongoDB (24 caracteres hexadecimales). */
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Id inválido");

export const idParamSchema = z.object({ id: objectId });

/** Escapa caracteres especiales para usar texto del usuario dentro de una RegExp. */
export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
