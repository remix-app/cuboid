// ================================================
// CONTABILIDAD PAGE
// ================================================
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api, { formatMoney, formatDate } from '../services/api'

export default function ContabilidadPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'asientos' | 'libro-diario' | 'balance'>('asientos')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ fecha: '', glosa: '', lineas: [{ cuenta_id: '', debe: 0, haber: 0 }] })

  const { data: asientos, isLoading } = useQuery({
    queryKey: ['asientos'],
    queryFn: () => api.get('/contabilidad/asientos').then(r => r.data),
  })

  const { data: cuentas } = useQuery({
    queryKey: ['plan-cuentas'],
    queryFn: () => api.get('/contabilidad/plan-cuentas').then(r => r.data),
  })

  const { data: balance } = useQuery({
    queryKey: ['balance'],
    queryFn: () => api.get('/contabilidad/balance').then(r => r.data),
    enabled: tab === 'balance',
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/contabilidad/asientos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asientos'] })
      toast.success('Asiento creado')
      setShowModal(false)
    },
  })

  const addLinea = () => setForm({ ...form, lineas: [...form.lineas, { cuenta_id: '', debe: 0, haber: 0 }] })
  const updateLinea = (idx: number, field: string, value: any) => {
    const newLineas = [...form.lineas]
    newLineas[idx] = { ...newLineas[idx], [field]: value }
    setForm({ ...form, lineas: newLineas })
  }

  const totalDebe = form.lineas.reduce((sum, l) => sum + (+l.debe || 0), 0)
  const totalHaber = form.lineas.reduce((sum, l) => sum + (+l.haber || 0), 0)

  if (isLoading) return <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-500">Gestión contable y reportes financieros</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Nuevo Asiento
        </button>
      </div>

      <div className="border-b">
        <nav className="flex gap-4">
          {['asientos', 'libro-diario', 'balance'].map(t => (
            <button key={t} onClick={() => setTab(t as any)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm capitalize ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
              {t.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'asientos' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Número</th><th>Fecha</th><th>Glosa</th><th>Debe</th><th>Haber</th><th>Estado</th></tr></thead>
              <tbody>
                {asientos?.data?.map((a: any) => (
                  <tr key={a.id}>
                    <td className="font-mono">{a.numero}</td>
                    <td>{formatDate(a.fecha)}</td>
                    <td>{a.glosa}</td>
                    <td>{formatMoney(a.total_debe)}</td>
                    <td>{formatMoney(a.total_haber)}</td>
                    <td><span className={`badge ${a.estado === 'contabilizado' ? 'badge-success' : 'badge-warning'}`}>{a.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'balance' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Código</th><th>Cuenta</th><th>Tipo</th><th>Debe</th><th>Haber</th><th>Saldo</th></tr></thead>
              <tbody>
                {balance?.map((b: any) => (
                  <tr key={b.codigo}>
                    <td className="font-mono">{b.codigo}</td>
                    <td>{b.nombre}</td>
                    <td className="capitalize">{b.tipo}</td>
                    <td>{formatMoney(b.total_debe)}</td>
                    <td>{formatMoney(b.total_haber)}</td>
                    <td className={`font-bold ${b.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatMoney(Math.abs(b.saldo))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 py-8">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 animate-slideIn max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="text-xl font-semibold">Nuevo Asiento Contable</h2></div>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Fecha</label><input type="date" className="input" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required /></div>
                <div><label className="label">Glosa</label><input className="input" value={form.glosa} onChange={e => setForm({...form, glosa: e.target.value})} required /></div>
              </div>
              <div className="space-y-2">
                <label className="label">Líneas</label>
                {form.lineas.map((linea, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <select className="input" value={linea.cuenta_id} onChange={e => updateLinea(idx, 'cuenta_id', e.target.value)}>
                      <option value="">Cuenta...</option>
                      {cuentas?.map((c: any) => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
                    </select>
                    <input type="number" className="input" placeholder="Debe" value={linea.debe || ''} onChange={e => updateLinea(idx, 'debe', +e.target.value)} />
                    <input type="number" className="input" placeholder="Haber" value={linea.haber || ''} onChange={e => updateLinea(idx, 'haber', +e.target.value)} />
                  </div>
                ))}
                <button type="button" onClick={addLinea} className="btn-secondary btn-sm">+ Agregar línea</button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Total Debe: {formatMoney(totalDebe)}</span>
                <span>Total Haber: {formatMoney(totalHaber)}</span>
                <span className={totalDebe === totalHaber ? 'text-green-600' : 'text-red-600'}>{totalDebe === totalHaber ? '✓ Cuadrado' : '✗ Descuadrado'}</span>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || totalDebe !== totalHaber}>{createMutation.isPending ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
