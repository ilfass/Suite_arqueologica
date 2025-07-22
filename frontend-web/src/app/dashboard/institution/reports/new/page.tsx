'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';

const CreateReportPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    period: '',
    projects_covered: '',
    researchers_involved: '',
    executive_summary: '',
    methodology: '',
    findings: '',
    conclusions: '',
    recommendations: '',
    budget_summary: '',
    timeline: '',
    challenges: '',
    next_quarter_plans: ''
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
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Reporte generado:', formData);
      alert('Reporte generado exitosamente');
      router.push('/dashboard/institution');
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/institution');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Generar Reporte Institucional
              </h1>
              <p className="text-gray-600">
                Institución: {user?.institution}
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
        <Card title="Configuración del Reporte">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Reporte *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Reporte Anual 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Reporte *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="monthly">Mensual</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="annual">Anual</option>
                  <option value="project">Por Proyecto</option>
                  <option value="special">Especial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período *
                </label>
                <Input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  placeholder="Ej: Q1 2024, Enero 2024, 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyectos Cubiertos
                </label>
                <Input
                  type="text"
                  name="projects_covered"
                  value={formData.projects_covered}
                  onChange={handleInputChange}
                  placeholder="Ej: Proyecto Teotihuacán, Proyecto Palenque"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investigadores Involucrados
              </label>
              <Input
                type="text"
                name="researchers_involved"
                value={formData.researchers_involved}
                onChange={handleInputChange}
                placeholder="Ej: Dr. María González, Lic. Carlos Pérez"
              />
            </div>

            {/* Resumen ejecutivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen Ejecutivo *
              </label>
              <textarea
                name="executive_summary"
                value={formData.executive_summary}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Resumen ejecutivo de las actividades y logros principales del período..."
                required
              />
            </div>

            {/* Metodología */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metodología Utilizada
              </label>
              <textarea
                name="methodology"
                value={formData.methodology}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe las metodologías arqueológicas utilizadas en los proyectos..."
              />
            </div>

            {/* Hallazgos principales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hallazgos Principales
              </label>
              <textarea
                name="findings"
                value={formData.findings}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe los hallazgos arqueológicos más importantes del período..."
              />
            </div>

            {/* Conclusiones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conclusiones
              </label>
              <textarea
                name="conclusions"
                value={formData.conclusions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Conclusiones principales derivadas de las investigaciones..."
              />
            </div>

            {/* Recomendaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recomendaciones
              </label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Recomendaciones para futuras investigaciones y proyectos..."
              />
            </div>

            {/* Resumen presupuestario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen Presupuestario
              </label>
              <textarea
                name="budget_summary"
                value={formData.budget_summary}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Resumen del presupuesto ejecutado y estado financiero de los proyectos..."
              />
            </div>

            {/* Cronograma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cronograma de Actividades
              </label>
              <textarea
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cronograma de actividades realizadas y pendientes..."
              />
            </div>

            {/* Desafíos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desafíos y Obstáculos
              </label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Desafíos encontrados durante el período y cómo se abordaron..."
              />
            </div>

            {/* Planes del próximo período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planes para el Próximo Período
              </label>
              <textarea
                name="next_quarter_plans"
                value={formData.next_quarter_plans}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Planes y objetivos para el próximo período..."
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
                    Generando...
                  </>
                ) : (
                  'Generar Reporte'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateReportPage; 