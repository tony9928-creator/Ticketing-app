"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, useTransition } from "react";
import { validarTicket, type ResultadoValidacion } from "@/actions/tickets";
import { formatPrecio } from "@/lib/format";
import { inputClass } from "../ui/Field";

/**
 * Control de acceso: escanea el QR con la cámara (o se escribe el código a mano)
 * y lo valida contra la API. Cada código entra una sola vez.
 * La cámara funciona en http://localhost o en sitios https.
 */
export function QrValidator() {
  const [camara, setCamara] = useState(false);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [resultado, setResultado] = useState<ResultadoValidacion | null>(null);
  const [pending, startTransition] = useTransition();

  function validar(codigo: string) {
    if (pending) return;
    startTransition(async () => {
      setResultado(await validarTicket(codigo));
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-ink">
          {camara ? (
            <Scanner
              onScan={(codes) => codes[0] && validar(codes[0].rawValue)}
              onError={(e) => setErrorCamara(e.message)}
              paused={pending || resultado !== null}
              sound={false}
              formats={["qr_code"]}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setErrorCamara(null);
                setCamara(true);
              }}
              className="grid h-full w-full place-items-center text-paper/80 hover:text-paper"
            >
              <span className="text-center">
                <span className="block text-5xl" aria-hidden>
                  📷
                </span>
                <span className="mt-2 block font-semibold">Activar cámara</span>
              </span>
            </button>
          )}
        </div>
        {errorCamara && <p className="text-sm text-danger">No se pudo usar la cámara: {errorCamara}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            validar(manual);
          }}
          className="flex gap-2"
        >
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="…o pegá el código del ticket"
            aria-label="Código del ticket"
            className={`${inputClass} font-mono text-sm`}
          />
          <button type="submit" disabled={pending} className="rounded-xl bg-ink px-5 font-semibold text-paper disabled:opacity-60">
            Validar
          </button>
        </form>
      </div>

      <div aria-live="polite">
        {pending ? (
          <Panel tono="bg-card border-line" titulo="Validando…" />
        ) : resultado === null ? (
          <Panel tono="bg-card border-line" titulo="Esperando un código">
            Escaneá la entrada del asistente para registrar su ingreso.
          </Panel>
        ) : resultado.ok ? (
          <Panel tono="bg-ok-soft border-ok/40 text-ok" titulo="✓ Entrada válida">
            Puede ingresar. Monto pagado: {formatPrecio(resultado.ticket.montoPagado)}.
          </Panel>
        ) : (
          <Panel tono="bg-danger-soft border-danger/40 text-danger" titulo="✕ No puede ingresar">
            {resultado.message}
          </Panel>
        )}
        {resultado && !pending && (
          <button
            type="button"
            onClick={() => {
              setResultado(null);
              setManual("");
            }}
            className="mt-4 w-full rounded-xl bg-ink px-5 py-3 font-semibold text-paper hover:bg-ink/85"
          >
            Escanear otra entrada
          </button>
        )}
      </div>
    </div>
  );
}

function Panel({ tono, titulo, children }: { tono: string; titulo: string; children?: React.ReactNode }) {
  return (
    <div className={`flex min-h-48 flex-col justify-center rounded-3xl border p-8 text-center ${tono}`}>
      <div className="font-display text-3xl font-bold">{titulo}</div>
      {children && <p className="mt-2 opacity-80">{children}</p>}
    </div>
  );
}
