import { motion } from 'motion/react'

export function LoadingDots() {
  return (
    <div className="flex gap-3 justify-center py-10">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1, delay }}
          className="w-3 h-3 rounded-full bg-gradient-to-br from-surface-dark to-surface-dark-mid"
        />
      ))}
    </div>
  )
}
