import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import {
  HomeIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UsersIcon,
  CalculatorIcon,
  VideoCameraIcon,
  ScaleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EdificiosPage from './pages/EdificiosPage'
import UnidadesPage from './pages/UnidadesPage'
import GastosComunesPage from './pages/GastosComunesPage'
import ArriendosPage from './pages/ArriendosPage'
import DistribucionPage from './pages/DistribucionPage'
import RRHHPage from './pages/RRHHPage'
import ContabilidadPage from './pages/ContabilidadPage'
import ReunionesPage from './pages/ReunionesPage'
import AsistenteLegalPage from './pages/AsistenteLegalPage'
import ReportesPage from './pages/ReportesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Edificios', href: '/edificios', icon: BuildingOffice2Icon },
  { name: 'Gastos Comunes', href: '/gastos-comunes', icon: CurrencyDollarIcon },
  { name: 'Arriendos', href: '/arriendos', icon: DocumentTextIcon },
  { name: 'Distribución', href: '/distribucion', icon: UsersIcon },
  { name: 'RRHH', href: '/rrhh', icon: UsersIcon },
  { name: 'Contabilidad', href: '/contabilidad', icon: CalculatorIcon },
  { name: 'Reuniones', href: '/reuniones', icon: VideoCameraIcon },
  { name: 'Asistente Legal', href: '/legal', icon: ScaleIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
]

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-primary-600">DATAPOLIS</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={location.pathname === item.href ? 'sidebar-link-active' : 'sidebar-link-inactive'}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white border-r">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-xl font-bold text-primary-600">DATAPOLIS</span>
            <span className="ml-2 text-xs text-gray-400">PRO</span>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={location.pathname === item.href || location.pathname.startsWith(item.href + '/') 
                  ? 'sidebar-link-active' 
                  : 'sidebar-link-inactive'}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Link to="/configuracion" className="sidebar-link-inactive">
              <Cog6ToothIcon className="w-5 h-5" />
              Configuración
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-8">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-gray-500" />
          </button>
          
          <div className="flex-1 lg:ml-0" />
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Cerrar sesión"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/edificios/*" element={<PrivateRoute><EdificiosPage /></PrivateRoute>} />
      <Route path="/unidades/*" element={<PrivateRoute><UnidadesPage /></PrivateRoute>} />
      <Route path="/gastos-comunes/*" element={<PrivateRoute><GastosComunesPage /></PrivateRoute>} />
      <Route path="/arriendos/*" element={<PrivateRoute><ArriendosPage /></PrivateRoute>} />
      <Route path="/distribucion/*" element={<PrivateRoute><DistribucionPage /></PrivateRoute>} />
      <Route path="/rrhh/*" element={<PrivateRoute><RRHHPage /></PrivateRoute>} />
      <Route path="/contabilidad/*" element={<PrivateRoute><ContabilidadPage /></PrivateRoute>} />
      <Route path="/reuniones/*" element={<PrivateRoute><ReunionesPage /></PrivateRoute>} />
      <Route path="/legal/*" element={<PrivateRoute><AsistenteLegalPage /></PrivateRoute>} />
      <Route path="/reportes/*" element={<PrivateRoute><ReportesPage /></PrivateRoute>} />
      <Route path="/configuracion/*" element={<PrivateRoute><ConfiguracionPage /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
