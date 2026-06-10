// ─── Navegación por rol ────────────────────────────────────────────────────────
// Define qué ítems ve cada rol en el BottomNav y cómo navega al hacer login.
// Para customizar: editar los arrays por rol o agregar nuevos roles.
// Los iconos son nombres de lucide-react (ver https://lucide.dev/icons/).

import { rolesConfig } from './rolesConfig'

export interface NavItem {
  id: string
  label: string
  icon: string     // nombre exacto del ícono en lucide-react
  path: string
  moduleId: string
}

// Items de navegación por rol — los primeros 4-5 se muestran en BottomNav
const navigationConfig: Record<string, NavItem[]> = {
  superAdmin: [
    { id: 'super-dashboard', label: 'Dashboard',  icon: 'LayoutDashboard', path: '/super/dashboard', moduleId: 'dashboard' },
    { id: 'tenants',         label: 'Tenants',    icon: 'Building2',       path: '/super/tenants',   moduleId: 'platform' },
    { id: 'audit',           label: 'Auditoría',  icon: 'ScrollText',      path: '/super/audit',     moduleId: 'platform' },
    { id: 'super-settings',  label: 'Config',     icon: 'Settings',        path: '/super/settings',  moduleId: 'settings' },
  ],

  admin: [
    { id: 'admin-dashboard', label: 'Dashboard',  icon: 'LayoutDashboard', path: '/admin/dashboard',  moduleId: 'dashboard' },
    { id: 'analytics',       label: 'Analytics',  icon: 'BarChart2',       path: '/admin/analytics',  moduleId: 'analytics' },
    { id: 'users',           label: 'Usuarios',   icon: 'Users',           path: '/admin/users',      moduleId: 'users' },
    { id: 'notifications',   label: 'Avisos',     icon: 'Bell',            path: '/notifications',    moduleId: 'notifications' },
    { id: 'admin-profile',   label: 'Perfil',     icon: 'User',            path: '/admin/profile',    moduleId: 'profile' },
  ],

  // corredor = rol operativo (en granos: broker; renombrar en Fase 3)
  corredor: [
    { id: 'dashboard',    label: 'Inicio',       icon: 'LayoutDashboard', path: '/dashboard',    moduleId: 'dashboard' },
    { id: 'entities',     label: 'Posiciones',   icon: 'Package',         path: '/posiciones',   moduleId: 'entities' },
    { id: 'operations',   label: 'Operaciones',  icon: 'Handshake',       path: '/operaciones',  moduleId: 'operations' },
    { id: 'calculator',   label: 'Calculadora',  icon: 'Calculator',      path: '/calculadora',  moduleId: 'calculator' },
    { id: 'profile',      label: 'Perfil',       icon: 'User',            path: '/profile',      moduleId: 'profile' },
  ],

  // comprador = rol cliente (en granos: buyer; renombrar en Fase 3)
  comprador: [
    { id: 'catalog',        label: 'Catálogo',       icon: 'ShoppingBag', path: '/marketplace',  moduleId: 'catalog' },
    { id: 'notifications',  label: 'Notificaciones', icon: 'Bell',        path: '/notifications', moduleId: 'notifications' },
    { id: 'profile',        label: 'Perfil',         icon: 'User',        path: '/profile',       moduleId: 'profile' },
  ],

  visitor: [
    { id: 'catalog', label: 'Catálogo', icon: 'ShoppingBag', path: '/marketplace', moduleId: 'catalog' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
