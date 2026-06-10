import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Wheat, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { useParametros } from '@/modules/grains/ParametrosContext'
import { calcular } from '@/modules/grains/calculator'
import { PRODUCTO_CONFIG, type Producto } from '@/modules/grains/data/tipos'

const PRODUCTOS: Producto[] = ['soja', 'maiz', 'trigo', 'girasol', 'sorgo', 'cebada']

function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

interface SliderInputProps {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  decimals?: number
}

function SliderInput({ label, value, onChange, min, max, step = 1, unit = '', decimals = 0 }: SliderInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-muted-foreground">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 text-right px-2 py-1 border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground/50 mt-0.5">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function Calculator() {
  const navigate = useNavigate()
  const { parametros } = useParametros()

  const [producto, setProducto] = useState<Producto>('soja')
  const [fas, setFas] = useState(275)
  const [volumen, setVolumen] = useState(500)
  const [distancia, setDistancia] = useState(300)
  const [humedad, setHumedad] = useState(13.5)
  const [grado, setGrado] = useState(1)
  const [precioBase, setPrecioBase] = useState(250)
  const [fob, setFob] = useState(330)
  const [showFOB, setShowFOB] = useState(false)
  const [showParams, setShowParams] = useState(false)

  const calc = useMemo(() => calcular({
    producto,
    fasComprador: fas,
    volumen,
    distanciaKm: distancia,
    humedad,
    grado,
    precioBaseVendedor: precioBase,
    fobReferencia: showFOB ? fob : undefined,
  }, parametros), [producto, fas, volumen, distancia, humedad, grado, precioBase, fob, showFOB, parametros])

  const reset = () => {
    setFas(275); setVolumen(500); setDistancia(300)
    setHumedad(parametros.humedadStd[producto]); setGrado(1); setPrecioBase(250)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Calculadora de márgenes</h1>}
        right={
          <button onClick={reset} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center" title="Resetear">
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4 space-y-4">

        {/* Producto selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Producto</p>
          <div className="grid grid-cols-3 gap-2">
            {PRODUCTOS.map(p => {
              const cfg = PRODUCTO_CONFIG[p]
              const selected = p === producto
              return (
                <button
                  key={p}
                  onClick={() => { setProducto(p); setHumedad(parametros.humedadStd[p]) }}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    selected
                      ? `bg-gradient-to-br ${cfg.color} text-white border-transparent shadow-sm`
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Parámetros de entrada */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-border rounded-2xl p-4 space-y-5">
          <p className="text-sm font-semibold text-foreground">Parámetros de la operación</p>
          <SliderInput label="FAS comprador (USD/tn)" value={fas} onChange={setFas} min={100} max={600} unit="USD" />
          <SliderInput label="Volumen" value={volumen} onChange={setVolumen} min={50} max={5000} step={50} unit=" tn" />
          <SliderInput label="Distancia al puerto" value={distancia} onChange={setDistancia} min={50} max={1000} step={10} unit=" km" />
        </motion.div>

        {/* Calidad */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white border border-border rounded-2xl p-4 space-y-4">
          <p className="text-sm font-semibold text-foreground">Calidad del grano</p>
          <SliderInput
            label={`Humedad (estándar: ${parametros.humedadStd[producto]}%)`}
            value={humedad}
            onChange={setHumedad}
            min={8} max={20} step={0.5} unit="%" decimals={1}
          />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Grado</p>
            <div className="flex gap-2">
              {[1, 2, 3].map(g => (
                <button
                  key={g}
                  onClick={() => setGrado(g)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    grado === g ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  Grado {g}
                </button>
              ))}
            </div>
          </div>
          <SliderInput label="Precio base vendedor (USD/tn)" value={precioBase} onChange={setPrecioBase} min={50} max={600} unit="USD" />
        </motion.div>

        {/* ═══ DESGLOSE ═══ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-surface-dark to-surface-dark-mid flex items-center gap-2">
            <Wheat className="w-4 h-4 text-white/80" />
            <h3 className="font-bold text-white text-sm">Desglose — FAS → Neto vendedor</h3>
          </div>

          <div className="p-4">
            {calc.lineas.map((linea, i) => {
              const isFirst = i === 0
              const pct = isFirst ? 100 : Math.abs(linea.valorTn / fas) * 100
              return (
                <div key={i} className={`py-2.5 ${i > 0 && i < calc.lineas.length - 1 ? 'border-b border-dashed border-border' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm ${isFirst ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {linea.concepto}
                    </p>
                    <p className={`font-bold text-sm ml-3 ${
                      isFirst ? 'text-foreground' : linea.valorTn < 0 ? 'text-destructive' : 'text-foreground'
                    }`}>
                      {linea.valorTn < 0 ? `− USD ${fmt(Math.abs(linea.valorTn))}` : `USD ${fmt(linea.valorTn)}`}
                    </p>
                  </div>
                  {!isFirst && linea.valorTn < 0 && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive/40 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  )}
                  {linea.detalle && <p className="text-xs text-muted-foreground/60 mt-0.5">{linea.detalle}</p>}
                </div>
              )
            })}

            {/* Result */}
            <div className={`mt-3 pt-3 border-t-2 ${calc.aceptaPrecio ? 'border-primary' : 'border-orange-400'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Neto al vendedor</p>
                  <p className={`text-xs ${calc.aceptaPrecio ? 'text-success' : 'text-orange-600'}`}>
                    {calc.aceptaPrecio
                      ? `+USD ${fmt(calc.diferenciaPrecio)}/tn sobre precio base`
                      : `−USD ${fmt(Math.abs(calc.diferenciaPrecio))}/tn bajo precio base`
                    }
                  </p>
                </div>
                <p className={`text-2xl font-black ${calc.aceptaPrecio ? 'text-primary' : 'text-orange-600'}`}>
                  USD {fmt(calc.netoPorTn)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Totales */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-border rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Neto total al vendedor</p>
            <p className="text-xl font-black text-foreground">USD {fmt(calc.netoTotal, 0)}</p>
            <p className="text-xs text-muted-foreground">{volumen.toLocaleString()} tn</p>
          </div>
          <div className="bg-gradient-to-br from-surface-dark to-surface-dark-mid rounded-2xl p-4 text-center">
            <p className="text-xs text-white/60 mb-1">Mi comisión</p>
            <p className="text-xl font-black text-white">USD {fmt(calc.comisionTotal, 0)}</p>
            <p className="text-xs text-white/60">USD {fmt(calc.comisionTn)}/tn</p>
          </div>
        </motion.div>

        {/* FOB Reference */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="bg-white border border-border rounded-2xl overflow-hidden">
          <button onClick={() => setShowFOB(v => !v)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
            <span className="text-sm font-semibold text-foreground">Agregar precio FOB de referencia</span>
            {showFOB ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showFOB && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <SliderInput label="FOB de referencia (USD/tn)" value={fob} onChange={setFob} min={100} max={700} unit="USD" />
                {calc.fasTeoricoTn != null && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FOB</span>
                      <span className="font-semibold">USD {fmt(fob)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retenciones ({(parametros.retenciones[producto] * 100).toFixed(1)}%)</span>
                      <span className="font-semibold text-destructive">− USD {fmt(calc.retencionesTn ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-border pt-2">
                      <span className="font-semibold">FAS teórico</span>
                      <span className="font-bold">USD {fmt(calc.fasTeoricoTn)}</span>
                    </div>
                    <div className={`flex justify-between text-sm pt-1 ${(calc.deltaFas ?? 0) >= 0 ? 'text-success' : 'text-orange-600'}`}>
                      <span>FAS ofrecido vs teórico</span>
                      <span className="font-bold">
                        {(calc.deltaFas ?? 0) >= 0 ? '+' : ''}USD {fmt(calc.deltaFas ?? 0)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(calc.deltaFas ?? 0) >= 0
                        ? 'El comprador ofrece por encima del FAS teórico.'
                        : 'El comprador ofrece por debajo del FAS teórico. Evaluá si conviene.'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Params summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="bg-white border border-border rounded-2xl overflow-hidden">
          <button onClick={() => setShowParams(v => !v)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
            <span className="text-sm text-muted-foreground">Parámetros utilizados</span>
            {showParams ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showParams && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 overflow-hidden">
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: 'Comisión corredor', value: `${(parametros.comisionPorc * 100).toFixed(1)}%` },
                    { label: 'Flete base (≤100km)', value: `USD ${parametros.fleteBase}/tn` },
                    { label: 'Flete por km adicional', value: `USD ${parametros.fletePorKm}/km` },
                    { label: 'Flete calculado', value: `USD ${fmt(calc.flete)}/tn (${distancia}km)` },
                    { label: `Humedad estándar ${PRODUCTO_CONFIG[producto].label}`, value: `${parametros.humedadStd[producto]}%` },
                    { label: 'Secado por % exceso', value: `${(parametros.secadoPorPorcentaje * 100).toFixed(1)}% del FAS` },
                    { label: 'Zarandeo', value: `USD ${parametros.zarandeo}/tn` },
                    { label: `Retención ${PRODUCTO_CONFIG[producto].label}`, value: `${(parametros.retenciones[producto] * 100).toFixed(1)}%` },
                    { label: 'Vigencia parámetros', value: parametros.vigencia },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium text-foreground">{r.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/parametros')} className="mt-3 w-full py-2 border border-primary/30 text-primary rounded-xl text-xs font-medium hover:bg-primary/5 transition-colors">
                  Editar parámetros →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </main>
    </div>
  )
}
