// ================================================
// ARRIENDOS PAGE
// ================================================
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentTextIcon, BuildingOffice2Icon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/24/outline'
import api, { formatMoney, formatDate, getEstadoColor } from '../services/api'
import toast from 'react-hot-toast'

export default function ArriendosPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'contratos' | 'facturas'>('contratos')

  const { data: contratos, isLoading } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => api.get('/arriendos/contratos').then(r => r.data),
  })

  const { data: facturas } = useQuery({
    queryKey: ['facturas'],
    queryFn: () => api.get('/arriendos/facturas').then(r => r.data),
  })

  const generarFacturasMutation = useMutation({
    mutationFn: (data: { mes: number; anio: number }) => api.post('/arriendos/facturas/generar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] })
      toast.success('Facturas generadas')
    },
  })

  const handleGenerarFacturas = () => {
    const now = new Date()
    generarFacturasMutation.mutate({ mes: now.getMonth() + 1, anio: now.getFullYear() })
  }

  const totalMensual = contratos?.filter((c: any) => c.estado === 'activo').reduce((sum: number, c: any) => sum + c.monto_mensual, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Arriendos</h1>
          <p className="text-gray-500">Gestión de contratos y facturación</p>
        </div>
        <button onClick={handleGenerarFacturas} disabled={generarFacturasMutation.isPending} className="btn-primary">
          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
          {generarFacturasMutation.isPending ? 'Generando...' : 'Generar Facturas Mes'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="stat-label">Contratos Activos</p>
          <p className="stat-value">{contratos?.filter((c: any) => c.estado === 'activo').length || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Ingreso Mensual</p>
          <p className="stat-value text-green-600">{formatMoney(totalMensual)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Facturas Pendientes</p>
          <p className="stat-value text-yellow-600">{facturas?.data?.filter((f: any) => f.estado === 'emitida').length || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button onClick={() => setTab('contratos')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'contratos' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}>
          Contratos
        </button>
        <button onClick={() => setTab('facturas')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'facturas' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}>
          Facturas
        </button>
      </div>

      {tab === 'contratos' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Edificio</th>
                  <th>Arrendatario</th>
                  <th>Espacio</th>
                  <th>Monto</th>
                  <th>Vigencia</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contratos?.map((c: any) => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.edificio}</td>
                    <td>{c.arrendatario}</td>
                    <td className="capitalize">{c.tipo_espacio} - {c.ubicacion_espacio}</td>
                    <td>{c.moneda === 'UF' ? `${c.monto_mensual} UF` : formatMoney(c.monto_mensual)}</td>
                    <td>{formatDate(c.fecha_inicio)} - {formatDate(c.fecha_termino)}</td>
                    <td><span className={`badge ${getEstadoColor(c.estado)}`}>{c.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'facturas' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Factura</th>
                  <th>Período</th>
                  <th>Arrendatario</th>
                  <th>Neto</th>
                  <th>IVA</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facturas?.data?.map((f: any) => (
                  <tr key={f.id}>
                    <td className="font-medium">{f.numero_factura || '-'}</td>
                    <td>{f.periodo_mes}/{f.periodo_anio}</td>
                    <td>{f.arrendatario}</td>
                    <td>{formatMoney(f.monto_neto)}</td>
                    <td>{formatMoney(f.iva)}</td>
                    <td className="font-semibold">{formatMoney(f.monto_total)}</td>
                    <td><span className={`badge ${getEstadoColor(f.estado)}`}>{f.estado}</span></td>
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
