"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Evento, FormState } from "@/lib/types";

/** Crea un evento (solo admin u organizer: lo controla la API). */
export async function crearEvento(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string") as [string, string][],
  );

  // <input type="datetime-local"> manda "2026-12-01T21:00" sin zona horaria:
  // se interpreta como hora de Argentina (UTC-3) para que no dependa del servidor.
  const fecha = values.fecha ? new Date(`${values.fecha}:00-03:00`) : null;

  const body = {
    titulo: values.titulo,
    descripcion: values.descripcion ?? "",
    fecha: fecha && !Number.isNaN(fecha.getTime()) ? fecha.toISOString() : values.fecha,
    ubicacion: {
      nombreLugar: values.nombreLugar,
      ciudad: values.ciudad,
      coordenadas: [Number(values.lng), Number(values.lat)],
    },
    esLocal: values.esLocal === "on",
    precio: Number(values.precio),
    stockDisponible: Number(values.stockDisponible),
  };

  let evento: Evento;
  try {
    evento = await api<Evento>("/events", { method: "POST", auth: true, body });
  } catch (e) {
    if (e instanceof ApiError) return { message: e.message, fieldErrors: e.fieldErrors, values };
    throw e;
  }
  redirect(`/eventos/${evento.id}`);
}
