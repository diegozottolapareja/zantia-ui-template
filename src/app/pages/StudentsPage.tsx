import { useState } from 'react'
import { Search, Phone, Calendar } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { MOCK_ALUMNOS, ESTADO_ALUMNO_CONFIG, MEMBRESIA_CONFIG, type EstadoAlumno } from '@/modules/fitness'

const FILTER_OPTIONS: Array<{ label: string; value: EstadoAlumno | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'activo' },
  { label: 'Inactivos', value: 'inactivo' },
  { label: 'Suspendidos', value: 'suspendido' },
]

export default function StudentsPage() {
  const [query, setQuery] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<EstadoAlumno | 'all'>('all')

  const alumnos = MOCK_ALUMNOS
    .filter(a => estadoFilter === 'all' || a.estado === estadoFilter)
    .filter(a => {
      const q = query.toLowerCase()
      return a.nombre.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    })

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader variant="brand" left={<h1 className="text-xl text-white">Alumnos</h1>} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar alumno..."
            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Estado filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setEstadoFilter(opt.value)}
              className={`shrink-0 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                estadoFilter === opt.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">{alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}</p>

        {/* Student list */}
        <div className="space-y-3">
          {alumnos.map((alumno, i) => {
            const estadoConf = ESTADO_ALUMNO_CONFIG[alumno.estado]
            const membresiaConf = MEMBRESIA_CONFIG[alumno.membresia]
            return (
              <motion.div
                key={alumno.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                    {alumno.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-dark-graphite truncate">{alumno.nombre}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${estadoConf.bgColor} ${estadoConf.color}`}>
                        {estadoConf.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{alumno.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className={`font-medium ${membresiaConf.color}`}>{membresiaConf.label}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {alumno.asistenciasMes} asist. este mes
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {alumno.telefono}
                      </span>
                    </div>
                    {alumno.ultimaAsistencia && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Última asistencia: {new Date(alumno.ultimaAsistencia + 'T12:00:00').toLocaleDateString('es-AR')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
          {alumnos.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground">
              No se encontraron alumnos.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
