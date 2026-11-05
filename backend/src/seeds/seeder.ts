import bcrypt from "bcrypt";
import { connectDatabase, disconnectDatabase } from "../config/database";
import { env } from "../config/env";
import { BookingModel } from "../modules/booking/booking.model";
import { EventModel } from "../modules/event/event.model";
import { TicketModel } from "../modules/ticket/ticket.model";
import { UserModel } from "../modules/user/user.model";
import { Rol } from "../modules/user/user.types";

const SEED_PASSWORD = "Tickets2026";

const USERS: { nombre: string; email: string; rol: Rol }[] = [
  { nombre: "Admin Tickets", email: "admin@tickets.io", rol: "admin" },
  { nombre: "Marcos Organizador", email: "organizer@tickets.io", rol: "organizer" },
  { nombre: "Lucía Compradora", email: "lucia@tickets.io", rol: "user" },
  { nombre: "Tomás Comprador", email: "tomas@tickets.io", rol: "user" },
];

/** Fecha futura: dentro de `days` días a las `hour` horas (hora de Corrientes, UTC-3). */
function futureDate(days: number, hour: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour + 3, 0, 0, 0);
  return date;
}

async function seed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("El seeder no se ejecuta con NODE_ENV=production");
  }
  await connectDatabase();

  console.log("Limpiando colecciones...");
  await Promise.all([
    TicketModel.deleteMany({}),
    BookingModel.deleteMany({}),
    EventModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  const password = await bcrypt.hash(SEED_PASSWORD, env.saltRounds);
  await UserModel.insertMany(USERS.map((u) => ({ ...u, password })));

  await EventModel.insertMany([
    {
      titulo: "Noche de Chamamé",
      descripcion: "Los mejores referentes del chamamé en una sola noche.",
      fecha: futureDate(10, 21),
      ubicacion: { nombreLugar: "Teatro Vera", ciudad: "Corrientes", coordenadas: [-58.8306, -27.4698] },
      esLocal: true,
      precio: 12000,
      stockDisponible: 200,
    },
    {
      titulo: "Festival Rock del Litoral",
      descripcion: "Bandas del litoral en el anfiteatro.",
      fecha: futureDate(25, 20),
      ubicacion: { nombreLugar: "Anfiteatro Cocomarola", ciudad: "Corrientes", coordenadas: [-58.8197, -27.4833] },
      esLocal: true,
      precio: 18000,
      stockDisponible: 500,
    },
    {
      titulo: "Gira Nacional de Stand Up",
      descripcion: "Función única en Buenos Aires. Alojamiento y transporte por cuenta del asistente.",
      fecha: futureDate(40, 21),
      ubicacion: { nombreLugar: "Teatro Gran Rex", ciudad: "Buenos Aires", coordenadas: [-58.3816, -34.6037] },
      esLocal: false,
      precio: 25000,
      stockDisponible: 100,
    },
    {
      // Pocas entradas a propósito: sirve para probar el control de stock.
      titulo: "Concierto Íntimo (cupo reducido)",
      descripcion: "Solo 5 entradas: ideal para probar el control de stock.",
      fecha: futureDate(15, 22),
      ubicacion: { nombreLugar: "Salón Dorado", ciudad: "Corrientes", coordenadas: [-58.8341, -27.4712] },
      esLocal: true,
      precio: 9000,
      stockDisponible: 5,
    },
  ]);

  console.log(`\nCargados: ${USERS.length} usuarios y 4 eventos.`);
  console.log(`\nUsuarios de ejemplo (contraseña de todos: ${SEED_PASSWORD})`);
  console.table(USERS.map(({ nombre, email, rol }) => ({ nombre, email, rol })));
}

seed()
  .then(() => disconnectDatabase())
  .catch(async (error) => {
    console.error("No se pudo ejecutar el seeder:", error);
    await disconnectDatabase().catch(() => undefined);
    process.exit(1);
  });
