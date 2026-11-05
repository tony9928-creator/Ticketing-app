import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <AuthCard title="Creá tu cuenta" subtitle="Es gratis y tarda menos de un minuto.">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
