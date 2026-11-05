"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { createSession, deleteSession } from "@/lib/session";
import type { AuthResponse, FormState } from "@/lib/types";

/**
 * Server Actions de autenticación. Corren en el servidor: el formulario las llama
 * directamente (sin escribir fetch), y acá se habla con la API y se guarda la cookie.
 */

/** Solo se permite volver a rutas internas ("/algo"), nunca a otro sitio. */
function destinoSeguro(next: FormDataEntryValue | null) {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const { token, user } = await api<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });
    await createSession(token, user);
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message, fieldErrors: e.fieldErrors, values: { email } };
    throw e;
  }
  // redirect va fuera del try: funciona lanzando una excepción especial que no hay que atrapar.
  redirect(destinoSeguro(formData.get("next")));
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const nombre = String(formData.get("nombre") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password !== formData.get("confirmar")) {
    return { fieldErrors: { confirmar: "Las contraseñas no coinciden" }, values: { nombre, email } };
  }

  try {
    const { token, user } = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: { nombre, email, password },
    });
    await createSession(token, user);
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message, fieldErrors: e.fieldErrors, values: { nombre, email } };
    throw e;
  }
  redirect(destinoSeguro(formData.get("next")));
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
