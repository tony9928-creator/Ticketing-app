import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { QrValidator } from "@/components/panel/QrValidator";
import { SinPermiso } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/data";

export const metadata: Metadata = { title: "Validar entradas" };

export default function ValidarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/panel" className="text-sm text-muted hover:text-ink">
        ← Panel
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Control de acceso</h1>
      <p className="mt-1 text-muted">Cada entrada se puede validar una sola vez.</p>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-3xl bg-line/60" />}>
        <Contenido />
      </Suspense>
    </div>
  );
}

async function Contenido() {
  const user = await requireUser("/panel/validar", ["admin", "organizer"]);
  return <div className="mt-8">{user ? <QrValidator /> : <SinPermiso />}</div>;
}
