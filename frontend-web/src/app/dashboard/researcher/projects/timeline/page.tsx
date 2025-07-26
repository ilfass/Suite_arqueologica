'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  start_date: string;
  end_date: string;
  progress: number;
  director: string;
  team_size: number;
  budget: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  project_id: string;
}

const TimelinePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'gantt'>('timeline');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Proyecto Templo Mayor 2024',
          status: 'active',
          start_date: '2024-01-15T08:00:00Z',
          end_date: '2024-06-30T18:00:00Z',
          progress: 65,
          director: 'Dr. María González',
          team_size: 12,
          budget: 2500000,
          milestones: [
            {
              id: '1',
              title: 'Inicio de Excavación',
              description: 'Comienzo de trabajos de campo en el sector norte',
              date: '2024-01-15T08:00:00Z',
              status: 'completed',
              project_id: '1'
            },
            {
              id: '2',
              title: 'Descubrimiento de Ofrenda',
              description: 'Hallazgo de ofrenda ritual en nivel 3',
              date: '2024-02-15T14:30:00Z',
              status: 'completed',
              project_id: '1'
            },
            {
              id: '3',
              title: 'Análisis de Laboratorio',
              description: 'Envío de muestras para análisis especializados',
              date: '2024-04-01T09:00:00Z',
              status: 'in_progress',
              project_id: '1'
            },
            {
              id: '4',
              title: 'Finalización de Campo',
              description: 'Cierre de excavaciones y documentación final',
              date: '2024-06-15T17:00:00Z',
              status: 'pending',
              project_id: '1'
            }
          ]
        },
        {
          id: '2',
          name: 'Análisis de Cerámica Prehispánica',
          status: 'active',
          start_date: '2024-02-01T09:00:00Z',
          end_date: '2024-08-31T17:00:00Z',
          progress: 40,
          director: 'Lic. Carlos Pérez',
          team_size: 6,
          budget: 800000,
          milestones: [
            {
              id: '5',
              title: 'Recolección de Muestras',
              description: 'Selección y catalogación de fragmentos cerámicos',
              date: '2024-02-01T09:00:00Z',
              status: 'completed',
              project_id: '2'
            },
            {
              id: '6',
              title: 'Análisis Tipológico',
              description: 'Clasificación y tipología de cerámicas',
              date: '2024-04-15T10:00:00Z',
              status: 'in_progress',
              project_id: '2'
            },
            {
              id: '7',
              title: 'Análisis de Composición',
              description: 'Estudios petrográficos y químicos',
              date: '2024-06-01T11:00:00Z',
              status: 'pending',
              project_id: '2'
            }
          ]
        },
        {
          id: '3',
          name: 'Prospección Valle de México',
          status: 'planning',
          start_date: '2024-03-01T08:00:00Z',
          end_date: '2024-12-31T18:00:00Z',
          progress: 15,
          director: 'Dr. Roberto Silva',
          team_size: 8,
          budget: 1200000,
          milestones: [
            {
              id: '8',
              title: 'Planificación de Rutas',
              description: 'Definición de áreas de prospección',
              date: '2024-03-01T08:00:00Z',
              status: 'completed',
              project_id: '3'
            },
            {
              id: '9',
              title: 'Trabajo de Campo',
              description: 'Prospección sistemática de superficie',
              date: '2024-05-01T07:00:00Z',
              status: 'pending',
              project_id: '3'
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMilestoneStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      case 'delayed': return '⚠️';
      default: return '📋';
    }
  };

  const filteredProjects = selectedProject === 'all' 
    ? projects 
    : projects.filter(p => p.id === selectedProject);

  const allMilestones = filteredProjects.flatMap(p => p.milestones);
  const sortedMilestones = allMilestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cronograma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cronograma de Proyectos</h1>
              <p className="text-gray-600">Visualización temporal de proyectos y hitos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/researcher/projects')}>
                Volver a Proyectos
              </Button>
              <Button onClick={() => router.push('/dashboard/researcher/projects/new')}>
                🆕 Nuevo Proyecto
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles */}
        <div className="mb-8">
          <Card title="Controles de Visualización">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los Proyectos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'timeline' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('timeline')}
                  >
                    📅 Timeline
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    📆 Calendario
                  </Button>
                  <Button
                    variant={viewMode === 'gantt' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('gantt')}
                  >
                    📊 Gantt
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Vista Timeline */}
        {viewMode === 'timeline' && (
          <Card title="Timeline de Proyectos">
            <div className="space-y-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-500 pl-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(project.start_date).toLocaleDateString('es-ES')} - 
                        {new Date(project.end_date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status === 'planning' ? 'Planificación' : 
                         project.status === 'active' ? 'Activo' : 
                         project.status === 'completed' ? 'Completado' : 'Archivado'}
                      </span>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(milestone.date).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                                <span className="mr-1">{getMilestoneStatusIcon(milestone.status)}</span>
                                {milestone.status === 'pending' ? 'Pendiente' : 
                                 milestone.status === 'in_progress' ? 'En Progreso' : 
                                 milestone.status === 'completed' ? 'Completado' : 'Retrasado'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Vista Calendario */}
        {viewMode === 'calendar' && (
          <Card title="Vista de Calendario">
            <div className="text-center py-8">
              <p className="text-gray-600">Vista de calendario en desarrollo</p>
              <p className="text-sm text-gray-500 mt-2">Aquí se mostrará un calendario interactivo con todos los hitos</p>
            </div>
          </Card>
        )}

        {/* Vista Gantt */}
        {viewMode === 'gantt' && (
          <Card title="Diagrama de Gantt">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-12 gap-1 mb-4">
                  <div className="col-span-3 font-medium text-gray-700">Proyecto</div>
                  <div className="col-span-9 grid grid-cols-12 gap-1">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="text-center text-xs text-gray-500">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {filteredProjects.map((project) => {
                  const startMonth = new Date(project.start_date).getMonth();
                  const endMonth = new Date(project.end_date).getMonth();
                  const duration = endMonth - startMonth + 1;
                  
                  return (
                    <div key={project.id} className="grid grid-cols-12 gap-1 mb-2">
                      <div className="col-span-3 text-sm text-gray-900 truncate">
                        {project.name}
                      </div>
                      <div className="col-span-9 grid grid-cols-12 gap-1">
                        {Array.from({ length: 12 }, (_, i) => {
                          const isActive = i >= startMonth && i <= endMonth;
                          return (
                            <div
                              key={i}
                              className={`h-6 rounded ${
                                isActive 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-100'
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Resumen */}
        <div className="mt-8">
          <Card title="Resumen del Cronograma">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredProjects.length}</div>
                <div className="text-sm text-gray-600">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {allMilestones.filter(m => m.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Hitos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {allMilestones.filter(m => m.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {allMilestones.filter(m => m.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TimelinePage; 