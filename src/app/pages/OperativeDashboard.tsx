import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Bell, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Wheat, Calculator, ClipboardList, LayoutDashboard, Settings, Clock, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav, type NavItem } from '@/components/BottomNav'
import { EmptyState } from '@/components/EmptyState'
import { useAuth } from '../contexts/AuthContext'
import { useParametros } from '@/modules/grains/ParametrosContext'
import { MOCK_POSICIONES } from '@/modules/grains/data/posiciones'
import { MOCK_NECESIDADES } from '@/modules/grains/data/necesidades'
import { MOCK_NEGOCIACIONES, ESTADO_NEG_CONFIG, PENDIENTE_DE_CONFIG } from '@/modules/grains/data/operaciones'
import { calcularMatch } from '@/modules/grains/calculator'
import { PRODUCTO_CONFIG, PUERTO_LABEL } from '@/modules/grains/data/tipos'

export default function OperativeDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { parametros } = useParametros()

  const matches = useMemo(() => {
    const activasIds = new Set(
      MOCK_NEGOCIACIONES
        .filter(n => n.estado !== 'liquidada' && n.estado !== 'cancelada')
        .map(n => `${n.posId}__${n.necId}`)
    )
    const result = []
    for (const pos of MOCK_POSICIONES.filter(p => p.estado === 'activa')) {
      for (const nec of MOCK_NECESIDADES.filter(n => n.estado === 'activa' && n.producto === pos.producto)) {
        const key = `${pos.id}__${nec.id}`
        if (activasIds.has(key)) continue   // ya en negociación, no mostrar como nuevo match
        const calc = calcularMatch(pos, nec, parametros)
        result.push({ id: key, pos, nec, calc })
      }
    }
    return result.sort((a, b) => b.calc.comisionTotal - a.calc.comisionTotal)
  }, [parametros])

  const enCurso = MOCK_NEGOCIACIONES.filter(n => n.estado !== 'liquidada' && n.estado !== 'cancelada')
  const requierenAccion = enCurso.filter(n => n.pendienteDe === 'corredor')
  const esperandoTerceros = enCurso.filter(n => n.pendienteDe !== 'corredor')

  const comisionPotencial = matches.reduce((sum, m) => sum + m.calc.comisionTotal, 0)
  const comisionEnCurso   = enCurso.reduce((sum, n) => sum + n.comisionTotal, 0)
  const matchesViables    = matches.filter(m => m.calc.aceptaPrecio).length

  const navItems: NavItem[] = [
    { id: 'dashboard',   label: 'Inicio',      Icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
    { id: 'posiciones',  label: 'Posiciones',  Icon: Wheat,           onClick: () => navigate('/posiciones') },
    { id: 'calculadora', label: 'Calculadora', Icon: Calculator,      onClick: () => navigate('/calculadora') },
    { id: 'operaciones', label: 'Operaciones', Icon: ClipboardList,   onClick: () => navigate('/operaciones') },
    { id: 'mas',         label: 'Más',         Icon: Settings,        onClick: () => navigate('/settings') },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="dark"
        left={<img src="/logo.svg" alt="Grainflow" className="h-10 w-auto" />}
        right={
          <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <Bell className="w-6 h-6" />
            {requierenAccion.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-dark" />
            )}
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h2 className="text-xl font-bold text-foreground">Hola, {user?.name.split(' ')[0]}</h2>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white border border-border rounded-2xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Negociaciones activas</p>
            <p className="text-3xl font-black text-foreground">{enCurso.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{requierenAccion.length > 0 ? <span className="text-destructive font-medium">{requierenAccion.length} requieren tu acción</span> : 'Todo al día'}</p>
          </div>
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-mid rounded-2xl p-3">
            <p className="text-xs text-white/60 mb-1">Comisión en pipeline</p>
            <p className="text-2xl font-black text-white leading-tight">USD {(comisionEnCurso / 1000).toFixed(1)}k</p>
            <p className="text-xs text-white/40 mt-0.5">+ USD {(comisionPotencial / 1000).toFixed(1)}k potencial</p>
          </div>
        </motion.div>

        {/* REQUIEREN TU ACCIÓN */}
        {requierenAccion.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <h3 className="font-bold text-foreground text-sm">Requieren tu acción</h3>
              <span className="ml-auto text-xs text-muted-foreground">{requierenAccion.length}</span>
            </div>
            <div className="space-y-2">
              {requierenAccion.map((neg, i) => {
                const cfg = PRODUCTO_CONFIG[neg.producto]
                const estCfg = ESTADO_NEG_CONFIG[neg.estado]
                return (
                  <motion.button
                    key={neg.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/match?pos=${neg.posId}&nec=${neg.necId}`)}
                    className="w-full bg-white border-2 border-destructive/30 rounded-2xl p-4 text-left hover:border-destructive/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                        <Wheat className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estCfg.bgColor} ${estCfg.color}`}>{estCfg.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground truncate">{neg.vendedorNombre} → {neg.compradorNombre}</p>
                        {neg.accionPendiente && (
                          <p className="text-xs text-destructive mt-0.5 truncate">{neg.accionPendiente}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-black text-foreground">USD {neg.comisionTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* EN CURSO (esperando terceros) */}
        {esperandoTerceros.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">Esperando respuesta</h3>
              </div>
              <button onClick={() => navigate('/operaciones')} className="text-xs text-primary hover:underline flex items-center gap-1">
                Ver todas <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {esperandoTerceros.map((neg, i) => {
                const cfg = PRODUCTO_CONFIG[neg.producto]
                const estCfg = ESTADO_NEG_CONFIG[neg.estado]
                const pendCfg = neg.pendienteDe ? PENDIENTE_DE_CONFIG[neg.pendienteDe] : null
                return (
                  <motion.button
                    key={neg.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + i * 0.04 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/match?pos=${neg.posId}&nec=${neg.necId}`)}
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:shadow-sm hover:border-primary/20 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                      <Wheat className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{neg.vendedorNombre} → {neg.compradorNombre}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${estCfg.bgColor} ${estCfg.color}`}>{estCfg.label}</span>
                        {pendCfg && <span className={`text-xs px-1.5 py-0.5 rounded-full ${pendCfg.color}`}>{pendCfg.label}</span>}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground flex-shrink-0">USD {neg.comisionTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => navigate('/calculadora')} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Calculadora</p>
              <p className="text-xs text-muted-foreground">Simular operación</p>
            </div>
          </button>
          <button onClick={() => navigate('/posiciones')} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wheat className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Posiciones</p>
              <p className="text-xs text-muted-foreground">Ver cartera</p>
            </div>
          </button>
        </motion.div>

        {/* Nuevos matches disponibles */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground text-sm">Nuevos matches</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{matchesViables} viables · {matches.length} total</span>
          </div>
        </div>

        {matches.length === 0 ? (
          <EmptyState Icon={Wheat} title="Sin matches nuevos" description="Todos los matches activos ya están en negociación." />
        ) : (
          <div className="space-y-3">
            {matches.map((m, i) => {
              const cfg = PRODUCTO_CONFIG[m.pos.producto]
              const viable = m.calc.aceptaPrecio && m.calc.cumpleCalidad
              return (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.06 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/match?pos=${m.pos.id}&nec=${m.nec.id}`)}
                  className="w-full bg-white border border-border rounded-2xl p-4 text-left hover:shadow-md hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                      <Wheat className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                        <span className="text-xs text-muted-foreground">{m.pos.volumen.toLocaleString()} tn</span>
                        {viable
                          ? <CheckCircle className="w-3.5 h-3.5 text-success ml-auto" />
                          : <AlertCircle className="w-3.5 h-3.5 text-orange-500 ml-auto" />
                        }
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {m.pos.vendedorNombre}
                        <span className="font-normal text-muted-foreground"> · {m.pos.ubicacion}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">→ {m.nec.compradorNombre} · {PUERTO_LABEL[m.nec.destino]}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">FAS comprador</p>
                      <p className="text-sm font-bold text-foreground">USD {m.nec.precioFAS}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Neto vendedor</p>
                      <p className={`text-sm font-bold ${viable ? 'text-primary' : 'text-orange-600'}`}>
                        USD {m.calc.netoPorTn.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Mi comisión</p>
                      <p className="text-sm font-black text-surface-dark">
                        USD {m.calc.comisionTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        USD {m.calc.comisionTn.toFixed(2)}/tn · {m.pos.distanciaRosario} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                      Ver cálculo <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav items={navItems} activeId="dashboard" />
    </div>
  )
}
