'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planning' | 'archived';
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

const EditProjectPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'planning' | 'archived',
    startDate: '',
    endDate: '',
    location: '',
    director: '',
    team: '',
    objectives: '',
    methodology: '',
    budget: '',
    notes: ''
  });

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
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const projectId = params.id as string;
      const foundProject = mockProjects.find(p => p.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
        setFormData({
          name: foundProject.name,
          description: foundProject.description,
          status: foundProject.status,
          startDate: foundProject.startDate,
          endDate: foundProject.endDate || '',
          location: foundProject.location || '',
          director: foundProject.director || '',
          team: foundProject.team?.join(', ') || '',
          objectives: foundProject.objectives || '',
          methodology: foundProject.methodology || '',
          budget: foundProject.budget?.toString() || '',
          notes: foundProject.notes || ''
        });
      }
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Proyecto guardado:', formData);
      setSaving(false);
      router.push('/dashboard/researcher');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/dashboard/researcher');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (!hasContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para editar proyectos, primero debes seleccionar un contexto.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyecto no encontrado</h3>
          <p className="text-gray-600 mb-4">El proyecto que buscas no existe o no tienes permisos para editarlo.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Volver al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      <ContextBanner
        project={context.project}
        area={context.area}
        site={context.site}
        projectName={project.name}
        showBackButton={true}
        showChangeButton={false}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/dashboard/researcher/projects')}
            className="hover:text-blue-600 hover:underline"
          >
            Proyectos
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Editar Proyecto</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✏️ Editar Proyecto</h1>
            <p className="mt-2 text-gray-600">Modifica la configuración y detalles del proyecto</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          {/* Información Básica */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nombre del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'completed' | 'planning' | 'archived'})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="planning">Planificación</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Finalización
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ubicación del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Director del Proyecto
                  </label>
                  <Input
                    value={formData.director}
                    onChange={(e) => setFormData({...formData, director: e.target.value})}
                    placeholder="Nombre del director"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción detallada del proyecto"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Equipo y Metodología */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">👥 Equipo y Metodología</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipo de Investigación
                  </label>
                  <textarea
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    placeholder="Miembros del equipo (separados por comas)"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    placeholder="Objetivos del proyecto"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metodología
                  </label>
                  <textarea
                    value={formData.methodology}
                    onChange={(e) => setFormData({...formData, methodology: e.target.value})}
                    placeholder="Metodología a utilizar"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Presupuesto y Notas */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">💰 Presupuesto y Notas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presupuesto (USD)
                  </label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notas adicionales sobre el proyecto"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProjectPage; 