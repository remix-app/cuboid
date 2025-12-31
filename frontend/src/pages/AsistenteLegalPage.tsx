import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PaperAirplaneIcon, ScaleIcon, DocumentTextIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api, { formatDate } from '../services/api'

export default function AsistenteLegalPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'consultas' | 'oficios' | 'certificados'>('consultas')
  const [consulta, setConsulta] = useState('')
  const [respuesta, setRespuesta] = useState<any>(null)

  const { data: categorias } = useQuery({
    queryKey: ['categorias-legal'],
    queryFn: () => api.get('/legal/categorias').then(r => r.data),
  })

  const { data: faq } = useQuery({
    queryKey: ['faq-legal'],
    queryFn: () => api.get('/legal/faq').then(r => r.data),
  })

  const { data: oficios } = useQuery({
    queryKey: ['oficios'],
    queryFn: () => api.get('/legal/oficios').then(r => r.data),
    enabled: tab === 'oficios',
  })

  const { data: certificados } = useQuery({
    queryKey: ['certificados-cumplimiento'],
    queryFn: () => api.get('/legal/certificados').then(r => r.data),
    enabled: tab === 'certificados',
  })

  const consultarMutation = useMutation({
    mutationFn: (data: { consulta: string }) => api.post('/legal/consultas', data),
    onSuccess: (res) => {
      setRespuesta(res.data)
      setConsulta('')
      queryClient.invalidateQueries({ queryKey: ['consultas-legal'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consulta.trim()) return
    consultarMutation.mutate({ consulta })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asistente Legal</h1>
        <p className="text-gray-500">Consultas legales, oficios y certificados</p>
      </div>

      <div className="border-b">
        <nav className="flex gap-4">
          {[
            { id: 'consultas', label: 'Consultas', icon: ScaleIcon },
            { id: 'oficios', label: 'Oficios', icon: DocumentTextIcon },
            { id: 'certificados', label: 'Certificados', icon: CheckBadgeIcon },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                tab === t.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'consultas' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chat */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-semibold mb-4">Haz tu consulta legal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    className="input"
                    rows={4}
                    value={consulta}
                    onChange={e => setConsulta(e.target.value)}
                    placeholder="Escribe tu consulta sobre copropiedad, gastos comunes, arriendos, etc..."
                  />
                  <button type="submit" className="btn-primary" disabled={consultarMutation.isPending || !consulta.trim()}>
                    {consultarMutation.isPending ? 'Consultando...' : (
                      <><PaperAirplaneIcon className="w-5 h-5 mr-2" /> Consultar</>
                    )}
                  </button>
                </form>

                {respuesta && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Respuesta</h3>
                    <p className="text-blue-900">{respuesta.respuesta}</p>
                    {respuesta.referencias?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">Referencias legales:</p>
                        <ul className="text-sm text-blue-600 mt-1">
                          {respuesta.referencias.map((ref: string, i: number) => (
                            <li key={i}>• {ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold">Preguntas Frecuentes</h2>
              </div>
              <div className="divide-y">
                {faq?.map((f: any, i: number) => (
                  <button key={i} onClick={() => setConsulta(f.pregunta)} className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-gray-700">{f.pregunta}</p>
                    <span className="text-xs text-gray-400 capitalize">{f.categoria}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="card h-fit">
            <div className="card-header">
              <h2 className="font-semibold">Categorías</h2>
            </div>
            <div className="p-4 space-y-2">
              {categorias?.map((cat: any) => (
                <div key={cat.id} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium text-sm">{cat.nombre}</p>
                  <p className="text-xs text-gray-500">{cat.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'oficios' && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold">Oficios</h2>
            <button className="btn-primary btn-sm">Nuevo Oficio</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Número</th><th>Fecha</th><th>Institución</th><th>Asunto</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {oficios?.data?.map((o: any) => (
                  <tr key={o.id}>
                    <td className="font-mono">{o.numero_oficio}</td>
                    <td>{formatDate(o.fecha)}</td>
                    <td>{o.institucion}</td>
                    <td className="max-w-xs truncate">{o.asunto}</td>
                    <td><span className={`badge ${o.estado === 'respondido' ? 'badge-success' : o.estado === 'enviado' ? 'badge-info' : 'badge-gray'}`}>{o.estado}</span></td>
                    <td><a href={`/api/legal/oficios/${o.id}/pdf`} target="_blank" className="btn-secondary btn-sm">PDF</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'certificados' && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="font-semibold">Certificados de Cumplimiento</h2>
            <button className="btn-primary btn-sm">Generar Certificado</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Número</th><th>Tipo</th><th>Edificio</th><th>Emisión</th><th>Validez</th><th>Código</th></tr></thead>
              <tbody>
                {certificados?.data?.map((c: any) => (
                  <tr key={c.id}>
                    <td className="font-mono">{c.numero_certificado}</td>
                    <td className="capitalize">{c.tipo.replace(/_/g, ' ')}</td>
                    <td>{c.edificio}</td>
                    <td>{formatDate(c.fecha_emision)}</td>
                    <td>{formatDate(c.fecha_validez)}</td>
                    <td><code className="text-xs bg-gray-100 px-2 py-1 rounded">{c.codigo_verificacion}</code></td>
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
