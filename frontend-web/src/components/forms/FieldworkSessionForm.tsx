'use client';

import React, { useState, useEffect } from 'react';
import { useArchaeological } from '../../contexts/ArchaeologicalContext';
import { FieldworkFormData, ArchaeologicalContext as ArchContext } from '../../types/archaeological';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface FieldworkSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FieldworkFormData) => void;
  initialData?: FieldworkFormData;
  context?: ArchContext;
}

const FieldworkSessionForm: React.FC<FieldworkSessionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  context
}) => {
  const { getFormContext } = useArchaeological();
  const formContext = getFormContext();

  const [formData, setFormData] = useState<FieldworkFormData>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    teamMembers: [''],
    weatherConditions: '',
    methodology: '',
    excavationUnits: [''],
    identifiedStrata: [''],
    generalObservations: '',
    siteId: context?.siteId || '',
    areaId: context?.areaId || '',
    projectId: context?.projectId || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar con datos existentes o contexto
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (context) {
      setFormData(prev => ({
        ...prev,
        siteId: context.siteId || '',
        areaId: context.areaId || '',
        projectId: context.projectId || ''
      }));
    }
  }, [initialData, context]);

  const handleInputChange = (field: keyof FieldworkFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: keyof FieldworkFormData, index: number, value: string) => {
    setFormData(prev => {
      const array = [...(prev[field] as string[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field: keyof FieldworkFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof FieldworkFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.siteId) {
      newErrors.siteId = 'Debe seleccionar un sitio';
    }
    if (!formData.areaId) {
      newErrors.areaId = 'Debe seleccionar un área';
    }
    if (!formData.projectId) {
      newErrors.projectId = 'Debe seleccionar un proyecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? 'Editar Trabajo de Campo' : 'Nuevo Trabajo de Campo'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Contexto Arqueológico */}
          {context && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Contexto Arqueológico</h3>
              <div className="text-sm text-blue-700">
                <p><strong>Proyecto:</strong> {context.projectName}</p>
                <p><strong>Área:</strong> {context.areaName}</p>
                <p><strong>Sitio:</strong> {context.siteName}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Trabajo de Campo *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Excavación Cuadrícula A1-A4"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              </div>
            </div>

            {/* Sección 2: Equipo y Condiciones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Equipo y Condiciones</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miembros del Equipo
                  </label>
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={member}
                        onChange={(e) => handleArrayChange('teamMembers', index, e.target.value)}
                        placeholder="Nombre del miembro del equipo"
                        className="flex-1"
                      />
                      {formData.teamMembers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('teamMembers', index)}
                          className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('teamMembers')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    + Agregar Miembro
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones Climáticas
                  </label>
                  <Input
                    type="text"
                    value={formData.weatherConditions}
                    onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                    placeholder="Ej: Soleado, 25°C, viento suave"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Metodología */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔬 Metodología</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metodología Utilizada
                  </label>
                  <textarea
                    value={formData.methodology}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    placeholder="Describa la metodología de excavación, prospección, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidades de Excavación
                  </label>
                  {formData.excavationUnits.map((unit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={unit}
                        onChange={(e) => handleArrayChange('excavationUnits', index, e.target.value)}
                        placeholder="Ej: A1, A2, B1, etc."
                        className="flex-1"
                      />
                      {formData.excavationUnits.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('excavationUnits', index)}
                          className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('excavationUnits')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    + Agregar Unidad
                  </Button>
                </div>
              </div>
            </div>

            {/* Sección 4: Estratos y Observaciones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🏔️ Estratos y Observaciones</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estratos Identificados
                  </label>
                  {formData.identifiedStrata.map((stratum, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={stratum}
                        onChange={(e) => handleArrayChange('identifiedStrata', index, e.target.value)}
                        placeholder="Ej: Estrato 1: Suelo orgánico"
                        className="flex-1"
                      />
                      {formData.identifiedStrata.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('identifiedStrata', index)}
                          className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('identifiedStrata')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    + Agregar Estrato
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones Generales
                  </label>
                  <textarea
                    value={formData.generalObservations}
                    onChange={(e) => handleInputChange('generalObservations', e.target.value)}
                    placeholder="Observaciones sobre el trabajo realizado, hallazgos importantes, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                {initialData ? 'Actualizar' : 'Crear'} Trabajo de Campo
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default FieldworkSessionForm; 