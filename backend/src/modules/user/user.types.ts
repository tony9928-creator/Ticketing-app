export const ROLES = ["user", "admin", "organizer"] as const;
export type Rol = (typeof ROLES)[number];

export const isRol = (value: unknown): value is Rol => ROLES.includes(value as Rol);

export interface User {
  id: string;
  nombre: string;
  email: string;
  /** Hash bcrypt, nunca la contraseña en claro. */
  password: string;
  rol: Rol;
  createdAt: Date;
}

/** Usuario sin datos sensibles, seguro para devolver en respuestas. */
export type PublicUser = Omit<User, "password">;

export type NewUser = Omit<User, "id" | "createdAt">;

export function toPublicUser({ password: _omit, ...rest }: User): PublicUser {
  return rest;
}
