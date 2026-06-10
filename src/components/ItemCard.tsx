import { motion } from 'motion/react'
import { StatusBadge } from './StatusBadge'
import { ValueSelector } from './ValueSelector'

interface ItemCardProps {
  id: string
  name: string
  year?: number
  price: number
  image: string
  isDynamic?: boolean
  quantity: number
  availableStock: number
  animationIndex?: number
  onClick: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export function ItemCard({
  name,
  year,
  price,
  image,
  isDynamic,
  quantity,
  availableStock,
  animationIndex = 0,
  onClick,
  onIncrement,
  onDecrement,
}: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (animationIndex % 4) * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
        isDynamic ? 'border-primary/20 bg-gradient-to-b from-white to-primary/5' : 'border-gray-100'
      }`}
    >
      <div className="p-4">
        <div
          onClick={onClick}
          className="relative h-44 mb-4 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white rounded-2xl cursor-pointer overflow-hidden"
        >
          {isDynamic && (
            <span className="absolute top-3 left-3 bg-primary text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow z-10">
              DB
            </span>
          )}
          <StatusBadge value={availableStock} className="absolute top-3 right-3 z-10" />
          <img
            src={image}
            alt={name}
            className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div onClick={onClick} className="text-center space-y-1.5 cursor-pointer mb-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight">{name}</h3>
          {year && <p className="text-xs text-gray-500 font-medium">{year}</p>}
          <p className="text-2xl font-bold bg-gradient-to-r from-surface-dark to-surface-dark-mid bg-clip-text text-transparent">
            $ {price.toLocaleString()}
          </p>
        </div>
        <ValueSelector
          value={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disableDecrement={quantity === 0}
          disableIncrement={availableStock === 0}
        />
      </div>
    </motion.div>
  )
}

