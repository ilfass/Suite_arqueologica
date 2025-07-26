'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planning';
  startDate: string;
  endDate?: string;
  location?: string;
  director?: string;
  team?: string[];
  objectives?: string;
  methodology?: string;
  budget?: number;
  notes?: string;
}

const ProjectsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');

  // Datos simulados de proyectos
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Proyecto Cazadores Recolectores - La Laguna',
      description: 'Estudio de ocupaciones tempranas en la región pampeana',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      location: 'Laguna La Brava, Buenos Aires',
      director: 'Dr. María González',
      team: ['Dr. Carlos Pérez', 'Lic. Ana Rodríguez', 'Téc. Juan López'],
      objectives: 'Estudiar los patrones de ocupación temprana en la región pampeana',
      methodology: 'Prospección sistemática, excavación estratigráfica, análisis de materiales',
      budget: 150000,
      notes: 'Proyecto en curso con hallazgos significativos'
    },
    {
      id: '2',
      name: 'Estudio de Poblamiento Pampeano',
      description: 'Investigación sobre patrones de asentamiento',
      status: 'active',
      startDate: '2024-03-01',
      location: 'Monte Hermoso, Buenos Aires',
      director: 'Dr. Roberto Silva',
      team: ['Dr. Laura Martínez', 'Lic. Pedro Gómez'],
      objectives: 'Analizar patrones de poblamiento en la costa pampeana',
      methodology: 'Análisis espacial, dataciones radiocarbónicas',
      budget: 80000,
      notes: 'Enfocado en sitios costeros'
    },
    {
      id: '3',
      name: 'Arqueología de la Llanura Bonaerense',
      description: 'Análisis de sitios costeros y de interior',
      status: 'planning',
      startDate: '2025-01-01',
      location: 'Región Pampeana',
      director: 'Dr. Elena Fernández',
      team: ['Dr. Miguel Torres'],
      objectives: 'Comprender la diversidad de ocupaciones en la llanura',
      methodology: 'Síntesis regional, análisis comparativo',
      budget: 120000,
      notes: 'Proyecto en fase de planificación'
    },
    {
      id: '4',
      name: 'Excavación Arroyo Seco',
      description: 'Investigación de sitios costeros del Holoceno',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      location: 'Arroyo Seco, Buenos Aires',
      director: 'Dr. Carlos Pérez',
      team: ['Lic. Ana Rodríguez', 'Téc. Juan López'],
      objectives: 'Documentar ocupaciones costeras del Holoceno',
      methodology: 'Excavación sistemática, análisis de materiales',
      budget: 95000,
      notes: 'Proyecto completado exitosamente'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => 
    filter === 'all' ? true : project.status === filter
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
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
          <span className="text-gray-900 font-medium">Proyectos</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Proyectos de Investigación</h1>
            <p className="mt-2 text-gray-600">Gestiona todos tus proyectos arqueológicos</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher/projects/new')}>
            ➕ Nuevo Proyecto
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
              Todos ({projects.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Activos ({projects.filter(p => p.status === 'active').length})
            </Button>
            <Button
              variant={filter === 'planning' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('planning')}
            >
              Planificación ({projects.filter(p => p.status === 'planning').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completados ({projects.filter(p => p.status === 'completed').length})
            </Button>
          </div>
        </div>

        {/* Lista de Proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {project.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">📅 Inicio:</span>
                    {new Date(project.startDate).toLocaleDateString('es-ES')}
                  </div>
                  {project.endDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📅 Fin:</span>
                      {new Date(project.endDate).toLocaleDateString('es-ES')}
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📍 Ubicación:</span>
                      {project.location}
                    </div>
                  )}
                  {project.director && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">👤 Director:</span>
                      {project.director}
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">💰 Presupuesto:</span>
                      ${project.budget.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/projects/${project.id}/edit`)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/projects/${project.id}`)}
                  >
                    👁️ Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay proyectos</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no tienes proyectos creados.'
                  : `No hay proyectos en estado "${getStatusText(filter)}".`
                }
              </p>
              <Button onClick={() => router.push('/dashboard/researcher')}>
                Crear Primer Proyecto
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage; 