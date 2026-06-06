import { useNavigate } from 'react-router'
import { Building2, Users, TrendingUp, AlertCircle, Settings, ScrollText, Plus, ChevronRight, Wheat, Activity } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { useAuth } from '../contexts/AuthContext'
import { MOCK_TENANTS, PLAN_CONFIG, ESTADO_CONFIG } from '@/data/mock/tenants'

function fmt(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const NAV_ITEMS = [
  { label: 'Tenants',       Icon: Building2,  route: '/super/tenants',   desc: 'Gestionar cuentas' },
  { label: 'Usuarios',      Icon: Users,      route: '/super/users',     desc: 'Todos los usuarios' },
  { label: 'Audit log',     Icon: ScrollText, route: '/super/audit',     desc: 'Actividad reciente' },
  { label: 'Configuración', Icon: Settings,   route: '/super/settings',  desc: 'Plataforma y planes' },
]

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const tenantsActivos  = MOCK_TENANTS.filter(t => t.estado === 'activo').length
  const totalUsuarios   = MOCK_TENANTS.reduce((s, t) => s + t.usuarios, 0)
  const totalComision   = MOCK_TENANTS.reduce((s, t) => s + t.comisionMes, 0)
  const pendientes      = MOCK_TENANTS.filter(t => t.estado === 'configurando').length
  const suspendidos     = MOCK_TENANTS.filter(t => t.estado === 'suspendido').length

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader
        variant="dark"
        left={
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Grainflow" className="h-8 w-auto" />
          </div>
        }
        center={
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full">PLATAFORMA</span>
          </div>
        }
        right={
          <button onClick={() => { logout(); navigate('/') }} className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1">
            Salir
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Administración de plataforma</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Hola {user?.name.split(' ')[0]} · Vista global de todos los tenants</p>
        </motion.div>

        {/* KPIs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Tenants activos</p>
            </div>
            <p className="text-3xl font-black text-foreground">{tenantsActivos}</p>
            <p className="text-xs text-muted-foreground mt-0.5">de {MOCK_TENANTS.length} totales</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Usuarios totales</p>
            </div>
            <p className="text-3xl font-black text-foreground">{totalUsuarios}</p>
            <p className="text-xs text-muted-foreground mt-0.5">en todos los tenants</p>
          </div>
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-mid rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <p className="text-xs text-white/60">Comisión total / mes</p>
            </div>
            <p className="text-2xl font-black text-white">USD {fmt(totalComision)}</p>
            <p className="text-xs text-white/40 mt-0.5">suma de todos los tenants</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-muted-foreground">Atención requerida</p>
            </div>
            <p className="text-3xl font-black text-orange-500">{pendientes + suspendidos}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{pendientes} config · {suspendidos} susp.</p>
          </div>
        </motion.div>

        {/* Alertas */}
        {(pendientes > 0 || suspendidos > 0) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-semibold text-amber-800">Tenants que requieren acción</p>
            </div>
            {MOCK_TENANTS.filter(t => t.estado === 'configurando' || t.estado === 'suspendido').map(t => {
              const estCfg = ESTADO_CONFIG[t.estado]
              return (
                <div key={t.id} className="flex items-center justify-between py-1.5">
                  <p className="text-sm text-amber-800">{t.nombre}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estCfg.color}`}>{estCfg.label}</span>
                </div>
              )
            })}
            <button onClick={() => navigate('/super/tenants')} className="mt-2 text-xs text-amber-700 hover:text-amber-900 underline">
              Ver todos los tenants →
            </button>
          </motion.div>
        )}

        {/* Navigation cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 mb-5">
          {NAV_ITEMS.map(({ label, Icon, route, desc }, i) => (
            <motion.button
              key={route}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(route)}
              className="bg-white border border-border rounded-2xl p-4 flex flex-col items-start text-left hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Tenants snapshot */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm">Tenants</h3>
            <button onClick={() => navigate('/super/tenants')} className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_TENANTS.slice(0, 4).map((t, i) => {
              const planCfg = PLAN_CONFIG[t.plan]
              const estCfg  = ESTADO_CONFIG[t.estado]
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.05 }}
                  onClick={() => navigate('/super/tenants')}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-primary/20 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wheat className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{t.nombre}</p>
                    <p className="text-xs text-muted-foreground">{t.region} · {t.usuarios} usuario{t.usuarios !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planCfg.color}`}>{planCfg.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${estCfg.color}`}>{estCfg.label}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Create tenant CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/super/tenants')}
          className="w-full mt-4 py-3.5 border-2 border-dashed border-primary/30 text-primary rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:border-primary/60 hover:bg-primary/5 transition-all"
        >
          <Plus className="w-4 h-4" /> Crear nuevo tenant
        </motion.button>
      </main>
    </div>
  )
}
