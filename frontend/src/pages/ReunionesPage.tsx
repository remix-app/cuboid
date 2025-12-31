import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, PlayIcon, VideoCameraIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api, { formatDateTime, getEstadoColor } from '../services/api'

export default function ReunionesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [selectedReunion, setSelectedReunion] = useState<any>(null)
  const [form, setForm] = useState({
    edificio_id: '', titulo: '', descripcion: '', tipo: 'asamblea_ordinaria',
    fecha_inicio: '', modalidad: 'telematica', duracion_minutos: 120, orden_del_dia: ''
  })

  const { data: edificios } = useQuery({
    queryKey: ['edificios'],
    queryFn: () => api.get('/edificios').then(r => r.data),
  })

  const { data: reuniones, isLoading } = useQuery({
    queryKey: ['reuniones'],
    queryFn: () => api.get('/reuniones').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/reuniones', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['reuniones'] })
      toast.success('Reunión creada')
      setShowModal(false)
    },
  })

  const convocarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/reuniones/${id}/convocar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reuniones'] })
      toast.success('Reunión convocada')
    },
  })

  const iniciarMutation = useMutation({
    mutationFn: (id: number) => api.post(`/reuniones/${id}/iniciar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reuniones'] })
      toast.success('Reunión iniciada')
    },
  })

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reuniones</h1>
          <p className="text-gray-500">Asambleas y votaciones telemáticas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Nueva Reunión
        </button>
      </div>

      <div className="grid gap-4">
        {reuniones?.data?.map((reunion: any) => (
          <div key={reunion.id} className="card">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    reunion.estado === 'en_curso' ? 'bg-green-100' :
                    reunion.estado === 'convocada' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <VideoCameraIcon className={`w-6 h-6 ${
                      reunion.estado === 'en_curso' ? 'text-green-600' :
                      reunion.estado === 'convocada' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{reunion.titulo}</h3>
                    <p className="text-sm text-gray-500">{reunion.edificio} • {reunion.tipo.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDateTime(reunion.fecha_inicio)}</p>
                  </div>
                </div>
                <span className={`badge ${getEstadoColor(reunion.estado)}`}>
                  {reunion.estado.replace(/_/g, ' ')}
                </span>
              </div>

              {reunion.descripcion && (
                <p className="text-sm text-gray-600 mt-3">{reunion.descripcion}</p>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                {reunion.estado === 'borrador' && (
                  <button onClick={() => convocarMutation.mutate(reunion.id)} className="btn-primary btn-sm">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Convocar
                  </button>
                )}
                {reunion.estado === 'convocada' && (
                  <button onClick={() => iniciarMutation.mutate(reunion.id)} className="btn-primary btn-sm">
                    <PlayIcon className="w-4 h-4 mr-1" /> Iniciar
                  </button>
                )}
                {reunion.estado === 'en_curso' && reunion.sala_url && (
                  <a href={reunion.sala_url} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                    <VideoCameraIcon className="w-4 h-4 mr-1" /> Entrar a Sala
                  </a>
                )}
                {reunion.estado === 'finalizada' && (
                  <button className="btn-secondary btn-sm">
                    <DocumentTextIcon className="w-4 h-4 mr-1" /> Ver Acta
                  </button>
                )}
                <button onClick={() => setSelectedReunion(reunion)} className="btn-secondary btn-sm">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}

        {(!reuniones?.data || reuniones.data.length === 0) && (
          <div className="card p-12 text-center">
            <VideoCameraIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay reuniones programadas</p>
          </div>
        )}
      </div>

      {/* Modal Nueva Reunión */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 animate-slideIn max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="text-xl font-semibold">Nueva Reunión</h2></div>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }} className="p-6 space-y-4">
              <div>
                <label className="label">Edificio</label>
                <select className="input" value={form.edificio_id} onChange={e => setForm({...form, edificio_id: e.target.value})} required>
                  <option value="">Seleccionar...</option>
                  {edificios?.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Título</label>
                <input className="input" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required placeholder="Ej: Asamblea Ordinaria 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    <option value="asamblea_ordinaria">Asamblea Ordinaria</option>
                    <option value="asamblea_extraordinaria">Asamblea Extraordinaria</option>
                    <option value="comite_administracion">Comité Administración</option>
                    <option value="informativa">Informativa</option>
                  </select>
                </div>
                <div>
                  <label className="label">Modalidad</label>
                  <select className="input" value={form.modalidad} onChange={e => setForm({...form, modalidad: e.target.value})}>
                    <option value="telematica">Telemática</option>
                    <option value="presencial">Presencial</option>
                    <option value="mixta">Mixta</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Fecha y Hora</label>
                  <input type="datetime-local" className="input" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Duración (min)</label>
                  <input type="number" className="input" value={form.duracion_minutos} onChange={e => setForm({...form, duracion_minutos: +e.target.value})} min={30} />
                </div>
              </div>
              <div>
                <label className="label">Orden del Día</label>
                <textarea className="input" rows={4} value={form.orden_del_dia} onChange={e => setForm({...form, orden_del_dia: e.target.value})} placeholder="1. Aprobación acta anterior&#10;2. Cuenta del administrador&#10;3. ..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creando...' : 'Crear Reunión'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
