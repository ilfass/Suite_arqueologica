'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Sample {
  id: string;
  code: string;
  type: 'carbon' | 'bone' | 'ceramic' | 'lithic' | 'sediment' | 'organic';
  description: string;
  context: string;
  coordinates: [number, number];
  depth: number;
  collection_date: string;
  collector: string;
  lab_code?: string;
  lab_name?: string;
  analysis_type?: 'c14' | 'dna' | 'composition' | 'isotope' | 'trace';
  status: 'collected' | 'sent_to_lab' | 'analyzing' | 'completed' | 'archived';
  results?: any;
  notes: string;
  created_at: string;
  updated_at: string;
}

const SamplesPage: React.FC = () => {
  const { user } = useAuth();
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddSample, setShowAddSample] = useState(false);

  useEffect(() => {
    // Simular carga de muestras
    setTimeout(() => {
      setSamples([
        {
          id: '1',
          code: 'CAR-001',
          type: 'carbon',
          description: 'Muestra de carbón de hogar en cuadrícula A1',
          context: 'Hogar prehispánico, nivel 2',
          coordinates: [-34.6037, -58.3816],
          depth: 0.45,
          collection_date: '2024-01-15',
          collector: 'Dr. María González',
          lab_code: 'C14-2024-001',
          lab_name: 'Laboratorio de Datación C14 - UBA',
          analysis_type: 'c14',
          status: 'completed',
          results: {
            age_bp: 8500,
            age_cal: '6500 BC',
            error_margin: '±50',
            lab_report: 'C14-2024-001.pdf'
          },
          notes: 'Muestra bien conservada, contexto sellado',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          code: 'BON-001',
          type: 'bone',
          description: 'Fragmento óseo de guanaco',
          context: 'Nivel de ocupación, cuadrícula B2',
          coordinates: [-34.6035, -58.3814],
          depth: 0.32,
          collection_date: '2024-01-16',
          collector: 'Lic. Carlos Rodríguez',
          lab_code: 'DNA-2024-001',
          lab_name: 'Laboratorio de Genética - CONICET',
          analysis_type: 'dna',
          status: 'analyzing',
          notes: 'Muestra para análisis de ADN antiguo',
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z'
        },
        {
          id: '3',
          code: 'LIT-001',
          type: 'lithic',
          description: 'Fragmento de cuarzo para análisis de composición',
          context: 'Superficie, hallazgo aislado',
          coordinates: [-34.6038, -58.3818],
          depth: 0.15,
          collection_date: '2024-01-17',
          collector: 'Dr. Ana Martínez',
          lab_code: 'COMP-2024-001',
          lab_name: 'Laboratorio de Petrología - UNLP',
          analysis_type: 'composition',
          status: 'sent_to_lab',
          notes: 'Análisis de procedencia de materia prima',
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-19T10:00:00Z'
        },
        {
          id: '4',
          code: 'SED-001',
          type: 'sediment',
          description: 'Muestra de sedimento para análisis de polen',
          context: 'Perfil estratigráfico, nivel 3',
          coordinates: [-34.6036, -58.3815],
          depth: 0.78,
          collection_date: '2024-01-18',
          collector: 'Lic. Laura Fernández',
          status: 'collected',
          notes: 'Muestra para reconstrucción paleoambiental',
          created_at: '2024-01-18T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'carbon': return '🔥';
      case 'bone': return '🦴';
      case 'ceramic': return '🏺';
      case 'lithic': return '🗿';
      case 'sediment': return '🌍';
      case 'organic': return '🌿';
      default: return '🧪';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'carbon': return 'bg-red-100 text-red-800';
      case 'bone': return 'bg-yellow-100 text-yellow-800';
      case 'ceramic': return 'bg-orange-100 text-orange-800';
      case 'lithic': return 'bg-gray-100 text-gray-800';
      case 'sediment': return 'bg-green-100 text-green-800';
      case 'organic': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-blue-100 text-blue-800';
      case 'sent_to_lab': return 'bg-yellow-100 text-yellow-800';
      case 'analyzing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'collected': return 'Recolectada';
      case 'sent_to_lab': return 'Enviada al Lab';
      case 'analyzing': return 'Analizando';
      case 'completed': return 'Completada';
      case 'archived': return 'Archivada';
      default: return status;
    }
  };

  const getAnalysisTypeText = (type?: string) => {
    switch (type) {
      case 'c14': return 'C14';
      case 'dna': return 'ADN';
      case 'composition': return 'Composición';
      case 'isotope': return 'Isótopos';
      case 'trace': return 'Trazas';
      default: return 'N/A';
    }
  };

  const filteredSamples = samples.filter(sample => {
    const typeMatch = filterType === 'all' || sample.type === filterType;
    const statusMatch = filterStatus === 'all' || sample.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const handleAddSample = () => {
    setShowAddSample(true);
  };

  const handleSendToLab = (sampleId: string) => {
    // Implementar envío al laboratorio
    console.log('Enviar al laboratorio:', sampleId);
  };

  const handleViewResults = (sampleId: string) => {
    // Implementar visualización de resultados
    console.log('Ver resultados:', sampleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Muestras</h1>
              <p className="text-gray-600 mt-2">Registro y análisis de muestras arqueológicas</p>
            </div>
            <Button variant="primary" onClick={handleAddSample}>
              + Nueva Muestra
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mb-6">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="carbon">Carbón</option>
              <option value="bone">Hueso</option>
              <option value="ceramic">Cerámica</option>
              <option value="lithic">Lítico</option>
              <option value="sediment">Sedimento</option>
              <option value="organic">Orgánico</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="collected">Recolectada</option>
              <option value="sent_to_lab">Enviada al Lab</option>
              <option value="analyzing">Analizando</option>
              <option value="completed">Completada</option>
              <option value="archived">Archivada</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🧪</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Muestras</p>
                  <p className="text-2xl font-semibold text-gray-900">{samples.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completadas</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {samples.filter(s => s.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🔬</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En Análisis</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {samples.filter(s => s.status === 'analyzing').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Enviadas al Lab</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {samples.filter(s => s.status === 'sent_to_lab').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Muestras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSamples.map((sample) => (
            <Card key={sample.id}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getTypeIcon(sample.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{sample.code}</h3>
                      <p className="text-sm text-gray-600">{sample.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(sample.type)}`}>
                      {sample.type.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)} mt-1`}>
                      {getStatusText(sample.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contexto:</span>
                    <span className="font-medium">{sample.context}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profundidad:</span>
                    <span className="font-medium">{sample.depth}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recolector:</span>
                    <span className="font-medium">{sample.collector}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha:</span>
                    <span className="font-medium">{sample.collection_date}</span>
                  </div>
                  {sample.lab_name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Laboratorio:</span>
                      <span className="font-medium">{sample.lab_name}</span>
                    </div>
                  )}
                  {sample.analysis_type && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Análisis:</span>
                      <span className="font-medium">{getAnalysisTypeText(sample.analysis_type)}</span>
                    </div>
                  )}
                </div>

                {sample.results && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Resultados</h4>
                    <div className="text-sm text-green-800">
                      <div>Edad BP: {sample.results.age_bp} ± {sample.results.error_margin}</div>
                      <div>Edad Cal: {sample.results.age_cal}</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/dashboard/researcher/samples/${sample.id}`}
                  >
                    Ver Detalles
                  </Button>
                  {sample.status === 'collected' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendToLab(sample.id)}
                    >
                      Enviar al Lab
                    </Button>
                  )}
                  {sample.status === 'completed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleViewResults(sample.id)}
                    >
                      Ver Resultados
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSamples.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay muestras</h3>
              <p className="text-gray-600 mb-4">Comienza registrando tu primera muestra arqueológica</p>
              <Button variant="primary" onClick={handleAddSample}>
                Registrar Muestra
              </Button>
            </div>
          </Card>
        )}

        {/* Información de Laboratorios */}
        <div className="mt-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratorios Asociados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Laboratorio de Datación C14 - UBA</h4>
                  <p className="text-sm text-gray-600">Análisis de radiocarbono</p>
                  <p className="text-sm text-gray-600">Tiempo de respuesta: 4-6 semanas</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Laboratorio de Genética - CONICET</h4>
                  <p className="text-sm text-gray-600">Análisis de ADN antiguo</p>
                  <p className="text-sm text-gray-600">Tiempo de respuesta: 8-12 semanas</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Laboratorio de Petrología - UNLP</h4>
                  <p className="text-sm text-gray-600">Análisis de composición</p>
                  <p className="text-sm text-gray-600">Tiempo de respuesta: 2-4 semanas</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SamplesPage; 