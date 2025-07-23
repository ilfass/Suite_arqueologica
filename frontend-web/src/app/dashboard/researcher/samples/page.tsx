'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Sample {
  id: string;
  name: string;
  type: 'carbon' | 'ceramic' | 'lithic' | 'bone' | 'sediment' | 'other';
  siteId: string;
  siteName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dateCollected: string;
  dateSent?: string;
  dateReceived?: string;
  lab?: string;
  notes?: string;
}

const SamplesPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'failed'>('all');

  // Datos simulados de muestras
  const mockSamples: Sample[] = [
    {
      id: '1',
      name: 'C14-001',
      type: 'carbon',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      status: 'completed',
      dateCollected: '2024-01-15',
      dateSent: '2024-01-20',
      dateReceived: '2024-02-15',
      lab: 'Laboratorio de Datación C14 - UBA',
      notes: 'Carbón de hogar, contexto estratigráfico claro'
    },
    {
      id: '2',
      name: 'CER-001',
      type: 'ceramic',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      status: 'in_progress',
      dateCollected: '2024-02-10',
      dateSent: '2024-02-15',
      lab: 'Laboratorio de Cerámica - CONICET',
      notes: 'Fragmento de vasija con decoración incisa'
    },
    {
      id: '3',
      name: 'LIT-001',
      type: 'lithic',
      siteId: '2',
      siteName: 'Excavación Arroyo Seco 2',
      status: 'pending',
      dateCollected: '2024-03-01',
      notes: 'Punta de proyectil para análisis de procedencia'
    },
    {
      id: '4',
      name: 'BONE-001',
      type: 'bone',
      siteId: '3',
      siteName: 'Monte Hermoso Playa',
      status: 'failed',
      dateCollected: '2024-01-20',
      dateSent: '2024-01-25',
      lab: 'Laboratorio de Zooarqueología - UNLP',
      notes: 'Hueso muy fragmentado, no apto para análisis'
    },
    {
      id: '5',
      name: 'SED-001',
      type: 'sediment',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      status: 'in_progress',
      dateCollected: '2024-02-20',
      dateSent: '2024-02-25',
      lab: 'Laboratorio de Sedimentología - UNS',
      notes: 'Muestra para análisis granulométrico'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setSamples(mockSamples);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSamples = samples.filter(sample => 
    filter === 'all' ? true : sample.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Análisis';
      case 'completed': return 'Completado';
      case 'failed': return 'Fallido';
      default: return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'carbon': return '🔥';
      case 'ceramic': return '🏺';
      case 'lithic': return '🪨';
      case 'bone': return '🦴';
      case 'sediment': return '🌍';
      case 'other': return '🔬';
      default: return '🧪';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'carbon': return 'Carbón (C14)';
      case 'ceramic': return 'Cerámica';
      case 'lithic': return 'Lítico';
      case 'bone': return 'Hueso';
      case 'sediment': return 'Sedimento';
      case 'other': return 'Otro';
      default: return 'Muestra';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando muestras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      {hasContext && (
        <ContextBanner
          project={context.project}
          area={context.area}
          site={context.site}
          showBackButton={true}
          showChangeButton={false}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Muestras en Análisis</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🧪 Muestras en Análisis</h1>
            <p className="mt-2 text-gray-600">Gestiona el seguimiento de muestras enviadas a laboratorio</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher')}>
            ➕ Nueva Muestra
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({samples.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendientes ({samples.filter(s => s.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              En Análisis ({samples.filter(s => s.status === 'in_progress').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completadas ({samples.filter(s => s.status === 'completed').length})
            </Button>
            <Button
              variant={filter === 'failed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              Fallidas ({samples.filter(s => s.status === 'failed').length})
            </Button>
          </div>
        </div>

        {/* Lista de Muestras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSamples.map((sample) => (
            <Card key={sample.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(sample.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sample.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {getTypeText(sample.type)} - {sample.siteName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                    {getStatusText(sample.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">📅 Recolectada:</span>
                    {new Date(sample.dateCollected).toLocaleDateString('es-ES')}
                  </div>
                  {sample.dateSent && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📤 Enviada:</span>
                      {new Date(sample.dateSent).toLocaleDateString('es-ES')}
                    </div>
                  )}
                  {sample.dateReceived && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📥 Recibida:</span>
                      {new Date(sample.dateReceived).toLocaleDateString('es-ES')}
                    </div>
                  )}
                  {sample.lab && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">🏢 Laboratorio:</span>
                      {sample.lab}
                    </div>
                  )}
                  {sample.notes && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📝 Notas:</span>
                      {sample.notes}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/samples/${sample.id}`)}
                  >
                    👁️ Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/laboratory`)}
                  >
                    🔬 Laboratorio
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSamples.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay muestras</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no tienes muestras registradas.'
                  : `No hay muestras en estado "${getStatusText(filter)}".`
                }
              </p>
              <Button onClick={() => router.push('/dashboard/researcher')}>
                Registrar Primera Muestra
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SamplesPage; 