# Guía de MongoDB Atlas (paso a paso)

Atlas es MongoDB **en la nube**: no hay que instalar ni levantar ningún servidor de base de datos. El clúster ya corre solo; nosotros únicamente nos conectamos con una dirección (la *URI*). Lo único que cada persona ejecuta en su computadora es la API (`npm run dev`).

## Cómo nos organizamos

- **Una sola persona** crea la cuenta de Atlas, el clúster gratuito y los usuarios de base de datos (partes A y B). Los demás **no necesitan cuenta de Atlas**: solo reciben su usuario y contraseña.
- **Una base de datos por persona** dentro del mismo clúster (`tickets_ana`, `tickets_luis`…), porque `npm run seed` borra todo lo que haya en la base configurada.
- Las credenciales se pasan por **mensaje privado**, nunca por el repositorio.

---

## A. Para quien crea el clúster (una sola vez)

### 1. Crear la cuenta y el proyecto
1. Entra a <https://www.mongodb.com/cloud/atlas> → **Try Free** → regístrate (puede ser con Google).
2. Si te pide una organización, ponle el nombre del equipo. Crea un **Project** llamado `bootcamp-ticketing`.

### 2. Crear el clúster gratuito
1. **Create** (o *Build a Database*) → elige **M0 Free**.
2. Proveedor: **AWS**. Región: la más cercana (por ejemplo *São Paulo*).
3. Nombre del clúster: `bootcamp-ticketing` (o el que prefieras) → **Create Deployment**. Tarda 1–3 minutos.

### 3. Crear los usuarios de base de datos
Menú izquierdo → **Database Access** → **Add New Database User**:
1. *Authentication Method*: **Password**.
2. Usuario: el nombre de la persona (por ejemplo `ana`). Contraseña: usa **Autogenerate Secure Password** y cópiala.
3. *Database User Privileges*: **Read and write to any database**.
4. **Add User**. Repite para cada integrante.

> Consejo: evita caracteres especiales en la contraseña (`@ : / ? # %`) porque rompen la URI. Si los tiene, hay que codificarlos (`@` → `%40`). Lo más simple es elegir una contraseña solo con letras y números.

### 4. Permitir las conexiones
Menú izquierdo → **Network Access** → **Add IP Address**:
- Para el desarrollo del bootcamp lo más práctico es **Allow Access from Anywhere** (`0.0.0.0/0`).
- Alternativa más estricta: que cada persona agregue su propia IP con **Add Current IP Address** (hay que repetirlo si cambia su IP, por ejemplo al cambiar de red).

### 5. Obtener la URI y compartirla
1. Menú izquierdo → **Database** → botón **Connect** del clúster → **Drivers** → **Node.js**.
2. Copia la cadena. Se ve así:
   ```
   mongodb+srv://<usuario>:<password>@bootcamp-ticketing.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Pásale a cada integrante **por privado**: la URI sin usuario/contraseña, y su usuario con su contraseña.

---

## B. Para cada integrante

### 1. Armar tu `MONGO_URI`
Toma la URI y haz tres cambios:
1. Reemplaza `<usuario>` y `<password>` por los tuyos (sin los `< >`).
2. **Agrega el nombre de tu base** justo antes del `?`: `/tickets_tunombre`.

Ejemplo final:
```
mongodb+srv://ana:MiClave123@bootcamp-ticketing.xxxxx.mongodb.net/tickets_ana?retryWrites=true&w=majority
```
> El nombre de la base **es obligatorio** en la URI. Si lo omites, MongoDB usa una base llamada `test`, compartida con quien haga lo mismo.

### 2. Completar el `.env`
En `backend/` copia el ejemplo y edítalo:
```bash
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
```
```
MONGO_URI=<la URI de arriba>
JWT_SECRET=<una frase larga cualquiera, por ejemplo 40 caracteres al azar>
```
Las demás variables son opcionales (ver `backend/README.md`).

### 3. Probar
```bash
npm run seed     # crea las colecciones y los datos de ejemplo en TU base
npm run dev      # debe decir "MongoDB conectado" y "Ticket API escuchando..."
```
Para ver los datos: en Atlas → **Database** → **Browse Collections** → tu base (`tickets_tunombre`). Verás `users`, `events`, `bookings` y `tickets`.

---

## Problemas frecuentes

| Mensaje / síntoma | Causa y solución |
|---|---|
| `bad auth : authentication failed` | Usuario o contraseña mal escritos, o la contraseña tiene caracteres especiales sin codificar. Revisa la URI o crea otra contraseña más simple. |
| Tarda ~5 s y falla con `Server selection timed out` / `Could not connect to any servers` | Tu IP no está permitida. En **Network Access** agrega tu IP (o `0.0.0.0/0`) y espera ~1 minuto. |
| `querySrv ENOTFOUND` o `ECONNREFUSED` | Sin internet, VPN/red que bloquea el puerto, o la URI está mal copiada. Prueba con otra red (por ejemplo el celular). |
| `Falta la variable de entorno MONGO_URI` | No existe el archivo `.env` o está vacío / en la carpeta equivocada (debe estar en `backend/`). |
| Los datos de otra persona aparecen en mi base | Están usando el mismo nombre de base. Cada uno debe tener `tickets_tunombre`. |

## Seguridad
- **Jamás** subas el `.env` ni pegues la URI en el chat del repositorio, issues o Pull Requests.
- Si una credencial se filtra: en **Database Access** edita ese usuario → **Edit Password** → cámbiala, y avisa al equipo.
- `0.0.0.0/0` está bien para un proyecto de práctica. Para algo real se limita por IP.
- El plan gratuito (M0) tiene 512 MB de almacenamiento: de sobra para este proyecto.
