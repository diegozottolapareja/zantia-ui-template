import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, LogIn, Settings, Building2, UserPlus, TrendingUp, AlertTriangle, Filter } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'

type EventType = 'login' | 'config' | 'tenant' | 'user' | 'operation' | 'alert'

interface AuditEvent {
  id: string
  timestamp: string
  type: EventType
  tenant: string
  usuario: string
  descripcion: string
  ip?: string
}

const ICON_MAP: Record<EventType, typeof LogIn> = {
  login:     LogIn,
  config:    Settings,
  tenant:    Building2,
  user:      UserPlus,
  operation: TrendingUp,
  alert:     AlertTriangle,
}

const COLOR_MAP: Record<EventType, string> = {
  login:     'text-blue-600 bg-blue-50',
  config:    'text-orange-600 bg-orange-50',
  tenant:    'text-primary bg-primary/10',
  user:      'text-purple-600 bg-purple-50',
  operation: 'text-success bg-success/10',
  alert:     'text-destructive bg-destructive/10',
}

const MOCK_EVENTS: AuditEvent[] = [
  { id: 'e1',  timestamp: '2026-06-06T14:32:00', type: 'login',     tenant: 'Mesa Don Pepe',      usuario: 'carlos@mdb.com',       descripcion: 'Inicio de sesión exitoso', ip: '190.210.14.5' },
  { id: 'e2',  timestamp: '2026-06-06T13:58:00', type: 'config',    tenant: 'Grainflow Mendoza',  usuario: 'admin@gfmendoza.com',  descripcion: 'Parámetros actualizados: retención soja 24% → 25%' },
  { id: 'e3',  timestamp: '2026-06-06T13:21:00', type: 'operation', tenant: 'Corredor del Sur',   usuario: 'broker@cdelsur.com',   descripcion: 'Operación registrada: 500tn Soja AGD · Comisión USD 2,062' },
  { id: 'e4',  timestamp: '2026-06-06T12:45:00', type: 'user',      tenant: 'Mesa Don Pepe',      usuario: 'super@grainflow.com',  descripcion: 'Nuevo usuario invitado: lucia@mdb.com (Broker)' },
  { id: 'e5',  timestamp: '2026-06-06T11:30:00', type: 'tenant',    tenant: 'Plataforma',         usuario: 'super@grainflow.com',  descripcion: 'Nuevo tenant creado: Broker Cuyo (trial)' },
  { id: 'e6',  timestamp: '2026-06-06T10:15:00', type: 'alert',     tenant: 'Agro Norte SA',      usuario: 'sistema',              descripcion: 'Tenant suspendido por falta de pago (plan Pro)' },
  { id: 'e7',  timestamp: '2026-06-06T09:42:00', type: 'login',     tenant: 'Grainflow Mendoza',  usuario: 'broker2@gfm.com',      descripcion: 'Inicio de sesión desde dispositivo nuevo', ip: '201.58.32.9' },
  { id: 'e8',  timestamp: '2026-06-05T18:20:00', type: 'config',    tenant: 'Mesa Don Pepe',      usuario: 'admin@mdb.com',        descripcion: 'Comisión corredor actualizada: 1.5% → 1.8%' },
  { id: 'e9',  timestamp: '2026-06-05T16:05:00', type: 'operation', tenant: 'Grainflow Mendoza',  usuario: 'broker@gfm.com',       descripcion: 'Operación registrada: 800tn Maíz Cargill · Comisión USD 2,160' },
  { id: 'e10', timestamp: '2026-06-05T14:30:00', type: 'user',      tenant: 'Corredor del Sur',   usuario: 'admin@cdelsur.com',    descripcion: 'Contraseña restablecida para jose@cdelsur.com' },
]

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  if (diffH < 1) return `Hace ${Math.floor(diffMs / 60000)} min`
  if (diffH < 24) return `Hace ${diffH}h`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const TYPE_LABELS: Record<EventType, string> = {
  login: 'Login', config: 'Config', tenant: 'Tenant', user: 'Usuario', operation: 'Operación', alert: 'Alerta',
}

export default function AuditLogPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<EventType | 'all'>('all')

  const filtered = filter === 'all' ? MOCK_EVENTS : MOCK_EVENTS.filter(e => e.type === filter)

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Audit Log</h1>}
      />

      <main className="max-w-2xl mx-auto p-4">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(['all', 'login', 'config', 'operation', 'user', 'tenant', 'alert'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === f ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Todos' : TYPE_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((event, i) => {
            const Icon = ICON_MAP[event.type]
            const color = COLOR_MAP[event.type]
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white border border-border rounded-xl p-3.5 flex gap-3 items-start"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{event.descripcion}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-primary font-medium">{event.tenant}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground truncate">{event.usuario}</span>
                    {event.ip && (
                      <>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground/60 font-mono">{event.ip}</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/60 flex-shrink-0 mt-0.5">{formatTimestamp(event.timestamp)}</p>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Mostrando últimos {filtered.length} eventos · Retención: 90 días
        </p>
      </main>
    </div>
  )
}
