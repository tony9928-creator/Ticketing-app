import Link from "next/link";
import { logout } from "@/actions/auth";
import { iniciales } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

const ROL_LABEL = { user: "Comprador", organizer: "Organizador", admin: "Admin" } as const;

/** Parte derecha de la barra: botones de ingreso, o el menú del usuario logueado. */
export async function UserNav() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link href="/login" className="rounded-full px-3 py-2 text-muted hover:text-ink">
          Ingresar
        </Link>
        <Link href="/registro" className="rounded-full bg-ink px-4 py-2 text-paper hover:bg-ink/85">
          Crear cuenta
        </Link>
      </div>
    );
  }

  const puedeGestionar = user.rol === "admin" || user.rol === "organizer";

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Link href="/mis-tickets" className="rounded-full px-3 py-2 text-muted hover:bg-line/60 hover:text-ink">
        Mis tickets
      </Link>
      {puedeGestionar && (
        <Link href="/panel" className="rounded-full px-3 py-2 text-muted hover:bg-line/60 hover:text-ink">
          Panel
        </Link>
      )}
      <div className="ml-2 flex items-center gap-2 border-l border-line pl-3">
        <span
          className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong"
          title={`${user.nombre} · ${ROL_LABEL[user.rol]}`}
        >
          {iniciales(user.nombre)}
        </span>
        <span className="hidden leading-tight md:block">
          {user.nombre.split(" ")[0]}
          <span className="block text-xs font-normal text-muted">{ROL_LABEL[user.rol]}</span>
        </span>
        <form action={logout}>
          <button type="submit" className="rounded-full px-2 py-2 text-muted hover:text-danger" title="Cerrar sesión">
            Salir
          </button>
        </form>
      </div>
    </div>
  );
}
