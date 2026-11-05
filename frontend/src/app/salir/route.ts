import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

/**
 * GET /salir: borra la sesión y lleva al login.
 * La usa lib/api.ts cuando la API responde 401 (token vencido o inválido),
 * porque un Server Component no puede borrar cookies pero un Route Handler sí.
 */
export async function GET() {
  await deleteSession();
  redirect("/login?expirada=1");
}
