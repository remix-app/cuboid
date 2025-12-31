import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CurrencyDollarIcon, DocumentCheckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import api, { formatMoney, formatDate, getEstadoColor } from '../services/api'
import toast from 'react-hot-toast'

export default function DistribucionPage() {
  const queryClient = useQueryClient()

  const { data: distribuciones, isLoading } = useQuery({
    queryKey: ['distribuciones'],
    queryFn: () => api.get('/distribucion').then(r => r.data),
  })

  const { data: certificados } = useQuery({
    queryKey: ['certificados-renta'],
    queryFn: () => api.get('/distribucion/certificados').then(r => r.data),
  })

  const procesarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/distribucion/${id}/procesar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribuciones'] })
      toast.success('Distribución procesada')
    },
  })

  const aprobarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/distribucion/${id}/aprobar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribuciones'] })
      toast.success('Distribución aprobada')
    },
  })

  const totalDistribuido = distribuciones?.data?.filter((d: any) => d.estado === 'aprobada').reduce((sum: number, d: any) => sum + d.monto_neto, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Distribución de Ingresos</h1>
        <p className="text-gray-500">Distribución de arriendos según Ley 21.713</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-label">Distribuciones</p>
          <p className="stat-value">{distribuciones?.data?.length || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pendientes Procesar</p>
          <p className="stat-value text-yellow-600">{distribuciones?.data?.filter((d: any) => d.estado === 'borrador').length || 0}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Distribuido</p>
          <p className="stat-value text-green-600">{formatMoney(totalDistribuido)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Certificados Emitidos</p>
          <p className="stat-value">{certificados?.data?.length || 0}</p>
        </div>
      </div>

      {/* Info legal */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900">Ley 21.713 - Distribución de Ingresos</h3>
        <p className="text-sm text-blue-800 mt-1">
          Los ingresos por arriendo de bienes comunes deben distribuirse proporcionalmente entre copropietarios.
          Los montos proporcionales a derechos están exentos de impuesto según Art. 17 N°3 LIR.
        </p>
      </div>

      {/* Tabla distribuciones */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Distribuciones</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Edificio</th>
                <th>Concepto</th>
                <th>Monto Bruto</th>
                <th>Gastos Adm.</th>
                <th>Monto Neto</th>
                <th>Beneficiarios</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={9} className="text-center py-8"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : distribuciones?.data?.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-500">No hay distribuciones registradas</td></tr>
              ) : (
                distribuciones?.data?.map((d: any) => (
                  <tr key={d.id}>
                    <td className="font-medium">{d.periodo_mes}/{d.periodo_anio}</td>
                    <td>{d.edificio}</td>
                    <td>{d.concepto}</td>
                    <td>{formatMoney(d.monto_bruto)}</td>
                    <td className="text-gray-500">{formatMoney(d.gastos_administracion)}</td>
                    <td className="font-semibold text-green-600">{formatMoney(d.monto_neto)}</td>
                    <td>{d.total_beneficiarios}</td>
                    <td><span className={`badge ${getEstadoColor(d.estado)}`}>{d.estado}</span></td>
                    <td>
                      <div className="flex gap-2">
                        {d.estado === 'borrador' && (
                          <button onClick={() => procesarMutation.mutate(d.id)} disabled={procesarMutation.isPending} className="text-primary-600 hover:underline text-sm">
                            Procesar
                          </button>
                        )}
                        {d.estado === 'procesada' && (
                          <button onClick={() => aprobarMutation.mutate(d.id)} disabled={aprobarMutation.isPending} className="text-green-600 hover:underline text-sm">
                            Aprobar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificados */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">Certificados de Renta</h3>
          <button className="btn-secondary btn-sm">
            <DocumentCheckIcon className="w-4 h-4 mr-2" />
            Generar Masivo
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>N° Certificado</th>
                <th>Año</th>
                <th>Unidad</th>
                <th>Beneficiario</th>
                <th>Renta Total</th>
                <th>Art. 17</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificados?.data?.map((c: any) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.numero_certificado}</td>
                  <td>{c.anio}</td>
                  <td>{c.numero}</td>
                  <td>{c.nombre_completo}</td>
                  <td>{formatMoney(c.renta_total)}</td>
                  <td className="text-green-600">{formatMoney(c.renta_articulo_17)}</td>
                  <td>{formatDate(c.fecha_emision)}</td>
                  <td>
                    <a href={`/api/distribucion/certificados/${c.id}/pdf`} className="text-primary-600 hover:underline text-sm" target="_blank">
                      Descargar PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
