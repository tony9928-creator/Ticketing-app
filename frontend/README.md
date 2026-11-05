# Frontend — Ticketera

Interfaz web de la plataforma de entradas: cartelera, detalle con mapa, reserva y pago, tickets con QR y panel para organizadores y administradores.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Leaflet + OpenStreetMap (mapas) · qrcode.react (QR) · @yudiel/react-qr-scanner (escáner). Todo gratuito y sin claves de API.

## Cómo levantarlo

Necesitás el **backend corriendo** (ver [`../backend/README.md`](../backend/README.md) y [`../docs/MONGO-LOCAL.md`](../docs/MONGO-LOCAL.md)).

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local   # solo la primera vez
npm run dev                         # http://localhost:3001
```

| Puerto | Qué corre |
|---|---|
| `3000` | API (backend) |
| `3001` | Este frontend |

Cuentas de prueba (después de `npm run seed` en el backend), contraseña `Tickets2026`:
`lucia@tickets.io` (comprador), `organizer@tickets.io` (organizador), `admin@tickets.io` (admin).

## Scripts

| Comando | Para qué |
|---|---|
| `npm run dev` | Desarrollo con recarga automática |
| `npm run build` | Compila para producción (también detecta errores) |
| `npm run start` | Sirve lo compilado |
| `npm run lint` | Revisa el código con ESLint |
| `npm run typecheck` | Revisa los tipos de TypeScript |

## Cómo está armado

**El navegador nunca llama directo a la API.** Las páginas son *Server Components* que piden los datos desde el servidor de Next, y los formularios usan *Server Actions*. Por eso:

- No hace falta configurar CORS en el backend.
- El JWT se guarda en una cookie `httpOnly`: el JavaScript de la página no puede leerlo.

```
Navegador ──► Next.js (3001) ──► API Express (3000) ──► MongoDB
               páginas + actions     lib/api.ts
```

```
src/
├── app/                      Rutas: cada carpeta es una URL
│   ├── layout.tsx            Estructura común (barra superior + pie)
│   ├── page.tsx              /                 Cartelera con filtros
│   ├── eventos/[id]/         /eventos/:id      Detalle, mapa, reservar
│   ├── login/ · registro/    Ingreso y registro
│   ├── reservas/[id]/        /reservas/:id     Checkout con cuenta regresiva
│   ├── mis-tickets/          Lista de entradas y detalle con QR
│   ├── panel/                Organizer/admin: crear evento, validar QR, usuarios
│   ├── salir/route.ts        Cierra la sesión vencida
│   ├── not-found.tsx · error.tsx   Pantallas de 404 y error
│   └── globals.css           Colores y tipografías (tokens de Tailwind)
├── actions/                  Server Actions: login, reservar, pagar, crear evento…
├── components/               Piezas de interfaz, agrupadas por tema
│   └── ui/                   Botones, campos, avisos reutilizables
├── lib/
│   ├── api.ts                Cliente HTTP hacia el backend (único lugar con fetch)
│   ├── data.ts               Lecturas que usan las páginas
│   ├── session.ts            Cookies de sesión
│   ├── types.ts              Tipos de los datos de la API
│   └── format.ts · config.ts Formato de precios/fechas y constantes
└── proxy.ts                  Manda al login si se entra a una ruta privada sin sesión
```

## Cosas a tener en cuenta (Next 16)

- **Cache Components está activado.** Todo lo que lee cookies, la URL (`params`, `searchParams`) o la API va dentro de un `<Suspense>` con un esqueleto de carga. Si te olvidás, `next dev` muestra un aviso en pantalla con la solución.
- **`middleware.ts` ahora se llama `proxy.ts`.**
- La documentación de la versión instalada está en `node_modules/next/dist/docs/`. Conviene consultarla antes que tutoriales viejos.
- Para agregar una página: creá `src/app/<ruta>/page.tsx`. Para leer datos, agregá una función en `lib/data.ts`. Para una acción (POST/PATCH), agregá una función en `actions/`.
