import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, Wheat, CheckCircle, AlertCircle, Phone, MessageCircle, ChevronDown, ChevronUp, Minus, Plus, Send, Clock, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { useParametros } from '../contexts/ParametrosContext'
import { MOCK_POSICIONES } from '@/data/mock/posiciones'
import { MOCK_NECESIDADES } from '@/data/mock/necesidades'
import { MOCK_NEGOCIACIONES, ESTADO_NEG_CONFIG, PENDIENTE_DE_CONFIG, type EstadoNegociacion, type NotaNegociacion } from '@/data/mock/operaciones'
import { calcularMatch } from '@/lib/calculator'
import { PRODUCTO_CONFIG, PUERTO_LABEL } from '@/data/mock/tipos'
import { appConfig } from '@/config/appConfig'

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

const NEXT_STATE: Partial<Record<EstadoNegociacion, EstadoNegociacion>> = {
  en_negociacion: 'acordada',
  acordada:       'en_transito',
  en_transito:    'liquidada',
}

const NEXT_STATE_LABEL: Partial<Record<EstadoNegociacion, string>> = {
  en_negociacion: 'Marcar como Acordada',
  acordada:       'Marcar En tránsito',
  en_transito:    'Confirmar Liquidada',
}

const AUTOR_COLOR: Record<string, string> = {
  corredor:  'bg-primary/10 text-primary border-primary/20',
  vendedor:  'bg-orange-50 text-orange-700 border-orange-200',
  comprador: 'bg-blue-50 text-blue-700 border-blue-200',
  sistema:   'bg-muted text-muted-foreground border-border',
}

export default function MatchDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { parametros } = useParametros()
  const [showFOB, setShowFOB] = useState(false)
  const [fasOverride, setFasOverride] = useState<number | null>(null)
  const [nuevaNota, setNuevaNota] = useState('')
  const [notas, setNotas] = useState<NotaNegociacion[]>([])

  const posId = searchParams.get('pos') ?? ''
  const necId = searchParams.get('nec') ?? ''

  const pos = MOCK_POSICIONES.find(p => p.id === posId)
  const nec = MOCK_NECESIDADES.find(n => n.id === necId)
  const negExistente = MOCK_NEGOCIACIONES.find(n => n.posId === posId && n.necId === necId)

  const [estadoLocal, setEstadoLocal] = useState<EstadoNegociacion | null>(negExistente?.estado ?? null)
  const notasEfectivas = estadoLocal ? [...(negExistente?.notas ?? []), ...notas] : notas

  const calc = useMemo(() => {
    if (!pos || !nec) return null
    const necOverride = fasOverride != null ? { ...nec, precioFAS: fasOverride } : nec
    return calcularMatch(pos, necOverride, parametros)
  }, [pos, nec, parametros, fasOverride])

  if (!pos || !nec || !calc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Match no encontrado</p>
      </div>
    )
  }

  const cfg    = PRODUCTO_CONFIG[pos.producto]
  const viable = calc.aceptaPrecio && calc.cumpleCalidad

  const handleIniciarNegociacion = () => {
    setEstadoLocal('en_negociacion')
    const nota: NotaNegociacion = {
      id: `new-${Date.now()}`,
      fecha: new Date().toISOString(),
      autor: 'sistema',
      autorNombre: 'Sistema',
      texto: `Negociación iniciada: ${pos.vendedorNombre} → ${nec.compradorNombre}`,
    }
    setNotas([nota])
    toast.success('Negociación iniciada', { description: 'Ahora podés registrar notas y avanzar el estado.' })
  }

  const handleAvanzarEstado = () => {
    if (!estadoLocal) return
    const siguiente = NEXT_STATE[estadoLocal]
    if (!siguiente) return
    const estCfg = ESTADO_NEG_CONFIG[siguiente]
    const nota: NotaNegociacion = {
      id: `new-${Date.now()}`,
      fecha: new Date().toISOString(),
      autor: 'sistema',
      autorNombre: 'Sistema',
      texto: `Estado actualizado a: ${estCfg.label}`,
    }
    setEstadoLocal(siguiente)
    setNotas(prev => [...prev, nota])
    toast.success(`Estado actualizado: ${estCfg.label}`)
    if (siguiente === 'liquidada') {
      setTimeout(() => navigate('/operaciones'), 1200)
    }
  }

  const handleAgregarNota = () => {
    if (!nuevaNota.trim()) return
    const nota: NotaNegociacion = {
      id: `new-${Date.now()}`,
      fecha: new Date().toISOString(),
      autor: 'corredor',
      autorNombre: 'Vos',
      texto: nuevaNota.trim(),
    }
    setNotas(prev => [...prev, nota])
    setNuevaNota('')
    toast.success('Nota registrada')
  }

  const estCfgActual = estadoLocal ? ESTADO_NEG_CONFIG[estadoLocal] : null
  const pendienteDe  = negExistente?.pendienteDe ?? null
  const pendCfg      = pendienteDe ? PENDIENTE_DE_CONFIG[pendienteDe] : null
  const accionPendiente = negExistente?.accionPendiente

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Detalle de match</h1>}
      />

      <main className="max-w-2xl mx-auto p-4 space-y-4">

        {/* Estado de negociación si existe */}
        {estadoLocal && estCfgActual && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 border ${estCfgActual.bgColor} border-current/20`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${estCfgActual.color}`} />
                <p className={`font-semibold text-sm ${estCfgActual.color}`}>Negociación {estCfgActual.label}</p>
              </div>
              {pendCfg && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pendCfg.color}`}>{pendCfg.label}</span>
              )}
            </div>
            {accionPendiente && (
              <p className="text-xs text-muted-foreground mt-1">{accionPendiente}</p>
            )}
          </motion.div>
        )}

        {/* Parties */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                <span className="text-sm text-muted-foreground">{pos.volumen.toLocaleString()} tn</span>
                {viable
                  ? <span className="text-xs text-success font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Viable</span>
                  : <span className="text-xs text-orange-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Revisar</span>
                }
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{pos.disponibleDesde} → {pos.disponibleHasta}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">VENDEDOR</p>
              <p className="text-sm font-semibold text-foreground">{pos.vendedorNombre}</p>
              <p className="text-xs text-muted-foreground">{pos.ubicacion}, {pos.provincia}</p>
              <p className="text-xs text-muted-foreground">{pos.distanciaRosario} km a Rosario</p>
              <div className="flex gap-2 mt-2">
                <a href={`tel:${pos.telefono}`} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary/10 rounded-lg text-primary text-xs font-medium">
                  <Phone className="w-3 h-3" /> Llamar
                </a>
                <a href={`${appConfig.WHATSAPP_URL}${pos.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-50 rounded-lg text-green-700 text-xs font-medium">
                  <MessageCircle className="w-3 h-3" /> WA
                </a>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">COMPRADOR</p>
              <p className="text-sm font-semibold text-foreground">{nec.compradorNombre}</p>
              <p className="text-xs text-muted-foreground capitalize">{nec.tipoComprador}</p>
              <p className="text-xs text-muted-foreground">{PUERTO_LABEL[nec.destino]}</p>
              <p className="text-xs text-muted-foreground mt-1">Ventana: {nec.ventanaDesde.slice(5)} → {nec.ventanaHasta.slice(5)}</p>
            </div>
          </div>
        </motion.div>

        {/* Calidad */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3">Calidad del grano</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Humedad', value: `${pos.humedad}%`, ok: pos.humedad <= nec.humedadMax, ref: `máx ${nec.humedadMax}%` },
              { label: 'Grado', value: `G${pos.grado}`, ok: pos.grado <= nec.gradoMin, ref: `mín G${nec.gradoMin}` },
              { label: 'Proteína', value: pos.proteina ? `${pos.proteina}%` : '—', ok: !nec.proteinaMin || !pos.proteina || pos.proteina >= nec.proteinaMin, ref: nec.proteinaMin ? `mín ${nec.proteinaMin}%` : 'n/a' },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-2.5 text-center ${item.ok ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`font-bold text-sm ${item.ok ? 'text-success' : 'text-destructive'}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground/70">{item.ref}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAS override */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground text-sm">FAS comprador</h3>
            {fasOverride != null && (
              <button onClick={() => setFasOverride(null)} className="text-xs text-muted-foreground hover:text-destructive">Restaurar</button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">Pisá el valor para simular negociaciones</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setFasOverride(v => Math.max(0, (v ?? nec.precioFAS) - 1))} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">USD</span>
              <input
                type="number"
                value={fasOverride ?? nec.precioFAS}
                onChange={e => setFasOverride(Number(e.target.value))}
                className="w-full pl-12 pr-14 py-3 border border-border rounded-xl text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/tn</span>
            </div>
            <button onClick={() => setFasOverride(v => (v ?? nec.precioFAS) + 1)} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {fasOverride != null && fasOverride !== nec.precioFAS && (
            <p className="text-xs text-center mt-2 text-orange-600">
              {fasOverride > nec.precioFAS ? '+' : ''}USD {(fasOverride - nec.precioFAS).toFixed(0)}/tn vs precio original
            </p>
          )}
        </motion.div>

        {/* Desglose */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-surface-dark">
            <h3 className="font-semibold text-white text-sm">Desglose FAS → Neto vendedor</h3>
          </div>
          <div className="p-4">
            {calc.lineas.map((linea, i) => {
              const isFirst = i === 0
              const isLast  = i === calc.lineas.length - 1
              return (
                <div key={i} className={`flex items-center justify-between py-2.5 ${!isFirst && !isLast ? 'border-b border-dashed border-border' : ''}`}>
                  <div className="flex-1">
                    <p className={`text-sm ${isFirst ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{linea.concepto}</p>
                    {linea.detalle && <p className="text-xs text-muted-foreground/70 mt-0.5">{linea.detalle}</p>}
                  </div>
                  <p className={`font-bold text-sm ml-4 ${isFirst ? 'text-foreground' : linea.valorTn < 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {linea.valorTn < 0 ? `− USD ${fmt(Math.abs(linea.valorTn))}` : `USD ${fmt(linea.valorTn)}`}
                  </p>
                </div>
              )
            })}
            <div className="mt-2 pt-3 border-t-2 border-foreground flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Neto al vendedor</p>
                <p className="text-xs text-muted-foreground">
                  Pretendido: USD {fmt(pos.precioBase)} ·
                  <span className={calc.aceptaPrecio ? ' text-success' : ' text-orange-600'}>
                    {calc.aceptaPrecio ? ` +USD ${fmt(calc.diferenciaPrecio)} sobre base` : ` −USD ${fmt(Math.abs(calc.diferenciaPrecio))} bajo base`}
                  </span>
                </p>
              </div>
              <p className={`text-xl font-black ${calc.aceptaPrecio ? 'text-primary' : 'text-orange-600'}`}>
                USD {fmt(calc.netoPorTn)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Totales */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-border rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Neto total al vendedor</p>
            <p className="text-lg font-black text-foreground">USD {fmt(calc.netoTotal, 0)}</p>
            <p className="text-xs text-muted-foreground">{pos.volumen.toLocaleString()} tn × USD {fmt(calc.netoPorTn)}</p>
          </div>
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-mid rounded-2xl p-4 text-center">
            <p className="text-xs text-white/60 mb-1">Mi comisión total</p>
            <p className="text-lg font-black text-white">USD {fmt(calc.comisionTotal, 0)}</p>
            <p className="text-xs text-white/60">USD {fmt(calc.comisionTn)}/tn</p>
          </div>
        </motion.div>

        {/* FOB colapsable */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-border rounded-2xl overflow-hidden">
          <button onClick={() => setShowFOB(v => !v)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
            <span className="text-sm font-semibold text-foreground">Referencia FOB (teórico)</span>
            {showFOB ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showFOB && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <p className="text-xs text-muted-foreground mb-3">Cálculo desde FOB de exportación para referencia de mercado.</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Retenciones {pos.producto} ({((parametros.retenciones[pos.producto]) * 100).toFixed(1)}%)</span>
                    <span className="font-medium text-foreground">− USD {fmt(nec.precioFAS / (1 - parametros.retenciones[pos.producto]) * parametros.retenciones[pos.producto])}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2">
                    <span className="text-muted-foreground">FAS teórico estimado</span>
                    <span className="font-semibold text-foreground">USD {fmt(nec.precioFAS)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded-lg">
                    Para calcular el FAS teórico exacto, ingresá el precio FOB en la Calculadora standalone.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* TIMELINE DE NEGOCIACIÓN */}
        {estadoLocal && notasEfectivas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="bg-white border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground text-sm mb-4">Historial de negociación</h3>
            <div className="space-y-3">
              {notasEfectivas.map((nota, i) => (
                <motion.div
                  key={nota.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${nota.autor === 'sistema' ? 'bg-muted-foreground/40' : nota.autor === 'corredor' ? 'bg-primary' : nota.autor === 'vendedor' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                    {i < notasEfectivas.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className={`flex-1 mb-3 px-3 py-2 rounded-xl border text-xs ${AUTOR_COLOR[nota.autor]}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{nota.autorNombre}</span>
                      <span className="opacity-60">
                        {new Date(nota.fecha).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="leading-snug">{nota.texto}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input nueva nota */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Agregar nota..."
                value={nuevaNota}
                onChange={e => setNuevaNota(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAgregarNota()}
                className="flex-1 px-3 py-2.5 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleAgregarNota}
                disabled={!nuevaNota.trim()}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white disabled:opacity-40 hover:bg-accent transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Notas estáticas si no hay negociación */}
        {!estadoLocal && (pos.notas || nec.notas) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-2">Notas</p>
            {pos.notas && <p className="text-xs text-amber-700 mb-1"><strong>Vendedor:</strong> {pos.notas}</p>}
            {nec.notas && <p className="text-xs text-amber-700"><strong>Comprador:</strong> {nec.notas}</p>}
          </motion.div>
        )}

        {/* CTA: contextual según estado */}
        {!estadoLocal ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciarNegociacion}
            className="w-full py-4 bg-gradient-to-r from-surface-dark to-surface-dark-mid text-white rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" /> Iniciar negociación
          </motion.button>
        ) : estadoLocal !== 'liquidada' && estadoLocal !== 'cancelada' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }} className="space-y-2">
            <button
              onClick={handleAvanzarEstado}
              className="w-full py-4 bg-gradient-to-r from-surface-dark to-surface-dark-mid text-white rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> {NEXT_STATE_LABEL[estadoLocal]}
            </button>
            <button
              onClick={() => { toast.error('Negociación cancelada'); setEstadoLocal('cancelada') }}
              className="w-full py-2.5 border border-destructive/30 text-destructive rounded-2xl text-sm font-medium hover:bg-destructive/5 transition-colors"
            >
              Cancelar negociación
            </button>
          </motion.div>
        ) : estadoLocal === 'liquidada' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-success/10 border border-success/30 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-bold text-success">Operación liquidada</p>
            <p className="text-xs text-muted-foreground mt-1">Comisión cobrada: USD {fmt(calc.comisionTotal, 0)}</p>
          </motion.div>
        ) : null}
      </main>
    </div>
  )
}
