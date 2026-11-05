import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EventForm } from "@/components/panel/EventForm";
import { SinPermiso } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/data";

export const metadata: Metadata = { title: "Crear evento" };

export default function NuevoEventoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/panel" className="text-sm text-muted hover:text-ink">
        ← Panel
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Crear evento</h1>
      <Suspense fallback={<div className="mt-8 h-[600px] animate-pulse rounded-3xl bg-line/60" />}>
        <Contenido />
      </Suspense>
    </div>
  );
}

async function Contenido() {
  const user = await requireUser("/panel/eventos/nuevo", ["admin", "organizer"]);
  return <div className="mt-8">{user ? <EventForm /> : <SinPermiso />}</div>;
}
