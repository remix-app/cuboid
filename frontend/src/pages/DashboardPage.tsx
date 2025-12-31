import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import api, { formatMoney } from '../services/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
  })

  const { data: ingresos } = useQuery({
    queryKey: ['dashboard-ingresos'],
    queryFn: () => api.get('/dashboard/ingresos?meses=6').then(r => r.data),
  })

  const { data: morosos } = useQuery({
    queryKey: ['dashboard-morosidad'],
    queryFn: () => api.get('/dashboard/morosidad').then(r => r.data),
  })

  const { data: alertas } = useQuery({
    queryKey: ['dashboard-alertas'],
    queryFn: () => api.get('/dashboard/alertas').then(r => r.data),
  })

  const ingresosChartData = {
    labels: ingresos?.map((i: any) => i.nombre) || [],
    datasets: [
      {
        label: 'Gastos Comunes',
        data: ingresos?.map((i: any) => i.gastos_comunes) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Arriendos',
        data: ingresos?.map((i: any) => i.arriendos) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  }

  const morosidadChartData = {
    labels: ['Al día', 'Morosos'],
    datasets: [{
      data: [
        (stats?.total_unidades || 0) - (morosos?.length || 0),
        morosos?.length || 0,
      ],
      backgroundColor: ['#10B981', '#EF4444'],
    }],
  }

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen general del sistema</p>
      </div>

      {/* Alertas */}
      {alertas && alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                alerta.tipo === 'error' ? 'bg-red-50 text-red-800' :
                alerta.tipo === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                'bg-blue-50 text-blue-800'
              }`}
            >
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{alerta.mensaje}</span>
              <Link to={alerta.accion} className="text-sm font-medium underline">
                Ver más
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <HomeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="stat-label">Total Unidades</p>
              <p className="stat-value">{stats?.total_unidades || 0}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="stat-label">Recaudación Mes</p>
              <p className="stat-value">{formatMoney(stats?.recaudacion_mes)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            +12% vs mes anterior
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="stat-label">Morosidad Total</p>
              <p className="stat-value text-red-600">{formatMoney(stats?.morosidad_total)}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-red-600">
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            {morosos?.length || 0} unidades morosas
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="stat-label">Contratos Activos</p>
              <p className="stat-value">{stats?.contratos_activos || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Ingresos Mensuales</h3>
          </div>
          <div className="card-body">
            <Bar
              data={ingresosChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatMoney(Number(value)),
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Estado de Pagos</h3>
          </div>
          <div className="card-body flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={morosidadChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Morosos table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Principales Morosos</h3>
          <Link to="/gastos-comunes/morosidad" className="text-sm text-primary-600 hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Edificio</th>
                <th>Propietario</th>
                <th>Deuda</th>
                <th>Días Mora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {morosos?.slice(0, 5).map((m: any) => (
                <tr key={m.unidad_id}>
                  <td className="font-medium">{m.numero}</td>
                  <td>{m.edificio}</td>
                  <td>{m.propietario || '-'}</td>
                  <td className="text-red-600 font-medium">{formatMoney(m.deuda)}</td>
                  <td>
                    <span className={`badge ${m.dias_mora > 60 ? 'badge-danger' : 'badge-warning'}`}>
                      {m.dias_mora} días
                    </span>
                  </td>
                </tr>
              ))}
              {(!morosos || morosos.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    No hay unidades morosas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/gastos-comunes" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generar Boletas</p>
              <p className="text-sm text-gray-500">Crear boletas del período</p>
            </div>
          </div>
        </Link>

        <Link to="/arriendos" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Facturar Arriendos</p>
              <p className="text-sm text-gray-500">Generar facturas mensuales</p>
            </div>
          </div>
        </Link>

        <Link to="/reuniones" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UsersIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Programar Reunión</p>
              <p className="text-sm text-gray-500">{stats?.reuniones_programadas || 0} programadas</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
