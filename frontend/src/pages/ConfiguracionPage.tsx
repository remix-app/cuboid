import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Cog6ToothIcon, UserGroupIcon, KeyIcon, BellIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'general' | 'usuarios' | 'notificaciones' | 'seguridad'>('general')
  
  const [config, setConfig] = useState({
    dia_vencimiento_gc: 10,
    interes_mora: 1.5,
    fondo_reserva_porcentaje: 5,
    enviar_email_boletas: true,
    recordatorio_dias: 5,
  })

  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => api.get('/usuarios').then(r => r.data),
    enabled: tab === 'usuarios',
  })

  const updateConfig = useMutation({
    mutationFn: (data: any) => api.put('/configuracion', data),
    onSuccess: () => toast.success('Configuración guardada'),
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'usuarios', label: 'Usuarios', icon: UserGroupIcon },
    { id: 'notificaciones', label: 'Notificaciones', icon: BellIcon },
    { id: 'seguridad', label: 'Seguridad', icon: KeyIcon },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Ajustes del sistema</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card h-fit">
          <nav className="p-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <t.icon className="w-5 h-5" /> {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'general' && (
            <div className="card">
              <div className="card-header"><h2 className="font-semibold">Configuración General</h2></div>
              <div className="card-body space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Gastos Comunes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Día de vencimiento</label>
                      <input type="number" className="input" min={1} max={28} value={config.dia_vencimiento_gc}
                        onChange={e => setConfig({...config, dia_vencimiento_gc: +e.target.value})} />
                      <p className="text-xs text-gray-500 mt-1">Día del mes para vencimiento de boletas</p>
                    </div>
                    <div>
                      <label className="label">Interés por mora (%)</label>
                      <input type="number" className="input" step="0.1" min={0} max={10} value={config.interes_mora}
                        onChange={e => setConfig({...config, interes_mora: +e.target.value})} />
                      <p className="text-xs text-gray-500 mt-1">Porcentaje mensual por mora</p>
                    </div>
                    <div>
                      <label className="label">Fondo de Reserva (%)</label>
                      <input type="number" className="input" step="0.5" min={5} max={20} value={config.fondo_reserva_porcentaje}
                        onChange={e => setConfig({...config, fondo_reserva_porcentaje: +e.target.value})} />
                      <p className="text-xs text-gray-500 mt-1">Mínimo legal: 5%</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button onClick={() => updateConfig.mutate(config)} className="btn-primary" disabled={updateConfig.isPending}>
                    {updateConfig.isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'usuarios' && (
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h2 className="font-semibold">Usuarios</h2>
                <button className="btn-primary btn-sm">Nuevo Usuario</button>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {usuarios?.map((u: any) => (
                      <tr key={u.id}>
                        <td className="font-medium">{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-info">{u.roles?.[0]?.name || 'usuario'}</span></td>
                        <td><span className={`badge ${u.activo ? 'badge-success' : 'badge-gray'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                        <td><button className="btn-secondary btn-sm">Editar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'notificaciones' && (
            <div className="card">
              <div className="card-header"><h2 className="font-semibold">Notificaciones</h2></div>
              <div className="card-body space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-5 h-5 rounded text-primary-600" checked={config.enviar_email_boletas}
                    onChange={e => setConfig({...config, enviar_email_boletas: e.target.checked})} />
                  <div>
                    <p className="font-medium">Enviar boletas por email</p>
                    <p className="text-sm text-gray-500">Enviar automáticamente las boletas de gastos comunes</p>
                  </div>
                </label>
                <div>
                  <label className="label">Días de anticipación para recordatorios</label>
                  <input type="number" className="input w-32" min={1} max={15} value={config.recordatorio_dias}
                    onChange={e => setConfig({...config, recordatorio_dias: +e.target.value})} />
                </div>
                <div className="pt-4">
                  <button onClick={() => updateConfig.mutate(config)} className="btn-primary">Guardar Cambios</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'seguridad' && (
            <div className="card">
              <div className="card-header"><h2 className="font-semibold">Seguridad</h2></div>
              <div className="card-body space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Cambiar Contraseña</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="label">Contraseña actual</label>
                      <input type="password" className="input" />
                    </div>
                    <div>
                      <label className="label">Nueva contraseña</label>
                      <input type="password" className="input" />
                    </div>
                    <div>
                      <label className="label">Confirmar contraseña</label>
                      <input type="password" className="input" />
                    </div>
                    <button className="btn-primary">Cambiar Contraseña</button>
                  </div>
                </div>
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Sesiones Activas</h3>
                  <p className="text-sm text-gray-500">Última conexión: {user?.ultimo_login || 'Ahora'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
