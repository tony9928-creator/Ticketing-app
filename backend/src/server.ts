import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { startExpirationJob } from "./jobs/expiration.job";

async function main() {
  await connectDatabase();
  const { app, bookingService } = createApp();
  const stopJob = startExpirationJob(bookingService, env.expirationSweepSeconds);

  const server = app.listen(env.port, () => {
    console.log(`Ticket API escuchando en http://localhost:${env.port}/api`);
    console.log(`Reservas: ${env.bookingHoldMinutes} min de bloqueo, revisión cada ${env.expirationSweepSeconds} s`);
  });

  const shutdown = () => {
    stopJob();
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("No se pudo iniciar la API:", err);
  process.exit(1);
});
