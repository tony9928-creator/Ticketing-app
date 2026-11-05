import Link from "next/link";
import type { ReactNode } from "react";

/** Mensaje para listas vacías o páginas sin permiso, con una acción opcional. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card/60 px-6 py-14 text-center">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {children && <div className="mx-auto mt-2 max-w-md text-muted">{children}</div>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex rounded-xl bg-ink px-5 py-3 font-semibold text-paper hover:bg-ink/85"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** Para páginas que requieren un rol que el usuario no tiene. */
export function SinPermiso({ texto = "Esta parte es solo para organizadores y administradores." }: { texto?: string }) {
  return (
    <EmptyState title="No tenés permiso para ver esta sección" action={{ href: "/", label: "Volver a la cartelera" }}>
      {texto}
    </EmptyState>
  );
}
