import "server-only";
import { notFound, redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { getSessionUser, type SessionUser } from "./session";
import type { Evento, Reserva, Rol, Ticket, Usuario } from "./types";

/**
 * Capa de acceso a datos: todas las lecturas de la API que usan las páginas.
 * Las escrituras (reservar, pagar, crear evento...) están en src/actions.
 */

// ---------- Sesión y permisos ----------

/**
 * Devuelve el usuario logueado o lo manda al login (volviendo después a `volverA`).
 * Si se pasan roles y el usuario no tiene ninguno, devuelve null para mostrar "sin permiso".
 */
export async function requireUser(volverA: string, roles?: Rol[]): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(volverA)}`);
  if (roles && !roles.includes(user.rol)) return null;
  return user;
}

// ---------- Eventos (públicos) ----------

export interface FiltrosEventos {
  ciudad?: string;
  titulo?: string;
  esLocal?: "true" | "false";
}

export async function getEventos(filtros: FiltrosEventos = {}): Promise<Evento[]> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filtros)) if (v) params.set(k, v);
  const query = params.size ? `?${params}` : "";
  const eventos = await api<Evento[]>(`/events${query}`);
  // Próximos primero.
  return eventos.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** Un evento por id. Si no existe (o el id no es válido) muestra la página 404. */
export async function getEvento(id: string): Promise<Evento> {
  try {
    return await api<Evento>(`/events/${id}`);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    throw e;
  }
}

/** Varios eventos a la vez; los que ya no existen se omiten. */
async function getEventosPorId(ids: string[]): Promise<Map<string, Evento>> {
  const unicos = [...new Set(ids)];
  const resultados = await Promise.allSettled(unicos.map((id) => api<Evento>(`/events/${id}`)));
  const mapa = new Map<string, Evento>();
  resultados.forEach((r) => r.status === "fulfilled" && mapa.set(r.value.id, r.value));
  return mapa;
}

// ---------- Reservas y tickets (del usuario logueado) ----------

export const getMisReservas = () => api<Reserva[]>("/bookings/me", { auth: true });

export const getMisTicketsRaw = () => api<Ticket[]>("/tickets/me", { auth: true });

/** Una reserva propia con su evento, o 404 si no es del usuario. */
export async function getReservaConEvento(id: string) {
  const reserva = (await getMisReservas()).find((r) => r.id === id);
  if (!reserva) notFound();
  const evento = await getEvento(reserva.id_evento);
  return { reserva, evento };
}

export interface TicketDetalle {
  ticket: Ticket;
  reserva?: Reserva;
  evento?: Evento;
}

/**
 * La API devuelve los tickets sin datos del evento (ticket -> reserva -> evento),
 * así que acá se "unen" las tres colecciones para mostrarlas juntas.
 */
export async function getMisTickets(): Promise<{ tickets: TicketDetalle[]; pendientes: TicketPendiente[] }> {
  const [tickets, reservas] = await Promise.all([getMisTicketsRaw(), getMisReservas()]);
  const reservaPorId = new Map(reservas.map((r) => [r.id, r]));

  const ahora = Date.now();
  const reservasPendientes = reservas.filter(
    (r) => r.estado === "PENDING" && new Date(r.expiresAt).getTime() > ahora,
  );

  const eventos = await getEventosPorId([
    ...tickets.map((t) => reservaPorId.get(t.id_reserva)?.id_evento ?? ""),
    ...reservasPendientes.map((r) => r.id_evento),
  ].filter(Boolean));

  return {
    tickets: tickets.map((ticket) => {
      const reserva = reservaPorId.get(ticket.id_reserva);
      return { ticket, reserva, evento: reserva ? eventos.get(reserva.id_evento) : undefined };
    }),
    pendientes: reservasPendientes.map((reserva) => ({ reserva, evento: eventos.get(reserva.id_evento) })),
  };
}

export interface TicketPendiente {
  reserva: Reserva;
  evento?: Evento;
}

/** Un ticket propio con su reserva y evento. */
export async function getTicketDetalle(id: string): Promise<TicketDetalle> {
  let ticket: Ticket;
  try {
    ticket = await api<Ticket>(`/tickets/${id}`, { auth: true });
  } catch (e) {
    if (e instanceof ApiError && [400, 403, 404].includes(e.status)) notFound();
    throw e;
  }
  const reserva = (await getMisReservas()).find((r) => r.id === ticket.id_reserva);
  const evento = reserva ? await getEvento(reserva.id_evento) : undefined;
  return { ticket, reserva, evento };
}

/** El ticket emitido para una reserva (si ya se pagó). */
export async function getTicketDeReserva(reservaId: string) {
  return (await getMisTicketsRaw()).find((t) => t.id_reserva === reservaId);
}

// ---------- Administración ----------

export const getUsuarios = () => api<Usuario[]>("/users", { auth: true });
