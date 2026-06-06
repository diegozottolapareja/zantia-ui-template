import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Save, RotateCcw, Globe, Mail, Key, Shield, Zap, ChevronRight, Copy, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { PLAN_CONFIG } from '@/data/mock/tenants'

interface ToggleRowProps { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }
function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

const MOCK_API_KEYS = [
  { id: 'key-1', nombre: 'Integración ERP',       creado: '2026-01-15', ultimo: 'Hace 2 horas',  activa: true },
  { id: 'key-2', nombre: 'Webhook notificaciones', creado: '2026-03-22', ultimo: 'Hace 1 día',    activa: true },
  { id: 'key-3', nombre: 'Backup externo',          creado: '2025-11-01', ultimo: 'Hace 2 semanas',activa: false },
]

export default function PlatformSettingsPage() {
  const navigate = useNavigate()

  const [demoMode,        setDemoMode]        = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [emailNotifs,     setEmailNotifs]     = useState(true)
  const [autoBackup,      setAutoBackup]      = useState(true)
  const [twoFactor,       setTwoFactor]       = useState(false)
  const [apiRateLimit,    setApiRateLimit]    = useState(true)

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Configuración de plataforma</h1>}
      />

      <main className="max-w-2xl mx-auto p-4 space-y-4">

        {maintenanceMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive font-medium">Modo mantenimiento activo — los tenants no pueden acceder a la plataforma.</p>
          </motion.div>
        )}

        {/* Feature flags */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Feature flags globales</h3>
          </div>
          <ToggleRow label="DEMO_MODE" description="Todos los tenants ven el selector de roles en login" checked={demoMode} onChange={v => { setDemoMode(v); toast.info(`Demo mode ${v ? 'activado' : 'desactivado'} globalmente`) }} />
          <ToggleRow label="Modo mantenimiento" description="Bloquea el acceso a todos los tenants (muestra mensaje)" checked={maintenanceMode} onChange={v => { setMaintenanceMode(v); if (v) toast.error('Modo mantenimiento ACTIVADO — tenants sin acceso') }} />
          <ToggleRow label="Notificaciones email" description="Envío automático de alertas operativas" checked={emailNotifs} onChange={setEmailNotifs} />
          <ToggleRow label="Backup automático" description="Snapshot diario de datos de operaciones" checked={autoBackup} onChange={setAutoBackup} />
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Seguridad</h3>
          </div>
          <ToggleRow label="2FA obligatorio para admins" description="Todos los administradores de tenant deben configurar 2FA" checked={twoFactor} onChange={v => { setTwoFactor(v); toast.success(v ? '2FA obligatorio activado' : '2FA ahora opcional') }} />
          <ToggleRow label="Rate limiting API" description="Limitar requests por minuto por tenant" checked={apiRateLimit} onChange={setApiRateLimit} />
          <button onClick={() => toast.info('Generación de reporte de seguridad: próximamente')} className="w-full mt-3 flex items-center justify-between py-2.5 hover:bg-muted/30 rounded-lg px-1 transition-colors text-sm text-muted-foreground">
            <span>Ver reporte de seguridad</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Plans */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Planes y precios</h3>
          </div>
          <div className="space-y-2">
            {(Object.entries(PLAN_CONFIG) as [string, typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG]][]).map(([key, plan]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-dashed border-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan.color}`}>{plan.label}</span>
                  <span className="text-xs text-muted-foreground">hasta {plan.maxUsers === 999 ? 'sin límite' : plan.maxUsers} usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {plan.precio === 0 ? 'Gratis' : `USD ${plan.precio}/mes`}
                  </span>
                  <button onClick={() => toast.info('Editor de plan: próximamente')} className="text-xs text-primary hover:underline">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Keys */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">API Keys de plataforma</h3>
            </div>
            <button onClick={() => toast.success('API Key generada')} className="text-xs text-primary hover:underline">+ Nueva</button>
          </div>
          <div className="space-y-2">
            {MOCK_API_KEYS.map(k => (
              <div key={k.id} className={`flex items-center gap-3 py-2.5 border-b border-dashed border-border last:border-0 ${!k.activa ? 'opacity-50' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{k.nombre}</p>
                  <p className="text-xs text-muted-foreground">Último uso: {k.ultimo} · Creada {k.creado}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toast.success('Clave copiada al portapapeles')} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${k.activa ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {k.activa ? 'Activa' : 'Revocada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email config */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Notificaciones de sistema</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Email remitente', value: 'noreply@grainflow.com.ar' },
              { label: 'Email soporte',   value: 'soporte@grainflow.com.ar' },
              { label: 'Proveedor SMTP',  value: 'Resend (configurado)' },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1.5 border-b border-dashed border-border last:border-0">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info('Editor de configuración SMTP: próximamente')} className="mt-3 w-full py-2 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
            Editar configuración de correo
          </button>
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="bg-white border border-destructive/20 rounded-2xl p-4">
          <h3 className="font-semibold text-destructive text-sm mb-3">Zona de peligro</h3>
          <div className="space-y-2">
            <button onClick={() => toast.error('Requiere confirmación escrita: borrar todos los datos')} className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-destructive/5 rounded-xl transition-colors text-sm text-destructive text-left">
              <span>Purgar datos de demo de todos los tenants</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => toast.error('Acción irreversible — no disponible en demo')} className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-destructive/5 rounded-xl transition-colors text-sm text-destructive text-left">
              <span>Resetear toda la plataforma</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.success('Configuración guardada')}
          className="w-full py-4 bg-gradient-to-r from-surface-dark to-surface-dark-mid text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Save className="w-5 h-5" /> Guardar cambios
        </motion.button>
      </main>
    </div>
  )
}
