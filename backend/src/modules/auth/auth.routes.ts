import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

/** Montado en /api/auth */
export function createAuthRouter(auth: AuthController) {
  const router = Router();

  router.post("/register", validate({ body: registerSchema }), auth.register);
  router.post("/login", validate({ body: loginSchema }), auth.login);

  return router;
}
