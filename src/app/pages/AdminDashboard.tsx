import { useNavigate } from 'react-router'
import {
  BarChart3, Package, MapPin, Bot, FileText, DollarSign, Users, TrendingUp, AlertCircle, User,
} from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { KPICard } from '@/components/KPICard'
import { appConfig } from '@/config/appConfig'

const cards = [
  { id: 'analytics',   title: 'Análisis',          description: 'Reportes de operaciones y márgenes', Icon: BarChart3,  color: 'from-primary to-accent',        route: '/admin/analytics' },
  { id: 'matches',     title: 'Matches activos',   description: 'Ver todos los matches del corredor', Icon: TrendingUp, color: 'from-blue-500 to-indigo-600',   route: '/dashboard' },
  { id: 'tracking',    title: 'Seguimiento',        description: 'Monitorear brokers y actividad',     Icon: MapPin,    color: 'from-emerald-500 to-green-600', route: '/admin/tracking' },
  { id: 'ai',          title: 'Asistente IA',       description: 'Consultas sobre el negocio',         Icon: Bot,       color: 'from-purple-500 to-violet-600', route: '/admin/ai-chat' },
  { id: 'parametros',  title: 'Parámetros',         description: 'Retenciones, flete y comisiones',    Icon: FileText,  color: 'from-orange-500 to-red-600',    route: '/parametros' },
  { id: 'operaciones', title: 'Operaciones',        description: 'Historial y comisión acumulada',     Icon: DollarSign,color: 'from-green-500 to-emerald-600', route: '/operaciones' },
  { id: 'team',        title: 'Equipo',             description: 'Gestionar corredores y permisos',    Icon: Users,     color: 'from-pink-500 to-rose-600',     route: '/admin/users' },
]

const quickStats = [
  { label: 'Ventas Hoy',              value: '$45.200', change: '+12,5%', Icon: TrendingUp,  positive: true },
  { label: `${appConfig.ROLES.operative}s Activos`, value: '8',  change: '2 en línea', Icon: Users, positive: true },
  { label: 'Stock Bajo',              value: '3',       change: 'Necesita atención', Icon: AlertCircle, positive: false },
  { label: `${appConfig.ITEM_NAME_PLURAL} Vendidos`, value: '142', change: '+23 hoy', Icon: Package, positive: true },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        variant="brand"
        left={
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-xl md:text-2xl text-white">{appConfig.APP_NAME}</h1>
              <p className="text-sm text-white/80">Panel de {appConfig.ROLES.admin}</p>
            </div>
          </div>
        }
        right={
          <button
            onClick={() => navigate('/admin/profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        }
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl md:text-3xl text-dark-graphite mb-2">Centro de Control</h2>
          <p className="text-muted-foreground">¡Bienvenido! Aquí está lo que pasa hoy.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <KPICard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => {
            const Icon = card.Icon
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.route)}
                className="group bg-white rounded-2xl p-6 md:p-8 border border-border hover:border-primary hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl text-dark-graphite mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.button>
            )
          })}
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/ai-chat')}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.button>
      </main>
    </div>
  )
}
