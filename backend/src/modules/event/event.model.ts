import { model, Schema } from "mongoose";
import { Event } from "./event.types";

/** En la base las coordenadas se guardan como number[]; el dominio las tipa como [lng, lat]. */
export type EventDoc = Omit<Event, "id" | "ubicacion"> & {
  ubicacion: { nombreLugar: string; ciudad: string; coordenadas: number[] };
};

const eventSchema = new Schema<EventDoc>(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    fecha: { type: Date, required: true, index: true },
    ubicacion: {
      type: new Schema(
        {
          nombreLugar: { type: String, required: true, trim: true },
          ciudad: { type: String, required: true, trim: true },
          coordenadas: {
            type: [Number],
            required: true,
            validate: {
              validator: (v: number[]) => v.length === 2,
              message: "Las coordenadas deben ser [longitud, latitud]",
            },
          },
        },
        { _id: false },
      ),
      required: true,
    },
    esLocal: { type: Boolean, default: true },
    precio: { type: Number, required: true, min: 0 },
    // El min: 0 es la última red de seguridad: el stock nunca puede quedar negativo.
    stockDisponible: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const EventModel = model<EventDoc>("Event", eventSchema);
