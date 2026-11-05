"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import { crearEvento } from "@/actions/events";
import { Alert } from "../ui/Alert";
import { Field, inputClass } from "../ui/Field";
import { SubmitButton } from "../ui/SubmitButton";

// El mapa solo existe en el navegador (Leaflet usa window).
const LocationPicker = dynamic(() => import("../map/LocationPickerInner"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-line/60" />,
});

/** Formulario para crear un evento. La ubicación se elige con un clic en el mapa. */
export function EventForm() {
  const [state, action] = useActionState(crearEvento, undefined);
  const v = state?.values ?? {};
  const err = state?.fieldErrors ?? {};

  const inicial = v.lat && v.lng ? ([Number(v.lat), Number(v.lng)] as [number, number]) : null;
  const [punto, setPunto] = useState<[number, number] | null>(inicial);

  return (
    <form action={action} className="space-y-8">
      {state?.message && <Alert tone="error">{state.message}</Alert>}

      <Seccion titulo="El evento">
        <Field label="Título" name="titulo" required minLength={3} maxLength={120} defaultValue={v.titulo} error={err.titulo} />
        <div>
          <label htmlFor="f-descripcion" className="mb-1.5 block text-sm font-medium">
            Descripción
          </label>
          <textarea id="f-descripcion" name="descripcion" rows={4} maxLength={2000} defaultValue={v.descripcion} className={inputClass} />
          {err.descripcion && <p className="mt-1.5 text-sm text-danger">{err.descripcion}</p>}
        </div>
        <Field label="Fecha y hora" name="fecha" type="datetime-local" required defaultValue={v.fecha} error={err.fecha} hint="Hora de Argentina." />
      </Seccion>

      <Seccion titulo="Lugar">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del lugar" name="nombreLugar" required defaultValue={v.nombreLugar} error={err.nombreLugar} />
          <Field label="Ciudad" name="ciudad" required defaultValue={v.ciudad} error={err.ciudad} />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium">Ubicación en el mapa</p>
          <div className="h-72 overflow-hidden rounded-2xl border border-line">
            <LocationPicker punto={punto} onChange={setPunto} />
          </div>
          <p className={`mt-1.5 text-sm ${err.coordenadas ? "text-danger" : "text-muted"}`}>
            {err.coordenadas ?? (punto ? `Lat ${punto[0]} · Lng ${punto[1]}` : "Hacé clic en el mapa para marcar el lugar.")}
          </p>
          <input type="hidden" name="lat" value={punto?.[0] ?? ""} />
          <input type="hidden" name="lng" value={punto?.[1] ?? ""} />
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-line bg-card px-4 py-3">
          <input type="checkbox" name="esLocal" defaultChecked={state ? v.esLocal === "on" : true} className="mt-1 h-4 w-4 accent-accent" />
          <span>
            <span className="block font-medium">Es un evento local</span>
            <span className="text-sm text-muted">
              Desmarcalo si el público tiene que viajar: se mostrará “Alojamiento y Transporte”.
            </span>
          </span>
        </label>
      </Seccion>

      <Seccion titulo="Entradas">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Precio (ARS)" name="precio" type="number" min={0} step={1} required defaultValue={v.precio} error={err.precio} />
          <Field label="Cantidad disponible" name="stockDisponible" type="number" min={0} step={1} required defaultValue={v.stockDisponible} error={err.stockDisponible} />
        </div>
      </Seccion>

      <SubmitButton disabled={!punto} pendingText="Publicando…" className="w-full sm:w-auto">
        Publicar evento
      </SubmitButton>
    </form>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-3xl border border-line bg-card p-6">
      <legend className="px-2 font-display text-lg font-semibold">{titulo}</legend>
      {children}
    </fieldset>
  );
}
