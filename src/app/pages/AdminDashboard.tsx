import { useNavigate } from 'react-router'
import {
  BarChart3, CalendarDays, ClipboardCheck, Users, TrendingUp, AlertCircle, User, Settings, LayoutDashboard,
} from 'lucide-react'
import { motion } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { KPICard } from '@/components/KPICard'
import { appConfig } from '@/config/appConfig'
import { MOCK_CLASES } from '@/modules/fitness'
import { MOCK_ALUMNOS } from '@/modules/fitness'
import { MOCK_ASISTENCIAS } from '@/modules/fitness'

const HOY = '2026-06-10'
const clasesHoy = MOCK_CLASES.filter(c => c.fecha === HOY)
const alumnosActivos = MOCK_ALUMNOS.filter(a => a.estado === 'activo').length
const asistenciasPendientes = MOCK_ASISTENCIAS.filter(a => a.estadoRevision === 'pendiente').length

const cards = [
  { id: 'schedule',    title: 'Agenda',         description: 'Ver y gestionar clases del día',        Icon: CalendarDays,  color: 'from-primary to-accent',        route: '/schedule' },
  { id: 'attendance',  title: 'Asistencias',    description: 'Revisar y aprobar registros de asistencia', Icon: ClipboardCheck, color: 'from-emerald-500 to-green-600', route: '/attendance/review' },
  { id: 'students',    title: 'Alumnos',        description: 'Gestionar membresías y estados',        Icon: Users,         color: 'from-blue-500 to-indigo-600',   route: '/students' },
  { id: 'classes',     title: 'Clases',         description: 'Crear y editar clases',                 Icon: CalendarDays,  color: 'from-orange-500 to-red-600',    route: '/classes' },
  { id: 'reports',     title: 'Reportes',       description: 'KPIs y exportación de datos',           Icon: BarChart3,     color: 'from-purple-500 to-violet-600', route: '/reports' },
  { id: 'users',       title: 'Usuarios',       description: 'Gestionar profesores y roles',          Icon: User,         color: 'from-pink-500 to-rose-600',     route: '/admin/users' },
  { id: 'settings',    title: 'Configuración',  description: 'Parámetros del sistema',                Icon: Settings,     color: 'from-gray-500 to-gray-700',     route: '/settings' },
]

const quickStats = [
  { label: 'Clases Hoy',           value: String(clasesHoy.length),        change: `${clasesHoy.filter(c => c.estado === 'finalizada').length} finalizadas`, Icon: CalendarDays,  positive: true  },
  { label: 'Alumnos Activos',      value: String(alumnosActivos),          change: `de ${MOCK_ALUMNOS.length} totales`,                                       Icon: Users,        positive: true  },
  { label: 'Asistencias Pendientes',value: String(asistenciasPendientes), change: 'Por aprobar',                                                              Icon: AlertCircle,  positive: asistenciasPendientes === 0 },
  { label: `${appConfig.ENTITY_NAME_PLURAL} Hoy`, value: String(clasesHoy.length), change: `+${clasesHoy.filter(c => c.cuposDisponibles === 0).length} llenas`, Icon: TrendingUp, positive: true },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        variant="brand"
        left={
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-white" />
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
          <h2 className="text-2xl md:text-3xl text-dark-graphite mb-2">Panel de Administración</h2>
          <p className="text-muted-foreground">Resumen de actividad del día en ORIGEN.</p>
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

      </main>
    </div>
  )
}
