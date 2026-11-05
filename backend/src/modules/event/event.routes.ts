import { RequestHandler, Router } from "express";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { idParamSchema } from "../../utils/validation";
import { EventController } from "./event.controller";
import { createEventSchema } from "./event.validation";

/** Montado en /api/events */
export function createEventRouter(events: EventController, protect: RequestHandler) {
  const router = Router();

  // Públicas: cualquiera puede ver la cartelera y la disponibilidad.
  router.get("/", events.list);
  router.get("/:id", validate({ params: idParamSchema }), events.get);

  router.post("/", protect, authorize("admin", "organizer"), validate({ body: createEventSchema }), events.create);

  return router;
}
