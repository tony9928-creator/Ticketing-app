import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <AuthCard title="Hola de nuevo" subtitle="Ingresá para reservar y ver tus entradas.">
      {/* LoginForm lee la URL (useSearchParams), por eso va dentro de Suspense */}
      <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-line/50" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
