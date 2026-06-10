import { useNavigate } from 'react-router'
import { CalendarDays, ClipboardCheck, ChevronRight, Clock, Users, CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { KPICard } from '@/components/KPICard'
import { useAuth } from '@/app/contexts/AuthContext'
import { MOCK_CLASES, MOCK_ASISTENCIAS, TIPO_CLASE_CONFIG, ESTADO_CLASE_CONFIG } from '@/modules/fitness'

const HOY = '2026-06-10'

export default function ProfesorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Filter classes for today belonging to this professor
  // In demo mode the logged-in profesor is Sofía (prof-001)
  const miId = user?.id === 'demo-profesor' ? 'prof-001' : user?.id ?? ''
  const misClasesHoy = MOCK_CLASES.filter(c => c.fecha === HOY && c.profesorId === miId)
  const totalAlumnos = misClasesHoy.reduce((acc, c) => acc + (c.capacidad - c.cuposDisponibles), 0)
  const asistenciasRegistradas = MOCK_ASISTENCIAS.filter(
    a => a.profesorId === miId && a.fecha === HOY
  ).length
  const clasesFinalizadas = misClasesHoy.filter(c => c.estado === 'finalizada').length

  const stats = [
    { label: 'Clases Hoy',           value: String(misClasesHoy.length), change: `${clasesFinalizadas} finalizadas`, Icon: CalendarDays,  positive: true },
    { label: 'Alumnos Inscriptos',   value: String(totalAlumnos),        change: 'en total hoy',                      Icon: Users,         positive: true },
    { label: 'Asistencias Cargadas', value: String(asistenciasRegistradas), change: 'registradas',                   Icon: CheckCircle2,  positive: true },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="brand"
        left={
          <div>
            <h1 className="text-xl text-white">Buen día, {user?.name?.split(' ')[0]}</h1>
            <p className="text-sm text-white/80">Tus clases de hoy</p>
          </div>
        }
      />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <KPICard key={s.label} {...s} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Today's classes */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg text-dark-graphite mb-3">Agenda de hoy</h2>
          {misClasesHoy.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground">
              No tenés clases programadas para hoy.
            </div>
          ) : (
            <div className="space-y-3">
              {misClasesHoy
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((clase, i) => {
                  const tipoConf = TIPO_CLASE_CONFIG[clase.tipo]
                  const estadoConf = ESTADO_CLASE_CONFIG[clase.estado]
                  const inscriptos = clase.capacidad - clase.cuposDisponibles
                  const asistenciasClase = MOCK_ASISTENCIAS.filter(a => a.claseId === clase.id).length
                  const puedeCargarAsistencia = clase.estado === 'finalizada' && asistenciasClase === 0

                  return (
                    <motion.div
                      key={clase.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white rounded-2xl border border-border overflow-hidden"
                    >
                      <div className={`h-1 bg-gradient-to-r ${tipoConf.color}`} />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-dark-graphite truncate">{clase.nombre}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${estadoConf.bgColor} ${estadoConf.color}`}>
                                {estadoConf.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {clase.hora} · {clase.duracionMin} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {inscriptos}/{clase.capacidad}
                              </span>
                              {clase.sala && <span>{clase.sala}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {puedeCargarAsistencia && (
                              <button
                                onClick={() => navigate(`/attendance?claseId=${clase.id}`)}
                                className="flex items-center gap-1.5 bg-primary text-white text-sm px-3 py-1.5 rounded-xl hover:bg-primary/90 transition-colors"
                              >
                                <ClipboardCheck className="w-4 h-4" />
                                Cargar asistencia
                              </button>
                            )}
                            {asistenciasClase > 0 && (
                              <button
                                onClick={() => navigate(`/attendance?claseId=${clase.id}`)}
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                Ver <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                            {clase.estado === 'programada' && (
                              <span className="text-sm text-muted-foreground italic">Próxima</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}
        </motion.section>

        {/* Quick nav */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg text-dark-graphite mb-3">Acceso rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/schedule')}
              className="bg-white rounded-2xl border border-border p-4 text-left hover:border-primary hover:shadow-md transition-all"
            >
              <CalendarDays className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-dark-graphite">Agenda completa</p>
              <p className="text-sm text-muted-foreground">Ver todas las clases</p>
            </button>
            <button
              onClick={() => navigate('/attendance')}
              className="bg-white rounded-2xl border border-border p-4 text-left hover:border-primary hover:shadow-md transition-all"
            >
              <ClipboardCheck className="w-8 h-8 text-primary mb-2" />
              <p className="font-medium text-dark-graphite">Asistencias</p>
              <p className="text-sm text-muted-foreground">Ver historial</p>
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
