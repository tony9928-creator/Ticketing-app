"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

/**
 * Mapa con OpenStreetMap (gratis, sin clave de API).
 * Se usa CircleMarker en vez del pin por defecto de Leaflet, que necesita imágenes
 * que los bundlers no copian bien.
 */
export default function MapInner({ coordenadas, label }: { coordenadas: [number, number]; label: string }) {
  const [lng, lat] = coordenadas; // la API guarda [lng, lat]; Leaflet pide [lat, lng]
  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={11}
        pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#ff5a36", fillOpacity: 1 }}
      >
        <Popup>{label}</Popup>
      </CircleMarker>
    </MapContainer>
  );
}
