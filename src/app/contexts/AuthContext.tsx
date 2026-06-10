import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { type Role } from '@/config/appConfig'
import { hasPermission, type Permission } from '@/config/rolesConfig'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  tenantId: string
  permissions: string[]
  avatarUrl?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  /** Verifica si el usuario tiene un permiso específico. Preferir sobre chequear user.role. */
  can: (permission: Permission) => boolean
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithBiometrics: (role: Role) => Promise<void>
  loginAsDemo: (role: Role) => void
  logout: () => void
}

export interface LoginCredentials {
  email: string
  password: string
  role: Role
}

// ─── Demo users — uno por rol ──────────────────────────────────────────────────

const DEMO_USERS: Record<Role, AuthUser> = {
  superAdmin: {
    id: 'demo-superadmin',
    name: 'Super Admin',
    email: 'superadmin@demo.com',
    role: 'superAdmin',
    tenantId: '*',
    permissions: ['*'],
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
  },
  admin: {
    id: 'demo-admin',
    name: 'Maria Rodriguez',
    email: 'admin@demo.com',
    role: 'admin',
    tenantId: 'tenant-001',
    permissions: [
      'entities:read', 'entities:write', 'entities:delete',
      'operations:read', 'operations:write',
      'users:read', 'users:manage',
      'analytics:read', 'reports:read',
      'settings:read', 'settings:write',
    ],
    avatarUrl: 'https://i.pravatar.cc/300?img=45',
  },
  corredor: {
    id: 'demo-corredor',
    name: 'Carlos Martinez',
    email: 'corredor@demo.com',
    role: 'corredor',
    tenantId: 'tenant-001',
    permissions: ['entities:read', 'entities:write', 'operations:read', 'operations:write', 'catalog:read'],
    avatarUrl: 'https://i.pravatar.cc/300?img=12',
  },
  comprador: {
    id: 'demo-comprador',
    name: 'Ana García',
    email: 'comprador@demo.com',
    role: 'comprador',
    tenantId: 'tenant-001',
    permissions: ['catalog:read'],
    avatarUrl: 'https://i.pravatar.cc/300?img=49',
  },
  visitor: {
    id: 'demo-visitor',
    name: 'Visitante',
    email: '',
    role: 'visitor',
    tenantId: '',
    permissions: ['catalog:read'],
  },
}

// ─── Session persistence ──────────────────────────────────────────────────────

const SESSION_KEY = 'zantia_session'

function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// ─── WebAuthn helpers ─────────────────────────────────────────────────────────

export function isWebAuthnSupported(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential
}

async function webAuthnAuthenticate(_userId: string): Promise<boolean> {
  // Scaffold — conectar a endpoints /auth/webauthn/* del backend real
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
        allowCredentials: [],
      },
    })
    return !!credential
  } catch (err) {
    console.warn('[WebAuthn]', err)
    return false
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = loadSession()
    if (stored) setUser(stored)
    setIsLoading(false)
  }, [])

  // Verifica si el usuario actual tiene un permiso. Usar esto en lugar de comparar user.role.
  const can = useCallback((permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.permissions, permission)
  }, [user])

  const login = async ({ email, password: _password, role }: LoginCredentials) => {
    // TODO: reemplazar con POST /auth/login { email, password, role }
    // Esperar respuesta: { user: AuthUser, token: string }
    await new Promise(r => setTimeout(r, 800))
    const loggedIn: AuthUser = { ...DEMO_USERS[role], email }
    setUser(loggedIn)
    saveSession(loggedIn)
  }

  const loginWithBiometrics = async (role: Role) => {
    const demoUser = DEMO_USERS[role]
    const ok = await webAuthnAuthenticate(demoUser.id)
    if (!ok) throw new Error('Autenticación biométrica fallida o cancelada')
    setUser(demoUser)
    saveSession(demoUser)
  }

  const loginAsDemo = (role: Role) => {
    const demoUser = DEMO_USERS[role]
    setUser(demoUser)
    saveSession(demoUser)
  }

  const logout = () => {
    setUser(null)
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, can, login, loginWithBiometrics, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
