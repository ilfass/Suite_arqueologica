'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface ArchaeologicalSite {
  id: string;
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  period?: string;
  status: 'active' | 'inactive' | 'archived';
  site_type?: string;
  excavation_status?: string;
  preservation_status?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const SitesPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<ArchaeologicalSite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de sitios para el demo
    setTimeout(() => {
      setSites([
        {
          id: '1',
          name: 'Teotihuacán',
          description: 'Antigua ciudad mesoamericana ubicada en el valle de México',
          location: {
            latitude: 19.6915,
            longitude: -98.8441,
            address: 'Teotihuacán, Estado de México, México'
          },
          period: 'Clásico',
          status: 'active',
          site_type: 'Ciudad',
          excavation_status: 'En progreso',
          preservation_status: 'Excelente',
          created_by: 'admin',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Chichen Itza',
          description: 'Importante centro ceremonial maya en la península de Yucatán',
          location: {
            latitude: 20.6843,
            longitude: -88.5678,
            address: 'Chichen Itza, Yucatán, México'
          },
          period: 'Clásico Tardío',
          status: 'active',
          site_type: 'Centro Ceremonial',
          excavation_status: 'Completado',
          preservation_status: 'Bueno',
          created_by: 'admin',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '3',
          name: 'Palenque',
          description: 'Ciudad maya en el estado de Chiapas',
          location: {
            latitude: 17.4833,
            longitude: -92.0500,
            address: 'Palenque, Chiapas, México'
          },
          period: 'Clásico',
          status: 'active',
          site_type: 'Ciudad',
          excavation_status: 'En progreso',
          preservation_status: 'Bueno',
          created_by: 'admin',
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateSite = () => {
    router.push('/sites/new');
  };

  const handleViewSite = (siteId: string) => {
    router.push(`/sites/${siteId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sitios arqueológicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sitios Arqueológicos
              </h1>
              <p className="text-gray-600">
                Gestiona y explora sitios arqueológicos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
              <Button onClick={handleCreateSite}>
                Crear Nuevo Sitio
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sites.length}</div>
                <div className="text-sm text-gray-600">Total de Sitios</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sites.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Sitios Activos</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {sites.filter(s => s.excavation_status === 'En progreso').length}
                </div>
                <div className="text-sm text-gray-600">En Excavación</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {sites.filter(s => s.preservation_status === 'Excelente').length}
                </div>
                <div className="text-sm text-gray-600">Excelente Estado</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                  <p className="text-sm text-gray-600">{site.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Período:</span>
                    <span className="font-medium">{site.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      site.status === 'active' ? 'bg-green-100 text-green-800' :
                      site.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {site.status === 'active' ? 'Activo' : 
                       site.status === 'inactive' ? 'Inactivo' : 'Archivado'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Excavación:</span>
                    <span className="font-medium">{site.excavation_status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Preservación:</span>
                    <span className="font-medium">{site.preservation_status}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewSite(site.id)}
                      className="flex-1"
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/sites/${site.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏛️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sitios arqueológicos</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer sitio arqueológico</p>
            <Button onClick={handleCreateSite}>
              Crear Primer Sitio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SitesPage; 