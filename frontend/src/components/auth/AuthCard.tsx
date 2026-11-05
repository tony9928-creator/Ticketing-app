import type { ReactNode } from "react";

/** Marco común de las pantallas de ingreso y registro. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border border-line bg-card p-8 shadow-[0_20px_50px_-30px_rgba(23,20,31,0.35)]">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
