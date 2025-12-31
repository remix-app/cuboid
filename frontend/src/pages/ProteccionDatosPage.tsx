import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api, { formatDate } from '../services/api'

export default function ProteccionDatosPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'dashboard' | 'solicitudes' | 'consentimientos' | 'tratamientos' | 'brechas' | 'politicas'>('dashboard')
  const [showModalSolicitud, setShowModalSolicitud] = useState(false)
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any>(null)

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['proteccion-dashboard'],
    queryFn: () => api.get('/proteccion-datos/dashboard').then(r => r.data),
  })

  const { data: solicitudes } = useQuery({
    queryKey: ['solicitudes-arco'],
    queryFn: () => api.get('/proteccion-datos/solicitudes').then(r => r.data),
    enabled: tab === 'solicitudes',
  })

  const { data: tratamientos } = useQuery({
    queryKey: ['tratamientos-datos'],
    queryFn: () => api.get('/proteccion-datos/tratamientos').then(r => r.data),
    enabled: tab === 'tratamientos',
  })

  const { data: brechas } = useQuery({
    queryKey: ['brechas-seguridad'],
    queryFn: () => api.get('/proteccion-datos/brechas').then(r => r.data),
    enabled: tab === 'brechas',
  })

  const procesarSolicitud = useMutation({
    mutationFn: (data: { id: number, estado: string, respuesta: string }) =>
      api.put(`/proteccion-datos/solicitudes/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes-arco'] })
      queryClient.invalidateQueries({ queryKey: ['proteccion-dashboard'] })
      toast.success('Solicitud procesada')
      setShowModalSolicitud(false)
    },
  })

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ShieldCheckIcon },
    { id: 'solicitudes', label: 'Solicitudes ARCO', icon: DocumentTextIcon, badge: dashboard?.solicitudes?.pendientes },
    { id: 'consentimientos', label: 'Consentimientos', icon: CheckCircleIcon },
    { id: 'tratamientos', label: 'Tratamientos', icon: UserGroupIcon },
    { id: 'brechas', label: 'Brechas', icon: ExclamationTriangleIcon, badge: dashboard?.brechas?.abiertas },
    { id: 'politicas', label: 'Políticas', icon: DocumentTextIcon },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Protección de Datos Personales</h1>
        <p className="text-gray-500">Cumplimiento Ley 19.628 / Ley 21.719 (2024)</p>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <nav className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`pb-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
              }`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.badge ? (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">{t.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          {/* Alertas */}
          {(dashboard?.solicitudes?.vencidas > 0 || dashboard?.brechas?.criticas > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span className="font-medium">Alertas de Cumplimiento</span>
              </div>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {dashboard?.solicitudes?.vencidas > 0 && (
                  <li>{dashboard.solicitudes.vencidas} solicitudes ARCO vencidas (plazo legal: 10 días hábiles)</li>
                )}
                {dashboard?.brechas?.criticas > 0 && (
                  <li>{dashboard.brechas.criticas} brechas críticas sin resolver (notificar a Agencia en 72h)</li>
                )}
              </ul>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Solicitudes Pendientes</p>
                  <p className="stat-value">{dashboard?.solicitudes?.pendientes || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{dashboard?.solicitudes?.total_mes || 0} este mes</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Consentimientos Activos</p>
                  <p className="stat-value text-green-600">{dashboard?.consentimientos?.activos || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{dashboard?.consentimientos?.revocados_mes || 0} revocados este mes</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Tratamientos Activos</p>
                  <p className="stat-value">{dashboard?.tratamientos?.activos || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{dashboard?.tratamientos?.requieren_revision || 0} requieren revisión</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">Brechas Abiertas</p>
                  <p className={`stat-value ${dashboard?.brechas?.abiertas > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {dashboard?.brechas?.abiertas || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${dashboard?.brechas?.abiertas > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                  <ExclamationTriangleIcon className={`w-6 h-6 ${dashboard?.brechas?.abiertas > 0 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Política v{dashboard?.politica_vigente || '1.0'}</p>
            </div>
          </div>

          {/* Info Legal */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold">Marco Legal Aplicable</h2>
            </div>
            <div className="card-body">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Ley 19.628 / Ley 21.719 (2024)</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Licitud:</strong> Base legal documentada para cada tratamiento</li>
                    <li>• <strong>Finalidad:</strong> Propósito específico y legítimo</li>
                    <li>• <strong>Minimización:</strong> Solo datos necesarios</li>
                    <li>• <strong>Exactitud:</strong> Datos actualizados</li>
                    <li>• <strong>Limitación:</strong> Período de retención definido</li>
                    <li>• <strong>Seguridad:</strong> Medidas técnicas y organizativas</li>
                    <li>• <strong>Responsabilidad:</strong> Demostrable ante autoridad</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Derechos ARCO+ del Titular</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Acceso:</strong> Conocer qué datos se tratan</li>
                    <li>• <strong>Rectificación:</strong> Corregir datos inexactos</li>
                    <li>• <strong>Cancelación:</strong> Eliminar datos (supresión)</li>
                    <li>• <strong>Oposición:</strong> Oponerse al tratamiento</li>
                    <li>• <strong>Portabilidad:</strong> Recibir datos en formato estructurado</li>
                    <li>• <strong>Plazo respuesta:</strong> 10 días hábiles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solicitudes ARCO */}
      {tab === 'solicitudes' && (
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold">Solicitudes de Derechos ARCO+</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Solicitud</th>
                  <th>Fecha</th>
                  <th>Titular</th>
                  <th>Derecho</th>
                  <th>Fecha Límite</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes?.data?.map((s: any) => {
                  const vencida = new Date(s.fecha_limite_respuesta) < new Date() && !['completada', 'rechazada'].includes(s.estado)
                  return (
                    <tr key={s.id} className={vencida ? 'bg-red-50' : ''}>
                      <td className="font-mono text-sm">{s.numero_solicitud}</td>
                      <td>{formatDate(s.fecha_recepcion)}</td>
                      <td>
                        <div>
                          <p className="font-medium">{s.nombre_solicitante}</p>
                          <p className="text-xs text-gray-500">{s.rut_solicitante}</p>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info capitalize">{s.tipo_derecho}</span>
                      </td>
                      <td className={vencida ? 'text-red-600 font-medium' : ''}>
                        {formatDate(s.fecha_limite_respuesta)}
                        {vencida && <span className="ml-1 text-xs">(VENCIDA)</span>}
                      </td>
                      <td>
                        <span className={`badge ${
                          s.estado === 'completada' ? 'badge-success' :
                          s.estado === 'rechazada' ? 'badge-danger' :
                          s.estado === 'en_proceso' ? 'badge-info' : 'badge-warning'
                        }`}>{s.estado}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => { setSolicitudSeleccionada(s); setShowModalSolicitud(true) }}
                          className="btn-secondary btn-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" /> Ver
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tratamientos */}
      {tab === 'tratamientos' && (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="font-semibold">Registro de Tratamientos de Datos</h2>
            <button className="btn-primary btn-sm">Nuevo Tratamiento</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tratamiento</th>
                  <th>Categoría</th>
                  <th>Base Legal</th>
                  <th>Retención</th>
                  <th>Sensible</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tratamientos?.map((t: any) => (
                  <tr key={t.id}>
                    <td>
                      <p className="font-medium">{t.nombre_tratamiento}</p>
                      <p className="text-xs text-gray-500 max-w-xs truncate">{t.finalidad_tratamiento}</p>
                    </td>
                    <td><span className="badge badge-gray capitalize">{t.categoria_datos}</span></td>
                    <td className="capitalize">{t.base_legal.replace(/_/g, ' ')}</td>
                    <td>{t.periodo_retencion_meses} meses</td>
                    <td>
                      {t.datos_sensibles ? (
                        <span className="badge badge-danger">Sí</span>
                      ) : (
                        <span className="badge badge-gray">No</span>
                      )}
                    </td>
                    <td><span className="badge badge-success">{t.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brechas */}
      {tab === 'brechas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="btn-danger">Reportar Brecha</button>
          </div>
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>N° Incidente</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Riesgo</th>
                    <th>Notificado Agencia</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {brechas?.data?.map((b: any) => (
                    <tr key={b.id}>
                      <td className="font-mono">{b.numero_incidente}</td>
                      <td>{formatDate(b.fecha_deteccion)}</td>
                      <td className="capitalize">{b.tipo_brecha.replace(/_/g, ' ')}</td>
                      <td>
                        <span className={`badge ${
                          b.nivel_riesgo === 'critico' ? 'badge-danger' :
                          b.nivel_riesgo === 'alto' ? 'badge-warning' :
                          b.nivel_riesgo === 'medio' ? 'badge-info' : 'badge-gray'
                        }`}>{b.nivel_riesgo}</span>
                      </td>
                      <td>
                        {b.notificado_agencia ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td><span className="badge badge-info">{b.estado}</span></td>
                    </tr>
                  ))}
                  {(!brechas?.data || brechas.data.length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-8">
                        <ShieldCheckIcon className="w-12 h-12 mx-auto text-green-300 mb-2" />
                        Sin brechas de seguridad registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Procesar Solicitud */}
      {showModalSolicitud && solicitudSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Solicitud {solicitudSeleccionada.numero_solicitud}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Titular:</strong> {solicitudSeleccionada.nombre_solicitante}</div>
                <div><strong>RUT:</strong> {solicitudSeleccionada.rut_solicitante}</div>
                <div><strong>Email:</strong> {solicitudSeleccionada.email_solicitante}</div>
                <div><strong>Derecho:</strong> <span className="capitalize">{solicitudSeleccionada.tipo_derecho}</span></div>
                <div><strong>Fecha recepción:</strong> {formatDate(solicitudSeleccionada.fecha_recepcion)}</div>
                <div><strong>Fecha límite:</strong> {formatDate(solicitudSeleccionada.fecha_limite_respuesta)}</div>
              </div>
              
              <div>
                <strong>Descripción:</strong>
                <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">{solicitudSeleccionada.descripcion_solicitud}</p>
              </div>

              {solicitudSeleccionada.motivo && (
                <div>
                  <strong>Motivo:</strong>
                  <p className="mt-1 text-gray-600">{solicitudSeleccionada.motivo}</p>
                </div>
              )}

              {!['completada', 'rechazada'].includes(solicitudSeleccionada.estado) && (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  procesarSolicitud.mutate({
                    id: solicitudSeleccionada.id,
                    estado: formData.get('estado') as string,
                    respuesta: formData.get('respuesta') as string,
                  })
                }} className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="label">Decisión</label>
                    <select name="estado" className="input" required>
                      <option value="">Seleccionar...</option>
                      <option value="aprobada">Aprobar solicitud</option>
                      <option value="rechazada">Rechazar solicitud</option>
                      <option value="completada">Marcar como completada</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Respuesta al titular</label>
                    <textarea name="respuesta" className="input" rows={4} required 
                      placeholder="Detalle la respuesta que se enviará al titular..." />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowModalSolicitud(false)} className="btn-secondary flex-1">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary flex-1" disabled={procesarSolicitud.isPending}>
                      {procesarSolicitud.isPending ? 'Procesando...' : 'Procesar Solicitud'}
                    </button>
                  </div>
                </form>
              )}

              {solicitudSeleccionada.respuesta && (
                <div className="pt-4 border-t">
                  <strong>Respuesta enviada:</strong>
                  <p className="mt-1 text-gray-600 bg-green-50 p-3 rounded">{solicitudSeleccionada.respuesta}</p>
                  <p className="text-xs text-gray-500 mt-1">Fecha: {formatDate(solicitudSeleccionada.fecha_respuesta)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
