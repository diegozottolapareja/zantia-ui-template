import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Plus, Search, MoreVertical, Building2, Users, TrendingUp, ExternalLink, PauseCircle, PlayCircle, Trash2, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { MOCK_TENANTS, PLAN_CONFIG, ESTADO_CONFIG, type Tenant, type EstadoTenant } from '@/data/mock/tenants'

function fmt(n: number) { return n.toLocaleString('en-US', { maximumFractionDigits: 0 }) }

export default function TenantsPage() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS)
  const [search, setSearch]     = useState('')
  const [menuId, setMenuId]     = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = tenants.filter(t =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    t.region.toLowerCase().includes(search.toLowerCase())
  )

  const cambiarEstado = (id: string, estado: EstadoTenant) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, estado } : t))
    setMenuId(null)
    toast.success('Estado actualizado')
  }

  const handleAcceder = (t: Tenant) => {
    toast.success(`Accediendo como admin de ${t.nombre}`, { description: 'Modo impersonación (demo)' })
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Tenants</h1>}
        right={
          <button onClick={() => setShowForm(true)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total',     value: tenants.length },
            { label: 'Activos',   value: tenants.filter(t => t.estado === 'activo').length },
            { label: 'Trial',     value: tenants.filter(t => t.estado === 'configurando' || t.plan === 'trial').length },
            { label: 'Susp.',     value: tenants.filter(t => t.estado === 'suspendido').length },
          ].map(s => (
            <div key={s.label} className="bg-white border border-border rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar tenant o región..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {filtered.length === 0
          ? <EmptyState Icon={Building2} title="Sin resultados" description="No hay tenants que coincidan con la búsqueda." />
          : (
            <div className="space-y-3">
              {filtered.map((t, i) => {
                const planCfg = PLAN_CONFIG[t.plan]
                const estCfg  = ESTADO_CONFIG[t.estado]
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white border rounded-2xl p-4 ${t.estado === 'suspendido' ? 'opacity-60 border-destructive/20' : 'border-border'}`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{t.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.razonSocial} · CUIT {t.cuit}</p>
                        <p className="text-xs text-muted-foreground">{t.region}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${planCfg.color}`}>{planCfg.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${estCfg.color}`}>{estCfg.label}</span>
                      </div>
                      <div className="relative ml-1">
                        <button onClick={() => setMenuId(menuId === t.id ? null : t.id)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuId === t.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-10 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[190px]"
                            >
                              <button onClick={() => handleAcceder(t)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left">
                                <ExternalLink className="w-4 h-4 text-primary" /> Acceder como admin
                              </button>
                              <button onClick={() => { toast.info('Copiado al portapapeles'); setMenuId(null) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left">
                                <Copy className="w-4 h-4 text-muted-foreground" /> Copiar ID tenant
                              </button>
                              <div className="border-t border-border mt-1 pt-1">
                                {t.estado === 'suspendido'
                                  ? <button onClick={() => cambiarEstado(t.id, 'activo')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-success">
                                      <PlayCircle className="w-4 h-4" /> Reactivar
                                    </button>
                                  : <button onClick={() => cambiarEstado(t.id, 'suspendido')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-destructive">
                                      <PauseCircle className="w-4 h-4" /> Suspender
                                    </button>
                                }
                                <button onClick={() => { toast.error('Eliminación requiere confirmación por email'); setMenuId(null) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-destructive">
                                  <Trash2 className="w-4 h-4" /> Eliminar tenant
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-dashed border-border">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{t.usuarios}</p>
                          <p className="text-xs text-muted-foreground">Usuarios</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{t.operacionesMes}</p>
                          <p className="text-xs text-muted-foreground">Ops/mes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div>
                          <p className="text-sm font-bold text-primary">USD {fmt(t.comisionMes)}</p>
                          <p className="text-xs text-muted-foreground">Comisión/mes</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick action */}
                    <button
                      onClick={() => handleAcceder(t)}
                      className="w-full mt-3 py-2 bg-surface-dark text-white rounded-xl text-xs font-semibold hover:bg-surface-dark-mid transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Acceder al panel de {t.nombre}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )
        }
      </main>

      {menuId && <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />}

      {/* Create tenant sheet */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 z-30" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl p-6"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            >
              <h2 className="text-xl font-bold mb-1">Nuevo tenant</h2>
              <p className="text-muted-foreground text-sm mb-4">Se creará la cuenta y se enviará el email de bienvenida al administrador.</p>
              <div className="space-y-3">
                <input placeholder="Nombre del tenant (ej: Mesa Don Pepe)" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <input placeholder="Razón social" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <input placeholder="Email del administrador" type="email" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <input placeholder="CUIT" className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <select className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none bg-white">
                  <option value="trial">Trial (gratuito, 14 días)</option>
                  <option value="starter">Starter — USD 49/mes</option>
                  <option value="pro">Pro — USD 129/mes</option>
                  <option value="enterprise">Enterprise — USD 349/mes</option>
                </select>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
                  <button onClick={() => { setShowForm(false); toast.success('Tenant creado y email enviado') }} className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent transition-colors">
                    Crear tenant
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
