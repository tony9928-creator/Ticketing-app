import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("error", (err) => console.error("Error de MongoDB:", err));
  mongoose.connection.on("disconnected", () => console.warn("MongoDB desconectado"));

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  // Asegura que los índices únicos (email, reserva activa) existan antes de atender tráfico.
  await mongoose.syncIndexes();
  console.log("MongoDB conectado");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
