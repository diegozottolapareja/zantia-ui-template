import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { OfflineBanner } from '@/components/OfflineBanner'
import { InstallBanner } from '@/components/InstallBanner'
import { UpdateBanner } from '@/components/UpdateBanner'

// Auth & shell
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

// ORIGEN — Fitness dashboards
import ProfesorDashboard from './pages/ProfesorDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import AdminDashboard from './pages/AdminDashboard'

// ORIGEN — Operational pages
import SchedulePage from './pages/SchedulePage'
import AttendancePage from './pages/AttendancePage'
import StudentsPage from './pages/StudentsPage'
import ClassesPage from './pages/ClassesPage'

// ORIGEN — Admin pages
import AttendanceReviewPage from './pages/AttendanceReviewPage'
import ReportsPage from './pages/ReportsPage'
import UserManagement from './pages/UserManagement'

// SuperAdmin
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import TenantsPage from './pages/TenantsPage'
import AuditLogPage from './pages/AuditLogPage'
import PlatformSettingsPage from './pages/PlatformSettingsPage'

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
      <Router>
        <div className="size-full">
          <OfflineBanner />
          <UpdateBanner />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Profesor routes */}
            <Route path="/dashboard"  element={<PrivateRoute allowedRoles={['profesor', 'admin', 'superAdmin']}><ProfesorDashboard /></PrivateRoute>} />

            {/* Manager routes */}
            <Route path="/manager/dashboard" element={<PrivateRoute allowedRoles={['manager', 'admin', 'superAdmin']}><ManagerDashboard /></PrivateRoute>} />
            <Route path="/reports"           element={<PrivateRoute allowedRoles={['manager', 'admin', 'superAdmin']}><ReportsPage /></PrivateRoute>} />

            {/* Operational — shared across roles */}
            <Route path="/schedule"    element={<PrivateRoute allowedRoles={['profesor', 'manager', 'admin', 'superAdmin', 'visitor']}><SchedulePage /></PrivateRoute>} />
            <Route path="/attendance"  element={<PrivateRoute allowedRoles={['profesor', 'admin', 'superAdmin']}><AttendancePage /></PrivateRoute>} />
            <Route path="/students"    element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><StudentsPage /></PrivateRoute>} />
            <Route path="/classes"     element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><ClassesPage /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard"       element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/users"           element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><UserManagement /></PrivateRoute>} />
            <Route path="/admin/profile"         element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><Profile role="admin" /></PrivateRoute>} />
            <Route path="/attendance/review"     element={<PrivateRoute allowedRoles={['admin', 'superAdmin']}><AttendanceReviewPage /></PrivateRoute>} />

            {/* Shared */}
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/profile"       element={<PrivateRoute><Profile role="seller" /></PrivateRoute>} />

            {/* SuperAdmin */}
            <Route path="/super/dashboard" element={<PrivateRoute allowedRoles={['superAdmin']}><SuperAdminDashboard /></PrivateRoute>} />
            <Route path="/super/tenants"   element={<PrivateRoute allowedRoles={['superAdmin']}><TenantsPage /></PrivateRoute>} />
            <Route path="/super/audit"     element={<PrivateRoute allowedRoles={['superAdmin']}><AuditLogPage /></PrivateRoute>} />
            <Route path="/super/settings"  element={<PrivateRoute allowedRoles={['superAdmin']}><PlatformSettingsPage /></PrivateRoute>} />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <InstallBanner />
          <Toaster position="top-center" richColors toastOptions={{ style: { borderRadius: '1rem' } }} />
        </div>
      </Router>
    </AuthProvider>
  )
}
