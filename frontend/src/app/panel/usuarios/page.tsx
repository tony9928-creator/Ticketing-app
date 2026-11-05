import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RoleSelect } from "@/components/panel/RoleSelect";
import { SinPermiso } from "@/components/ui/EmptyState";
import { getUsuarios, requireUser } from "@/lib/data";
import { formatFecha, iniciales } from "@/lib/format";

export const metadata: Metadata = { title: "Usuarios" };

/** Lista de usuarios con cambio de rol (solo admin). */
export default function UsuariosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/panel" className="text-sm text-muted hover:text-ink">
        ← Panel
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Usuarios</h1>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-3xl bg-line/60" />}>
        <Tabla />
      </Suspense>
    </div>
  );
}

async function Tabla() {
  const user = await requireUser("/panel/usuarios", ["admin"]);
  if (!user) return <div className="mt-8"><SinPermiso texto="Esta parte es solo para administradores." /></div>;

  const usuarios = await getUsuarios();

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-card">
      <ul className="divide-y divide-line">
        {usuarios.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-strong">
              {iniciales(u.nombre)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">
                {u.nombre} {u.id === user.id && <span className="text-xs font-normal text-muted">(vos)</span>}
              </div>
              <div className="truncate text-sm text-muted">
                {u.email} · desde {formatFecha(u.createdAt)}
              </div>
            </div>
            {/* El admin no puede quitarse su propio rol desde acá (evita quedarse afuera). */}
            <RoleSelect id={u.id} rol={u.rol} disabled={u.id === user.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
