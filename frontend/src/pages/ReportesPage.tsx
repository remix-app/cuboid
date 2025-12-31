// ================================================
// REPORTES PAGE
// ================================================
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { DocumentArrowDownIcon, CalendarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import api, { formatMoney } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState({ desde: '', hasta: '' })
  const [edificioId, setEdificioId] = useState('')

  const { data: edificios } = useQuery({
    queryKey: ['edificios'],
    queryFn: () => api.get('/edificios').then(r => r.data),
  })

  const { data: resumen } = useQuery({
    queryKey: ['reporte-resumen', edificioId, periodo],
    queryFn: () => api.get('/reportes/resumen', { params: { edificio_id: edificioId, ...periodo } }).then(r => r.data),
  })

  const { data: recaudacion } = useQuery({
    queryKey: ['reporte-recaudacion', edificioId],
    queryFn: () => api.get('/reportes/recaudacion', { params: { edificio_id: edificioId, meses: 12 } }).then(r => r.data),
  })

  const recaudacionChart = {
    labels: recaudacion?.map((r: any) => r.mes) || [],
    datasets: [
      { label: 'Emitido', data: recaudacion?.map((r: any) => r.emitido) || [], borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true },
      { label: 'Recaudado', data: recaudacion?.map((r: any) => r.recaudado) || [], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true },
    ],
  }

  const handleExport = (tipo: string) => {
    window.open(`/api/reportes/exportar/${tipo}?edificio_id=${edificioId}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500">Análisis y exportación de datos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="label">Edificio</label>
              <select className="input w-48" value={edificioId} onChange={e => setEdificioId(e.target.value)}>
                <option value="">Todos</option>
                {edificios?.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Desde</label>
              <input type="date" className="input" value={periodo.desde} onChange={e => setPeriodo({...periodo, desde: e.target.value})} />
            </div>
            <div>
              <label className="label">Hasta</label>
              <input type="date" className="input" value={periodo.hasta} onChange={e => setPeriodo({...periodo, hasta: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleExport('excel')} className="btn-secondary">
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="btn-secondary">
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-label">Recaudación Total</p>
          <p className="stat-value text-green-600">{formatMoney(resumen?.recaudacion_total)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Morosidad</p>
          <p className="stat-value text-red-600">{formatMoney(resumen?.morosidad_total)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ingresos Arriendos</p>
          <p className="stat-value text-blue-600">{formatMoney(resumen?.ingresos_arriendos)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tasa Recaudación</p>
          <p className="stat-value">{resumen?.tasa_recaudacion || 0}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h2 className="font-semibold">Recaudación Mensual</h2></div>
          <div className="card-body"><Line data={recaudacionChart} options={{ responsive: true }} /></div>
        </div>
        <div className="card">
          <div className="card-header"><h2 className="font-semibold">Distribución de Ingresos</h2></div>
          <div className="card-body flex justify-center">
            <div className="w-64 h-64">
              <Doughnut data={{
                labels: ['Gastos Comunes', 'Arriendos', 'Otros'],
                datasets: [{ data: [resumen?.gc || 0, resumen?.arriendos || 0, resumen?.otros || 0], backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'] }]
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Reportes predefinidos */}
      <div className="card">
        <div className="card-header"><h2 className="font-semibold">Reportes Disponibles</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {[
            { nombre: 'Morosidad Detallada', desc: 'Listado completo de unidades morosas', tipo: 'morosidad' },
            { nombre: 'Recaudación por Período', desc: 'Resumen de pagos por mes', tipo: 'recaudacion' },
            { nombre: 'Ingresos por Arriendos', desc: 'Detalle de facturas emitidas', tipo: 'arriendos' },
            { nombre: 'Distribución de Ingresos', desc: 'Resumen de distribuciones realizadas', tipo: 'distribuciones' },
            { nombre: 'Costos de Personal', desc: 'Resumen de liquidaciones', tipo: 'personal' },
            { nombre: 'Balance General', desc: 'Estado financiero contable', tipo: 'balance' },
          ].map(r => (
            <button key={r.tipo} onClick={() => handleExport(r.tipo)} className="p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors">
              <p className="font-medium">{r.nombre}</p>
              <p className="text-sm text-gray-500">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
