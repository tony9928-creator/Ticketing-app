/** Etiqueta de disponibilidad: agotado / últimas entradas / disponible. */
export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="rounded-full bg-line px-3 py-1 text-xs font-semibold text-muted">Agotado</span>;
  }
  if (stock <= 10) {
    return (
      <span className="rounded-full bg-warn-soft px-3 py-1 text-xs font-semibold text-warn">
        {stock === 1 ? "¡Última entrada!" : `Quedan ${stock}`}
      </span>
    );
  }
  return <span className="rounded-full bg-ok-soft px-3 py-1 text-xs font-semibold text-ok">Disponible</span>;
}
