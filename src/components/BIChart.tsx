import { appConfig, type BIChartId } from '@/config/appConfig'

interface BIChartProps {
  id: BIChartId
  className?: string
  title?: string
}

export function BIChart({ id, className = '', title }: BIChartProps) {
  const chart = appConfig.BI_CHARTS.find((c) => c.id === id)

  if (!chart) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl p-8 text-muted-foreground text-sm ${className}`}>
        Chart "{id}" not found in appConfig.BI_CHARTS
      </div>
    )
  }

  if (!chart.url) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted rounded-xl p-8 gap-2 ${className}`}>
        <p className="text-muted-foreground text-sm font-medium">{chart.name}</p>
        <p className="text-muted-foreground text-xs">
          Configurá la URL en <code className="bg-background px-1 rounded">appConfig.BI_CHARTS</code>
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-border ${className}`}>
      <iframe
        src={chart.url}
        title={title ?? chart.name}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
