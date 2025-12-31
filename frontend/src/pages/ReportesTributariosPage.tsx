import { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle, AlertTriangle, Calendar,
  Building, DollarSign, Users, FileCheck, Search, Filter,
  PieChart, TrendingUp, ClipboardList, Shield, Printer
} from 'lucide-react';

interface Edificio {
  id: number;
  nombre: string;
  rut: string;
}

interface Balance {
  id: number;
  anio_tributario: number;
  tipo: string;
  total_activos: number;
  total_pasivos: number;
  total_patrimonio: number;
  cuadrado: boolean;
  estado: string;
  created_at: string;
}

interface EstadoResultados {
  id: number;
  anio_tributario: number;
  total_ingresos_operacionales: number;
  total_gastos_operacionales: number;
  resultado_operacional: number;
  distribucion_copropietarios: number;
  resultado_ejercicio: number;
}

interface CertificadoDeuda {
  id: number;
  numero_certificado: string;
  tipo: string;
  unidad_numero: string;
  tiene_deuda: boolean;
  deuda_total: number;
  fecha_emision: string;
  fecha_validez: string;
  codigo_verificacion: string;
}

interface ChecklistUnidad {
  id: number;
  numero: string;
  tipo: string;
  porcentaje_cumplimiento: number;
  estado_general: string;
  alertas: string[];
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function ReportesTributariosPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'eerr' | 'dj' | 'distribucion' | 'certificados' | 'checklist'>('balance');
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [selectedEdificio, setSelectedEdificio] = useState<number | null>(null);
  const [selectedAnio, setSelectedAnio] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [balances, setBalances] = useState<Balance[]>([]);
  const [estadosResultados, setEstadosResultados] = useState<EstadoResultados[]>([]);
  const [certificadosDeuda, setCertificadosDeuda] = useState<CertificadoDeuda[]>([]);
  const [checklistUnidades, setChecklistUnidades] = useState<ChecklistUnidad[]>([]);
  const [resumenChecklist, setResumenChecklist] = useState<any>(null);
  
  // Modal states
  const [showGenerarModal, setShowGenerarModal] = useState(false);
  const [showCertificadoModal, setShowCertificadoModal] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<number | null>(null);

  const anios = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchEdificios();
  }, []);

  useEffect(() => {
    if (selectedEdificio) {
      fetchData();
    }
  }, [selectedEdificio, selectedAnio, activeTab]);

  const fetchEdificios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/edificios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setEdificios(data.data || data);
      if (data.length > 0 || data.data?.length > 0) {
        setSelectedEdificio((data.data || data)[0].id);
      }
    } catch (err) {
      console.error('Error fetching edificios:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      switch (activeTab) {
        case 'balance':
          const balRes = await fetch(
            `${API_BASE}/contabilidad/balance-general?edificio_id=${selectedEdificio}&anio=${selectedAnio}`,
            { headers }
          );
          const balData = await balRes.json();
          setBalances(balData.data || []);
          break;

        case 'certificados':
          const certRes = await fetch(
            `${API_BASE}/certificados-deuda?edificio_id=${selectedEdificio}`,
            { headers }
          );
          const certData = await certRes.json();
          setCertificadosDeuda(certData.data || []);
          break;

        case 'checklist':
          const checkRes = await fetch(
            `${API_BASE}/cumplimiento/checklist/edificio/${selectedEdificio}?anio=${selectedAnio}`,
            { headers }
          );
          const checkData = await checkRes.json();
          setChecklistUnidades(checkData.checklists || []);
          setResumenChecklist(checkData.resumen || null);
          break;
      }
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const generarBalanceGeneral = async () => {
    if (!selectedEdificio) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/contabilidad/balance-general/generar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          edificio_id: selectedEdificio,
          anio_tributario: selectedAnio,
          tipo: 'anual',
          fecha_inicio: `${selectedAnio}-01-01`,
          fecha_cierre: `${selectedAnio}-12-31`
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Balance General generado exitosamente');
        fetchData();
      } else {
        setError(data.message || 'Error al generar balance');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
      setShowGenerarModal(false);
    }
  };

  const generarEstadoResultados = async () => {
    if (!selectedEdificio) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/contabilidad/estado-resultados/generar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          edificio_id: selectedEdificio,
          anio_tributario: selectedAnio,
          tipo: 'anual',
          fecha_inicio: `${selectedAnio}-01-01`,
          fecha_cierre: `${selectedAnio}-12-31`
        })
      });

      if (res.ok) {
        setSuccess('Estado de Resultados generado');
        fetchData();
      }
    } catch (err) {
      setError('Error al generar');
    } finally {
      setLoading(false);
    }
  };

  const generarDJ1887 = async () => {
    if (!selectedEdificio) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/tributario/declaraciones-juradas/dj1887`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          edificio_id: selectedEdificio,
          anio_tributario: selectedAnio
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(`DJ 1887 generada: ${data.declaracion?.cantidad_informados || 0} informados`);
      }
    } catch (err) {
      setError('Error al generar DJ');
    } finally {
      setLoading(false);
    }
  };

  const generarReporteDistribucion = async () => {
    if (!selectedEdificio) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/distribucion/reportes/consolidado`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          edificio_id: selectedEdificio,
          anio: selectedAnio
        })
      });

      if (res.ok) {
        setSuccess('Reporte de distribución generado');
      }
    } catch (err) {
      setError('Error al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  const generarCertificadoDeuda = async (tipo: string) => {
    if (!unidadSeleccionada) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/certificados-deuda/generar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unidad_id: unidadSeleccionada,
          tipo: tipo,
          motivo_solicitud: 'Solicitud del sistema'
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Certificado generado');
        setShowCertificadoModal(false);
        fetchData();
      } else {
        setError(data.error || 'Error al generar certificado');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const generarChecklistMasivo = async () => {
    if (!selectedEdificio) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/cumplimiento/checklist/generar-masivo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          edificio_id: selectedEdificio,
          anio: selectedAnio
        })
      });

      if (res.ok) {
        setSuccess('Checklist generado para todas las unidades');
        fetchData();
      }
    } catch (err) {
      setError('Error al generar checklist');
    } finally {
      setLoading(false);
    }
  };

  const descargarPdf = async (endpoint: string, filename: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } catch (err) {
      setError('Error al descargar');
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const tabs = [
    { id: 'balance', label: 'Balance General', icon: PieChart },
    { id: 'eerr', label: 'Estado de Resultados', icon: TrendingUp },
    { id: 'dj', label: 'Declaraciones Juradas', icon: FileText },
    { id: 'distribucion', label: 'Distribución', icon: Users },
    { id: 'certificados', label: 'Certificados Deuda', icon: FileCheck },
    { id: 'checklist', label: 'Cumplimiento Legal', icon: ClipboardList },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-7 h-7 text-blue-600" />
          Reportes Tributarios y Cumplimiento
        </h1>
        <p className="text-gray-600 mt-1">
          Balance General, Estado de Resultados, DJ, Certificados y Cumplimiento Legal
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">×</button>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          {success}
          <button onClick={() => setSuccess(null)} className="ml-auto">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-400" />
            <select
              value={selectedEdificio || ''}
              onChange={(e) => setSelectedEdificio(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccionar edificio</option>
              {edificios.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {anios.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Balance General */}
          {activeTab === 'balance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Balance General {selectedAnio}</h2>
                <button
                  onClick={generarBalanceGeneral}
                  disabled={loading || !selectedEdificio}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generar Balance
                </button>
              </div>

              {balances.length > 0 ? (
                <div className="space-y-4">
                  {balances.map(balance => (
                    <div key={balance.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Año {balance.anio_tributario}</h3>
                          <p className="text-sm text-gray-500">{balance.tipo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            balance.cuadrado 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {balance.cuadrado ? '✓ Cuadrado' : '✗ Descuadrado'}
                          </span>
                          <button
                            onClick={() => descargarPdf(`/contabilidad/balance-general/${balance.id}/pdf`, `balance-${balance.anio_tributario}.pdf`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xs text-blue-600">Total Activos</p>
                          <p className="font-semibold text-blue-900">{formatMoney(balance.total_activos)}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <p className="text-xs text-red-600">Total Pasivos</p>
                          <p className="font-semibold text-red-900">{formatMoney(balance.total_pasivos)}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-xs text-green-600">Patrimonio</p>
                          <p className="font-semibold text-green-900">{formatMoney(balance.total_patrimonio)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay balances generados para este período</p>
                </div>
              )}
            </div>
          )}

          {/* Estado de Resultados */}
          {activeTab === 'eerr' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Estado de Resultados {selectedAnio}</h2>
                <button
                  onClick={generarEstadoResultados}
                  disabled={loading || !selectedEdificio}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Generar EERR
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Seleccione un edificio y genere el Estado de Resultados</p>
              </div>
            </div>
          )}

          {/* Declaraciones Juradas */}
          {activeTab === 'dj' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Declaraciones Juradas {selectedAnio}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={generarDJ1887}
                    disabled={loading || !selectedEdificio}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Generar DJ 1887
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-purple-800">DJ 1887 - Rentas Art. 42 N°1</h3>
                <p className="text-sm text-purple-600 mt-1">
                  Declaración de rentas pagadas por arriendo de bienes comunes. 
                  Incluye montos del Art. 17 N°3 LIR (no constituyen renta).
                </p>
                <p className="text-xs text-purple-500 mt-2">
                  <strong>Vencimiento:</strong> 31 de marzo de {selectedAnio + 1}
                </p>
              </div>

              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Genere la DJ 1887 para declarar las rentas distribuidas</p>
              </div>
            </div>
          )}

          {/* Distribución */}
          {activeTab === 'distribucion' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Reporte Consolidado de Distribución {selectedAnio}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={generarReporteDistribucion}
                    disabled={loading || !selectedEdificio}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Generar Reporte
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800">Ingresos por Arriendos</h3>
                  <ul className="text-sm text-orange-600 mt-2 space-y-1">
                    <li>• Antenas de telecomunicaciones</li>
                    <li>• Publicidad en fachadas</li>
                    <li>• Espacios comunes</li>
                    <li>• Estacionamientos</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800">Certificados de Renta</h3>
                  <ul className="text-sm text-green-600 mt-2 space-y-1">
                    <li>• Individual por propiedad</li>
                    <li>• Consolidado multi-propiedad</li>
                    <li>• Detalle mensual de pagos</li>
                    <li>• Código de verificación</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Certificados de Deuda */}
          {activeTab === 'certificados' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Certificados de Deuda / No Deuda</h2>
                <button
                  onClick={() => setShowCertificadoModal(true)}
                  disabled={!selectedEdificio}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Nuevo Certificado
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <FileCheck className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <h3 className="font-semibold text-green-800">Certificado No Deuda</h3>
                  <p className="text-xs text-green-600 mt-1">Para unidades sin deuda pendiente</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h3 className="font-semibold text-blue-800">Certificado Pago al Día</h3>
                  <p className="text-xs text-blue-600 mt-1">Confirma pagos regulares</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                  <h3 className="font-semibold text-yellow-800">Estado de Cuenta</h3>
                  <p className="text-xs text-yellow-600 mt-1">Detalle de deuda si existe</p>
                </div>
              </div>

              {certificadosDeuda.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">N° Certificado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unidad</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Válido hasta</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {certificadosDeuda.map(cert => (
                        <tr key={cert.id}>
                          <td className="px-4 py-3 text-sm font-mono">{cert.numero_certificado}</td>
                          <td className="px-4 py-3 text-sm">{cert.unidad_numero}</td>
                          <td className="px-4 py-3 text-sm capitalize">{cert.tipo.replace('_', ' ')}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              cert.tiene_deuda 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {cert.tiene_deuda ? `Deuda: ${formatMoney(cert.deuda_total)}` : 'Sin Deuda'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{cert.fecha_validez}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => descargarPdf(`/certificados-deuda/${cert.id}/pdf`, `certificado-${cert.numero_certificado}.pdf`)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay certificados emitidos</p>
                </div>
              )}
            </div>
          )}

          {/* Checklist Cumplimiento */}
          {activeTab === 'checklist' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Checklist de Cumplimiento Legal {selectedAnio}</h2>
                <button
                  onClick={generarChecklistMasivo}
                  disabled={loading || !selectedEdificio}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  Generar Checklist
                </button>
              </div>

              {resumenChecklist && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{resumenChecklist.total_unidades}</p>
                    <p className="text-xs text-gray-500">Total Unidades</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{resumenChecklist.cumplen}</p>
                    <p className="text-xs text-green-600">Cumplen</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{resumenChecklist.cumplen_parcial}</p>
                    <p className="text-xs text-yellow-600">Parcial</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{resumenChecklist.no_cumplen}</p>
                    <p className="text-xs text-red-600">No Cumplen</p>
                  </div>
                </div>
              )}

              {checklistUnidades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unidad</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cumplimiento</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Alertas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {checklistUnidades.map(check => (
                        <tr key={check.id}>
                          <td className="px-4 py-3 text-sm font-semibold">{check.numero}</td>
                          <td className="px-4 py-3 text-sm capitalize">{check.tipo}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    check.porcentaje_cumplimiento >= 90 ? 'bg-green-500' :
                                    check.porcentaje_cumplimiento >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${check.porcentaje_cumplimiento}%` }}
                                />
                              </div>
                              <span className="text-sm">{check.porcentaje_cumplimiento}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              check.estado_general === 'cumple' ? 'bg-green-100 text-green-700' :
                              check.estado_general === 'cumple_parcial' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {check.estado_general === 'cumple' ? 'Cumple' :
                               check.estado_general === 'cumple_parcial' ? 'Parcial' : 'No Cumple'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {check.alertas && check.alertas.length > 0 && (
                              <span className="text-xs text-red-600">
                                {check.alertas.length} alerta(s)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Genere el checklist para ver el estado de cumplimiento</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Certificado Deuda */}
      {showCertificadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Generar Certificado de Deuda</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
              <select
                value={unidadSeleccionada || ''}
                onChange={(e) => setUnidadSeleccionada(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccionar unidad</option>
                {/* Las unidades se cargarían dinámicamente */}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Certificado</label>
              <div className="space-y-2">
                <button
                  onClick={() => generarCertificadoDeuda('no_deuda')}
                  className="w-full text-left px-4 py-3 border rounded-lg hover:bg-green-50 hover:border-green-300"
                >
                  <span className="font-medium text-green-700">Certificado de No Deuda</span>
                  <p className="text-xs text-gray-500">Solo si la unidad no tiene deuda</p>
                </button>
                <button
                  onClick={() => generarCertificadoDeuda('pago_al_dia')}
                  className="w-full text-left px-4 py-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300"
                >
                  <span className="font-medium text-blue-700">Certificado Pago al Día</span>
                  <p className="text-xs text-gray-500">Confirma pagos regulares</p>
                </button>
                <button
                  onClick={() => generarCertificadoDeuda('estado_cuenta')}
                  className="w-full text-left px-4 py-3 border rounded-lg hover:bg-yellow-50 hover:border-yellow-300"
                >
                  <span className="font-medium text-yellow-700">Estado de Cuenta</span>
                  <p className="text-xs text-gray-500">Incluye detalle de deuda si existe</p>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCertificadoModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportesTributariosPage;
