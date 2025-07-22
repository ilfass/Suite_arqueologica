'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const NewSitePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    coordinates: '',
    period: '',
    culture: '',
    discoveryDate: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Solo el nombre es obligatorio
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del sitio es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envío al backend
      console.log('Enviando datos del sitio:', formData);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la lista de sitios
      router.push('/sites');
    } catch (error) {
      console.error('Error al crear sitio:', error);
      setErrors({ submit: 'Error al crear el sitio. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Sitio Arqueológico</h1>
          <p className="text-gray-600">Completa la información del sitio arqueológico. Solo el nombre es obligatorio.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre - Obligatorio */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sitio <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Templo Mayor, Machu Picchu, etc."
                error={errors.name}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el sitio arqueológico, su importancia histórica, características principales..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ciudad, región, país"
              />
            </div>

            {/* Coordenadas */}
            <div>
              <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-2">
                Coordenadas
              </label>
              <Input
                id="coordinates"
                name="coordinates"
                type="text"
                value={formData.coordinates}
                onChange={handleInputChange}
                placeholder="Latitud, Longitud (ej: 19.4326, -99.1332)"
              />
            </div>

            {/* Período */}
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                Período Histórico
              </label>
              <Input
                id="period"
                name="period"
                type="text"
                value={formData.period}
                onChange={handleInputChange}
                placeholder="Ej: Preclásico, Clásico, Posclásico, etc."
              />
            </div>

            {/* Cultura */}
            <div>
              <label htmlFor="culture" className="block text-sm font-medium text-gray-700 mb-2">
                Cultura
              </label>
              <Input
                id="culture"
                name="culture"
                type="text"
                value={formData.culture}
                onChange={handleInputChange}
                placeholder="Ej: Maya, Azteca, Inca, etc."
              />
            </div>

            {/* Fecha de Descubrimiento */}
            <div>
              <label htmlFor="discoveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Descubrimiento
              </label>
              <Input
                id="discoveryDate"
                name="discoveryDate"
                type="date"
                value={formData.discoveryDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="excavation">En Excavación</option>
                <option value="preservation">En Preservación</option>
              </select>
            </div>

            {/* Error general */}
            {errors.submit && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {errors.submit}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creando...' : 'Crear Sitio'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/sites')}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewSitePage; 