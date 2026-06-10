import { Download, TrendingUp, Users, CalendarDays, ClipboardCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { KPICard } from '@/components/KPICard'
import { toast } from 'sonner'
import { MOCK_CLASES, MOCK_ALUMNOS, MOCK_ASISTENCIAS, TIPO_CLASE_CONFIG } from '@/modules/fitness'

// Derived metrics
const alumnosActivos = MOCK_ALUMNOS.filter(a => a.estado === 'activo').length
const totalClases = MOCK_CLASES.length
const totalAsistencias = MOCK_ASISTENCIAS.filter(a => a.estado === 'presente').length
const ocupacionPromedio = Math.round(
  MOCK_CLASES.reduce((acc, c) => acc + ((c.capacidad - c.cuposDisponibles) / c.capacidad) * 100, 0) /
  (MOCK_CLASES.length || 1)
)

// Chart data — asistencias por tipo de clase (mock)
const porTipo = MOCK_CLASES.reduce<Record<string, number>>((acc, c) => {
  const label = TIPO_CLASE_CONFIG[c.tipo].label
  acc[label] = (acc[label] ?? 0) + (c.capacidad - c.cuposDisponibles)
  return acc
}, {})

const chartData = Object.entries(porTipo).map(([name, value]) => ({ name, value }))

const kpis = [
  { label: 'Alumnos activos',    value: String(alumnosActivos),       change: `de ${MOCK_ALUMNOS.length} totales`,  Icon: Users,         positive: true  },
  { label: 'Clases registradas', value: String(totalClases),          change: 'en 3 días',                          Icon: CalendarDays,  positive: true  },
  { label: 'Asistencias hoy',    value: String(totalAsistencias),     change: 'confirmadas',                         Icon: ClipboardCheck, positive: true },
  { label: 'Ocupación media',    value: `${ocupacionPromedio}%`,      change: 'de capacidad',                        Icon: TrendingUp,    positive: ocupacionPromedio > 60 },
]

export default function ReportsPage() {
  function handleExport() {
    const csv = [
      'Tipo,Inscriptos',
      ...chartData.map(d => `${d.name},${d.value}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'origen-reporte.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Reporte exportado')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader variant="brand" left={<h1 className="text-xl text-white">Reportes</h1>} />

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* KPIs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-3">
            {kpis.map((k, i) => <KPICard key={k.label} {...k} index={i} />)}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg text-dark-graphite mb-3">Inscriptos por tipo de clase</h2>
          <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
            {chartData.map(d => {
              const pct = Math.round((d.value / Math.max(...chartData.map(x => x.value))) * 100)
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-36 shrink-0">{d.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-dark-graphite w-8 text-right">{d.value}</span>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Export */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </motion.div>
      </main>
    </div>
  )
}
