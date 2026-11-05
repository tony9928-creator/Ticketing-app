import { PublicUser, Rol } from "../user/user.types";

/** Usuario que realiza la petición (sale del JWT). */
export interface Actor {
  userId: string;
  rol: Rol;
}

/** Contenido del JWT: solo el id (sub) y el rol, sin datos sensibles. */
export interface TokenPayload {
  sub: string;
  rol: Rol;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}
