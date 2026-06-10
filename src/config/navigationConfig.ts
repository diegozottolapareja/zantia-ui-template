// ─── Navegación por rol — ORIGEN Fitness ──────────────────────────────────────

import { rolesConfig } from './rolesConfig'

export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  moduleId: string
}

const navigationConfig: Record<string, NavItem[]> = {
  superAdmin: [
    { id: 'super-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/super/dashboard', moduleId: 'dashboard' },
    { id: 'tenants',         label: 'Tenants',   icon: 'Building2',       path: '/super/tenants',   moduleId: 'platform' },
    { id: 'audit',           label: 'Auditoría', icon: 'ScrollText',      path: '/super/audit',     moduleId: 'platform' },
    { id: 'super-settings',  label: 'Config',    icon: 'Settings',        path: '/super/settings',  moduleId: 'settings' },
  ],

  admin: [
    { id: 'admin-dashboard', label: 'Inicio',      icon: 'LayoutDashboard', path: '/admin/dashboard',     moduleId: 'dashboard' },
    { id: 'schedule',        label: 'Agenda',       icon: 'CalendarDays',    path: '/schedule',            moduleId: 'schedule' },
    { id: 'attendance',      label: 'Asistencias',  icon: 'ClipboardCheck',  path: '/attendance/review',   moduleId: 'attendance' },
    { id: 'students',        label: 'Alumnos',      icon: 'Users',           path: '/students',            moduleId: 'entities' },
    { id: 'admin-profile',   label: 'Perfil',       icon: 'User',            path: '/admin/profile',       moduleId: 'profile' },
  ],

  profesor: [
    { id: 'dashboard',   label: 'Inicio',      icon: 'LayoutDashboard', path: '/dashboard',   moduleId: 'dashboard' },
    { id: 'schedule',    label: 'Agenda',       icon: 'CalendarDays',    path: '/schedule',    moduleId: 'schedule' },
    { id: 'attendance',  label: 'Asistencias',  icon: 'ClipboardCheck',  path: '/attendance',  moduleId: 'attendance' },
    { id: 'profile',     label: 'Perfil',       icon: 'User',            path: '/profile',     moduleId: 'profile' },
  ],

  manager: [
    { id: 'manager-dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/manager/dashboard', moduleId: 'dashboard' },
    { id: 'reports',           label: 'Reportes',  icon: 'BarChart2',       path: '/reports',           moduleId: 'reports' },
    { id: 'schedule',          label: 'Agenda',    icon: 'CalendarDays',    path: '/schedule',          moduleId: 'schedule' },
    { id: 'profile',           label: 'Perfil',    icon: 'User',            path: '/profile',           moduleId: 'profile' },
  ],

  visitor: [
    { id: 'schedule', label: 'Agenda', icon: 'CalendarDays', path: '/schedule', moduleId: 'schedule' },
  ],
}

export function getNavItems(role: string): NavItem[] {
  return navigationConfig[role] ?? []
}

export function getDefaultRoute(role: string): string {
  return rolesConfig[role]?.defaultRoute ?? '/'
}

export function getNavItem(role: string, id: string): NavItem | undefined {
  return navigationConfig[role]?.find(item => item.id === id)
}

export { navigationConfig }
