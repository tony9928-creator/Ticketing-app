# MongoDB local en Windows (cada integrante en su PC)

Es la forma **más simple de arrancar**: cada persona instala MongoDB en su computadora y tiene su propia base. No hace falta internet, ni cuentas, ni permisos de IP, ni compartir contraseñas, y `npm run seed` no pisa los datos de nadie más.

> Si el equipo prefiere una base en la nube compartida, la alternativa es [MongoDB Atlas](ATLAS.md). Ambas funcionan con el mismo código: solo cambia la `MONGO_URI` del `.env`.

## 1. Instalar MongoDB Community Server

1. Entra a <https://www.mongodb.com/try/download/community>.
2. Elige **Version**: la más reciente (*current*), **Platform**: *Windows x64*, **Package**: *msi* → **Download**.
3. Ejecuta el instalador:
   - **Setup Type:** *Complete*.
   - **Service Configuration:** deja marcado **Install MongoDB as a Service** y **Run service as Network Service user** (así MongoDB arranca solo con Windows).
   - **Install MongoDB Compass:** déjalo marcado (es una app para ver los datos con interfaz gráfica).
4. Termina la instalación (puede tardar unos minutos).

## 2. Comprobar que está funcionando

Abre **PowerShell** y ejecuta:

```powershell
Get-Service MongoDB
```
Debe mostrar `Status: Running`. Si dice `Stopped`, inícialo (PowerShell **como administrador**):

```powershell
net start MongoDB
```

También puedes abrir **MongoDB Compass**, pulsar **Connect** con la dirección `mongodb://127.0.0.1:27017` y ver que conecta.

## 3. Configurar el proyecto

En la carpeta `backend/`, crea el `.env` desde el ejemplo:

```powershell
Copy-Item .env.example .env
```

Y complétalo (el nombre de la base, `tickets`, va al final de la URI):

```
MONGO_URI=mongodb://127.0.0.1:27017/tickets
JWT_SECRET=una-frase-larga-cualquiera-de-40-caracteres-o-mas
```

> Usa `127.0.0.1` en vez de `localhost`: en algunas versiones de Node, `localhost` se resuelve a una dirección IPv6 y la conexión falla.

## 4. Probar

```powershell
npm install        # solo la primera vez
npm run seed       # crea las colecciones y los datos de ejemplo
npm run dev        # debe decir "MongoDB conectado" y "Ticket API escuchando..."
```

Para mirar los datos: en **Compass**, conecta y abre la base `tickets` → colecciones `users`, `events`, `bookings` y `tickets`.

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `connect ECONNREFUSED 127.0.0.1:27017` o tarda ~5 s y falla con `Server selection timed out` | MongoDB no está corriendo. Ejecuta `Get-Service MongoDB`; si está detenido, `net start MongoDB` (PowerShell como administrador). |
| `Get-Service` dice que no existe el servicio `MongoDB` | Se instaló sin la opción de servicio. Reinstala marcando **Install MongoDB as a Service**. |
| `Falta la variable de entorno MONGO_URI` | No existe el `.env` o no está dentro de `backend/`. |
| Error de permisos al iniciar el servicio | Abre PowerShell **como administrador**. |
| El puerto 27017 está ocupado | Otro MongoDB ya está corriendo; usa ese, o detén el otro servicio. |

## Cuándo conviene Atlas en lugar de local

- Si queremos **una base compartida** para que todos vean los mismos datos (por ejemplo, una demo del equipo).
- Para **publicar** la API en internet (Render, Railway…): allí no hay una MongoDB en tu PC, y se usa Atlas.

Para el desarrollo diario, cada uno con su MongoDB local es lo más cómodo.
