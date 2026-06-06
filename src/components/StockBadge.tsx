interface StockBadgeProps {
  stock: number
  className?: string
}

export function StockBadge({ stock, className = '' }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm bg-red-500/90 text-white ${className}`}>
        Sin stock
      </div>
    )
  }
  return (
    <div
      className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm ${
        stock > 5 ? 'bg-green-500/90 text-white' : 'bg-orange-500/90 text-white'
      } ${className}`}
    >
      {stock}
    </div>
  )
}
