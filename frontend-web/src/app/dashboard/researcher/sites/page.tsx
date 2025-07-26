'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Site {
  id: string;
  name: string;
  description: string;
  coordinates?: [number, number];
  areaId: string;
  projectId: string;
  status: 'active' | 'completed' | 'planning';
  type: 'excavation' | 'survey' | 'monitoring';
  findings: number;
  artifacts: number;
  samples: number;
}

const SitesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');

  // Datos simulados de sitios
  const mockSites: Site[] = [
    {
      id: '1',
      name: 'Sitio Laguna La Brava Norte',
      description: 'Concentración de artefactos líticos en superficie',
      coordinates: [-38.1234, -61.5678],
      areaId: '1',
      projectId: '1',
      status: 'active',
      type: 'excavation',
      findings: 45,
      artifacts: 23,
      samples: 12
    },
    {
      id: '2',
      name: 'Excavación Arroyo Seco 2',
      description: 'Sondeo estratigráfico en cauce antiguo',
      coordinates: [-38.2345, -61.6789],
      areaId: '2',
      projectId: '1',
      status: 'completed',
      type: 'excavation',
      findings: 67,
      artifacts: 34,
      samples: 18
    },
    {
      id: '3',
      name: 'Monte Hermoso Playa',
      description: 'Sitio costero con ocupaciones del Holoceno',
      coordinates: [-38.3456, -61.7890],
      areaId: '3',
      projectId: '2',
      status: 'active',
      type: 'survey',
      findings: 23,
      artifacts: 15,
      samples: 8
    },
    {
      id: '4',
      name: 'Sitio Río Salado',
      description: 'Prospección en valle fluvial',
      coordinates: [-38.4567, -61.8901],
      areaId: '1',
      projectId: '1',
      status: 'planning',
      type: 'survey',
      findings: 0,
      artifacts: 0,
      samples: 0
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setSites(mockSites);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSites = sites.filter(site => 
    filter === 'all' ? true : site.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'planning': return 'Planificación';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'excavation': return '⛏️';
      case 'survey': return '🔍';
      case 'monitoring': return '📊';
      default: return '📍';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'excavation': return 'Excavación';
      case 'survey': return 'Prospección';
      case 'monitoring': return 'Monitoreo';
      default: return 'Sitio';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sitios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <span className="text-gray-900 font-medium">Sitios Arqueológicos</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📍 Sitios Arqueológicos</h1>
            <p className="mt-2 text-gray-600">Gestiona todos los sitios de excavación y prospección</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher')}>
            ➕ Nuevo Sitio
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
              Todos ({sites.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Activos ({sites.filter(s => s.status === 'active').length})
            </Button>
            <Button
              variant={filter === 'planning' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('planning')}
            >
              Planificación ({sites.filter(s => s.status === 'planning').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completados ({sites.filter(s => s.status === 'completed').length})
            </Button>
          </div>
        </div>

        {/* Lista de Sitios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(site.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {site.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {site.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                    {getStatusText(site.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">🔍 Tipo:</span>
                    {getTypeText(site.type)}
                  </div>
                  {site.coordinates && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📍 Coordenadas:</span>
                      {site.coordinates[0].toFixed(4)}, {site.coordinates[1].toFixed(4)}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{site.findings}</div>
                      <div className="text-xs text-gray-600">Hallazgos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{site.artifacts}</div>
                      <div className="text-xs text-gray-600">Artefactos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{site.samples}</div>
                      <div className="text-xs text-gray-600">Muestras</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/sites/${site.id}`)}
                  >
                    👁️ Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/surface-mapping`)}
                  >
                    🗺️ Mapeo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay sitios</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no tienes sitios registrados.'
                  : `No hay sitios en estado "${getStatusText(filter)}".`
                }
              </p>
              <Button onClick={() => router.push('/dashboard/researcher')}>
                Crear Primer Sitio
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SitesPage; 