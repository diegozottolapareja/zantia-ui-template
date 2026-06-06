import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  Icon: LucideIcon
  onClick: () => void
}

interface BottomNavProps {
  items: NavItem[]
  activeId: string
}

export function BottomNav({ items, activeId }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex px-2">
        {items.map(({ id, label, Icon, onClick }) => {
          const active = id === activeId
          return (
            <button
              key={id}
              onClick={onClick}
              className={`flex-1 py-3 flex flex-col items-center gap-1.5 transition-all duration-200 ${
                active ? 'text-surface-dark' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
