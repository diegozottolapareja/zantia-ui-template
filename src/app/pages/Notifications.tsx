import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Bell, ShoppingBag, TrendingUp, User, CheckCheck, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'

type NotifType = 'order' | 'sale' | 'system' | 'user'

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

const ICON_MAP: Record<NotifType, typeof Bell> = {
  order: ShoppingBag, sale: TrendingUp, system: Bell, user: User,
}

const COLOR_MAP: Record<NotifType, string> = {
  order: 'text-blue-600 bg-blue-50',
  sale:  'text-green-600 bg-green-50',
  system:'text-orange-600 bg-orange-50',
  user:  'text-purple-600 bg-purple-50',
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'order',  title: 'Nuevo pedido recibido',       body: 'Hotel Los Álamos realizó un pedido por $98.400',       time: 'Hace 5 min',    read: false },
  { id: 'n2', type: 'sale',   title: 'Meta de ventas alcanzada',    body: 'Superaste el 80% de tu meta mensual. ¡Seguí así!',     time: 'Hace 1 hora',   read: false },
  { id: 'n3', type: 'system', title: 'Actualización disponible',    body: 'Hay una nueva versión de la app lista para instalar.',  time: 'Hace 3 horas',  read: true },
  { id: 'n4', type: 'order',  title: 'Pedido entregado',            body: 'El pedido ORD-001 fue confirmado por Restaurante La Viña.', time: 'Ayer',      read: true },
  { id: 'n5', type: 'user',   title: 'Nuevo vendedor agregado',     body: 'Lucas Pérez fue agregado al equipo como Vendedor.',    time: 'Hace 2 días',   read: true },
  { id: 'n6', type: 'sale',   title: 'Informe semanal listo',       body: 'Tu resumen de ventas de la semana está disponible.',   time: 'Hace 3 días',   read: true },
]

export default function Notifications() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const unreadCount = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead    = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const remove      = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id))

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        variant="dark"
        left={
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        }
        center={
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white">Notificaciones</h1>
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </div>
        }
        right={
          unreadCount > 0 ? (
            <button onClick={markAllRead} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center" title="Marcar todo como leído">
              <CheckCheck className="w-5 h-5 text-white" />
            </button>
          ) : undefined
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        {notifs.length === 0 ? (
          <EmptyState Icon={Bell} title="Sin notificaciones" description="Cuando haya novedades, aparecerán acá" />
        ) : (
          <AnimatePresence initial={false}>
            {notifs.map((notif, i) => {
              const Icon = ICON_MAP[notif.type]
              const color = COLOR_MAP[notif.type]
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markRead(notif.id)}
                  className={`bg-white border rounded-2xl p-4 mb-3 flex gap-3 items-start cursor-pointer hover:shadow-md transition-all duration-200 ${notif.read ? 'border-border' : 'border-primary/30 shadow-sm shadow-primary/10'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${notif.read ? 'text-foreground' : 'text-primary'}`}>{notif.title}</p>
                      <button
                        onClick={e => { e.stopPropagation(); remove(notif.id) }}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground/70">{notif.time}</p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}
