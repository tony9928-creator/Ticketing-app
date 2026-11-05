import { ZONA_HORARIA } from "./config";

const precio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** 12000 -> "$ 12.000" */
export const formatPrecio = (valor: number) => precio.format(valor);

const fechaLarga = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: ZONA_HORARIA,
});

const hora = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: ZONA_HORARIA,
});

/** "sábado, 15 de noviembre de 2026" */
export const formatFecha = (iso: string) => fechaLarga.format(new Date(iso));

/** "21:00" */
export const formatHora = (iso: string) => hora.format(new Date(iso));

const partes = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  weekday: "short",
  timeZone: ZONA_HORARIA,
});

/** Partes sueltas para el "bloque de fecha" de las tarjetas: { dia: "15", mes: "nov", semana: "sáb" } */
export function partesFecha(iso: string) {
  const p = Object.fromEntries(partes.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return {
    dia: p.day ?? "",
    mes: (p.month ?? "").replace(".", ""),
    semana: (p.weekday ?? "").replace(".", ""),
  };
}

/** "Lucía Compradora" -> "LC" */
export const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
