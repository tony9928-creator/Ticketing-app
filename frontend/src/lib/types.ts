/**
 * Tipos de los datos que devuelve la API (backend/src/modules/*.types.ts).
 * Las fechas llegan como texto ISO porque viajan en JSON.
 */

export type Rol = "user" | "admin" | "organizer";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  createdAt: string;
}

export interface Ubicacion {
  nombreLugar: string;
  ciudad: string;
  /** [longitud, latitud]: el orden de MongoDB. Leaflet usa [latitud, longitud]. */
  coordenadas: [number, number];
}

/** Se llama Evento (y no Event) para no chocar con el Event del navegador. */
export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: Ubicacion;
  /** false = evento en otra ciudad: se muestra "Alojamiento y Transporte". */
  esLocal: boolean;
  precio: number;
  stockDisponible: number;
  createdAt: string;
}

export type EstadoReserva = "PENDING" | "COMPLETED" | "EXPIRED";

export interface Reserva {
  id: string;
  id_usuario: string;
  id_evento: string;
  cantidad: number;
  estado: EstadoReserva;
  /** Hasta cuándo se mantiene bloqueado el stock si no se paga. */
  expiresAt: string;
  createdAt: string;
}

export type EstadoTicket = "ACTIVO" | "USADO" | "CANCELADO";

/** Un ticket por reserva: vale por la `cantidad` de entradas de esa reserva. */
export interface Ticket {
  id: string;
  id_reserva: string;
  codigoQR: string;
  estado: EstadoTicket;
  montoPagado: number;
  fechaCompra: string;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
}

export interface PagoResponse {
  booking: Reserva;
  ticket: Ticket;
}

/** Formato de error único del backend. */
export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: { field?: string; message: string }[];
}

/** Estado que devuelven los formularios que usan Server Actions. */
export type FormState =
  | {
      message?: string;
      /** Errores por campo: { email: "Email inválido" } */
      fieldErrors?: Record<string, string>;
      /** Lo que escribió el usuario, para no perderlo si hay un error. */
      values?: Record<string, string>;
    }
  | undefined;
