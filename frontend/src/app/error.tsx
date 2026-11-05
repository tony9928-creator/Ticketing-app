"use client";

/**
 * Pantalla de error para cualquier página (por ejemplo, si la API está apagada).
 * Tiene que ser Client Component porque ofrece reintentar sin recargar todo el sitio.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="rounded-3xl border border-danger/30 bg-danger-soft/60 px-6 py-12 text-center">
        <h1 className="font-display text-2xl font-semibold">Algo salió mal</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">
          {error.message || "Ocurrió un error inesperado."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-ink px-5 py-3 font-semibold text-paper hover:bg-ink/85"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
