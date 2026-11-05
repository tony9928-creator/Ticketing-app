/** Punto geográfico [longitud, latitud], el orden que usan MongoDB y los mapas (GeoJSON). */
export type Coordenadas = [longitud: number, latitud: number];

export interface Ubicacion {
  nombreLugar: string;
  ciudad: string;
  coordenadas: Coordenadas;
}

export interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  ubicacion: Ubicacion;
  /** false: el frontend muestra "Alojamiento y Transporte" con links externos. */
  esLocal: boolean;
  precio: number;
  stockDisponible: number;
  createdAt: Date;
}

export type NewEvent = Omit<Event, "id" | "createdAt">;

/** Filtros que entiende el repositorio. */
export interface EventFilters {
  ciudad?: string;
  titulo?: string;
  esLocal?: boolean;
}
