import type { EstadoTicket } from "@/lib/types";

const ESTILOS: Record<EstadoTicket, { texto: string; clase: string }> = {
  ACTIVO: { texto: "Válido", clase: "bg-ok-soft text-ok" },
  USADO: { texto: "Usado", clase: "bg-line text-muted" },
  CANCELADO: { texto: "Cancelado", clase: "bg-danger-soft text-danger" },
};

export function TicketStateBadge({ estado }: { estado: EstadoTicket }) {
  const { texto, clase } = ESTILOS[estado];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${clase}`}>{texto}</span>;
}
