interface StatusBadgeProps {
  /** Valor numérico a mostrar (stock, cantidad, capacidad, etc.) */
  value: number
  /** Umbral por debajo del cual se muestra en naranja. Default: 5 */
  lowThreshold?: number
  /** Texto cuando el valor es 0. Default: 'Sin disponibilidad' */
  emptyLabel?: string
  className?: string
}

export function StatusBadge({ value, lowThreshold = 5, emptyLabel = 'Sin disponibilidad', className = '' }: StatusBadgeProps) {
  if (value === 0) {
    return (
      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm bg-red-500/90 text-white ${className}`}>
        {emptyLabel}
      </div>
    )
  }
  return (
    <div
      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm ${
        value > lowThreshold ? 'bg-green-500/90 text-white' : 'bg-orange-500/90 text-white'
      } ${className}`}
    >
      {value}
    </div>
  )
}

/** @deprecated Usar StatusBadge */
export const StockBadge = ({ stock, className }: { stock: number; className?: string }) =>
  <StatusBadge value={stock} className={className} />
