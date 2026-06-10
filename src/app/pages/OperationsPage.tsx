import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, TrendingUp, ChevronRight, Wheat, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav, type NavItem } from '@/components/BottomNav'
import { MOCK_NEGOCIACIONES, ESTADO_NEG_CONFIG, PENDIENTE_DE_CONFIG, type EstadoNegociacion } from '@/modules/grains/data/operaciones'
import { PRODUCTO_CONFIG } from '@/modules/grains/data/tipos'
import { LayoutDashboard, Wheat as WheatIcon, Calculator, ClipboardList, Settings } from 'lucide-react'

function fmt(n: number) { return n.toLocaleString('en-US', { maximumFractionDigits: 0 }) }

const PIPELINE_ORDER: EstadoNegociacion[] = ['en_negociacion', 'acordada', 'en_transito', 'liquidada', 'cancelada']

const ESTADO_ICON: Record<EstadoNegociacion, typeof CheckCircle> = {
  en_negociacion: Clock,
  acordada:       AlertCircle,
  en_transito:    TrendingUp,
  liquidada:      CheckCircle,
  cancelada:      AlertCircle,
}

export default function OperationsPage() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<EstadoNegociacion | 'todas'>('todas')

  const navItems: NavItem[] = [
    { id: 'dashboard',   label: 'Inicio',      Icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
    { id: 'posiciones',  label: 'Posiciones',  Icon: WheatIcon,       onClick: () => navigate('/posiciones') },
    { id: 'calculadora', label: 'Calculadora', Icon: Calculator,      onClick: () => navigate('/calculadora') },
    { id: 'operaciones', label: 'Operaciones', Icon: ClipboardList,   onClick: () => navigate('/operaciones') },
    { id: 'mas',         label: 'Más',         Icon: Settings,        onClick: () => navigate('/settings') },
  ]

  const enCurso   = MOCK_NEGOCIACIONES.filter(n => n.estado !== 'liquidada' && n.estado !== 'cancelada')
  const cerradas  = MOCK_NEGOCIACIONES.filter(n => n.estado === 'liquidada')
  const miAccion  = enCurso.filter(n => n.pendienteDe === 'corredor')
  const comisionActiva  = enCurso.reduce((s, n) => s + n.comisionTotal, 0)
  const comisionCerrada = cerradas.reduce((s, n) => s + n.comisionTotal, 0)

  const negociacionesFiltradas = filtro === 'todas'
    ? [...MOCK_NEGOCIACIONES].sort((a, b) => PIPELINE_ORDER.indexOf(a.estado) - PIPELINE_ORDER.indexOf(b.estado))
    : MOCK_NEGOCIACIONES.filter(n => n.estado === filtro)

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Operaciones</h1>}
      />

      <main className="max-w-2xl mx-auto p-4">

        {/* KPIs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">{enCurso.length}</p>
            <p className="text-xs text-muted-foreground">En curso</p>
            {miAccion.length > 0 && (
              <p className="text-xs text-destructive font-medium mt-0.5">{miAccion.length} tuyas</p>
            )}
          </div>
          <div className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-primary">{cerradas.length}</p>
            <p className="text-xs text-muted-foreground">Liquidadas</p>
          </div>
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-mid rounded-2xl p-3 text-center">
            <p className="text-base font-black text-white leading-tight">USD {fmt(comisionActiva + comisionCerrada)}</p>
            <p className="text-xs text-white/60">Comisión total</p>
          </div>
        </motion.div>

        {/* Pipeline progress bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pipeline</p>
            <p className="text-xs text-muted-foreground">USD {fmt(comisionActiva)} en curso · USD {fmt(comisionCerrada)} cobrado</p>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
            {PIPELINE_ORDER.filter(e => e !== 'cancelada').map(estado => {
              const count = MOCK_NEGOCIACIONES.filter(n => n.estado === estado).length
              const total = MOCK_NEGOCIACIONES.filter(n => n.estado !== 'cancelada').length
              if (count === 0) return null
              const cfg = ESTADO_NEG_CONFIG[estado]
              const bgClass = estado === 'liquidada' ? 'bg-success' : estado === 'en_transito' ? 'bg-purple-500' : estado === 'acordada' ? 'bg-blue-500' : 'bg-orange-400'
              return (
                <motion.div
                  key={estado}
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / total) * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                  className={`h-full ${bgClass}`}
                  title={cfg.label}
                />
              )
            })}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {PIPELINE_ORDER.filter(e => e !== 'cancelada').map(estado => {
              const count = MOCK_NEGOCIACIONES.filter(n => n.estado === estado).length
              if (count === 0) return null
              const cfg = ESTADO_NEG_CONFIG[estado]
              return (
                <span key={estado} className={`text-xs ${cfg.color}`}>
                  {cfg.label}: {count}
                </span>
              )
            })}
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(['todas', ...PIPELINE_ORDER.filter(e => MOCK_NEGOCIACIONES.some(n => n.estado === e))] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtro === f
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'todas' ? 'Todas' : ESTADO_NEG_CONFIG[f].label}
            </button>
          ))}
        </div>

        {/* Negotiation cards */}
        <div className="space-y-3">
          {negociacionesFiltradas.map((neg, i) => {
            const cfg     = PRODUCTO_CONFIG[neg.producto]
            const estCfg  = ESTADO_NEG_CONFIG[neg.estado]
            const pendCfg = neg.pendienteDe ? PENDIENTE_DE_CONFIG[neg.pendienteDe] : null
            const StatusIcon = ESTADO_ICON[neg.estado]
            const esUrgente  = neg.pendienteDe === 'corredor'
            const ultimaNota = neg.notas[neg.notas.length - 1]

            return (
              <motion.button
                key={neg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/match?pos=${neg.posId}&nec=${neg.necId}`)}
                className={`w-full bg-white rounded-2xl p-4 text-left transition-all hover:shadow-md ${
                  esUrgente ? 'border-2 border-destructive/40 hover:border-destructive/60' : 'border border-border hover:border-primary/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                    <Wheat className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                      <span className="text-xs text-muted-foreground">{neg.volumen.toLocaleString()} tn</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${estCfg.bgColor} ${estCfg.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {estCfg.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{neg.vendedorNombre}</p>
                    <p className="text-xs text-muted-foreground">→ {neg.compradorNombre}</p>
                  </div>
                </div>

                {/* Pending action */}
                {neg.accionPendiente && (
                  <div className={`mt-2.5 px-3 py-2 rounded-xl text-xs ${esUrgente ? 'bg-destructive/10 text-destructive' : 'bg-muted/50 text-muted-foreground'}`}>
                    {pendCfg && <span className={`font-semibold mr-1 ${pendCfg.color.split(' ')[0]}`}>{pendCfg.label}:</span>}
                    {neg.accionPendiente}
                  </div>
                )}

                {/* Last note */}
                {ultimaNota && neg.estado !== 'liquidada' && (
                  <div className="mt-2 text-xs text-muted-foreground/70 italic truncate">
                    "{ultimaNota.texto}"
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-dashed border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">FAS acordado</p>
                    <p className="text-sm font-bold text-foreground">USD {neg.precioFASAcordado}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Neto vendedor</p>
                    <p className="text-sm font-bold text-primary">USD {neg.netoPorTn.toFixed(1)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Mi comisión</p>
                    <p className="text-sm font-black text-foreground">USD {fmt(neg.comisionTotal)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground/60">
                    Iniciada: {new Date(neg.fechaInicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    {' · '}
                    {neg.notas.length} nota{neg.notas.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                    Ver detalle <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </main>

      <BottomNav items={navItems} activeId="operaciones" />
    </div>
  )
}
