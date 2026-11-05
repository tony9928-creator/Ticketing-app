"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { register } from "@/actions/auth";
import { Alert } from "../ui/Alert";
import { Field } from "../ui/Field";
import { SubmitButton } from "../ui/SubmitButton";

/** Registro: siempre crea una cuenta de comprador (rol "user"). */
export function RegisterForm() {
  const next = useSearchParams().get("next") ?? "/";
  const [state, action] = useActionState(register, undefined);
  const err = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state?.message && <Alert tone="error">{state.message}</Alert>}

      <Field label="Nombre y apellido" name="nombre" autoComplete="name" required minLength={2} defaultValue={state?.values?.nombre} error={err.nombre} />
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} error={err.email} />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        error={err.password}
        hint="Mínimo 8 caracteres, con al menos una letra y un número."
      />
      <Field label="Repetir contraseña" name="confirmar" type="password" autoComplete="new-password" required error={err.confirmar} />

      <SubmitButton className="w-full" pendingText="Creando cuenta…">
        Crear cuenta
      </SubmitButton>

      <p className="text-center text-sm text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent-strong hover:underline">
          Ingresá
        </Link>
      </p>
    </form>
  );
}
