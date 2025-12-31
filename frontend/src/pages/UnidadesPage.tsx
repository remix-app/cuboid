import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MagnifyingGlassIcon, HomeIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import api, { formatMoney } from '../services/api'
import { Link } from 'react-router-dom'

export default function UnidadesPage() {
  const [edificioId, setEdificioId] = useState<string>('')
  const [buscar, setBuscar] = useState('')

  const { data: edificios } = useQuery({
    queryKey: ['edificios'],
    queryFn: () => api.get('/edificios').then(r => r.data),
  })

  const { data: unidades, isLoading } = useQuery({
    queryKey: ['unidades', edificioId],
    queryFn: () => api.get('/unidades', { params: { edificio_id: edificioId || undefined } }).then(r => r.data),
  })

  const filteredUnidades = unidades?.data?.filter((u: any) =>
    u.numero.toLowerCase().includes(buscar.toLowerCase()) ||
    u.propietario?.toLowerCase().includes(buscar.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Unidades</h1>
        <p className="text-gray-500">Gestión de departamentos y propietarios</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
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
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por número o propietario..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Tipo</th>
                <th>Edificio</th>
                <th>Propietario</th>
                <th>Prorrateo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredUnidades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No hay unidades registradas
                  </td>
                </tr>
              ) : (
                filteredUnidades.map((unidad: any) => (
                  <tr key={unidad.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <HomeIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium">{unidad.numero}</span>
                      </div>
                    </td>
                    <td className="capitalize">{unidad.tipo}</td>
                    <td>{unidad.edificio}</td>
                    <td>
                      {unidad.propietario ? (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          {unidad.propietario}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    <td>{unidad.prorrateo?.toFixed(4)}%</td>
                    <td>
                      <span className={`badge ${unidad.activa ? 'badge-success' : 'badge-gray'}`}>
                        {unidad.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/unidades/${unidad.id}`}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
