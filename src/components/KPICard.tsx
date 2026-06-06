import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  change?: string
  positive?: boolean
  Icon: LucideIcon
  index?: number
}

export function KPICard({ label, value, change, positive = true, Icon, index = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-4 md:p-6 border border-border"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl md:text-3xl text-dark-graphite">{value}</p>
    </motion.div>
  )
}
