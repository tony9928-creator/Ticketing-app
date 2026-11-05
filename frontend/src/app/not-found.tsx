import { EmptyState } from "@/components/ui/EmptyState";

/** Se muestra cuando una ruta no existe o una página llama a notFound(). */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState title="No encontramos lo que buscás" action={{ href: "/", label: "Ir a la cartelera" }}>
        Puede que el enlace esté mal escrito o que el evento ya no exista.
      </EmptyState>
    </div>
  );
}
