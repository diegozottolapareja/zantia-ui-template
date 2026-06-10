import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Plus, Wheat, MapPin, Phone, Edit2, Archive, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { MOCK_POSICIONES, type Posicion } from '@/data/mock/posiciones'
import { MOCK_NECESIDADES, type Necesidad } from '@/data/mock/necesidades'
import { PRODUCTO_CONFIG, PUERTO_LABEL, type Producto } from '@/data/mock/tipos'

type Tab = 'posiciones' | 'necesidades'

export default function ListingsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('posiciones')
  const [posiciones, setPosiciones] = useState<Posicion[]>(MOCK_POSICIONES)
  const [necesidades, setNecesidades] = useState<Necesidad[]>(MOCK_NECESIDADES)
  const [menuId, setMenuId] = useState<string | null>(null)

  const archivarPos = (id: string) => {
    setPosiciones(prev => prev.map(p => p.id === id ? { ...p, estado: 'cerrada' } : p))
    setMenuId(null)
    toast.success('Posición archivada')
  }

  const archivarNec = (id: string) => {
    setNecesidades(prev => prev.map(n => n.id === id ? { ...n, estado: 'cerrada' } : n))
    setMenuId(null)
    toast.success('Necesidad archivada')
  }

  const PRODUCTO_COLORS: Record<Producto, string> = {
    soja:    'text-lime-700 bg-lime-100',
    maiz:    'text-yellow-700 bg-yellow-100',
    trigo:   'text-amber-700 bg-amber-100',
    girasol: 'text-amber-600 bg-yellow-50',
    sorgo:   'text-orange-700 bg-orange-100',
    cebada:  'text-emerald-700 bg-emerald-100',
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
        center={<h1 className="text-lg font-semibold text-white">Cartera</h1>}
        right={
          <button onClick={() => toast.info('Formulario disponible en próxima versión')} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-4">
          {(['posiciones', 'necesidades'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'posiciones' ? `Vendedores (${posiciones.filter(p => p.estado === 'activa').length})` : `Compradores (${necesidades.filter(n => n.estado === 'activa').length})`}
            </button>
          ))}
        </div>

        {/* Posiciones */}
        {tab === 'posiciones' && (
          posiciones.filter(p => p.estado === 'activa').length === 0 ? (
            <EmptyState Icon={Wheat} title="Sin posiciones activas" description="Cargá posiciones de vendedores para empezar a generar matches." />
          ) : (
            <div className="space-y-3">
              {posiciones.filter(p => p.estado === 'activa').map((pos, i) => {
                const cfg = PRODUCTO_CONFIG[pos.producto]
                return (
                  <motion.div key={pos.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white border border-border rounded-2xl p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                        <Wheat className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRODUCTO_COLORS[pos.producto]}`}>{cfg.label}</span>
                          <StatusBadge value={pos.volumen} />
                        </div>
                        <p className="font-semibold text-foreground text-sm">{pos.vendedorNombre}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {pos.ubicacion}, {pos.provincia} · {pos.distanciaRosario} km a Rosario
                        </div>
                      </div>
                      <div className="relative">
                        <button onClick={() => setMenuId(menuId === pos.id ? null : pos.id)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuId === pos.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-10 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                              <button onClick={() => { toast.info('Edición próximamente'); setMenuId(null) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left">
                                <Edit2 className="w-4 h-4 text-muted-foreground" /> Editar
                              </button>
                              <button onClick={() => archivarPos(pos.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-destructive">
                                <Archive className="w-4 h-4" /> Archivar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
                      <div><p className="text-xs text-muted-foreground">Volumen</p><p className="text-sm font-bold">{pos.volumen.toLocaleString()} tn</p></div>
                      <div><p className="text-xs text-muted-foreground">Base USD/tn</p><p className="text-sm font-bold">{pos.precioBase}</p></div>
                      <div><p className="text-xs text-muted-foreground">Humedad</p><p className="text-sm font-bold">{pos.humedad}%</p></div>
                      <div><p className="text-xs text-muted-foreground">Grado</p><p className="text-sm font-bold">G{pos.grado}</p></div>
                    </div>

                    {pos.notas && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-dashed border-border">{pos.notas}</p>
                    )}

                    <div className="flex gap-2 mt-3">
                      <a href={`tel:${pos.telefono}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 rounded-xl text-primary text-xs font-medium">
                        <Phone className="w-3.5 h-3.5" /> {pos.contacto}
                      </a>
                      <button
                        onClick={() => navigate(`/match?pos=${pos.id}&nec=${MOCK_NECESIDADES.find(n => n.producto === pos.producto)?.id ?? ''}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-surface-dark text-white rounded-xl text-xs font-medium hover:bg-surface-dark-mid transition-colors"
                      >
                        Ver match →
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )
        )}

        {/* Necesidades */}
        {tab === 'necesidades' && (
          necesidades.filter(n => n.estado === 'activa').length === 0 ? (
            <EmptyState Icon={Wheat} title="Sin necesidades activas" description="Cargá las necesidades de tus compradores para cruzarlas con los vendedores." />
          ) : (
            <div className="space-y-3">
              {necesidades.filter(n => n.estado === 'activa').map((nec, i) => {
                const cfg = PRODUCTO_CONFIG[nec.producto]
                return (
                  <motion.div key={nec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white border border-border rounded-2xl p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                        <Wheat className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRODUCTO_COLORS[nec.producto]}`}>{cfg.label}</span>
                          <span className="text-xs text-muted-foreground capitalize">{nec.tipoComprador}</span>
                        </div>
                        <p className="font-semibold text-foreground text-sm">{nec.compradorNombre}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {PUERTO_LABEL[nec.destino]}
                        </div>
                      </div>
                      <div className="relative">
                        <button onClick={() => setMenuId(menuId === nec.id ? null : nec.id)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {menuId === nec.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-10 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                              <button onClick={() => archivarNec(nec.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-destructive">
                                <Archive className="w-4 h-4" /> Archivar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                      <div><p className="text-xs text-muted-foreground">Volumen</p><p className="text-sm font-bold">{nec.volumen.toLocaleString()} tn</p></div>
                      <div><p className="text-xs text-muted-foreground">FAS USD/tn</p><p className="text-sm font-bold text-primary">{nec.precioFAS}</p></div>
                      <div><p className="text-xs text-muted-foreground">Hum. máx</p><p className="text-sm font-bold">{nec.humedadMax}%</p></div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )
        )}
      </main>

      {menuId && <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />}
    </div>
  )
}
