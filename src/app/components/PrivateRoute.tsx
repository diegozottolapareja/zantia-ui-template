import { Navigate, useLocation } from 'react-router'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Role } from '@/config/appConfig'

interface PrivateRouteProps {
  children: ReactNode
  allowedRoles?: Role[]
}

const ADMIN_ROLES: Role[] = ['admin', 'superAdmin']

function roleDefaultRoute(role: Role): string {
  if (role === 'superAdmin') return '/super/dashboard'
  if (ADMIN_ROLES.includes(role)) return '/admin/dashboard'
  if (role === 'comprador') return '/marketplace'
  return '/dashboard'
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  const path = location.pathname
  if (path.startsWith('/admin/') && !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to={roleDefaultRoute(user.role)} replace />
  }
  if (path.startsWith('/super/') && user.role !== 'superAdmin') {
    return <Navigate to={roleDefaultRoute(user.role)} replace />
  }
  // Comprador can't access broker routes
  if (path.startsWith('/dashboard') && user.role === 'comprador') {
    return <Navigate to="/marketplace" replace />
  }

  return <>{children}</>
}
