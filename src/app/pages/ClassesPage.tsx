import { useState } from 'react'
import { Search, Clock, Users, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { PermissionGuard } from '@/app/components/PermissionGuard'
import { MOCK_CLASES, TIPO_CLASE_CONFIG, ESTADO_CLASE_CONFIG, type TipoClase } from '@/modules/fitness'

const TIPO_FILTERS: Array<{ label: string; value: TipoClase | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Pilates', value: 'pilates_reformer' },
  { label: 'Funcional', value: 'funcional' },
  { label: 'Spinning', value: 'spinning' },
  { label: 'Yoga', value: 'yoga' },
  { label: 'Musculación', value: 'musculacion' },
]

export default function ClassesPage() {
  const [query, setQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<TipoClase | 'all'>('all')

  const clases = MOCK_CLASES
    .filter(c => tipoFilter === 'all' || c.tipo === tipoFilter)
    .filter(c => {
      const q = query.toLowerCase()
      return c.nombre.toLowerCase().includes(q) || c.profesorNombre.toLowerCase().includes(q)
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader variant="brand" left={<h1 className="text-xl text-white">Clases</h1>} />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar clase o profesor..."
            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Tipo filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TIPO_FILTERS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTipoFilter(opt.value)}
              className={`shrink-0 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                tipoFilter === opt.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">{clases.length} clase{clases.length !== 1 ? 's' : ''}</p>

        <div className="space-y-3">
          {clases.map((clase, i) => {
            const tipoConf = TIPO_CLASE_CONFIG[clase.tipo]
            const estadoConf = ESTADO_CLASE_CONFIG[clase.estado]
            const inscriptos = clase.capacidad - clase.cuposDisponibles

            return (
              <motion.div
                key={clase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-border overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${tipoConf.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-graphite">{clase.nombre}</p>
                      <p className="text-sm text-muted-foreground">{clase.profesorNombre}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tipoConf.bg} ${tipoConf.textColor}`}>
                        {tipoConf.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${estadoConf.bgColor} ${estadoConf.color}`}>
                        {estadoConf.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(clase.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {clase.hora} · {clase.duracionMin} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {inscriptos}/{clase.capacidad}
                    </span>
                    {clase.sala && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {clase.sala}
                      </span>
                    )}
                  </div>
                  <PermissionGuard permission="entities:write">
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <button className="text-sm text-primary hover:underline">Editar</button>
                      <button className="text-sm text-red-600 hover:underline ml-auto">Cancelar</button>
                    </div>
                  </PermissionGuard>
                </div>
              </motion.div>
            )
          })}

          {clases.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground">
              No se encontraron clases.
            </div>
          )}
        </div>

        <PermissionGuard permission="entities:write">
          <button className="w-full bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors">
            + Nueva clase
          </button>
        </PermissionGuard>
      </main>
    </div>
  )
}
