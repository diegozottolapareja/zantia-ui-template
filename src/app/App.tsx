import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { ParametrosProvider } from './contexts/ParametrosContext'
import { PrivateRoute } from './components/PrivateRoute'
import { OfflineBanner } from '@/components/OfflineBanner'
import { InstallBanner } from '@/components/InstallBanner'
import { UpdateBanner } from '@/components/UpdateBanner'
import Login from './pages/Login'
import OperativeDashboard from './pages/OperativeDashboard'
import OperationDetail from './pages/OperationDetail'
import Calculator from './pages/Calculator'
import ListingsPage from './pages/ListingsPage'
import OperationsPage from './pages/OperationsPage'
import ParametersPage from './pages/ParametersPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSellerTracking from './pages/AdminSellerTracking'
import AdminAIChat from './pages/AdminAIChat'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import UserManagement from './pages/UserManagement'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Onboarding from './pages/Onboarding'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import TenantsPage from './pages/TenantsPage'
import AuditLogPage from './pages/AuditLogPage'
import PlatformSettingsPage from './pages/PlatformSettingsPage'
import CatalogPage from './pages/CatalogPage'

function UnauthorizedPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleVolver = () => { logout(); navigate('/', { replace: true }) }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-dark via-surface-dark-mid to-surface-dark">
      <div className="text-center">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-2xl font-bold text-white mb-2">Acceso denegado</p>
        <p className="text-white/50 mb-6">No tenés permisos para ver esta página.</p>
        <button onClick={handleVolver} className="text-white underline text-sm">Volver al inicio</button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ParametrosProvider>
        <Router>
          <div className="size-full">
            <OfflineBanner />
            <UpdateBanner />

            <Routes>
              {/* Public */}
              <Route path="/" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Operative routes (corredor) */}
              <Route path="/dashboard"   element={<PrivateRoute allowedRoles={['corredor', 'superAdmin', 'admin']}><OperativeDashboard /></PrivateRoute>} />
              <Route path="/match"       element={<PrivateRoute allowedRoles={['corredor', 'superAdmin', 'admin']}><OperationDetail /></PrivateRoute>} />
              <Route path="/calculadora" element={<PrivateRoute allowedRoles={['corredor', 'superAdmin', 'admin']}><Calculator /></PrivateRoute>} />
              <Route path="/posiciones"  element={<PrivateRoute allowedRoles={['corredor', 'superAdmin', 'admin']}><ListingsPage /></PrivateRoute>} />
              <Route path="/operaciones" element={<PrivateRoute allowedRoles={['corredor', 'superAdmin', 'admin']}><OperationsPage /></PrivateRoute>} />

              {/* Customer routes (comprador) */}
              <Route path="/marketplace" element={<PrivateRoute allowedRoles={['comprador', 'superAdmin', 'admin']}><CatalogPage /></PrivateRoute>} />

              {/* Admin routes */}
              <Route path="/admin/dashboard"  element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/analytics"  element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AdminAnalytics /></PrivateRoute>} />
              <Route path="/admin/tracking"   element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AdminSellerTracking /></PrivateRoute>} />
              <Route path="/admin/ai-chat"    element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AdminAIChat /></PrivateRoute>} />
              <Route path="/admin/users"      element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><UserManagement /></PrivateRoute>} />
              <Route path="/admin/profile"    element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><Profile role="admin" /></PrivateRoute>} />
              <Route path="/parametros"       element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><ParametersPage /></PrivateRoute>} />

              {/* Shared */}
              <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
              <Route path="/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/profile"       element={<PrivateRoute><Profile role="seller" /></PrivateRoute>} />

              {/* SuperAdmin routes */}
              <Route path="/super/dashboard" element={<PrivateRoute allowedRoles={['superAdmin']}><SuperAdminDashboard /></PrivateRoute>} />
              <Route path="/super/tenants"   element={<PrivateRoute allowedRoles={['superAdmin']}><TenantsPage /></PrivateRoute>} />
              <Route path="/super/audit"     element={<PrivateRoute allowedRoles={['superAdmin']}><AuditLogPage /></PrivateRoute>} />
              <Route path="/super/settings"  element={<PrivateRoute allowedRoles={['superAdmin']}><PlatformSettingsPage /></PrivateRoute>} />

              {/* Legacy redirects */}
              <Route path="/seller/dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="/seller/*"         element={<Navigate to="/dashboard" replace />} />

              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            <InstallBanner />
            <Toaster position="top-center" richColors toastOptions={{ style: { borderRadius: '1rem' } }} />
          </div>
        </Router>
      </ParametrosProvider>
    </AuthProvider>
  )
}
