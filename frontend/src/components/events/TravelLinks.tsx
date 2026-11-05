import type { Evento } from "@/lib/types";

/**
 * "Alojamiento y Transporte": se muestra solo si el evento NO es local (esLocal = false).
 * Son enlaces de búsqueda a sitios externos con la ciudad ya cargada; no requieren claves.
 */
export function TravelLinks({ evento }: { evento: Evento }) {
  const ciudad = encodeURIComponent(evento.ubicacion.ciudad);
  const [lng, lat] = evento.ubicacion.coordenadas;

  const links = [
    { titulo: "Hoteles", detalle: "Booking.com", href: `https://www.booking.com/searchresults.html?ss=${ciudad}`, icono: "🏨" },
    { titulo: "Alquileres", detalle: "Airbnb", href: `https://www.airbnb.com.ar/s/${ciudad}/homes`, icono: "🏠" },
    { titulo: "Vuelos", detalle: "Google Flights", href: `https://www.google.com/travel/flights?q=vuelos%20a%20${ciudad}`, icono: "✈️" },
    { titulo: "Cómo llegar", detalle: "Google Maps", href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, icono: "🧭" },
  ];

  return (
    <section className="rounded-3xl border border-line bg-card p-6">
      <h2 className="font-display text-xl font-semibold">Alojamiento y Transporte</h2>
      <p className="mt-1 text-sm text-muted">
        Este evento es en {evento.ubicacion.ciudad}. Organizá tu viaje:
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <a
            key={l.titulo}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 transition hover:border-accent hover:bg-accent-soft/40"
          >
            <span className="text-2xl" aria-hidden>
              {l.icono}
            </span>
            <span>
              <span className="block font-semibold">{l.titulo}</span>
              <span className="text-sm text-muted">{l.detalle} ↗</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
