# Ticketing App

Plataforma full stack para **publicar eventos, reservar entradas y validarlas con código QR en la puerta**. Las reservas bloquean el stock durante 5 minutos y el sistema garantiza que nunca se vendan más entradas de las disponibles, incluso con compras simultáneas.

Proyecto final grupal del bootcamp de desarrollo web full stack.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)

> **Estado:** en desarrollo. El flujo completo (cartelera → reserva → pago → ticket QR → validación) ya funciona de punta a punta. Avances y próximas tareas en [`docs/PROGRESO.md`](docs/PROGRESO.md).

---

## Funcionalidades

**Para el público**
- Cartelera de eventos con filtros por ciudad y título.
- Detalle del evento con **mapa interactivo** (Leaflet + OpenStreetMap) y enlaces de alojamiento y transporte para eventos fuera de la ciudad.
- Registro e inicio de sesión.

**Para el comprador**
- Reserva de entradas con **checkout y cuenta regresiva de 5 minutos**: si no se paga, la reserva expira y el stock vuelve a estar disponible.
- Pago (simulado) que emite un **ticket con código QR único**.
- Sección *Mis tickets* con el detalle y el QR de cada entrada.

**Para organizadores y administradores**
- Panel para crear eventos eligiendo la ubicación en el mapa.
- **Validador de QR con la cámara**: cada entrada solo puede ingresar una vez.
- Gestión de usuarios y roles (`user`, `organizer`, `admin`).

## Aspectos técnicos destacados

- **Control de stock atómico.** El descuento de entradas es una sola operación atómica de MongoDB: si 20 personas compran a la vez las últimas 5 entradas, ganan exactamente 5 y el stock nunca queda negativo. El pago también es atómico, así que dos pagos simultáneos de la misma reserva emiten un solo ticket.
- **Expiración automática de reservas.** Un job revisa cada 30 segundos las reservas vencidas y repone su stock una sola vez.
- **Sesión segura.** Contraseñas con bcrypt y autenticación con JWT. En el frontend, el token vive en una cookie `httpOnly`, fuera del alcance del JavaScript de la página.
- **El navegador nunca llama directo a la API.** Las páginas son *React Server Components* y los formularios usan *Server Actions*, de modo que todas las peticiones pasan por el servidor de Next.js.
- **Autorización por roles** con middlewares de Express y validación de entradas con Zod.
- **Arquitectura modular** en el backend: cada dominio (`auth`, `user`, `event`, `booking`, `ticket`) tiene su capa de rutas, controlador, servicio, repositorio y validación.
- Manejo de errores con formato único, logger de peticiones y seed con datos de ejemplo.

## Arquitectura

```
Navegador ──► Next.js (puerto 3001) ──► API Express (puerto 3000) ──► MongoDB
               Server Components          módulos por dominio
               + Server Actions           + job de expiración
```

| Parte | Tecnologías |
|---|---|
| **Backend** (`/backend`) | Node.js, TypeScript, Express 5, Mongoose, JWT, bcrypt, Zod |
| **Frontend** (`/frontend`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Leaflet, qrcode.react, react-qr-scanner |
| **Base de datos** | MongoDB (local o Atlas) |

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registro de usuario |
| `POST` | `/api/auth/login` | Público | Inicio de sesión (devuelve JWT) |
| `GET` | `/api/users/me` | Autenticado | Perfil propio |
| `GET` | `/api/users` | Admin | Listado de usuarios |
| `PATCH` | `/api/users/:id/rol` | Admin | Cambiar rol |
| `GET` | `/api/events` | Público | Cartelera con filtros |
| `GET` | `/api/events/:id` | Público | Detalle de evento |
| `POST` | `/api/events` | Admin, organizer | Crear evento |
| `POST` | `/api/bookings` | Autenticado | Reservar (bloquea stock 5 min) |
| `GET` | `/api/bookings/me` | Autenticado | Mis reservas |
| `POST` | `/api/bookings/:id/pay` | Autenticado | Pagar y emitir ticket |
| `GET` | `/api/tickets/me` | Autenticado | Mis tickets |
| `GET` | `/api/tickets/:id` | Autenticado | Detalle de ticket |
| `POST` | `/api/tickets/validate` | Admin, organizer | Validar QR en la puerta |

Documentación completa y reglas de negocio en [`backend/README.md`](backend/README.md). Todas las peticiones de ejemplo están en [`backend/requests.http`](backend/requests.http).

## Cómo ejecutarlo en local

**Requisitos:** Node.js 20 o superior y MongoDB, ya sea instalado en tu PC ([guía](docs/MONGO-LOCAL.md)) o en Atlas ([guía](docs/ATLAS.md)).

```bash
git clone https://github.com/tony9928-creator/Ticketing-app.git
cd Ticketing-app
```

**1. Backend** (http://localhost:3000)
```bash
cd backend
npm install
cp .env.example .env      # completar MONGO_URI y JWT_SECRET
npm run seed              # carga datos de ejemplo (borra la base configurada)
npm run dev
```

**2. Frontend** (http://localhost:3001), en otra terminal
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

> En PowerShell, reemplazá `cp` por `Copy-Item`.

**Cuentas de prueba** (contraseña `Tickets2026`):

| Email | Rol |
|---|---|
| `lucia@tickets.io` | Comprador |
| `organizer@tickets.io` | Organizador |
| `admin@tickets.io` | Administrador |

## Estructura del proyecto

```
Ticketing-app/
├── backend/
│   ├── src/
│   │   ├── modules/        auth, user, event, booking, ticket
│   │   ├── middlewares/    auth, roles, validación, errores, logger
│   │   ├── jobs/           expiración de reservas
│   │   ├── config/         entorno y conexión a MongoDB
│   │   └── seeds/          datos de ejemplo
│   └── requests.http       pruebas manuales de todos los endpoints
├── frontend/
│   └── src/
│       ├── app/            rutas (cartelera, eventos, reservas, tickets, panel)
│       ├── actions/        Server Actions
│       ├── components/     interfaz agrupada por dominio
│       └── lib/            cliente de la API, sesión, tipos y formato
└── docs/
    ├── PROGRESO.md         estado del proyecto y próximas tareas
    ├── MONGO-LOCAL.md      MongoDB en Windows
    └── ATLAS.md            MongoDB Atlas en la nube
```

## Próximos pasos

- Editar y eliminar eventos, y cancelar reservas pendientes.
- Pasarela de pago real (Mercado Pago).
- Tests automáticos con Jest y Supertest para los flujos críticos.
- Documentación interactiva con Swagger.
- Despliegue de la API y el frontend.

## Equipo

Proyecto desarrollado en equipo durante el bootcamp. Repositorio original del grupo: [escoobarmauricio/bootcamp-ticketing](https://github.com/escoobarmauricio/bootcamp-ticketing).

**Tomás Acosta** — [GitHub](https://github.com/tony9928-creator)
