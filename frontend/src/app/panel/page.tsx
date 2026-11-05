import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SinPermiso } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/data";

export const metadata: Metadata = { title: "Panel" };

/** Inicio del panel de gestión (organizer y admin). */
export default function PanelPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Panel</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Gestión de eventos</h1>
      <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-3xl bg-line/60" />}>
        <Accesos />
      </Suspense>
    </div>
  );
}

async function Accesos() {
  const user = await requireUser("/panel", ["admin", "organizer"]);
  if (!user) return <div className="mt-8"><SinPermiso /></div>;

  const accesos = [
    { href: "/panel/eventos/nuevo", titulo: "Crear evento", texto: "Publicá un evento nuevo con su lugar, precio y entradas.", icono: "＋" },
    { href: "/panel/validar", titulo: "Validar entradas", texto: "Escaneá los QR en la puerta del evento.", icono: "⌁" },
    ...(user.rol === "admin"
      ? [{ href: "/panel/usuarios", titulo: "Usuarios", texto: "Mirá las cuentas y asigná roles.", icono: "◎" }]
      : []),
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accesos.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-2xl text-accent-strong" aria-hidden>
            {a.icono}
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold group-hover:text-accent-strong">{a.titulo}</h2>
          <p className="mt-1 text-sm text-muted">{a.texto}</p>
        </Link>
      ))}
    </div>
  );
}
