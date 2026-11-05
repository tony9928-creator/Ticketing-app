import Form from "next/form";
import Link from "next/link";
import type { FiltrosEventos } from "@/lib/data";
import { inputClass } from "../ui/Field";

/**
 * Filtros de la cartelera. Es un <Form> de Next con method GET: al enviarlo,
 * los valores pasan a la URL (/?ciudad=corrientes&titulo=rock) y la página
 * vuelve a pedir los eventos con esos filtros. No necesita JavaScript propio.
 */
export function EventFilters({ valores }: { valores: FiltrosEventos }) {
  const hayFiltros = Boolean(valores.ciudad || valores.titulo || valores.esLocal);

  return (
    <Form action="/" className="grid gap-3 rounded-3xl border border-line bg-card p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
      <input
        name="titulo"
        defaultValue={valores.titulo}
        placeholder="Buscar evento…"
        aria-label="Buscar por título"
        className={inputClass}
      />
      <input
        name="ciudad"
        defaultValue={valores.ciudad}
        placeholder="Ciudad"
        aria-label="Ciudad"
        className={inputClass}
      />
      <select name="esLocal" defaultValue={valores.esLocal ?? ""} aria-label="Dónde" className={inputClass}>
        <option value="">Todas las ubicaciones</option>
        <option value="true">En mi ciudad</option>
        <option value="false">Para viajar</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 rounded-xl bg-ink px-5 py-3 font-semibold text-paper hover:bg-ink/85">
          Buscar
        </button>
        {hayFiltros && (
          <Link href="/" className="rounded-xl border border-line px-4 py-3 text-muted hover:text-ink" title="Quitar filtros">
            ✕
          </Link>
        )}
      </div>
    </Form>
  );
}
