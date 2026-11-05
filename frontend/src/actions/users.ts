"use server";

import { refresh } from "next/cache";
import { api, ApiError } from "@/lib/api";
import type { FormState, Rol, Usuario } from "@/lib/types";

/** Cambia el rol de un usuario (solo admin). */
export async function cambiarRol(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const rol = String(formData.get("rol") ?? "") as Rol;
  try {
    await api<Usuario>(`/users/${id}/rol`, { method: "PATCH", auth: true, body: { rol } });
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message };
    throw e;
  }
  refresh(); // vuelve a pedir la lista para mostrar el rol nuevo
  return { message: undefined };
}
