// ================================================
// EDIFICIOS PAGE
// ================================================
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, BuildingOffice2Icon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function EdificiosPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '', direccion: '', comuna: '', rut: '', tipo: 'condominio', total_unidades: 1
  })

  const { data: edificios, isLoading } = useQuery({
    queryKey: ['edificios'],
    queryFn: () => api.get('/edificios').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/edificios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edificios'] })
      toast.success('Edificio creado')
      setShowModal(false)
      setFormData({ nombre: '', direccion: '', comuna: '', rut: '', tipo: 'condominio', total_unidades: 1 })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edificios</h1>
          <p className="text-gray-500">Gestión de condominios y comunidades</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Nuevo Edificio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {edificios?.map((edificio: any) => (
          <div key={edificio.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <BuildingOffice2Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{edificio.nombre}</h3>
                  <p className="text-sm text-gray-500">{edificio.rut}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  {edificio.direccion}, {edificio.comuna}
                </div>
                {edificio.administrador_telefono && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    {edificio.administrador_telefono}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-gray-500">{edificio.total_unidades} unidades</span>
                <span className={`badge ${edificio.activo ? 'badge-success' : 'badge-gray'}`}>
                  {edificio.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear edificio */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Nuevo Edificio</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="label">Nombre</label>
                  <input type="text" className="input" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                </div>
                <div>
                  <label className="label">RUT</label>
                  <input type="text" className="input" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} placeholder="12.345.678-9" required />
                </div>
                <div>
                  <label className="label">Dirección</label>
                  <input type="text" className="input" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Comuna</label>
                    <input type="text" className="input" value={formData.comuna} onChange={e => setFormData({...formData, comuna: e.target.value})} required />
                  </div>
                  <div>
                    <label className="label">Total Unidades</label>
                    <input type="number" className="input" value={formData.total_unidades} onChange={e => setFormData({...formData, total_unidades: parseInt(e.target.value)})} min={1} required />
                  </div>
                </div>
                <div>
                  <label className="label">Tipo</label>
                  <select className="input" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="condominio">Condominio</option>
                    <option value="comunidad">Comunidad</option>
                    <option value="edificio">Edificio</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
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
