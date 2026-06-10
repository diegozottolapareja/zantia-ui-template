// ─── Roles, permisos y módulos por rol ────────────────────────────────────────
// Para customizar: agregar/quitar roles, ajustar permisos y módulos habilitados.
// En código nuevo, preferir can(permission) sobre comparar user.role directamente.

export type Permission =
  | '*'
  | 'entities:read'
  | 'entities:write'
  | 'entities:delete'
  | 'operations:read'
  | 'operations:write'
  | 'users:read'
  | 'users:manage'
  | 'analytics:read'
  | 'reports:read'
  | 'catalog:read'
  | 'catalog:write'
  | 'settings:read'
  | 'settings:write'
  | 'platform:manage'

export interface RoleConfig {
  label: string
  permissions: Permission[]
  modules: string[]          // IDs de módulos habilitados ('*' = todos)
  defaultRoute: string       // Ruta a la que se redirige al hacer login
}

export const rolesConfig: Record<string, RoleConfig> = {
  superAdmin: {
    label: 'Super Admin',
    permissions: ['*'],
    modules: ['*'],
    defaultRoute: '/super/dashboard',
  },

  admin: {
    label: 'Administrador',
    permissions: [
      'entities:read', 'entities:write', 'entities:delete',
      'operations:read', 'operations:write',
      'users:read', 'users:manage',
      'analytics:read', 'reports:read',
      'settings:read', 'settings:write',
    ],
    modules: ['dashboard', 'entities', 'operations', 'users', 'analytics', 'notifications', 'profile', 'settings'],
    defaultRoute: '/admin/dashboard',
  },

  // Rol operativo — en granos es el "corredor", en otros rubros puede ser agente, operador, vendedor
  corredor: {
    label: 'Operativo',
    permissions: [
      'entities:read', 'entities:write',
      'operations:read', 'operations:write',
      'catalog:read',
    ],
    modules: ['dashboard', 'entities', 'operations', 'calculator', 'notifications', 'profile', 'settings'],
    defaultRoute: '/dashboard',
  },

  // Rol cliente — en granos es el "comprador", en otros rubros puede ser cliente, alumno, huésped
  comprador: {
    label: 'Cliente',
    permissions: ['catalog:read'],
    modules: ['catalog', 'notifications', 'profile', 'settings'],
    defaultRoute: '/marketplace',
  },

  visitor: {
    label: 'Visitante',
    permissions: ['catalog:read'],
    modules: ['catalog'],
    defaultRoute: '/marketplace',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function hasPermission(userPermissions: string[], permission: Permission): boolean {
  return userPermissions.includes('*') || userPermissions.includes(permission)
}

export function hasModule(role: string, moduleId: string): boolean {
  const config = rolesConfig[role]
  if (!config) return false
  return config.modules.includes('*') || config.modules.includes(moduleId)
}
