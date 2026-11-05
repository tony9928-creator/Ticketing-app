# Estado del proyecto

_Última actualización: 5 de noviembre de 2026_

## En pocas palabras

El **backend ya funciona de punta a punta**: se pueden registrar usuarios, crear eventos, reservar entradas (bloqueando el stock 5 minutos), pagar (simulado) y recibir un ticket con código QR, que además se puede validar en la puerta del evento. Quedó probado con 34 verificaciones automáticas, incluyendo compras simultáneas.

Lo que falta es ampliar el backend (tareas abajo) y construir el frontend en React.

## Qué hay hecho

| Módulo | Qué permite |
|---|---|
| **Auth** | Registrarse (siempre como `user`) e iniciar sesión. Contraseñas con bcrypt y sesión con JWT. |
| **Usuarios** | Ver mi perfil; el admin lista usuarios y cambia roles (`user`, `admin`, `organizer`). |
| **Eventos** | Cartelera pública con filtros (`ciudad`, `titulo`, `esLocal`) y detalle. Solo `admin` y `organizer` crean eventos. Incluye ubicación con coordenadas para el mapa y `esLocal` para mostrar "Alojamiento y Transporte". |
| **Reservas** | Al reservar se **descuenta el stock** y se bloquea por 5 minutos. Si no se paga, la reserva **expira y el stock se repone** (una sola vez). |
| **Tickets** | Al pagar se emite el ticket con `codigoQR` único. `admin`/`organizer` pueden **validar** el QR en la puerta: cada código entra una sola vez. |

Extras: seed con datos de ejemplo, `requests.http` con todo el flujo, manejo de errores con formato único y logger de peticiones.

## Cómo está cuidado el stock (lo más delicado)

- El descuento de stock es **una sola operación atómica** de MongoDB: aunque 20 personas compren a la vez las últimas 5 entradas, ganan exactamente 5 y el stock nunca queda negativo.
- Pagar es también atómico: dos pagos simultáneos de la misma reserva emiten **un solo ticket**.
- Un job revisa cada 30 s las reservas vencidas y repone su stock; además se libera el stock vencido antes de cada reserva nueva.

## Qué falta (backend) — ideas para repartir

| # | Tarea | Detalle |
|---|---|---|
| 1 | **CORS** | Imprescindible para que el frontend en React pueda llamar a la API (instalar `cors` y permitir el origen del front). |
| 2 | Editar y eliminar eventos | `PATCH`/`DELETE /events/:id`. Definir si un `organizer` solo toca los suyos (habría que agregar el campo `organizador` al evento). |
| 3 | Cancelar una reserva pendiente | Que el usuario libere su stock antes de los 5 minutos. |
| 4 | Listados para organizer/admin | Reservas y tickets por evento, ventas totales. |
| 5 | Imagen del QR | Endpoint que devuelva el QR como imagen (librería `qrcode`) a partir del `codigoQR`. |
| 6 | Pago real | Reemplazar el pago simulado por Mercado Pago (si el equipo lo decide). |
| 7 | **Tests automáticos** | Jest + Supertest para los flujos críticos (stock, expiración, QR). |
| 8 | Documentación interactiva | Swagger/OpenAPI en `/api/docs`. |
| 9 | Mejoras | Paginación en `/events`, `helmet` y límite de peticiones, transacciones de MongoDB. |
| 10 | Despliegue | Publicar la API (Render, Railway…) y conectarla a una base de producción. |

Sugerencia de reparto: una persona por tarea, cada una en su rama (ver el flujo en el [README](../README.md#trabajo-en-equipo)). Las tareas 2, 3 y 4 tocan módulos distintos, así que casi no generan conflictos.

## Cómo probar lo que ya existe

1. Sigue "Empezar en 5 pasos" del [README](../README.md) (incluye la guía de [Atlas](ATLAS.md)).
2. Abre `backend/requests.http` y ejecuta en orden: logins → eventos → reserva → pago → ticket → validar QR.
3. Usuarios del seed (contraseña de todos: `Tickets2026`): `admin@tickets.io`, `organizer@tickets.io`, `lucia@tickets.io`, `tomas@tickets.io`.

## Decisiones técnicas que conviene que el equipo conozca

- **TypeScript** en el backend (el servidor de prueba inicial estaba en JavaScript). Da errores claros antes de ejecutar; si alguien prefiere JS, es una conversación para tener en equipo.
- Los datos de ejemplo se crean con fechas relativas a "hoy", así que los eventos siempre quedan a futuro.
- El pago es simulado: `POST /api/bookings/:id/pay` representa un pago aprobado.
- Límites conocidos: sin transacciones multi-documento (si el servidor se cae justo entre dos pasos, puede requerir una corrección manual).
