import type { ReactNode } from "react";

const TONOS = {
  error: "border-danger/30 bg-danger-soft text-danger",
  ok: "border-ok/30 bg-ok-soft text-ok",
  warn: "border-warn/30 bg-warn-soft text-warn",
  info: "border-line bg-card text-ink",
} as const;

/** Caja de aviso (errores de formulario, confirmaciones, advertencias). */
export function Alert({ tone = "info", children }: { tone?: keyof typeof TONOS; children: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${TONOS[tone]}`}>
      {children}
    </div>
  );
}
