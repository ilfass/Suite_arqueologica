'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';

const CreateProjectPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    team_size: '',
    objectives: '',
    methodology: '',
    expected_outcomes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular creación de proyecto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Proyecto creado:', formData);
      alert('Proyecto creado exitosamente');
      router.push('/dashboard/director');
    } catch (error) {
      console.error('Error creando proyecto:', error);
      alert('Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/director');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Crear Nuevo Proyecto
              </h1>
              <p className="text-gray-600">
                Director: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Información del Proyecto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Proyecto Teotihuacán 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del Equipo *
                </label>
                <Input
                  type="number"
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleInputChange}
                  placeholder="Número de personas"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el proyecto arqueológico..."
                required
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Finalización
                </label>
                <Input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Presupuesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto Estimado (MXN)
              </label>
              <Input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>

            {/* Objetivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos del Proyecto *
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Define los objetivos principales del proyecto..."
                required
              />
            </div>

            {/* Metodología */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metodología
              </label>
              <textarea
                name="methodology"
                value={formData.methodology}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe la metodología a utilizar..."
              />
            </div>

            {/* Resultados esperados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados Esperados
              </label>
              <textarea
                name="expected_outcomes"
                value={formData.expected_outcomes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe los resultados esperados del proyecto..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Proyecto'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateProjectPage; 