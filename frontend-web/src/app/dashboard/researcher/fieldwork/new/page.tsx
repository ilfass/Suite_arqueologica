'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface FieldworkRecord {
  id: string;
  title: string;
  description: string;
  type: 'excavation' | 'survey' | 'mapping' | 'sampling' | 'documentation';
  date: string;
  siteId: string;
  siteName: string;
  projectId: string;
  projectName: string;
  team: string[];
  weather: string;
  equipment: string[];
  findings: string;
  notes: string;
  photos: string[];
}

const NewFieldworkPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'excavation' as const,
    date: new Date().toISOString().split('T')[0],
    team: '',
    weather: '',
    equipment: '',
    findings: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Registro de campo guardado:', formData);
      setLoading(false);
      router.push('/dashboard/researcher/fieldwork');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/dashboard/researcher/fieldwork');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
          <p className="text-gray-600 mb-4">Para crear un registro de campo, primero debes seleccionar un contexto.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
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
            onClick={() => router.push('/dashboard/researcher/fieldwork')}
            className="hover:text-blue-600 hover:underline"
          >
            Trabajo de Campo
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Nuevo Registro</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📝 Nuevo Registro de Campo</h1>
            <p className="mt-2 text-gray-600">Documenta las actividades de trabajo de campo</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Registro'}
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Registro *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Excavación cuadrícula A1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Actividad *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="excavation">Excavación</option>
                    <option value="survey">Prospección</option>
                    <option value="mapping">Mapeo</option>
                    <option value="sampling">Muestreo</option>
                    <option value="documentation">Documentación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones Climáticas
                  </label>
                  <Input
                    value={formData.weather}
                    onChange={(e) => setFormData({...formData, weather: e.target.value})}
                    placeholder="Ej: Soleado, 25°C, viento suave"
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
                  placeholder="Describe detalladamente las actividades realizadas"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Equipo y Equipamiento */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">👥 Equipo y Equipamiento</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipo Participante
                  </label>
                  <textarea
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    placeholder="Lista de participantes (separados por comas)"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipamiento Utilizado
                  </label>
                  <textarea
                    value={formData.equipment}
                    onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                    placeholder="Lista de herramientas y equipos utilizados"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Hallazgos y Observaciones */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">🔍 Hallazgos y Observaciones</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hallazgos Realizados
                  </label>
                  <textarea
                    value={formData.findings}
                    onChange={(e) => setFormData({...formData, findings: e.target.value})}
                    placeholder="Describe los hallazgos arqueológicos realizados"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observaciones adicionales, problemas encontrados, etc."
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default NewFieldworkPage; 