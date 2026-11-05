import express from "express";
import { authenticate } from "./middlewares/auth.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { AuthController } from "./modules/auth/auth.controller";
import { createAuthRouter } from "./modules/auth/auth.routes";
import { AuthService } from "./modules/auth/auth.service";
import { BookingController } from "./modules/booking/booking.controller";
import { MongoBookingRepository } from "./modules/booking/booking.repository";
import { createBookingRouter } from "./modules/booking/booking.routes";
import { BookingService } from "./modules/booking/booking.service";
import { EventController } from "./modules/event/event.controller";
import { MongoEventRepository } from "./modules/event/event.repository";
import { createEventRouter } from "./modules/event/event.routes";
import { EventService } from "./modules/event/event.service";
import { TicketController } from "./modules/ticket/ticket.controller";
import { MongoTicketRepository } from "./modules/ticket/ticket.repository";
import { createTicketRouter } from "./modules/ticket/ticket.routes";
import { TicketService } from "./modules/ticket/ticket.service";
import { UserController } from "./modules/user/user.controller";
import { MongoUserRepository } from "./modules/user/user.repository";
import { createUserRouter } from "./modules/user/user.routes";
import { UserService } from "./modules/user/user.service";

export function createApp() {
  // Composición de dependencias: repositorios -> servicios -> controladores -> rutas
  const userRepo = new MongoUserRepository();
  const eventRepo = new MongoEventRepository();
  const bookingRepo = new MongoBookingRepository();
  const ticketRepo = new MongoTicketRepository();

  const authService = new AuthService(userRepo);
  const bookingService = new BookingService(bookingRepo, eventRepo, ticketRepo);
  const protect = authenticate(authService);

  const app = express();
  app.use(requestLogger);
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", createAuthRouter(new AuthController(authService)));
  app.use("/api/users", createUserRouter(new UserController(new UserService(userRepo)), protect));
  app.use("/api/events", createEventRouter(new EventController(new EventService(eventRepo)), protect));
  app.use("/api/bookings", createBookingRouter(new BookingController(bookingService), protect));
  app.use(
    "/api/tickets",
    createTicketRouter(new TicketController(new TicketService(ticketRepo, bookingRepo)), protect),
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  // bookingService se devuelve para que server.ts arranque el job de expiración.
  return { app, bookingService };
}
