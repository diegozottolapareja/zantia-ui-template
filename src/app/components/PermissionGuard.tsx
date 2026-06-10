import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Permission } from '@/config/rolesConfig'

interface PermissionGuardProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renderiza children solo si el usuario tiene el permiso indicado.
 * Preferir este componente sobre RoleGuard en código nuevo.
 *
 * @example
 * <PermissionGuard permission="entities:write">
 *   <EditButton />
 * </PermissionGuard>
 *
 * <PermissionGuard permission="users:manage" fallback={<ReadOnlyView />}>
 *   <AdminPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { can } = useAuth()
  if (!can(permission)) return <>{fallback}</>
  return <>{children}</>
}
