import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Plus, Search, MoreVertical, Shield, UserCheck, UserX, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { AppHeader } from '@/components/AppHeader'
import { RoleGuard } from '../components/RoleGuard'
import { appConfig, type Role } from '@/config/appConfig'

interface ManagedUser {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  lastSeen: string
  avatar: string
}

const MOCK_USERS: ManagedUser[] = [
  { id: 'u1', name: 'Carlos Martínez',   email: 'carlos@demo.com',  role: 'corredor',   active: true,  lastSeen: 'Hace 5 min',  avatar: 'https://i.pravatar.cc/60?img=12' },
  { id: 'u2', name: 'María Rodríguez',   email: 'maria@demo.com',   role: 'admin',      active: true,  lastSeen: 'Hace 1 hora', avatar: 'https://i.pravatar.cc/60?img=45' },
  { id: 'u3', name: 'Lucas Pérez',       email: 'lucas@demo.com',   role: 'corredor',   active: true,  lastSeen: 'Hace 2 días', avatar: 'https://i.pravatar.cc/60?img=33' },
  { id: 'u4', name: 'Ana García',        email: 'ana@demo.com',     role: 'comprador',  active: true,  lastSeen: 'Hace 1 día',  avatar: 'https://i.pravatar.cc/60?img=49' },
  { id: 'u5', name: 'Roberto Gómez',     email: 'roberto@demo.com', role: 'comprador',  active: false, lastSeen: 'Hace 2 sem',  avatar: 'https://i.pravatar.cc/60?img=15' },
  { id: 'u6', name: 'Valentina Torres',  email: 'vale@demo.com',    role: 'visitor',    active: true,  lastSeen: 'Hoy',         avatar: 'https://i.pravatar.cc/60?img=47' },
]

const ROLE_COLORS: Record<Role, string> = {
  superAdmin: 'bg-amber-100 text-amber-700',
  admin:      'bg-blue-100 text-blue-700',
  corredor:   'bg-green-100 text-green-700',
  comprador:  'bg-purple-100 text-purple-700',
  visitor:    'bg-gray-100 text-gray-600',
}

export default function UserManagement() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
    setMenuId(null)
    toast.success('Estado actualizado')
  }

  const changeRole = (id: string, role: Role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    setMenuId(null)
    toast.success('Rol actualizado')
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
        center={<h1 className="text-lg font-semibold text-white">Usuarios</h1>}
        right={
          <RoleGuard roles={['superAdmin', 'admin']}>
            <button
              onClick={() => setShowInvite(true)}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </RoleGuard>
        }
      />

      <main className="max-w-2xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Total',    value: users.length },
            { label: 'Activos',  value: users.filter(u => u.active).length },
            { label: 'Inactivos',value: users.filter(u => !u.active).length },
          ].map(s => (
            <div key={s.label} className="bg-white border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white border border-border rounded-2xl p-4 flex items-center gap-3 relative ${!user.active ? 'opacity-60' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${user.active ? 'bg-green-400' : 'bg-gray-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{user.name}</p>
                <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                    {appConfig.ROLES[user.role]}
                  </span>
                  <span className="text-muted-foreground/60 text-xs">{user.lastSeen}</span>
                </div>
              </div>

              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setMenuId(menuId === user.id ? null : user.id)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {menuId === user.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-10 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[180px]"
                    >
                      <div className="px-3 py-1.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cambiar rol</p>
                        {(Object.keys(appConfig.ROLES) as Role[]).filter(r => r !== 'superAdmin').map(r => (
                          <button
                            key={r}
                            onClick={() => changeRole(user.id, r)}
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors ${user.role === r ? 'font-bold text-primary' : 'text-foreground'}`}
                          >
                            {appConfig.ROLES[r]}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-border mt-1 pt-1">
                        <button onClick={() => toggleActive(user.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted text-left text-destructive">
                          {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                          {user.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {menuId && <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />}

      {/* Invite sheet */}
      <AnimatePresence>
        {showInvite && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInvite(false)} className="fixed inset-0 bg-black/50 z-30" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl p-6"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            >
              <h2 className="text-xl font-bold mb-1">Invitar usuario</h2>
              <p className="text-muted-foreground text-sm mb-4">Se enviará un email con el link de acceso</p>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="Email del nuevo usuario" className="w-full pl-9 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <select className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                  {(Object.entries(appConfig.ROLES) as [Role, string][]).filter(([r]) => r !== 'superAdmin').map(([r, label]) => (
                    <option key={r} value={r}>{label}</option>
                  ))}
                </select>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowInvite(false)} className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
                  <button
                    onClick={() => { setShowInvite(false); toast.success('Invitación enviada') }}
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" /> Invitar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
