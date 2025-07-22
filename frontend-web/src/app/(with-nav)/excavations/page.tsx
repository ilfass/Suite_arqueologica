'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface Excavation {
  id: string;
  site_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'suspended';
  team_leader?: string;
  team_members?: string[];
  objectives?: string[];
  methodology?: string;
  findings_summary?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const ExcavationsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [excavations, setExcavations] = useState<Excavation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de excavaciones para el demo
    setTimeout(() => {
      setExcavations([
        {
          id: '1',
          site_id: '1',
          name: 'Excavación Sector Norte - Teotihuacán',
          description: 'Excavación del sector norte de la ciudad de Teotihuacán',
          start_date: '2024-01-15',
          end_date: '2024-06-15',
          status: 'in_progress',
          team_leader: 'Dr. María González',
          team_members: ['Dr. Carlos Pérez', 'Lic. Ana Martínez', 'Est. Juan López'],
          objectives: ['Documentar estructuras residenciales', 'Recuperar objetos', 'Mapear el área'],
          methodology: 'Excavación estratigráfica sistemática',
          findings_summary: 'Se han encontrado múltiples estructuras residenciales y objetos cerámicos',
          created_by: 'admin',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          site_id: '2',
          name: 'Excavación Templo Principal - Chichen Itza',
          description: 'Excavación del templo principal de Chichen Itza',
          start_date: '2024-02-01',
          status: 'planned',
          team_leader: 'Dr. Roberto Martínez',
          team_members: ['Dr. Laura Sánchez', 'Lic. Pedro Ramírez'],
          objectives: ['Documentar arquitectura del templo', 'Recuperar ofrendas', 'Estudiar cronología'],
          methodology: 'Excavación por niveles arquitectónicos',
          created_by: 'admin',
          created_at: '2024-02-01T10:00:00Z',
          updated_at: '2024-02-01T10:00:00Z'
        },
        {
          id: '3',
          site_id: '3',
          name: 'Excavación Palacio - Palenque',
          description: 'Excavación del palacio real de Palenque',
          start_date: '2023-09-01',
          end_date: '2024-01-31',
          status: 'completed',
          team_leader: 'Dr. Elena Rodríguez',
          team_members: ['Dr. Miguel Torres', 'Lic. Carmen Vega'],
          objectives: ['Documentar arquitectura palaciega', 'Recuperar inscripciones', 'Estudiar cronología'],
          methodology: 'Excavación sistemática por habitaciones',
          findings_summary: 'Se documentaron 12 habitaciones y se recuperaron múltiples inscripciones jeroglíficas',
          created_by: 'admin',
          created_at: '2023-09-01T10:00:00Z',
          updated_at: '2024-01-31T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateExcavation = () => {
    router.push('/excavations/new');
  };

  const handleViewExcavation = (excavationId: string) => {
    router.push(`/excavations/${excavationId}`);
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planned: 'Planificada',
      in_progress: 'En Progreso',
      completed: 'Completada',
      suspended: 'Suspendida'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando excavaciones...</p>
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
                Excavaciones
              </h1>
              <p className="text-gray-600">
                Gestión y seguimiento de excavaciones arqueológicas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Volver al Dashboard
              </Button>
              <Button onClick={handleCreateExcavation}>
                Nueva Excavación
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
                <div className="text-2xl font-bold text-blue-600">{excavations.length}</div>
                <div className="text-sm text-gray-600">Total de Excavaciones</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {excavations.filter(e => e.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {excavations.filter(e => e.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {excavations.filter(e => e.status === 'planned').length}
                </div>
                <div className="text-sm text-gray-600">Planificadas</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Excavations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {excavations.map((excavation) => (
            <Card key={excavation.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{excavation.name}</h3>
                  <p className="text-sm text-gray-600">{excavation.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(excavation.status)}`}>
                      {getStatusLabel(excavation.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Líder:</span>
                    <span className="font-medium">{excavation.team_leader}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Inicio:</span>
                    <span className="font-medium">{excavation.start_date}</span>
                  </div>
                  {excavation.end_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fin:</span>
                      <span className="font-medium">{excavation.end_date}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Equipo:</span>
                    <span className="font-medium">{excavation.team_members?.length || 0} miembros</span>
                  </div>
                </div>

                {excavation.findings_summary && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Hallazgos:</strong> {excavation.findings_summary}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewExcavation(excavation.id)}
                      className="flex-1"
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/excavations/${excavation.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {excavations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⛏️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay excavaciones registradas</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primera excavación</p>
            <Button onClick={handleCreateExcavation}>
              Crear Primera Excavación
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExcavationsPage; 