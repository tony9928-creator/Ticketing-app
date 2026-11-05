"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";

interface Props {
  /** [latitud, longitud] (formato Leaflet) o null si todavía no se eligió. */
  punto: [number, number] | null;
  onChange: (punto: [number, number]) => void;
}

/** Escucha los clics sobre el mapa. useMapEvents solo funciona dentro de <MapContainer>. */
function ClickHandler({ onChange }: Pick<Props, "onChange">) {
  useMapEvents({
    click: (e) => onChange([Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))]),
  });
  return null;
}

/** Centro inicial: Corrientes (de donde son la mayoría de los eventos de ejemplo). */
const CENTRO: [number, number] = [-27.4698, -58.8306];

export default function LocationPickerInner({ punto, onChange }: Props) {
  return (
    <MapContainer center={punto ?? CENTRO} zoom={13} className="h-full w-full cursor-crosshair">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      {punto && (
        <CircleMarker center={punto} radius={11} pathOptions={{ color: "#fff", weight: 3, fillColor: "#ff5a36", fillOpacity: 1 }} />
      )}
    </MapContainer>
  );
}
