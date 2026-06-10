// ─── Roles, permisos y módulos — ORIGEN Fitness ───────────────────────────────

export type Permission =
  | '*'
  | 'dashboard:view'
  | 'schedule:view'
  | 'schedule:manage'
  | 'attendance:create'
  | 'attendance:review'
  | 'attendance:edit'
  | 'entities:read'
  | 'entities:write'
  | 'entities:delete'
  | 'users:read'
  | 'users:manage'
  | 'reports:view'
  | 'reports:export'
  | 'settings:read'
  | 'settings:write'
  | 'platform:manage'

export interface RoleConfig {
  label: string
  permissions: Permission[]
  modules: string[]
  defaultRoute: string
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
      'dashboard:view',
      'schedule:view', 'schedule:manage',
      'attendance:review', 'attendance:edit',
      'entities:read', 'entities:write', 'entities:delete',
      'users:read', 'users:manage',
      'reports:view', 'reports:export',
      'settings:read', 'settings:write',
    ],
    modules: ['dashboard', 'schedule', 'attendance', 'entities', 'users', 'reports', 'notifications', 'profile', 'settings'],
    defaultRoute: '/admin/dashboard',
  },

  profesor: {
    label: 'Profesor',
    permissions: [
      'dashboard:view',
      'schedule:view',
      'attendance:create',
      'entities:read',
    ],
    modules: ['dashboard', 'schedule', 'attendance', 'notifications', 'profile'],
    defaultRoute: '/dashboard',
  },

  manager: {
    label: 'Manager',
    permissions: [
      'dashboard:view',
      'schedule:view',
      'entities:read',
      'reports:view', 'reports:export',
    ],
    modules: ['dashboard', 'reports', 'schedule', 'notifications', 'profile'],
    defaultRoute: '/manager/dashboard',
  },

  visitor: {
    label: 'Visitante',
    permissions: ['schedule:view'],
    modules: ['schedule'],
    defaultRoute: '/schedule',
  },
}

export function hasPermission(userPermissions: string[], permission: Permission): boolean {
  return userPermissions.includes('*') || userPermissions.includes(permission)
}

export function hasModule(role: string, moduleId: string): boolean {
  const config = rolesConfig[role]
  if (!config) return false
  return config.modules.includes('*') || config.modules.includes(moduleId)
}
