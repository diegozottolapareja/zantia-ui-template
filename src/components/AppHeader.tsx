import type { ReactNode } from 'react'

interface AppHeaderProps {
  variant?: 'dark' | 'brand'
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  className?: string
}

export function AppHeader({ variant = 'brand', left, center, right, bottom, className = '' }: AppHeaderProps) {
  const bg =
    variant === 'dark'
      ? 'bg-gradient-to-r from-surface-dark via-surface-dark-mid to-surface-dark'
      : 'bg-gradient-to-r from-primary to-accent'

  return (
    <header className={`${bg} px-4 py-4 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-lg ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">{left}</div>
          <div className="flex-1 flex items-center justify-center min-w-0">{center}</div>
          <div className="flex items-center">{right}</div>
        </div>
        {bottom && <div className="mt-4">{bottom}</div>}
      </div>
    </header>
  )
}
