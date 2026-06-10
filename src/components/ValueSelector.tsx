import { Plus, Minus } from 'lucide-react'

interface ValueSelectorProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  disableDecrement?: boolean
  disableIncrement?: boolean
  size?: 'sm' | 'md'
}

export function ValueSelector({
  value,
  onIncrement,
  onDecrement,
  disableDecrement = false,
  disableIncrement = false,
  size = 'md',
}: ValueSelectorProps) {
  const btnSm = 'w-9 h-9'
  const btnMd = 'w-11 h-11'
  const btnSize = size === 'sm' ? btnSm : btnMd

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        disabled={disableDecrement}
        className={`${btnSize} rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm`}
      >
        <Minus className="w-4 h-4 text-gray-700" />
      </button>
      <div className={`${size === 'sm' ? 'w-10' : 'w-14'} text-center`}>
        <span className={`${size === 'sm' ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>{value}</span>
      </div>
      <button
        onClick={onIncrement}
        disabled={disableIncrement}
        className={`${btnSize} rounded-2xl bg-gradient-to-r from-surface-dark to-surface-dark-mid hover:from-surface-dark-mid hover:to-surface-dark active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white shadow-lg`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

/** @deprecated Usar ValueSelector */
export const QuantitySelector = ValueSelector
