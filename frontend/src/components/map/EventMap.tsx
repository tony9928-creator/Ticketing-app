"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet usa `window`, que no existe en el servidor. Por eso el mapa se carga
 * solo en el navegador (ssr: false) y mientras tanto se ve un recuadro gris.
 */
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-line/60" />,
});

/** coordenadas en el formato de la API: [longitud, latitud]. */
export function EventMap({ coordenadas, label }: { coordenadas: [number, number]; label: string }) {
  return (
    <div className="h-72 overflow-hidden rounded-3xl border border-line">
      <MapInner coordenadas={coordenadas} label={label} />
    </div>
  );
}
