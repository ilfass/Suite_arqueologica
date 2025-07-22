'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';

const CreateFieldNotePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    project_name: '',
    excavation_name: '',
    content: '',
    weather: '',
    temperature: '',
    humidity: '',
    wind_speed: '',
    visibility: '',
    activities: '',
    findings: '',
    observations: '',
    questions: '',
    next_steps: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Simular creación de nota de campo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Nota de campo creada:', formData);
      alert('Nota de campo creada exitosamente');
      router.push('/dashboard/student');
    } catch (error) {
      console.error('Error creando nota de campo:', error);
      alert('Error al crear la nota de campo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/student');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nueva Nota de Campo
              </h1>
              <p className="text-gray-600">
                Estudiante: {user?.full_name}
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
        <Card title="Información de la Nota de Campo">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Nota *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Descubrimiento de fragmento cerámico"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto Asignado *
                </label>
                <Input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  placeholder="Ej: Proyecto Teotihuacán - Sector Norte"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excavación
              </label>
              <Input
                type="text"
                name="excavation_name"
                value={formData.excavation_name}
                onChange={handleInputChange}
                placeholder="Ej: Excavación Sector Norte"
              />
            </div>

            {/* Condiciones ambientales */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-4">🌤️ Condiciones Ambientales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clima
                  </label>
                  <select
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="soleado">Soleado</option>
                    <option value="nublado">Nublado</option>
                    <option value="lluvioso">Lluvioso</option>
                    <option value="ventoso">Ventoso</option>
                    <option value="neblinoso">Neblinoso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C)
                  </label>
                  <Input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="-50"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humedad (%)
                  </label>
                  <Input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    placeholder="65"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido de la Nota *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe detalladamente las actividades realizadas, observaciones, hallazgos y cualquier información relevante del día..."
                required
              />
            </div>

            {/* Actividades realizadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actividades Realizadas
              </label>
              <textarea
                name="activities"
                value={formData.activities}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lista las actividades específicas que realizaste durante el día..."
              />
            </div>

            {/* Hallazgos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hallazgos Importantes
              </label>
              <textarea
                name="findings"
                value={formData.findings}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe cualquier hallazgo importante, artefacto, estructura o evidencia arqueológica..."
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones y Reflexiones
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Incluye observaciones personales, reflexiones sobre el trabajo y aprendizajes del día..."
              />
            </div>

            {/* Preguntas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preguntas y Dudas
              </label>
              <textarea
                name="questions"
                value={formData.questions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Anota cualquier pregunta o duda que tengas sobre el trabajo realizado..."
              />
            </div>

            {/* Próximos pasos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próximos Pasos
              </label>
              <textarea
                name="next_steps"
                value={formData.next_steps}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Planea las actividades para el próximo día o las siguientes acciones a realizar..."
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
                  'Crear Nota'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateFieldNotePage; 