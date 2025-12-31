import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentTextIcon, CurrencyDollarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import api, { formatMoney, formatDate, getEstadoColor } from '../services/api'
import toast from 'react-hot-toast'

export default function GastosComunesPage() {
  const queryClient = useQueryClient()
  const [edificioId, setEdificioId] = useState('')
  const [tab, setTab] = useState<'periodos' | 'boletas' | 'pagos' | 'morosidad'>('periodos')

  const { data: edificios } = useQuery({
    queryKey: ['edificios'],
    queryFn: () => api.get('/edificios').then(r => r.data),
  })

  const { data: periodos, isLoading: loadingPeriodos } = useQuery({
    queryKey: ['periodos', edificioId],
    queryFn: () => api.get('/gastos-comunes/periodos', { params: { edificio_id: edificioId || undefined } }).then(r => r.data),
  })

  const { data: morosidad } = useQuery({
    queryKey: ['morosidad', edificioId],
    queryFn: () => api.get('/gastos-comunes/morosidad', { params: { edificio_id: edificioId || undefined } }).then(r => r.data),
  })

  const generarBoletasMutation = useMutation({
    mutationFn: (periodoId: number) => api.post(`/gastos-comunes/periodos/${periodoId}/generar-boletas`),
    onSuccess: (_, periodoId) => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] })
      toast.success('Boletas generadas correctamente')
    },
  })

  const tabs = [
    { id: 'periodos', name: 'Períodos', icon: DocumentTextIcon },
    { id: 'boletas', name: 'Boletas', icon: CurrencyDollarIcon },
    { id: 'pagos', name: 'Pagos', icon: CheckCircleIcon },
    { id: 'morosidad', name: 'Morosidad', icon: ExclamationTriangleIcon },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gastos Comunes</h1>
        <p className="text-gray-500">Gestión de cobros y recaudación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-label">Total Emitido</p>
          <p className="stat-value">{formatMoney(periodos?.data?.[0]?.total_emitido)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Recaudado</p>
          <p className="stat-value text-green-600">{formatMoney(periodos?.data?.[0]?.total_recaudado)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Pendiente</p>
          <p className="stat-value text-yellow-600">{formatMoney(periodos?.data?.[0]?.total_pendiente)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Morosos</p>
          <p className="stat-value text-red-600">{morosidad?.totales?.total_morosos || 0}</p>
        </div>
      </div>

      {/* Filtro y tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.name}
            </button>
          ))}
        </div>

        <select
          className="input max-w-xs"
          value={edificioId}
          onChange={e => setEdificioId(e.target.value)}
        >
          <option value="">Todos los edificios</option>
          {edificios?.map((e: any) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>

      {/* Contenido según tab */}
      {tab === 'periodos' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Edificio</th>
                  <th>Vencimiento</th>
                  <th>Emitido</th>
                  <th>Recaudado</th>
                  <th>Pendiente</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingPeriodos ? (
                  <tr><td colSpan={8} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                ) : periodos?.data?.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">No hay períodos registrados</td></tr>
                ) : (
                  periodos?.data?.map((periodo: any) => (
                    <tr key={periodo.id}>
                      <td className="font-medium">{periodo.mes}/{periodo.anio}</td>
                      <td>{periodo.edificio}</td>
                      <td>{formatDate(periodo.fecha_vencimiento)}</td>
                      <td>{formatMoney(periodo.total_emitido)}</td>
                      <td className="text-green-600">{formatMoney(periodo.total_recaudado)}</td>
                      <td className="text-yellow-600">{formatMoney(periodo.total_pendiente)}</td>
                      <td><span className={`badge ${getEstadoColor(periodo.estado)}`}>{periodo.estado}</span></td>
                      <td>
                        {periodo.estado === 'abierto' && (
                          <button
                            onClick={() => generarBoletasMutation.mutate(periodo.id)}
                            disabled={generarBoletasMutation.isPending}
                            className="text-primary-600 hover:underline text-sm"
                          >
                            Generar boletas
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'morosidad' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Unidades Morosas</h3>
            <p className="text-sm text-gray-500">Deuda total: {formatMoney(morosidad?.totales?.deuda_total)}</p>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Unidad</th>
                  <th>Edificio</th>
                  <th>Propietario</th>
                  <th>Contacto</th>
                  <th>Boletas</th>
                  <th>Deuda</th>
                  <th>Días Mora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {morosidad?.morosos?.map((m: any) => (
                  <tr key={m.unidad_id}>
                    <td className="font-medium">{m.numero}</td>
                    <td>{m.edificio}</td>
                    <td>{m.propietario || '-'}</td>
                    <td>
                      <div className="text-sm">
                        <p>{m.email}</p>
                        <p className="text-gray-500">{m.telefono}</p>
                      </div>
                    </td>
                    <td>{m.boletas_pendientes}</td>
                    <td className="text-red-600 font-semibold">{formatMoney(m.deuda)}</td>
                    <td>
                      <span className={`badge ${m.dias_mora > 60 ? 'badge-danger' : m.dias_mora > 30 ? 'badge-warning' : 'badge-info'}`}>
                        {m.dias_mora} días
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
