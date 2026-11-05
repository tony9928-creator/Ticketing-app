"use client";

import { useActionState } from "react";
import { cambiarRol } from "@/actions/users";
import type { Rol } from "@/lib/types";

const ROLES: { value: Rol; label: string }[] = [
  { value: "user", label: "Comprador" },
  { value: "organizer", label: "Organizador" },
  { value: "admin", label: "Admin" },
];

/** Selector de rol que guarda apenas se cambia (envía el formulario solo). */
export function RoleSelect({ id, rol, disabled }: { id: string; rol: Rol; disabled?: boolean }) {
  const [state, action, pending] = useActionState(cambiarRol, undefined);
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="rol"
        defaultValue={rol}
        disabled={disabled || pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        aria-label="Rol"
        className="rounded-lg border border-line bg-card px-3 py-2 text-sm disabled:opacity-60"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {state?.message && <span className="text-xs text-danger">{state.message}</span>}
    </form>
  );
}
