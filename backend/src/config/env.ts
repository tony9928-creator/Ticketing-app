import "dotenv/config";

const HINT = "Copia .env.example a .env y completa los valores (ver README)";

/** Devuelve la primera variable definida y no vacía, o lanza un error claro en español. */
function required(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(`Falta la variable de entorno ${names[0]}. ${HINT}`);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  // MONGODB_URI se acepta como alternativa a MONGO_URI.
  mongoUri: required("MONGO_URI", "MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  /** Minutos que una reserva PENDING mantiene bloqueado el stock (admite decimales). */
  bookingHoldMinutes: Number(process.env.BOOKING_HOLD_MINUTES || 5),
  /** Cada cuántos segundos se buscan reservas vencidas para devolver su stock. */
  expirationSweepSeconds: Number(process.env.EXPIRATION_SWEEP_SECONDS || 30),
};
