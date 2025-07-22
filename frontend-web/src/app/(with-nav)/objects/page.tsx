'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface Object {
  id: string;
  site_id: string;
  name: string;
  description?: string;
  object_type: string;
  material?: string;
  dimensions?: any;
  condition?: string;
  discovery_date?: string;
  discovery_location?: {
    latitude: number;
    longitude: number;
  };
  catalog_number?: string;
  images?: string[];
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const ObjectsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [objects, setObjects] = useState<Object[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de objetos para el demo
    setTimeout(() => {
      setObjects([
        {
          id: '1',
          site_id: '1',
          name: 'Máscara de Jade',
          description: 'Máscara ceremonial de jade con incrustaciones de obsidiana',
          object_type: 'Máscara',
          material: 'Jade, Obsidiana',
          condition: 'Excelente',
          discovery_date: '2024-01-15',
          catalog_number: 'OBJ-001',
          created_by: 'admin',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          site_id: '1',
          name: 'Vasija Cerámica',
          description: 'Vasija ceremonial con decoración geométrica',
          object_type: 'Vasija',
          material: 'Cerámica',
          condition: 'Bueno',
          discovery_date: '2024-01-10',
          catalog_number: 'OBJ-002',
          created_by: 'admin',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '3',
          site_id: '2',
          name: 'Cuchillo de Obsidiana',
          description: 'Cuchillo ceremonial de obsidiana con mango de madera',
          object_type: 'Herramienta',
          material: 'Obsidiana, Madera',
          condition: 'Regular',
          discovery_date: '2024-01-05',
          catalog_number: 'OBJ-003',
          created_by: 'admin',
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateObject = () => {
    router.push('/objects/new');
  };

  const handleViewObject = (objectId: string) => {
    router.push(`/objects/${objectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando objetos...</p>
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
                Objetos
              </h1>
              <p className="text-gray-600">
                Catálogo y gestión de objetos arqueológicos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
              <Button onClick={handleCreateObject}>
                Agregar Objeto
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
                <div className="text-2xl font-bold text-blue-600">{objects.length}</div>
                <div className="text-sm text-gray-600">Total de Objetos</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {objects.filter(o => o.condition === 'Excelente').length}
                </div>
                <div className="text-sm text-gray-600">Excelente Estado</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {objects.filter(o => o.object_type === 'Máscara').length}
                </div>
                <div className="text-sm text-gray-600">Máscaras</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {objects.filter(o => o.material?.includes('Jade')).length}
                </div>
                <div className="text-sm text-gray-600">Objetos de Jade</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Objects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((object) => (
            <Card key={object.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{object.name}</h3>
                  <p className="text-sm text-gray-600">{object.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium">{object.object_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Material:</span>
                    <span className="font-medium">{object.material}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      object.condition === 'Excelente' ? 'bg-green-100 text-green-800' :
                      object.condition === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {object.condition}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Catálogo:</span>
                    <span className="font-medium">{object.catalog_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Descubierto:</span>
                    <span className="font-medium">{object.discovery_date}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewObject(object.id)}
                      className="flex-1"
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/objects/${object.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {objects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏺</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay objetos registrados</h3>
            <p className="text-gray-600 mb-6">Comienza agregando tu primer objeto</p>
            <Button onClick={handleCreateObject}>
              Agregar Primer Objeto
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ObjectsPage; 