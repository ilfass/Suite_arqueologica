'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface Excavation {
  id: string;
  name: string;
  site_id: string;
  site_name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  director: string;
  team_size: number;
  budget: number;
  methodology: string;
  objectives: string[];
  findings_summary: string;
  objects_count: number;
  samples_count: number;
  photos_count: number;
  documents_count: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

const ExcavationDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const excavationId = params?.id as string;
  const [excavation, setExcavation] = useState<Excavation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setExcavation({
        id: excavationId,
        name: 'Excavación del Templo Mayor - Temporada 2024',
        site_id: '1',
        site_name: 'Templo Mayor, Ciudad de México',
        description: 'Excavación arqueológica del Templo Mayor de Tenochtitlán, enfocada en la exploración de las capas más profundas del recinto sagrado.',
        start_date: '2024-01-15T08:00:00Z',
        end_date: '2024-06-30T18:00:00Z',
        status: 'active',
        director: 'Dr. María González',
        team_size: 12,
        budget: 2500000,
        methodology: 'Excavación estratigráfica sistemática con documentación fotográfica y topográfica detallada.',
        objectives: [
          'Explorar las capas más profundas del Templo Mayor',
          'Documentar la secuencia estratigráfica completa',
          'Recuperar objetos rituales y ofrendas',
          'Analizar la evolución arquitectónica del templo'
        ],
        findings_summary: 'Se han descubierto múltiples niveles de construcción, ofrendas rituales y objetos cerámicos de gran valor histórico.',
        objects_count: 156,
        samples_count: 89,
        photos_count: 1247,
        documents_count: 45,
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          address: 'Seminario 8, Centro Histórico, Ciudad de México'
        },
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2024-01-15T16:30:00Z'
      });
      setLoading(false);
    }, 1000);
  }, [excavationId]);

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planificación';
      case 'active': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'suspended': return 'Suspendida';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la excavación...</p>
        </div>
      </div>
    );
  }

  if (!excavation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card title="Excavación no encontrada">
          <p>No se encontró la excavación solicitada.</p>
          <Button onClick={() => router.push('/excavations')}>Volver</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{excavation.name}</h1>
              <p className="text-gray-600">Detalles de la Excavación</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/excavations')}>
                Volver a Excavaciones
              </Button>
              {user?.role === 'RESEARCHER' && (
                <Button onClick={() => alert('Función en desarrollo')}>
                  ✏️ Editar Excavación
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Información General">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700">{excavation.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Sitio:</span>
                    <span className="ml-2 text-sm">{excavation.site_name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Director:</span>
                    <span className="ml-2 text-sm">{excavation.director}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(excavation.status)}`}>
                      {getStatusLabel(excavation.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Equipo:</span>
                    <span className="ml-2 text-sm">{excavation.team_size} personas</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                  <span className="ml-2 text-sm">{excavation.location.address}</span>
                </div>
              </div>
            </Card>

            <Card title="Metodología">
              <p className="text-gray-700">{excavation.methodology}</p>
            </Card>

            <Card title="Objetivos">
              <ul className="space-y-2">
                {excavation.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Hallazgos Principales">
              <p className="text-gray-700">{excavation.findings_summary}</p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Fechas">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {new Date(excavation.start_date).toLocaleDateString('es-ES')}
                  </div>
                  <div className="text-sm text-gray-600">Fecha de Inicio</div>
                </div>
                {excavation.end_date && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {new Date(excavation.end_date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-gray-600">Fecha de Finalización</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    ${excavation.budget.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Presupuesto</div>
                </div>
              </div>
            </Card>

            <Card title="Estadísticas">
              <div className="space-y-4">
                <div className="text-center">
                                  <div className="text-3xl font-bold text-blue-600">{excavation.objects_count}</div>
                <div className="text-sm text-gray-600">Objetos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{excavation.samples_count}</div>
                  <div className="text-sm text-gray-600">Muestras</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{excavation.photos_count}</div>
                  <div className="text-sm text-gray-600">Fotografías</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{excavation.documents_count}</div>
                  <div className="text-sm text-gray-600">Documentos</div>
                </div>
              </div>
            </Card>

            <Card title="Acciones Rápidas">
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  🏺 Ver Objetos
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📸 Ver Fotos
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📄 Ver Documentos
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  🗺️ Ver Mapa
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExcavationDetailsPage; 