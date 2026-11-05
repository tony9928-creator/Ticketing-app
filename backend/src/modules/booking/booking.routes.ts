import { RequestHandler, Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { idParamSchema } from "../../utils/validation";
import { BookingController } from "./booking.controller";
import { createBookingSchema } from "./booking.validation";

/** Montado en /api/bookings. Todas las rutas requieren token. */
export function createBookingRouter(bookings: BookingController, protect: RequestHandler) {
  const router = Router();
  router.use(protect);

  router.get("/me", bookings.listMine);
  router.post("/", validate({ body: createBookingSchema }), bookings.create);
  // La regla "solo el dueño" se valida en el servicio.
  router.post("/:id/pay", validate({ params: idParamSchema }), bookings.pay);

  return router;
}
