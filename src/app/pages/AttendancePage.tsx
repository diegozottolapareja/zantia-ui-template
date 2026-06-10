import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { ConfirmModal } from '@/components/ConfirmModal'
import {
  MOCK_CLASES, MOCK_ASISTENCIAS, MOCK_ALUMNOS,
  ESTADO_ASISTENCIA_CONFIG, type EstadoAsistencia, type Asistencia,
} from '@/modules/fitness'

type LocalAsistencia = Asistencia & { _dirty?: boolean }

const HOY = '2026-06-10'

export default function AttendancePage() {
  const [searchParams] = useSearchParams()
  const claseId = searchParams.get('claseId')

  // Determine which class to show — if no query param, show first finished class today
  const clase = claseId
    ? MOCK_CLASES.find(c => c.id === claseId)
    : MOCK_CLASES.filter(c => c.fecha === HOY && c.estado === 'finalizada')[0]

  const alumnosInscritos = MOCK_ALUMNOS.slice(0, clase ? clase.capacidad - clase.cuposDisponibles : 0)

  const [records, setRecords] = useState<LocalAsistencia[]>(() => {
    if (!clase) return []
    const existing = MOCK_ASISTENCIAS.filter(a => a.claseId === clase.id)
    if (existing.length > 0) return existing
    // Generate pending records for enrolled students
    return alumnosInscritos.map(a => ({
      id: `new-${a.id}`,
      claseId: clase.id,
      claseNombre: clase.nombre,
      alumnoId: a.id,
      alumnoNombre: a.nombre,
      profesorId: clase.profesorId,
      profesorNombre: clase.profesorNombre,
      fecha: clase.fecha,
      hora: clase.hora,
      estado: 'pendiente' as EstadoAsistencia,
      estadoRevision: 'pendiente' as const,
    }))
  })

  const [confirmSave, setConfirmSave] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedClaseId, setSelectedClaseId] = useState(clase?.id ?? '')
  const [showClaseSelector, setShowClaseSelector] = useState(false)

  const clasesFinalizadasHoy = MOCK_CLASES.filter(c => c.fecha === HOY && c.estado === 'finalizada')

  function toggleEstado(alumnoId: string) {
    setRecords(prev => prev.map(r => {
      if (r.alumnoId !== alumnoId) return r
      const next: EstadoAsistencia = r.estado === 'pendiente'
        ? 'presente'
        : r.estado === 'presente' ? 'ausente' : 'pendiente'
      return { ...r, estado: next, _dirty: true }
    }))
  }

  function handleSave() {
    // In a real app: POST /api/attendance { records }
    setSaved(true)
    setConfirmSave(false)
  }

  const pendienteCount = records.filter(r => r.estado === 'pendiente').length
  const presenteCount = records.filter(r => r.estado === 'presente').length
  const ausenteCount = records.filter(r => r.estado === 'ausente').length

  if (!clase) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="brand" left={<h1 className="text-xl text-white">Asistencias</h1>} />
        <div className="p-8 text-center text-muted-foreground">No hay clases finalizadas para registrar asistencia.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <AppHeader variant="brand" left={<h1 className="text-xl text-white">Asistencias</h1>} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Clase selector */}
        <div className="relative">
          <button
            onClick={() => setShowClaseSelector(v => !v)}
            className="w-full bg-white rounded-2xl border border-border p-4 text-left flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-dark-graphite">{clase.nombre}</p>
              <p className="text-sm text-muted-foreground">{clase.hora} · {clase.profesorNombre}</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showClaseSelector ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showClaseSelector && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-border shadow-lg z-10 overflow-hidden"
              >
                {clasesFinalizadasHoy.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClaseId(c.id)
                      setShowClaseSelector(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-muted transition-colors flex justify-between ${c.id === selectedClaseId ? 'bg-primary/5' : ''}`}
                  >
                    <span className="font-medium">{c.nombre}</span>
                    <span className="text-sm text-muted-foreground">{c.hora}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary chips */}
        <div className="flex gap-2">
          {[
            { label: `${presenteCount} presentes`, color: 'bg-green-100 text-green-700' },
            { label: `${ausenteCount} ausentes`, color: 'bg-red-100 text-red-700' },
            { label: `${pendienteCount} pendientes`, color: 'bg-yellow-100 text-yellow-700' },
          ].map(c => (
            <span key={c.label} className={`text-xs px-3 py-1 rounded-full font-medium ${c.color}`}>{c.label}</span>
          ))}
        </div>

        {/* Attendance list */}
        <div className="space-y-2">
          {records.map((r, i) => {
            const conf = ESTADO_ASISTENCIA_CONFIG[r.estado]
            return (
              <motion.div
                key={r.alumnoId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                  {r.alumnoNombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-graphite truncate">{r.alumnoNombre}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${conf.bgColor} ${conf.color}`}>
                    {conf.label}
                  </span>
                </div>
                {!saved && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setRecords(prev => prev.map(rec =>
                          rec.alumnoId === r.alumnoId ? { ...rec, estado: 'presente', _dirty: true } : rec
                        ))
                      }}
                      className={`p-2 rounded-xl transition-colors ${r.estado === 'presente' ? 'bg-green-100' : 'hover:bg-muted'}`}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${r.estado === 'presente' ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </button>
                    <button
                      onClick={() => {
                        setRecords(prev => prev.map(rec =>
                          rec.alumnoId === r.alumnoId ? { ...rec, estado: 'ausente', _dirty: true } : rec
                        ))
                      }}
                      className={`p-2 rounded-xl transition-colors ${r.estado === 'ausente' ? 'bg-red-100' : 'hover:bg-muted'}`}
                    >
                      <XCircle className={`w-5 h-5 ${r.estado === 'ausente' ? 'text-red-600' : 'text-muted-foreground'}`} />
                    </button>
                    <button
                      onClick={() => toggleEstado(r.alumnoId)}
                      className={`p-2 rounded-xl transition-colors ${r.estado === 'pendiente' ? 'bg-yellow-100' : 'hover:bg-muted'}`}
                    >
                      <Clock className={`w-5 h-5 ${r.estado === 'pendiente' ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center text-green-700 font-medium">
            Asistencia guardada correctamente. Pendiente de aprobación.
          </div>
        )}
      </main>

      {!saved && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border max-w-2xl mx-auto">
          <button
            onClick={() => setConfirmSave(true)}
            disabled={pendienteCount === records.length}
            className="w-full bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Guardar asistencia ({records.length - pendienteCount} registradas)
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmSave}
        onOpenChange={setConfirmSave}
        title="Confirmar asistencia"
        description={`Vas a registrar la asistencia de ${presenteCount} presentes y ${ausenteCount} ausentes para ${clase.nombre}. Una vez guardada, quedará pendiente de aprobación del administrador.`}
        confirmLabel="Guardar"
        onConfirm={handleSave}
      />
    </div>
  )
}
