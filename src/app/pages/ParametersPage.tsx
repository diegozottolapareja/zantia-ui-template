import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, RotateCcw, Save, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { useParametros, PARAMETROS_DEFAULT } from '@/modules/grains/ParametrosContext'
import { PRODUCTO_CONFIG, type Producto } from '@/modules/grains/data/tipos'

const PRODUCTOS = Object.keys(PRODUCTO_CONFIG) as Producto[]

export default function ParametersPage() {
  const navigate = useNavigate()
  const { parametros, setParametros, resetParametros } = useParametros()
  const [draft, setDraft] = useState(parametros)

  const update = <K extends keyof typeof draft>(key: K, value: typeof draft[K]) =>
    setDraft(d => ({ ...d, [key]: value }))

  const updateRetencion = (p: Producto, val: number) =>
    setDraft(d => ({ ...d, retenciones: { ...d.retenciones, [p]: val / 100 } }))

  const updateHumStd = (p: Producto, val: number) =>
    setDraft(d => ({ ...d, humedadStd: { ...d.humedadStd, [p]: val } }))

  const handleSave = () => {
    setParametros(draft)
    toast.success('Parámetros guardados y vigentes')
  }

  const handleReset = () => {
    setDraft(PARAMETROS_DEFAULT)
    resetParametros()
    toast.info('Parámetros restaurados a valores por defecto')
  }

  const changed = JSON.stringify(draft) !== JSON.stringify(parametros)

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={<h1 className="text-lg font-semibold text-white">Parámetros</h1>}
        right={
          <button onClick={handleReset} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center" title="Restaurar defaults">
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4 space-y-4">

        {changed && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">Hay cambios sin guardar. Guardá para que los cálculos usen los nuevos valores.</p>
          </motion.div>
        )}

        {/* Retenciones */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-1">Retenciones (derechos de exportación)</h3>
          <p className="text-xs text-muted-foreground mb-4">Vigencia: <input type="date" value={draft.vigencia} onChange={e => update('vigencia', e.target.value)} className="border-b border-dashed border-border bg-transparent text-xs ml-1 focus:outline-none" /></p>
          <div className="space-y-3">
            {PRODUCTOS.map(p => {
              const cfg = PRODUCTO_CONFIG[p]
              const val = Math.round(draft.retenciones[p] * 1000) / 10
              const defaultVal = Math.round(PARAMETROS_DEFAULT.retenciones[p] * 1000) / 10
              return (
                <div key={p} className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg min-w-[70px] text-center ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                  <input
                    type="range" min={0} max={40} step={0.5}
                    value={val}
                    onChange={e => updateRetencion(p, Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex items-center gap-1 min-w-[72px]">
                    <input
                      type="number" min={0} max={40} step={0.5}
                      value={val}
                      onChange={e => updateRetencion(p, Number(e.target.value))}
                      className="w-14 text-right px-1.5 py-1 border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  {val !== defaultVal && <span className="text-xs text-orange-500">↑</span>}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Flete */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-4">Flete (base CATAC/FADEEAC)</h3>
          <div className="space-y-4">
            {[
              { label: 'Base hasta 100 km (USD/tn)', key: 'fleteBase' as const, min: 0, max: 30, step: 0.5 },
              { label: 'Por km adicional (USD/tn/km)', key: 'fletePorKm' as const, min: 0, max: 0.2, step: 0.005 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">USD {draft[key].toFixed(3).replace(/\.?0+$/, '')}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={draft[key]}
                  onChange={e => update(key, Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
            ))}
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-xs text-muted-foreground">
                Ejemplo: Río Cuarto (330km) → USD {(draft.fleteBase + Math.max(0, 330 - 100) * draft.fletePorKm).toFixed(2)}/tn
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comisión y gastos */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-4">Comisión y gastos</h3>
          <div className="space-y-4">
            {[
              { label: 'Comisión corredor (%)', key: 'comisionPorc' as const, multiplier: 100, min: 0, max: 5, step: 0.1, unit: '%' },
              { label: 'Gastos puerto / fobbing (USD/tn)', key: 'gastosPuerto' as const, multiplier: 1, min: 0, max: 30, step: 0.5, unit: 'USD' },
              { label: 'Zarandeo / mermas (USD/tn)', key: 'zarandeo' as const, multiplier: 1, min: 0, max: 5, step: 0.25, unit: 'USD' },
            ].map(({ label, key, multiplier, min, max, step, unit }) => {
              const display = (draft[key] as number) * multiplier
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{display.toFixed(2).replace(/\.?0+$/, '')} {unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step}
                    value={display}
                    onChange={e => update(key, Number(e.target.value) / multiplier as never)}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Humedad estándar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-1">Humedad estándar por grano</h3>
          <p className="text-xs text-muted-foreground mb-4">El exceso genera descuento por secado.</p>
          <div className="space-y-3">
            {PRODUCTOS.map(p => {
              const cfg = PRODUCTO_CONFIG[p]
              return (
                <div key={p} className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg min-w-[70px] text-center ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
                  <input type="range" min={8} max={16} step={0.5} value={draft.humedadStd[p]}
                    onChange={e => updateHumStd(p, Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-semibold min-w-[48px] text-right">{draft.humedadStd[p]}%</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Save */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!changed}
          className="w-full py-4 bg-gradient-to-r from-surface-dark to-surface-dark-mid text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90 transition-all"
        >
          <Save className="w-5 h-5" /> Guardar parámetros
        </motion.button>
      </main>
    </div>
  )
}
