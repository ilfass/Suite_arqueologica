'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Card from '../../../../../../components/ui/Card';
import Button from '../../../../../../components/ui/Button';
import Input from '../../../../../../components/ui/Input';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'suspended' | 'planning';
  start_date: string;
  end_date?: string;
  team_size: number;
  budget?: number;
  institution: string;
}

const EditProjectPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        budget: 2500000,
        institution: 'INAH'
      });
      setLoading(false);
    }, 1000);
  }, [projectId]);

  const handleInputChange = (field: keyof Project, value: any) => {
    if (project) {
      setProject({ ...project, [field]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simular guardado
    setTimeout(() => {
      setSaving(false);
      alert('Proyecto actualizado exitosamente');
      router.push(`/dashboard/director/projects/${projectId}`);
    }, 2000);
  };

  const handleCancel = () => {
    router.push(`/dashboard/director/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyecto...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Editar Proyecto</h1>
              <p className="text-gray-600">{project.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Información del Proyecto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto
              </label>
              <Input
                value={project.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción detallada del proyecto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Proyecto
                </label>
                <select
                  value={project.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planificación</option>
                  <option value="active">Activo</option>
                  <option value="suspended">Suspendido</option>
                  <option value="completed">Completado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del Equipo
                </label>
                <Input
                  type="number"
                  value={project.team_size}
                  onChange={(e) => handleInputChange('team_size', parseInt(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <Input
                  type="date"
                  value={project.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <Input
                  type="date"
                  value={project.end_date || ''}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presupuesto (USD)
                </label>
                <Input
                  type="number"
                  value={project.budget || ''}
                  onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <Input
                  value={project.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  placeholder="Nombre de la institución"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EditProjectPage; 