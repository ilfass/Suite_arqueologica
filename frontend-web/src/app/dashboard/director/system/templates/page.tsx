'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

interface Template {
  id: string;
  name: string;
  type: 'site' | 'artifact' | 'excavation' | 'report';
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
  fields_count: number;
  is_active: boolean;
}

const TemplatesPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de plantillas
    setTimeout(() => {
      setTemplates([
        {
          id: '1',
          name: 'Ficha de Sitio Arqueológico',
          type: 'site',
          description: 'Plantilla estándar para documentar sitios arqueológicos',
          version: '2.1',
          created_at: '2023-01-15T10:00:00Z',
          updated_at: '2024-01-10T14:30:00Z',
          fields_count: 45,
          is_active: true
        },
        {
          id: '2',
          name: 'Ficha de Artefacto',
          type: 'artifact',
          description: 'Plantilla para catalogar objetos encontrados',
          version: '1.8',
          created_at: '2023-02-20T10:00:00Z',
          updated_at: '2024-01-05T09:15:00Z',
          fields_count: 32,
          is_active: true
        },
        {
          id: '3',
          name: 'Ficha de Excavación',
          type: 'excavation',
          description: 'Plantilla para documentar procesos de excavación',
          version: '1.5',
          created_at: '2023-03-10T10:00:00Z',
          updated_at: '2023-12-20T16:45:00Z',
          fields_count: 28,
          is_active: true
        },
        {
          id: '4',
          name: 'Reporte de Investigación',
          type: 'report',
          description: 'Plantilla para reportes de investigación arqueológica',
          version: '3.0',
          created_at: '2023-04-05T10:00:00Z',
          updated_at: '2024-01-15T11:20:00Z',
          fields_count: 15,
          is_active: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'site': return '🏛️';
      case 'artifact': return '🏺';
      case 'excavation': return '⛏️';
      case 'report': return '📄';
      default: return '📋';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'site': return 'Sitio';
      case 'artifact': return 'Artefacto';
      case 'excavation': return 'Excavación';
      case 'report': return 'Reporte';
      default: return 'Plantilla';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando plantillas...</p>
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
                Plantillas de Fichas
              </h1>
              <p className="text-gray-600">
                Gestionar plantillas para documentación arqueológica
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => alert('Función en desarrollo')}>
                📝 Nueva Plantilla
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <Card title="Estadísticas de Plantillas">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-600">Total de Plantillas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {templates.filter(t => t.is_active).length}
                </div>
                <div className="text-sm text-gray-600">Plantillas Activas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {templates.filter(t => t.type === 'site').length}
                </div>
                <div className="text-sm text-gray-600">Plantillas de Sitios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {templates.filter(t => t.type === 'artifact').length}
                </div>
                <div className="text-sm text-gray-600">Plantillas de Objetos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de plantillas */}
        <Card title="Plantillas Disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(template.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{getTypeLabel(template.type)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Versión:</span>
                    <span className="font-medium">{template.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campos:</span>
                    <span className="font-medium">{template.fields_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actualizada:</span>
                    <span className="font-medium">
                      {new Date(template.updated_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={template.is_active ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'}
                    >
                      {template.is_active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Acciones adicionales */}
        <div className="mt-8">
          <Card title="Acciones del Sistema">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                📤 Exportar Plantillas
              </Button>
              <Button variant="outline" className="w-full">
                📥 Importar Plantillas
              </Button>
              <Button variant="outline" className="w-full">
                🔄 Sincronizar
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TemplatesPage; 