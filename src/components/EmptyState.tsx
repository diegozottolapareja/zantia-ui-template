import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  Icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-center mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-surface-dark to-surface-dark-mid text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
