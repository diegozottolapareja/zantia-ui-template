import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { ConfirmModal } from '@/components/ConfirmModal'
import { MOCK_ASISTENCIAS, ESTADO_ASISTENCIA_CONFIG, type Asistencia } from '@/modules/fitness'

function groupByClase(asistencias: Asistencia[]) {
  return asistencias.reduce<Record<string, Asistencia[]>>((acc, a) => {
    const key = `${a.claseId}|${a.fecha}|${a.hora}`
    if (!acc[key]) acc[key] = []
    acc[key].push(a)
    return acc
  }, {})
}

export default function AttendanceReviewPage() {
  const pendientes = MOCK_ASISTENCIAS.filter(a => a.estadoRevision === 'pendiente')
  const grupos = groupByClase(pendientes)

  const [reviews, setReviews] = useState<Record<string, 'aprobada' | 'rechazada'>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(groupByClase(pendientes)).map(k => [k, true]))
  )
  const [confirmKey, setConfirmKey] = useState<string | null>(null)
  const [savedGroups, setSavedGroups] = useState<Set<string>>(new Set())

  function setAll(groupKey: string, action: 'aprobada' | 'rechazada') {
    const ids = grupos[groupKey].map(a => a.id)
    setReviews(prev => {
      const next = { ...prev }
      ids.forEach(id => { next[id] = action })
      return next
    })
  }

  function saveGroup(groupKey: string) {
    // In a real app: PATCH /api/attendance/review { ids, action }
    setSavedGroups(prev => new Set([...prev, groupKey]))
    setConfirmKey(null)
  }

  if (pendientes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader variant="brand" left={<h1 className="text-xl text-white">Revisar Asistencias</h1>} />
        <div className="p-8 text-center text-muted-foreground">No hay asistencias pendientes de revisión.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader variant="brand" left={<h1 className="text-xl text-white">Revisar Asistencias</h1>} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          {pendientes.length} asistencia{pendientes.length !== 1 ? 's' : ''} pendiente{pendientes.length !== 1 ? 's' : ''}
          en {Object.keys(grupos).length} clase{Object.keys(grupos).length !== 1 ? 's' : ''}
        </p>

        {Object.entries(grupos).map(([groupKey, asistencias]) => {
          const first = asistencias[0]
          const isSaved = savedGroups.has(groupKey)
          const isExpanded = expanded[groupKey] ?? true
          const groupReviewed = asistencias.every(a => reviews[a.id])

          return (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${isSaved ? 'border-green-200 opacity-60' : 'border-border'}`}
            >
              {/* Group header */}
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [groupKey]: !isExpanded }))}
                className="w-full p-4 text-left flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-dark-graphite">{first.claseNombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(first.fecha + 'T12:00:00').toLocaleDateString('es-AR')} · {first.hora} · {first.profesorNombre}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{asistencias.length} alumnos</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isSaved && <span className="text-xs text-green-600 font-medium">Guardado</span>}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Bulk actions */}
                    {!isSaved && (
                      <div className="px-4 pb-2 flex gap-2">
                        <button
                          onClick={() => setAll(groupKey, 'aprobada')}
                          className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                        >
                          Aprobar todos
                        </button>
                        <button
                          onClick={() => setAll(groupKey, 'rechazada')}
                          className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          Rechazar todos
                        </button>
                      </div>
                    )}

                    {/* Student rows */}
                    <div className="border-t border-border divide-y divide-border">
                      {asistencias.map(a => {
                        const estadoConf = ESTADO_ASISTENCIA_CONFIG[a.estado]
                        const rev = reviews[a.id]
                        return (
                          <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark-graphite truncate">{a.alumnoNombre}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${estadoConf.bgColor} ${estadoConf.color}`}>
                                {estadoConf.label}
                              </span>
                              {a.nota && <p className="text-xs text-muted-foreground mt-0.5 italic">{a.nota}</p>}
                            </div>
                            {!isSaved && (
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => setReviews(prev => ({ ...prev, [a.id]: 'aprobada' }))}
                                  className={`p-1.5 rounded-lg transition-colors ${rev === 'aprobada' ? 'bg-green-100' : 'hover:bg-muted'}`}
                                >
                                  <CheckCircle2 className={`w-4 h-4 ${rev === 'aprobada' ? 'text-green-600' : 'text-muted-foreground'}`} />
                                </button>
                                <button
                                  onClick={() => setReviews(prev => ({ ...prev, [a.id]: 'rechazada' }))}
                                  className={`p-1.5 rounded-lg transition-colors ${rev === 'rechazada' ? 'bg-red-100' : 'hover:bg-muted'}`}
                                >
                                  <XCircle className={`w-4 h-4 ${rev === 'rechazada' ? 'text-red-600' : 'text-muted-foreground'}`} />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Save group */}
                    {!isSaved && (
                      <div className="p-4 border-t border-border">
                        <button
                          onClick={() => setConfirmKey(groupKey)}
                          disabled={!groupReviewed}
                          className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                        >
                          Confirmar revisión ({asistencias.filter(a => reviews[a.id]).length}/{asistencias.length})
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </main>

      <ConfirmModal
        open={!!confirmKey}
        onOpenChange={open => { if (!open) setConfirmKey(null) }}
        title="Confirmar revisión"
        description="Las asistencias quedará marcadas como aprobadas o rechazadas según tu revisión."
        confirmLabel="Confirmar"
        onConfirm={() => confirmKey && saveGroup(confirmKey)}
      />
    </div>
  )
}
