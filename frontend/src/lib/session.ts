import "server-only";
import { cookies } from "next/headers";
import type { Usuario } from "./types";

/**
 * Sesión del usuario guardada en dos cookies httpOnly (el JavaScript del navegador no puede leerlas):
 * - TOKEN_COOKIE: el JWT que entrega la API. Se reenvía en cada petición protegida.
 * - USER_COOKIE: nombre y rol, para dibujar el menú sin consultar la API.
 *
 * Ojo: la cookie del usuario solo sirve para la interfaz. Quien de verdad controla
 * permisos es la API, que verifica la firma del JWT en cada petición.
 */
export const TOKEN_COOKIE = "tk_token";
const USER_COOKIE = "tk_user";

export type SessionUser = Pick<Usuario, "id" | "nombre" | "email" | "rol">;

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw || !store.has(TOKEN_COOKIE)) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Segundos que le quedan al JWT (lee el campo `exp`, sin verificar la firma). */
function segundosRestantes(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (typeof payload.exp === "number") return Math.max(payload.exp - Math.floor(Date.now() / 1000), 0);
  } catch {
    // Si no se puede leer, se usa el valor por defecto.
  }
  return 60 * 60 * 24;
}

export async function createSession(token: string, user: Usuario) {
  const store = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: segundosRestantes(token),
  };
  const { id, nombre, email, rol } = user;
  store.set(TOKEN_COOKIE, token, options);
  store.set(USER_COOKIE, JSON.stringify({ id, nombre, email, rol }), options);
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}
