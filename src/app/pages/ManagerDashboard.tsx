import { useNavigate } from 'react-router'
import { BarChart3, CalendarDays, Users, TrendingUp, ClipboardCheck, Award } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { KPICard } from '@/components/KPICard'
import { MetricCard } from '@/components/MetricCard'
import { MOCK_CLASES, MOCK_ALUMNOS, MOCK_ASISTENCIAS, MOCK_PROFESORES, TIPO_CLASE_CONFIG } from '@/modules/fitness'

const HOY = '2026-06-10'

// Derived KPIs
const clasesHoy = MOCK_CLASES.filter(c => c.fecha === HOY)
const alumnosActivos = MOCK_ALUMNOS.filter(a => a.estado === 'activo').length
const ocupacionPromedio = Math.round(
  clasesHoy.reduce((acc, c) => acc + ((c.capacidad - c.cuposDisponibles) / c.capacidad) * 100, 0) /
  (clasesHoy.length || 1)
)
const totalAsistenciasHoy = MOCK_ASISTENCIAS.filter(a => a.fecha === HOY && a.estado === 'presente').length

// Clases por tipo
const clasesPorTipo = MOCK_CLASES.reduce<Record<string, number>>((acc, c) => {
  acc[c.tipo] = (acc[c.tipo] ?? 0) + 1
  return acc
}, {})

const topTipos = Object.entries(clasesPorTipo)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)

export default function ManagerDashboard() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Clases Hoy',         value: String(clasesHoy.length),      change: `${clasesHoy.filter(c => c.estado === 'finalizada').length} finalizadas`, Icon: CalendarDays,  positive: true },
    { label: 'Alumnos Activos',    value: String(alumnosActivos),         change: `de ${MOCK_ALUMNOS.length} totales`,                                       Icon: Users,         positive: true },
    { label: 'Ocupación Promedio', value: `${ocupacionPromedio}%`,        change: 'capacidad media',                                                         Icon: TrendingUp,    positive: ocupacionPromedio > 60 },
    { label: 'Presentes Hoy',      value: String(totalAsistenciasHoy),    change: 'asistencias confirmadas',                                                 Icon: ClipboardCheck, positive: true },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="brand"
        left={
          <div>
            <h1 className="text-xl text-white">Dashboard Manager</h1>
            <p className="text-sm text-white/80">Métricas en tiempo real</p>
          </div>
        }
      />

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* KPI grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <KPICard key={s.label} {...s} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Metric cards */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg text-dark-graphite mb-3">Métricas del mes</h2>
          <div className="grid grid-cols-1 gap-3">
            <MetricCard
              label="Total de alumnos"
              value={`${MOCK_ALUMNOS.length} alumnos`}
              change="+2 este mes"
              positive={true}
              Icon={Users}
              gradient="from-blue-500 to-indigo-600"
            />
            <MetricCard
              label="Profesores activos"
              value={`${MOCK_PROFESORES.filter(p => p.estado === 'activo').length} profesores`}
              Icon={Award}
              gradient="from-emerald-500 to-green-600"
            />
          </div>
        </motion.section>

        {/* Top class types */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg text-dark-graphite mb-3">Clases más frecuentes</h2>
          <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
            {topTipos.map(([tipo, count]) => {
              const conf = TIPO_CLASE_CONFIG[tipo as keyof typeof TIPO_CLASE_CONFIG]
              const pct = Math.round((count / MOCK_CLASES.length) * 100)
              return (
                <div key={tipo} className="p-4 flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${conf.color}`} />
                  <span className="flex-1 text-dark-graphite">{conf.label}</span>
                  <span className="text-sm text-muted-foreground">{count} clases</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${conf.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* Quick nav */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/reports')}
              className="bg-white rounded-2xl border border-border p-4 text-left hover:border-primary hover:shadow-md transition-all"
            >
              <BarChart3 className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-dark-graphite">Reportes</p>
              <p className="text-sm text-muted-foreground">KPIs y exportación</p>
            </button>
            <button
              onClick={() => navigate('/schedule')}
              className="bg-white rounded-2xl border border-border p-4 text-left hover:border-primary hover:shadow-md transition-all"
            >
              <CalendarDays className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-dark-graphite">Agenda</p>
              <p className="text-sm text-muted-foreground">Ver todas las clases</p>
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
