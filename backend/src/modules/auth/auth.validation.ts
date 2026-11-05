import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres"),
  email: z.string().trim().toLowerCase().pipe(z.email("Email inválido")),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72, "Máximo 72 caracteres (límite de bcrypt)")
    .regex(/[A-Za-z]/, "Debe contener al menos una letra")
    .regex(/\d/, "Debe contener al menos un número"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Email inválido")),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
