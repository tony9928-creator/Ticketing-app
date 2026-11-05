"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Alert } from "../ui/Alert";
import { Field } from "../ui/Field";
import { SubmitButton } from "../ui/SubmitButton";

/** Formulario de ingreso. `next` (de la URL) indica a dónde volver después de entrar. */
export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const expirada = searchParams.has("expirada");
  const [state, action] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {expirada && !state && <Alert tone="warn">Tu sesión expiró. Ingresá de nuevo para continuar.</Alert>}
      {state?.message && <Alert tone="error">{state.message}</Alert>}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        error={state?.fieldErrors?.email}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state?.fieldErrors?.password}
      />

      <SubmitButton className="w-full" pendingText="Ingresando…">
        Ingresar
      </SubmitButton>

      <p className="text-center text-sm text-muted">
        ¿No tenés cuenta?{" "}
        <Link href={`/registro?next=${encodeURIComponent(next)}`} className="font-semibold text-accent-strong hover:underline">
          Creá una
        </Link>
      </p>

      {process.env.NODE_ENV === "development" && (
        <p className="rounded-xl bg-paper px-4 py-3 text-xs text-muted">
          <strong>Cuentas de prueba</strong> (npm run seed): lucia@tickets.io, organizer@tickets.io, admin@tickets.io ·
          contraseña <code>Tickets2026</code>
        </p>
      )}
    </form>
  );
}
