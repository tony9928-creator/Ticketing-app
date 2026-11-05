import "server-only";
import { redirect } from "next/navigation";
import { getToken } from "./session";
import type { ApiErrorBody } from "./types";

/**
 * Cliente de la API. Solo corre en el servidor de Next (Server Components y Server Actions),
 * así el navegador nunca habla directo con el backend: no hace falta CORS y el token
 * nunca queda expuesto al JavaScript de la página.
 */
const API_URL = process.env.API_URL ?? "http://localhost:3000/api";

/** Error de la API con el status HTTP y los errores por campo, listo para mostrar en formularios. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Options {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** true: envía el JWT de la sesión. Si la API responde 401, se cierra la sesión. */
  auth?: boolean;
}

export async function api<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (!token) redirect("/login");
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(503, "No se pudo conectar con la API. ¿Está corriendo el backend (npm run dev en backend/)?");
  }

  // Token vencido o inválido: /salir borra las cookies y lleva al login.
  if (auth && res.status === 401) redirect("/salir");

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data as ApiErrorBody | null;
    const fieldErrors: Record<string, string> = {};
    for (const e of err?.errors ?? []) {
      // "ubicacion.ciudad" -> "ciudad"; nos quedamos con el primer error de cada campo.
      const key = e.field?.split(".").filter((p) => Number.isNaN(Number(p))).pop();
      if (key && !fieldErrors[key]) fieldErrors[key] = e.message;
    }
    throw new ApiError(res.status, err?.message ?? `Error ${res.status}`, fieldErrors);
  }

  return data as T;
}
