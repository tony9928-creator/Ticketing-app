import { Suspense } from "react";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { getEventos, type FiltrosEventos } from "@/lib/data";

/**
 * Página principal: la cartelera.
 * El encabezado es estático (se ve al instante); la lista depende de la URL (?ciudad=...)
 * y de la API, así que se carga dentro de <Suspense> mostrando un esqueleto mientras tanto.
 */
export default function Home(props: PageProps<"/">) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-12 sm:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Cartelera</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Tu próxima noche empieza con una entrada.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Reservá en segundos, pagá y entrá con el QR desde tu celular.
        </p>
      </section>

      <Suspense fallback={<CarteleraSkeleton />}>
        <Cartelera searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

/** Toma un valor de la URL (puede venir repetido como array) y lo normaliza. */
const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

async function Cartelera({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const sp = await searchParams;
  const esLocal = uno(sp.esLocal);
  const filtros: FiltrosEventos = {
    titulo: uno(sp.titulo),
    ciudad: uno(sp.ciudad),
    esLocal: esLocal === "true" || esLocal === "false" ? esLocal : undefined,
  };
  const eventos = await getEventos(filtros);

  return (
    <>
      <EventFilters valores={filtros} />
      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold">Próximos eventos</h2>
        <span className="text-sm text-muted">
          {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
        </span>
      </div>
      {eventos.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No hay eventos con esos filtros" action={{ href: "/", label: "Ver todos" }}>
            Probá con otra ciudad o quitá los filtros.
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((e) => (
            <EventCard key={e.id} evento={e} />
          ))}
        </div>
      )}
    </>
  );
}

function CarteleraSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando eventos">
      <div className="h-[74px] animate-pulse rounded-3xl bg-line/60" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-3xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
