# Bootcamp Ticketing

Proyecto final grupal del bootcamp: plataforma para **vender y reservar entradas de eventos** , con reservas temporales y control estricto de stock.

| Parte | Tecnología | Estado |
|---|---|---|
| Backend (`/backend`) | Node.js, TypeScript, Express 5, MongoDB Atlas (Mongoose), JWT, bcrypt, Zod | Base funcionando |
| Frontend (`/frontend`) | React | Pendiente |

> **Resumen de avances y tareas pendientes:** [`docs/PROGRESO.md`](docs/PROGRESO.md)

## Empezar en 5 pasos

1. **Clona el repositorio** y entra al backend:
   ```bash
   git clone https://github.com/escoobarmauricio/bootcamp-ticketing.git
   cd bootcamp-ticketing/backend
   npm install
   ```
2. **Conéctate a MongoDB Atlas**: sigue la guía [`docs/ATLAS.md`](docs/ATLAS.md) (crear usuario, permitir tu IP, copiar la URI). Es lo único que toma unos minutos.
3. **Crea tu `.env`**: `cp .env.example .env` (en PowerShell: `Copy-Item .env.example .env`) y completa `MONGO_URI` y `JWT_SECRET`.
4. **Carga datos de ejemplo**: `npm run seed` (¡borra y recrea la base de **tu** `.env`!).
5. **Arranca la API**: `npm run dev` → `http://localhost:3000/api/health`.

Para probar los endpoints usa `backend/requests.http` (extensión *REST Client* de VS Code). La documentación de la API está en [`backend/README.md`](backend/README.md).

## Trabajo en equipo

### Reglas básicas
- **No se trabaja directo en `main`.** Cada tarea va en su propia rama y entra por Pull Request.
- **Cada persona usa su propia base de datos** en Atlas (`tickets_tunombre`). El comando `seed` borra todo lo que haya en la base configurada: si dos personas comparten base, se pisan los datos.
- **Nunca se sube el `.env`** (ya está en `.gitignore`). Las credenciales se comparten por un canal privado del equipo, jamás por el repositorio.
- Código en inglés donde ya lo está (nombres de archivos y clases) y mensajes de la API en español. Los campos de datos siguen el diseño del equipo (`titulo`, `fecha`, `id_usuario`…).

### Flujo para cada tarea
```bash
git checkout main
git pull                                # trae lo último del equipo
git checkout -b feature/nombre-corto    # ej: feature/editar-eventos
# ... programa, prueba con requests.http ...
npm run typecheck                       # debe terminar sin errores
git add .
git commit -m "Agrega edición de eventos"
git push -u origin feature/nombre-corto
```
Después, en GitHub: **Compare & pull request** → describe qué cambió y cómo probarlo → pide revisión a un compañero → cuando lo aprueban, **Merge**. Si hay conflictos, `git pull origin main` en tu rama y resuélvelos antes de mergear.

### Para no pisarse
El backend está dividido en módulos (`backend/src/modules/{auth,user,event,booking,ticket}`). Conviene que cada persona tome un módulo o una tarea distinta. Si necesitas tocar algo compartido (`middlewares`, `config`, `app.ts`), avisa al equipo.

### Estructura
```
bootcamp-ticketing/
├── README.md
├── docs/
│   ├── ATLAS.md        # guía paso a paso de MongoDB Atlas
│   └── PROGRESO.md     # qué está hecho y qué falta
└── backend/
    ├── README.md       # documentación de la API y de las reglas de negocio
    ├── requests.http   # pruebas manuales de todos los endpoints
    └── src/            # app.ts, server.ts, config, jobs, middlewares, modules, seeds
```
