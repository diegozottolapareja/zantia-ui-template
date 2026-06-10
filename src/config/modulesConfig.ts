// ─── Módulos de la aplicación — ORIGEN Fitness ────────────────────────────────

export interface ModuleConfig {
  id: string
  label: string
  description: string
  enabled: boolean
  path: string
}

export const modulesConfig: ModuleConfig[] = [
  { id: 'dashboard',    label: 'Dashboard',      description: 'Panel principal con métricas del día',            enabled: true,  path: '/dashboard' },
  { id: 'schedule',     label: 'Agenda',          description: 'Clases programadas y asignación de profesores',   enabled: true,  path: '/schedule' },
  { id: 'attendance',   label: 'Asistencias',     description: 'Registro y revisión de asistencias',             enabled: true,  path: '/attendance' },
  { id: 'entities',     label: 'Alumnos',         description: 'Gestión de alumnos y membresías',                enabled: true,  path: '/students' },
  { id: 'users',        label: 'Usuarios',        description: 'Gestión de usuarios y roles del sistema',        enabled: true,  path: '/admin/users' },
  { id: 'reports',      label: 'Reportes',        description: 'KPIs, ocupación, facturación y exportación',     enabled: true,  path: '/reports' },
  { id: 'notifications',label: 'Notificaciones',  description: 'Centro de notificaciones del usuario',           enabled: true,  path: '/notifications' },
  { id: 'profile',      label: 'Perfil',          description: 'Perfil del usuario autenticado',                 enabled: true,  path: '/profile' },
  { id: 'settings',     label: 'Configuración',   description: 'Preferencias y configuración del sistema',       enabled: true,  path: '/settings' },
]

export function getModule(id: string): ModuleConfig | undefined {
  return modulesConfig.find(m => m.id === id)
}

export function isModuleEnabled(id: string): boolean {
  return modulesConfig.some(m => m.id === id && m.enabled)
}
