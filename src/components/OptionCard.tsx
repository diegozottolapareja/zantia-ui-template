import { Fingerprint } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface OptionCardProps {
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  accentClass?: string
}

export function OptionCard({ icon, title, description, onClick, disabled, loading, accentClass = 'from-purple-500/0 via-purple-500/10 to-purple-500/0 group-hover:via-purple-500/20' }: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-7 hover:bg-white/15 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] disabled:opacity-50 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${accentClass} transition-all duration-500`} />
      <div className="flex items-center gap-5 relative">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-xl font-medium text-white mb-1">{title}</h3>
          <p className="text-white/50 text-sm">{description}</p>
        </div>
        <Fingerprint className={`w-7 h-7 text-white/30 ${loading ? 'animate-pulse' : ''}`} />
      </div>
    </motion.button>
  )
}
