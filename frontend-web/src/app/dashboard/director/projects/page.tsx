'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: number;
  researcherId: string;
  researcherName: string;
}

export default function DirectorProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DIRECTOR')) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'DIRECTOR') {
      fetchProjects();
    }
  }, [user, loading, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        console.error('Error fetching projects:', response.status);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/director/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/director/projects/${projectId}/edit`);
  };

  if (loading || loadingProjects) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <Button 
            onClick={() => router.push('/dashboard/director/projects/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nuevo Proyecto
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay proyectos registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando el primer proyecto arqueológico
            </p>
            <Button 
              onClick={() => router.push('/dashboard/director/projects/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Crear Proyecto
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Investigador:</span>
                    <span className="font-medium">{project.researcherName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Presupuesto:</span>
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Inicio:</span>
                    <span className="font-medium">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleViewProject(project.id)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    Ver
                  </Button>
                  <Button 
                    onClick={() => handleEditProject(project.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Editar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 