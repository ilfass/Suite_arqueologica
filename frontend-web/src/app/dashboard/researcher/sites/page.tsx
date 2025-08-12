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
  area_id: string;
  project_id: string;
  status: 'active' | 'completed' | 'planning';
  type: 'excavation' | 'survey' | 'monitoring';
  findings_count: number;
  artifacts_count: number;
  samples_count: number;
}

const SitesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');

  // Cargar sitios desde la API
  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.error('No hay token de autenticación');
          return;
        }

        const response = await fetch('/api/sites', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSites(data.data || []);
            console.log('✅ Sitios cargados desde la API:', data.data?.length || 0);
          } else {
            console.error('❌ Error en respuesta de API:', data);
          }
        } else {
          console.error('❌ Error cargando sitios:', response.status);
        }
      } catch (error) {
        console.error('❌ Error cargando sitios:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadSites();
    }
  }, [authLoading, user]);

  const filteredSites = sites.filter(site => 
    filter === 'all' ? true : site.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'planning': return 'Planificación';
      default: return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'excavation': return '⛏️';
      case 'survey': return '🗺️';
      case 'monitoring': return '📊';
      default: return '🏛️';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'excavation': return 'Excavación';
      case 'survey': return 'Prospección';
      case 'monitoring': return 'Monitoreo';
      default: return type;
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
      {/* Banner de contexto */}
      {hasContext && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Contexto actual:</span> {context?.project} › {context?.area} › {context?.site}
            </p>
          </div>
        </div>
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
          <span className="text-gray-900 font-medium">Sitios</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏛️ Sitios Arqueológicos</h1>
            <p className="mt-2 text-gray-600">Gestiona todos tus sitios de excavación</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher/sites/new')}>
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
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completados ({sites.filter(s => s.status === 'completed').length})
            </Button>
            <Button
              variant={filter === 'planning' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('planning')}
            >
              Planificación ({sites.filter(s => s.status === 'planning').length})
            </Button>
          </div>
        </div>

        {/* Grid de sitios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(site.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{site.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                        {getStatusText(site.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="line-clamp-2">{site.description}</p>
                  {site.coordinates && (
                    <p><span className="font-medium">Coordenadas:</span> {site.coordinates[0]}, {site.coordinates[1]}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-blue-600">{site.findings_count}</div>
                    <div className="text-gray-500">Hallazgos</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">{site.artifacts_count}</div>
                    <div className="text-gray-500">Artefactos</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-600">{site.samples_count}</div>
                    <div className="text-gray-500">Muestras</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/researcher/sites/${site.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/researcher/sites/${site.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sitios</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Aún no has registrado ningún sitio arqueológico. ¡Comienza explorando!'
                : `No hay sitios con estado "${getStatusText(filter)}"`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={() => router.push('/dashboard/researcher/sites/new')}>
                ➕ Crear Primer Sitio
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SitesPage; 