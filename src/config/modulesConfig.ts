// ─── Módulos de la aplicación ─────────────────────────────────────────────────
// Cada módulo representa una sección funcional de la app.
// Para deshabilitar un módulo globalmente, poner enabled: false.
// Para controlarlo por rol, editar rolesConfig.ts.

export interface ModuleConfig {
  id: string
  label: string
  description: string
  enabled: boolean
  path: string
}

export const modulesConfig: ModuleConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Panel principal con métricas y resumen',
    enabled: true,
    path: '/dashboard',
  },
  {
    id: 'entities',
    label: 'Entidades',
    description: 'Gestión de la entidad principal del negocio',
    enabled: true,
    path: '/posiciones',     // Fase 3: renombrar a /entities
  },
  {
    id: 'operations',
    label: 'Operaciones',
    description: 'Gestión de operaciones, negociaciones o transacciones',
    enabled: true,
    path: '/operaciones',    // Fase 3: renombrar a /operations
  },
  {
    id: 'calculator',
    label: 'Calculadora',
    description: 'Herramienta de cálculo configurable por negocio',
    enabled: true,
    path: '/calculadora',    // Fase 4: mover a módulo de granos
  },
  {
    id: 'catalog',
    label: 'Catálogo',
    description: 'Vista de catálogo o marketplace para clientes',
    enabled: true,
    path: '/marketplace',    // Fase 3: renombrar a /catalog
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Reportes y análisis de datos embebidos (Looker Studio, Metabase)',
    enabled: true,
    path: '/admin/analytics',
  },
  {
    id: 'users',
    label: 'Usuarios',
    description: 'Gestión de usuarios y roles',
    enabled: true,
    path: '/admin/users',
  },
  {
    id: 'notifications',
    label: 'Notificaciones',
    description: 'Centro de notificaciones del usuario',
    enabled: true,
    path: '/notifications',
  },
  {
    id: 'profile',
    label: 'Perfil',
    description: 'Perfil del usuario autenticado',
    enabled: true,
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Configuración',
    description: 'Preferencias personales del usuario',
    enabled: true,
    path: '/settings',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getModule(id: string): ModuleConfig | undefined {
  return modulesConfig.find(m => m.id === id)
}

export function isModuleEnabled(id: string): boolean {
  return modulesConfig.some(m => m.id === id && m.enabled)
}
