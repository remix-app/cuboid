import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api, { formatMoney, formatDate } from '../services/api'

export default function RRHHPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'empleados' | 'liquidaciones'>('empleados')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    rut: '', nombres: '', apellido_paterno: '', apellido_materno: '',
    fecha_nacimiento: '', sexo: 'M', direccion: '', comuna: '', telefono: '', email: '',
    fecha_ingreso: '', tipo_contrato: 'indefinido', sueldo_base: 0,
    afp_id: '', salud_id: ''
  })

  const { data: empleados, isLoading } = useQuery({
    queryKey: ['empleados'],
    queryFn: () => api.get('/rrhh/empleados').then(r => r.data),
  })

  const { data: liquidaciones } = useQuery({
    queryKey: ['liquidaciones'],
    queryFn: () => api.get('/rrhh/liquidaciones').then(r => r.data),
  })

  const { data: afps } = useQuery({
    queryKey: ['afp'],
    queryFn: () => api.get('/rrhh/afp').then(r => r.data),
  })

  const { data: isapres } = useQuery({
    queryKey: ['isapres'],
    queryFn: () => api.get('/rrhh/isapres').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/rrhh/empleados', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] })
      toast.success('Empleado creado')
      setShowModal(false)
    },
  })

  const generarLiquidacion = useMutation({
    mutationFn: (data: { empleado_id: number, mes: number, anio: number }) => 
      api.post('/rrhh/liquidaciones/generar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liquidaciones'] })
      toast.success('Liquidación generada')
    },
  })

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recursos Humanos</h1>
          <p className="text-gray-500">Gestión de empleados y remuneraciones</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Nuevo Empleado
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4">
          <button
            onClick={() => setTab('empleados')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              tab === 'empleados' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
            }`}
          >
            Empleados ({empleados?.length || 0})
          </button>
          <button
            onClick={() => setTab('liquidaciones')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              tab === 'liquidaciones' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
            }`}
          >
            Liquidaciones
          </button>
        </nav>
      </div>

      {tab === 'empleados' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>RUT</th>
                  <th>Cargo</th>
                  <th>Ingreso</th>
                  <th>Sueldo Base</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados?.map((emp: any) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{emp.nombres} {emp.apellido_paterno}</p>
                          <p className="text-sm text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{emp.rut}</td>
                    <td>{emp.cargo || '-'}</td>
                    <td>{formatDate(emp.fecha_ingreso)}</td>
                    <td className="font-medium">{formatMoney(emp.sueldo_base)}</td>
                    <td>
                      <span className={`badge ${emp.estado === 'activo' ? 'badge-success' : 'badge-gray'}`}>
                        {emp.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => generarLiquidacion.mutate({
                          empleado_id: emp.id,
                          mes: new Date().getMonth() + 1,
                          anio: new Date().getFullYear()
                        })}
                        className="btn-secondary btn-sm"
                      >
                        <DocumentTextIcon className="w-4 h-4 mr-1" /> Liquidar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'liquidaciones' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Período</th>
                  <th>Haberes</th>
                  <th>Descuentos</th>
                  <th>Líquido</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {liquidaciones?.data?.map((liq: any) => (
                  <tr key={liq.id}>
                    <td className="font-medium">{liq.empleado}</td>
                    <td>{liq.mes}/{liq.anio}</td>
                    <td>{formatMoney(liq.total_haberes)}</td>
                    <td className="text-red-600">{formatMoney(liq.total_descuentos)}</td>
                    <td className="font-bold text-green-600">{formatMoney(liq.sueldo_liquido)}</td>
                    <td>
                      <span className={`badge ${liq.estado === 'pagada' ? 'badge-success' : 'badge-warning'}`}>
                        {liq.estado}
                      </span>
                    </td>
                    <td>
                      <a href={`/api/rrhh/liquidaciones/${liq.id}/pdf`} target="_blank" className="btn-secondary btn-sm">
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nuevo Empleado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 animate-slideIn">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Nuevo Empleado</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">RUT</label>
                  <input className="input" value={form.rut} onChange={e => setForm({...form, rut: e.target.value})} required placeholder="12.345.678-9" />
                </div>
                <div>
                  <label className="label">Sexo</label>
                  <select className="input" value={form.sexo} onChange={e => setForm({...form, sexo: e.target.value})}>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Nombres</label>
                  <input className="input" value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Apellido Paterno</label>
                  <input className="input" value={form.apellido_paterno} onChange={e => setForm({...form, apellido_paterno: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Apellido Materno</label>
                  <input className="input" value={form.apellido_materno} onChange={e => setForm({...form, apellido_materno: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Fecha Nacimiento</label>
                  <input type="date" className="input" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Fecha Ingreso</label>
                  <input type="date" className="input" value={form.fecha_ingreso} onChange={e => setForm({...form, fecha_ingreso: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Teléfono</label>
                  <input className="input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Dirección</label>
                <input className="input" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo Contrato</label>
                  <select className="input" value={form.tipo_contrato} onChange={e => setForm({...form, tipo_contrato: e.target.value})}>
                    <option value="indefinido">Indefinido</option>
                    <option value="plazo_fijo">Plazo Fijo</option>
                    <option value="por_obra">Por Obra</option>
                    <option value="honorarios">Honorarios</option>
                  </select>
                </div>
                <div>
                  <label className="label">Sueldo Base</label>
                  <input type="number" className="input" value={form.sueldo_base} onChange={e => setForm({...form, sueldo_base: +e.target.value})} required min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">AFP</label>
                  <select className="input" value={form.afp_id} onChange={e => setForm({...form, afp_id: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {afps?.map((afp: any) => (
                      <option key={afp.id} value={afp.id}>{afp.nombre} ({afp.tasa_trabajador}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Salud</label>
                  <select className="input" value={form.salud_id} onChange={e => setForm({...form, salud_id: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {isapres?.map((i: any) => (
                      <option key={i.id} value={i.id}>{i.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
