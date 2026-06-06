import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Role } from '@/config/appConfig'

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

// ─── Demo users — one per role ────────────────────────────────────────────────

const DEMO_USERS: Record<Role, AuthUser> = {
  superAdmin: {
    id: 'demo-superadmin',
    name: 'Super Admin',
    email: 'superadmin@demo.com',
    role: 'superAdmin',
    tenantId: '*',            // superAdmin sees all tenants
    permissions: ['*'],
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
  },
  admin: {
    id: 'demo-admin',
    name: 'Maria Rodriguez',
    email: 'admin@demo.com',
    role: 'admin',
    tenantId: 'tenant-001',
    permissions: ['catalog:read', 'catalog:write', 'users:read', 'analytics:read'],
    avatarUrl: 'https://i.pravatar.cc/300?img=45',
  },
  corredor: {
    id: 'demo-corredor',
    name: 'Carlos Martinez',
    email: 'corredor@demo.com',
    role: 'corredor',
    tenantId: 'tenant-001',
    permissions: ['catalog:read', 'catalog:write', 'sales:write'],
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

async function webAuthnAuthenticate(userId: string): Promise<boolean> {
  // Registration: store a credential for this user on first biometric login
  // Authentication: verify the stored credential
  // This is a template scaffold — wire to your backend's /auth/webauthn/* endpoints
  // For now, simulates a successful assertion after the platform dialog
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
        allowCredentials: [],    // empty = any registered credential for this device
      },
    })

    return !!credential
  } catch (err) {
    // NotAllowedError = user cancelled or no credential registered
    // In that case we fall back to password login — caller handles this
    console.warn('[WebAuthn]', err)
    return false
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = loadSession()
    if (stored) setUser(stored)
    setIsLoading(false)
  }, [])

  const login = async ({ email, password, role }: LoginCredentials) => {
    // TODO: replace with real API call: POST /auth/login { email, password, role }
    // Expect response: { user: AuthUser, token: string }
    // Store token in httpOnly cookie or Authorization header

    // Demo stub — simulates network delay
    await new Promise(r => setTimeout(r, 800))

    // In a real implementation, validate credentials against backend here.
    // We simulate success by picking the demo user for the selected role.
    const loggedIn: AuthUser = { ...DEMO_USERS[role], email }
    setUser(loggedIn)
    saveSession(loggedIn)
  }

  const loginWithBiometrics = async (role: Role) => {
    const demoUser = DEMO_USERS[role]
    const ok = await webAuthnAuthenticate(demoUser.id)
    if (!ok) throw new Error('Biometric authentication failed or cancelled')
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithBiometrics, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
