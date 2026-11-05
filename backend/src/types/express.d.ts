import { Actor } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      /** Usuario autenticado, lo completa el middleware authenticate. */
      auth?: Actor;
    }
  }
}

export {};
