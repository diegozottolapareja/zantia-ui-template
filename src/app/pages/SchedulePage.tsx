import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { useAuth } from '@/app/contexts/AuthContext'
import { MOCK_CLASES, MOCK_PROFESORES, TIPO_CLASE_CONFIG, ESTADO_CLASE_CONFIG, type Clase } from '@/modules/fitness'

const DATES = ['2026-06-09', '2026-06-10', '2026-06-11']
const DATE_LABELS: Record<string, string> = {
  '2026-06-09': 'Ayer',
  '2026-06-10': 'Hoy',
  '2026-06-11': 'Mañana',
}

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function SchedulePage() {
  const navigate = useNavigate()
  const { can } = useAuth()
  const [selectedDate, setSelectedDate] = useState('2026-06-10')
  const [selectedProfesor, setSelectedProfesor] = useState<string>('all')

  const profesores = MOCK_PROFESORES.filter(p => p.estado === 'activo')

  const clasesFiltradas = MOCK_CLASES
    .filter(c => c.fecha === selectedDate)
    .filter(c => selectedProfesor === 'all' || c.profesorId === selectedProfesor)
    .sort((a, b) => a.hora.localeCompare(b.hora))

  const currentIdx = DATES.indexOf(selectedDate)

  function ClaseCard({ clase }: { clase: Clase }) {
    const tipoConf = TIPO_CLASE_CONFIG[clase.tipo]
    const estadoConf = ESTADO_CLASE_CONFIG[clase.estado]
    const inscriptos = clase.capacidad - clase.cuposDisponibles
    const llena = clase.cuposDisponibles === 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-border overflow-hidden"
      >
        <div className={`h-1.5 bg-gradient-to-r ${tipoConf.color}`} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-medium text-dark-graphite">{clase.nombre}</p>
              <p className={`text-xs ${tipoConf.textColor} ${tipoConf.bg} inline-block px-2 py-0.5 rounded-full mt-0.5`}>
                {tipoConf.label}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${estadoConf.bgColor} ${estadoConf.color}`}>
              {estadoConf.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {clase.hora} · {clase.duracionMin} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span className={llena ? 'text-red-600 font-medium' : ''}>{inscriptos}/{clase.capacidad}</span>
              {llena && <span className="text-red-600 text-xs">(llena)</span>}
            </span>
            {clase.sala && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {clase.sala}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{clase.profesorNombre}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="brand"
        left={<h1 className="text-xl text-white">Agenda</h1>}
      />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Date selector */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => currentIdx > 0 && setSelectedDate(DATES[currentIdx - 1])}
            disabled={currentIdx === 0}
            className="p-2 rounded-xl border border-border disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {DATES.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`flex-1 min-w-0 text-center py-2 px-3 rounded-xl border text-sm transition-all ${
                  d === selectedDate
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-muted-foreground border-border hover:border-primary'
                }`}
              >
                <span className="block font-medium">{DATE_LABELS[d]}</span>
                <span className="block text-xs opacity-70">{formatDate(d)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => currentIdx < DATES.length - 1 && setSelectedDate(DATES[currentIdx + 1])}
            disabled={currentIdx === DATES.length - 1}
            className="p-2 rounded-xl border border-border disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Profesor filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedProfesor('all')}
            className={`shrink-0 px-3 py-1.5 rounded-xl border text-sm transition-all ${
              selectedProfesor === 'all'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-muted-foreground border-border'
            }`}
          >
            Todos
          </button>
          {profesores.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProfesor(p.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                selectedProfesor === p.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border'
              }`}
            >
              {p.nombre.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Classes list */}
        {clasesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground">
            No hay clases para los filtros seleccionados.
          </div>
        ) : (
          <div className="space-y-3">
            {clasesFiltradas.map(c => <ClaseCard key={c.id} clase={c} />)}
          </div>
        )}

        {can('schedule:manage') && (
          <button
            onClick={() => navigate('/classes')}
            className="w-full bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            Gestionar clases
          </button>
        )}
      </main>
    </div>
  )
}
