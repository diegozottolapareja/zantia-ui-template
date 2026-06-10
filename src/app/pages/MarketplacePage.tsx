import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Wheat, SlidersHorizontal, X, MessageCircle, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav, type NavItem } from '@/components/BottomNav'
import { MOCK_POSICIONES, type Posicion } from '@/modules/grains/data/posiciones'
import { PRODUCTO_CONFIG, type Producto } from '@/modules/grains/data/tipos'
import { LayoutGrid, Search, Bell, Settings } from 'lucide-react'

function fmt(n: number) { return n.toLocaleString('en-US', { maximumFractionDigits: 0 }) }

const PRODUCTOS_DISPONIBLES = [...new Set(MOCK_POSICIONES.map(p => p.producto))] as Producto[]
const PROVINCIAS_DISPONIBLES = [...new Set(MOCK_POSICIONES.map(p => p.provincia))].sort()

interface Filtros {
  producto: Producto | 'todos'
  provincia: string | 'todas'
  soloConPrecio: boolean
  volumenMin: number
  precioMax: number
}

const FILTROS_DEFAULT: Filtros = {
  producto: 'todos',
  provincia: 'todas',
  soloConPrecio: false,
  volumenMin: 0,
  precioMax: 9999,
}

function PrecioTag({ pos }: { pos: Posicion }) {
  if (pos.precioVisible) {
    return (
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Precio FAS</p>
        <p className="text-lg font-black text-foreground">USD {pos.precioBase}</p>
        <p className="text-xs text-muted-foreground">/tn</p>
      </div>
    )
  }
  return (
    <div className="text-right">
      <span className="inline-block bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-lg">
        A consultar
      </span>
    </div>
  )
}

function PosicionCard({ pos, onContacto }: { pos: Posicion; onContacto: (pos: Posicion) => void }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = PRODUCTO_CONFIG[pos.producto]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl overflow-hidden"
    >
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.textColor}`}>{cfg.label}</span>
              <span className="text-xs text-muted-foreground">{fmt(pos.volumen)} tn</span>
              <span className="text-xs text-muted-foreground">· Grado {pos.grado}</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{pos.vendedorNombre}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{pos.ubicacion}, {pos.provincia}</p>
            </div>
          </div>
          <PrecioTag pos={pos} />
        </div>

        {/* Calidad */}
        <div className="flex gap-3 mt-3 pt-3 border-t border-dashed border-border">
          <div>
            <p className="text-xs text-muted-foreground">Humedad</p>
            <p className="text-sm font-semibold">{pos.humedad}%</p>
          </div>
          {pos.proteina && (
            <div>
              <p className="text-xs text-muted-foreground">Proteína</p>
              <p className="text-sm font-semibold">{pos.proteina}%</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Disponible</p>
            <p className="text-sm font-semibold">
              {new Date(pos.disponibleDesde).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-xs text-muted-foreground">Dist. Rosario</p>
            <p className="text-sm font-semibold">{pos.distanciaRosario} km</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onContacto(pos)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {pos.precioVisible ? 'Me interesa' : 'Consultar precio'}
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded: notas + telefono */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 bg-muted/30 space-y-3">
              {pos.notas && (
                <p className="text-sm text-muted-foreground italic">"{pos.notas}"</p>
              )}
              <a
                href={`tel:${pos.telefono}`}
                className="flex items-center gap-2 text-sm text-primary font-medium"
              >
                <Phone className="w-4 h-4" />
                {pos.telefono}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PanelFiltros({ filtros, onChange, onClose }: {
  filtros: Filtros
  onChange: (f: Filtros) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState(filtros)
  const set = (patch: Partial<Filtros>) => setLocal(prev => ({ ...prev, ...patch }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-border p-6 pb-10 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold">Filtros</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Producto */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tipo de grano</p>
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => set({ producto: 'todos' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${local.producto === 'todos' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
        >
          Todos
        </button>
        {PRODUCTOS_DISPONIBLES.map(p => {
          const cfg = PRODUCTO_CONFIG[p]
          return (
            <button
              key={p}
              onClick={() => set({ producto: p })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${local.producto === p ? `${cfg.bg} ${cfg.textColor} font-bold` : 'bg-muted text-muted-foreground'}`}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Provincia */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Provincia</p>
      <select
        value={local.provincia}
        onChange={e => set({ provincia: e.target.value })}
        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background mb-4"
      >
        <option value="todas">Todas las provincias</option>
        {PROVINCIAS_DISPONIBLES.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Solo con precio */}
      <div className="flex items-center justify-between py-3 border-t border-border mb-4">
        <div>
          <p className="text-sm font-medium">Solo con precio visible</p>
          <p className="text-xs text-muted-foreground">Oculta posiciones "A consultar"</p>
        </div>
        <button
          onClick={() => set({ soloConPrecio: !local.soloConPrecio })}
          className={`w-12 h-6 rounded-full transition-colors relative ${local.soloConPrecio ? 'bg-primary' : 'bg-muted'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${local.soloConPrecio ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setLocal(FILTROS_DEFAULT); onChange(FILTROS_DEFAULT); onClose() }}
          className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-muted-foreground"
        >
          Limpiar
        </button>
        <button
          onClick={() => { onChange(local); onClose() }}
          className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          Aplicar filtros
        </button>
      </div>
    </motion.div>
  )
}

export default function MarketplacePage() {
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_DEFAULT)
  const [showFiltros, setShowFiltros] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const navItems: NavItem[] = [
    { id: 'marketplace', label: 'Ofertas',    Icon: LayoutGrid,  onClick: () => navigate('/marketplace') },
    { id: 'buscar',      label: 'Buscar',     Icon: Search,      onClick: () => {} },
    { id: 'alertas',     label: 'Alertas',    Icon: Bell,        onClick: () => {} },
    { id: 'perfil',      label: 'Perfil',     Icon: Settings,    onClick: () => navigate('/settings') },
  ]

  const filtradas = useMemo(() => {
    return MOCK_POSICIONES.filter(pos => {
      if (pos.estado !== 'activa') return false
      if (filtros.producto !== 'todos' && pos.producto !== filtros.producto) return false
      if (filtros.provincia !== 'todas' && pos.provincia !== filtros.provincia) return false
      if (filtros.soloConPrecio && !pos.precioVisible) return false
      if (pos.volumen < filtros.volumenMin) return false
      if (pos.precioVisible && pos.precioBase > filtros.precioMax) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        if (!pos.vendedorNombre.toLowerCase().includes(q) &&
            !pos.ubicacion.toLowerCase().includes(q) &&
            !pos.provincia.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filtros, busqueda])

  const filtrosActivos = filtros.producto !== 'todos' || filtros.provincia !== 'todas' || filtros.soloConPrecio

  const handleContacto = (pos: Posicion) => {
    const msg = pos.precioVisible
      ? `Hola, me interesa la posición de ${PRODUCTO_CONFIG[pos.producto].label} (${fmt(pos.volumen)} tn) en ${pos.ubicacion}. USD ${pos.precioBase}/tn.`
      : `Hola, me interesa consultar el precio de la posición de ${PRODUCTO_CONFIG[pos.producto].label} (${fmt(pos.volumen)} tn) en ${pos.ubicacion}.`
    window.open(`https://wa.me/${pos.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        variant="dark"
        center={<h1 className="text-lg font-semibold text-white">Marketplace</h1>}
        right={
          <button
            onClick={() => setShowFiltros(true)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
              filtrosActivos ? 'bg-white text-surface-dark' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {filtrosActivos && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
            )}
          </button>
        }
      />

      <main className="max-w-2xl mx-auto p-4">

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">{filtradas.length}</p>
            <p className="text-xs text-muted-foreground">Posiciones</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-primary">
              {filtradas.reduce((s, p) => s + p.volumen, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Toneladas</p>
          </div>
          <div className="bg-white border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">
              {filtradas.filter(p => p.precioVisible).length}
            </p>
            <p className="text-xs text-muted-foreground">Con precio</p>
          </div>
        </motion.div>

        {/* Buscador */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por productor, ciudad o provincia..."
            className="w-full pl-9 pr-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Chips de filtros activos */}
        {filtrosActivos && (
          <div className="flex gap-2 flex-wrap mb-4">
            {filtros.producto !== 'todos' && (
              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${PRODUCTO_CONFIG[filtros.producto].bg} ${PRODUCTO_CONFIG[filtros.producto].textColor}`}>
                {PRODUCTO_CONFIG[filtros.producto].label}
                <button onClick={() => setFiltros(f => ({ ...f, producto: 'todos' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filtros.provincia !== 'todas' && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                {filtros.provincia}
                <button onClick={() => setFiltros(f => ({ ...f, provincia: 'todas' }))}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filtros.soloConPrecio && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                Con precio
                <button onClick={() => setFiltros(f => ({ ...f, soloConPrecio: false }))}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Cards */}
        <div className="space-y-3">
          {filtradas.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Wheat className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Sin resultados</p>
              <p className="text-sm mt-1">Probá cambiando los filtros</p>
            </div>
          ) : (
            filtradas.map(pos => (
              <PosicionCard key={pos.id} pos={pos} onContacto={handleContacto} />
            ))
          )}
        </div>
      </main>

      <BottomNav items={navItems} activeId="marketplace" />

      <AnimatePresence>
        {showFiltros && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowFiltros(false)}
            />
            <PanelFiltros
              filtros={filtros}
              onChange={setFiltros}
              onClose={() => setShowFiltros(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
