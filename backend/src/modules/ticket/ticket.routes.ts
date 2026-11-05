import { RequestHandler, Router } from "express";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { idParamSchema } from "../../utils/validation";
import { TicketController } from "./ticket.controller";
import { validateTicketSchema } from "./ticket.validation";

/** Montado en /api/tickets. Todas las rutas requieren token. */
export function createTicketRouter(tickets: TicketController, protect: RequestHandler) {
  const router = Router();
  router.use(protect);

  router.get("/me", tickets.listMine);
  // Control de acceso en la puerta del evento: va antes de "/:id" para no confundirse con un id.
  router.post("/validate", authorize("admin", "organizer"), validate({ body: validateTicketSchema }), tickets.validate);
  router.get("/:id", validate({ params: idParamSchema }), tickets.get);

  return router;
}
