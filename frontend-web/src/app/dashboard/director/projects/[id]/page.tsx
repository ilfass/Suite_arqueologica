'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'suspended' | 'planning';
  start_date: string;
  end_date?: string;
  team_size: number;
  sites_count: number;
  objects_count: number;
  excavations_count: number;
  budget?: number;
  institution: string;
  created_at: string;
  progress: number;
  team_members: string[];
  objectives: string[];
  challenges: string[];
}

const ProjectDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del proyecto
    setTimeout(() => {
      setProject({
        id: projectId,
        name: 'Proyecto Teotihuacán 2024',
        description: 'Investigación integral de la ciudad de Teotihuacán, incluyendo excavaciones en el templo principal y análisis de materiales encontrados.',
        status: 'active',
        start_date: '2024-01-15',
        end_date: '2024-12-31',
        team_size: 12,
        sites_count: 3,
        objects_count: 156,
        excavations_count: 5,
        budget: 2500000,
        institution: 'INAH',
        created_at: '2024-01-15T10:00:00Z',
        progress: 65,
        team_members: [
          'Dr. María González - Investigador Principal',
          'Lic. Carlos Pérez - Arqueólogo de Campo',
          'Est. Ana Martínez - Asistente de Investigación',
          'Dr. Roberto López - Especialista en Cerámica'
        ],
        objectives: [
          'Documentar completamente el templo principal',
          'Analizar la estratigrafía del sitio',
          'Catalogar todos los objetos encontrados',
          'Publicar resultados en revista científica'
        ],
        challenges: [
          'Condiciones climáticas adversas',
          'Limitaciones de presupuesto',
          'Acceso restringido a ciertas áreas'
        ]
      });
      setLoading(false);
    }, 1000);
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del proyecto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card title="Proyecto no encontrado">
          <p>No se encontró el proyecto solicitado.</p>
          <Button onClick={() => router.push('/dashboard/director')}>Volver al Dashboard</Button>
        </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">Detalles del Proyecto</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push(`/dashboard/director/projects/${projectId}/edit`)}>
                Editar Proyecto
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Información General">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Descripción</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'active' ? 'Activo' : 
                       project.status === 'completed' ? 'Completado' : 
                       project.status === 'suspended' ? 'Suspendido' : 'Planificación'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Progreso:</span>
                    <span className="ml-2 text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha de inicio:</span>
                    <span className="ml-2 text-sm">{new Date(project.start_date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha de fin:</span>
                    <span className="ml-2 text-sm">{project.end_date ? new Date(project.end_date).toLocaleDateString('es-ES') : 'No definida'}</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso del proyecto</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Objetivos del Proyecto">
              <ul className="space-y-2">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Desafíos Identificados">
              <ul className="space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Estadísticas">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{project.team_size}</div>
                  <div className="text-sm text-gray-600">Miembros del Equipo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{project.sites_count}</div>
                  <div className="text-sm text-gray-600">Sitios Arqueológicos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{project.objects_count}</div>
                  <div className="text-sm text-gray-600">Objetos Catalogados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{project.excavations_count}</div>
                  <div className="text-sm text-gray-600">Excavaciones</div>
                </div>
                {project.budget && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      ${project.budget.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Presupuesto</div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Equipo del Proyecto">
              <div className="space-y-2">
                {project.team_members.map((member, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {member}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Acciones Rápidas">
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  📊 Ver Reportes
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  👥 Gestionar Equipo
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📋 Ver Tareas
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  💰 Gestionar Presupuesto
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailsPage; 