import { BookingService } from "../modules/booking/booking.service";

/**
 * Cada `everySeconds` busca reservas PENDING vencidas, las pasa a EXPIRED y repone su stock.
 * Devuelve una función para detenerlo (cierre ordenado del servidor).
 */
export function startExpirationJob(bookings: BookingService, everySeconds: number): () => void {
  let running = false;

  const timer = setInterval(async () => {
    if (running) return; // evita solapar ejecuciones si una tarda más que el intervalo
    running = true;
    try {
      const expired = await bookings.expireStale();
      if (expired > 0) console.log(`Reservas expiradas y stock repuesto: ${expired}`);
    } catch (error) {
      console.error("Error en el job de expiración:", error);
    } finally {
      running = false;
    }
  }, everySeconds * 1000);
  timer.unref();

  return () => clearInterval(timer);
}
