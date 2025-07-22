'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived' | 'planning';
  start_date: string;
  end_date?: string;
  site_id: string;
  site_name: string;
  coordinator: string;
  team_size: number;
  methodology: string;
  objectives: string[];
  budget?: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Simular carga de proyectos
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Excavación en Sitio Pampeano - Cazadores Recolectores',
          description: 'Investigación sobre patrones de asentamiento de cazadores recolectores en la región pampeana argentina durante el Holoceno temprano',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          site_id: '1',
          site_name: 'Sitio Pampeano La Laguna',
          coordinator: 'Dr. María González',
          team_size: 8,
          methodology: 'Excavación sistemática por cuadrículas de 1x1m, análisis de materiales líticos y óseos, datación por C14',
          objectives: [
            'Identificar patrones de ocupación estacional',
            'Analizar tecnología lítica',
            'Reconstruir paleoambiente',
            'Establecer cronología de ocupación'
          ],
          budget: 50000,
          progress: 65,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Análisis de Materiales Líticos - Técnica de Tallado',
          description: 'Estudio de técnicas de tallado y uso de herramientas líticas en contextos de cazadores recolectores',
          status: 'completed',
          start_date: '2023-06-01',
          end_date: '2023-12-31',
          site_id: '2',
          site_name: 'Sitio Arroyo Seco',
          coordinator: 'Dr. Carlos Rodríguez',
          team_size: 5,
          methodology: 'Análisis traceológico, experimentación, microscopía electrónica',
          objectives: [
            'Identificar técnicas de tallado',
            'Reconstruir cadenas operativas',
            'Determinar funciones de herramientas',
            'Establecer cronología tecnológica'
          ],
          budget: 30000,
          progress: 100,
          created_at: '2023-06-01T10:00:00Z',
          updated_at: '2023-12-31T10:00:00Z'
        },
        {
          id: '3',
          name: 'Prospección Arqueológica - Valle del Río Salado',
          description: 'Prospección sistemática para identificar nuevos sitios de cazadores recolectores',
          status: 'planning',
          start_date: '2024-03-01',
          end_date: '2024-08-31',
          site_id: '3',
          site_name: 'Valle del Río Salado',
          coordinator: 'Dr. Ana Martínez',
          team_size: 6,
          methodology: 'Prospección sistemática, GPS, fotogrametría, análisis de suelos',
          objectives: [
            'Identificar nuevos sitios',
            'Mapear distribución espacial',
            'Evaluar potencial arqueológico',
            'Establecer cronología regional'
          ],
          budget: 25000,
          progress: 0,
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'archived': return 'Archivado';
      case 'planning': return 'Planificación';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(project => 
    filterStatus === 'all' || project.status === filterStatus
  );

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleEditProject = (projectId: string) => {
    // Implementar edición de proyecto
    console.log('Editar proyecto:', projectId);
  };

  const handleArchiveProject = (projectId: string) => {
    // Implementar archivado de proyecto
    console.log('Archivar proyecto:', projectId);
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
              <p className="text-gray-600 mt-2">Administra tus proyectos arqueológicos</p>
            </div>
            <Button variant="primary" onClick={handleCreateProject}>
              + Nuevo Proyecto
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="planning">Planificación</option>
              <option value="completed">Completados</option>
              <option value="archived">Archivados</option>
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
                    <span className="text-white text-sm font-medium">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Proyectos</p>
                  <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'active').length}
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
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En Planificación</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'planning').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completados</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sitio:</span>
                    <span className="font-medium">{project.site_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Coordinador:</span>
                    <span className="font-medium">{project.coordinator}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Equipo:</span>
                    <span className="font-medium">{project.team_size} personas</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progreso:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleArchiveProject(project.id)}
                  >
                    Archivar
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => window.location.href = `/dashboard/researcher/projects/${project.id}`}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
              <p className="text-gray-600 mb-4">Comienza creando tu primer proyecto arqueológico</p>
              <Button variant="primary" onClick={handleCreateProject}>
                Crear Proyecto
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage; 