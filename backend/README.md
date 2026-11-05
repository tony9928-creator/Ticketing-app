# Ticket API

API REST para la venta de entradas de eventos (estilo Ticketmaster) con **reservas temporales** y **control estricto de stock**.
Node.js + TypeScript + Express 5 + MongoDB (Mongoose).

## Instalación

Requisitos: Node.js 20+ y una base MongoDB (local en tu PC o Atlas; ver `docs/MONGO-LOCAL.md` en la raíz del repo).

```bash
cd backend
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run seed              # BORRA y recrea los datos de ejemplo de la base configurada
npm run dev               # http://localhost:3000/api
```

| Variable | Obligatoria | Descripción |
|---|---|---|
| `MONGO_URI` | Sí | Cadena de conexión **terminada en el nombre de la base**. Local: `mongodb://127.0.0.1:27017/tickets`. Atlas: `mongodb+srv://USUARIO:CLAVE@CLUSTER.mongodb.net/tickets?...` |
| `JWT_SECRET` | Sí | Secreto para firmar los tokens |
| `PORT` | No | Puerto (por defecto `3000`) |
| `JWT_EXPIRES_IN` | No | Duración del token (por defecto `1d`) |
| `BCRYPT_SALT_ROUNDS` | No | Costo del hash (por defecto `10`) |
| `BOOKING_HOLD_MINUTES` | No | Minutos que una reserva bloquea el stock (por defecto `5`) |
| `EXPIRATION_SWEEP_SECONDS` | No | Cada cuánto se buscan reservas vencidas (por defecto `30`) |

Otros comandos: `npm run build`, `npm start`, `npm run typecheck`.

## Modelos

| Entidad | Campos |
|---|---|
| **User** | `nombre`, `email` (único), `password` (bcrypt), `rol`: `user` \| `admin` \| `organizer` (por defecto `user`) |
| **Event** | `titulo`, `descripcion`, `fecha`, `ubicacion {nombreLugar, ciudad, coordenadas [longitud, latitud]}`, `esLocal`, `precio`, `stockDisponible` |
| **Booking** | `id_usuario`, `id_evento`, `cantidad`, `estado`: `PENDING` \| `COMPLETED` \| `EXPIRED`, `expiresAt` |
| **Ticket** | `id_reserva` (único), `codigoQR` (único), `estado`: `ACTIVO` \| `USADO` \| `CANCELADO`, `montoPagado`, `fechaCompra` |

## Cómo funciona el stock

1. **Reservar** (`POST /api/bookings`): descuenta `stockDisponible` con una única operación atómica de MongoDB (`findOneAndUpdate` con filtro `stockDisponible >= cantidad` + `$inc`). Si no alcanza, responde `409` y no cambia nada. Así, aunque lleguen 20 compradores a la vez por 5 entradas, ganan exactamente 5.
2. La reserva queda `PENDING` con `expiresAt = ahora + BOOKING_HOLD_MINUTES`.
3. **Pagar** (`POST /api/bookings/:id/pay`, pago simulado): pasa la reserva a `COMPLETED` solo si sigue vigente (transición atómica) y emite el **ticket** con su `codigoQR`. Si dos pagos llegan a la vez, uno solo gana. `montoPagado = precio × cantidad`.
4. **Expiración:** si pasa `expiresAt` sin pago, la reserva pasa a `EXPIRED` y el stock se repone **una sola vez**. Lo hace un job periódico y, además, se liberan las vencidas antes de cada reserva nueva, para que el stock sea siempre exacto. Pagar una reserva vencida responde `409`.
5. **Control de acceso** (`POST /api/tickets/validate`): consume el QR (`ACTIVO` → `USADO`, atómico). El mismo código no puede entrar dos veces.

## Roles

| Acción | user | organizer | admin |
|---|---|---|---|
| Ver eventos (público) | ✅ | ✅ | ✅ |
| Crear evento | ❌ | ✅ | ✅ |
| Reservar, pagar y ver sus tickets | ✅ | ✅ | ✅ |
| Ver ticket ajeno | ❌ | ❌ | ✅ |
| Validar QR en puerta | ❌ | ✅ | ✅ |
| Listar usuarios y cambiar roles | ❌ | ❌ | ✅ |

El registro público siempre crea `user`.

## Endpoints (base `/api`)

🔒 = requiere `Authorization: Bearer <token>`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado |
| POST | `/auth/register` | Público | `nombre`, `email`, `password` → `201 { user, token }` |
| POST | `/auth/login` | Público | `email`, `password` → `200 { user, token }` |
| GET | `/users/me` | 🔒 | Perfil |
| GET | `/users` | 🔒 admin | Lista de usuarios |
| PATCH | `/users/:id/rol` | 🔒 admin | `{ "rol": "organizer" }` |
| GET | `/events` | Público | Filtros: `?ciudad=&titulo=&esLocal=` |
| GET | `/events/:id` | Público | Detalle con `stockDisponible` |
| POST | `/events` | 🔒 admin, organizer | Crea el evento (`201`) |
| POST | `/bookings` | 🔒 | `{ id_evento, cantidad }` (1–10) → `201` reserva `PENDING` |
| GET | `/bookings/me` | 🔒 | Mis reservas |
| POST | `/bookings/:id/pay` | 🔒 dueño | Pago simulado → `200 { booking, ticket }` |
| GET | `/tickets/me` | 🔒 | Mis tickets |
| GET | `/tickets/:id` | 🔒 dueño o admin | Detalle del ticket |
| POST | `/tickets/validate` | 🔒 admin, organizer | `{ codigoQR }` → ticket `USADO` |

Errores (formato único): `{ "success": false, "message": "...", "errors": [{ "field", "message" }] }`.
`400` validación · `401` sin token/credenciales · `403` sin permiso · `404` no existe · `409` conflicto (sin stock, reserva vencida o ya pagada, QR ya usado, email repetido) · `500` error interno.

## Datos de ejemplo (`npm run seed`)

Contraseña de todos: `Tickets2026`

| Email | Rol |
|---|---|
| `admin@tickets.io` | admin |
| `organizer@tickets.io` | organizer |
| `lucia@tickets.io`, `tomas@tickets.io` | user |

4 eventos, uno de ellos con solo 5 entradas para probar el control de stock y otro con `esLocal: false` (Buenos Aires).

## Pruebas manuales

[`requests.http`](requests.http) (extensión REST Client de VS Code) recorre todo el flujo: login → evento → reserva → pago → ticket → validación QR, más los casos de error. Ajusta `@base` al puerto de tu `.env`.

## Arquitectura

```
src/
├── app.ts / server.ts        # composición de dependencias y arranque
├── config/                   # env y conexión a MongoDB
├── jobs/expiration.job.ts    # repone el stock de reservas vencidas
├── middlewares/              # auth, roles, validación (Zod), logger, errores
├── modules/{auth,user,event,booking,ticket}/
│                             # routes → controller → service → repository → model
└── seeds/seeder.ts
```

Controllers solo manejan req/res (`try/catch` + `next(error)`); la lógica vive en los services; solo los repositories hablan con Mongoose.

## Límites conocidos

- El pago es **simulado**: no hay pasarela. `POST /bookings/:id/pay` representa el pago aprobado.
- `codigoQR` es el texto a codificar; la imagen del QR la genera el frontend.
- Las operaciones críticas son atómicas por documento (sin transacciones multi-documento): si el servidor se cae justo entre dos pasos, puede quedar una reserva sin ticket o stock sin reponer, y requeriría una corrección manual.
