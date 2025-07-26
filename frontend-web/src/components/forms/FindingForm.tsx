'use client';

import React, { useState, useEffect } from 'react';
import { useArchaeological } from '../../contexts/ArchaeologicalContext';
import { useUnifiedContext } from '../../hooks/useUnifiedContext';
import { FindingFormData, ArchaeologicalContext as ArchContext } from '../../types/archaeological';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface FindingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FindingFormData) => void;
  initialData?: FindingFormData;
  context?: ArchContext;
}

const FindingForm: React.FC<FindingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  context
}) => {
  const { getFormContext } = useArchaeological();
  const { context: unifiedContext } = useUnifiedContext();
  const formContext = getFormContext();

  const [formData, setFormData] = useState<FindingFormData>({
    name: '',
    type: 'artifact',
    material: '',
    description: '',
    coordinates: [0, 0],
    depth: 0,
    dimensions: {},
    weight: 0,
    condition: '',
    catalogNumber: '',
    context: '',
    associations: [''],
    photos: [''],
    drawings: [''],
    fieldworkSessionId: context?.fieldworkSessionId || '',
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
        fieldworkSessionId: context.fieldworkSessionId || '',
        siteId: context.siteId || '',
        areaId: context.areaId || '',
        projectId: context.projectId || ''
      }));
    } else if (unifiedContext.project_id) {
      // Usar contexto unificado si está disponible
      setFormData(prev => ({
        ...prev,
        projectId: unifiedContext.project_id || '',
        areaId: unifiedContext.area_id || '',
        siteId: unifiedContext.site_id || ''
      }));
    }
  }, [initialData, context, unifiedContext]);

  const handleInputChange = (field: keyof FindingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: keyof FindingFormData, index: number, value: string) => {
    setFormData(prev => {
      const array = [...(prev[field] as string[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field: keyof FindingFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof FindingFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleDimensionChange = (dimension: keyof FindingFormData['dimensions'], value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const handleCoordinateChange = (index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.map((coord, i) => i === index ? value : coord) as [number, number]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.material.trim()) {
      newErrors.material = 'El material es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.catalogNumber.trim()) {
      newErrors.catalogNumber = 'El número de catálogo es requerido';
    }
    if (!formData.fieldworkSessionId) {
      newErrors.fieldworkSessionId = 'Debe seleccionar un trabajo de campo';
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
              {initialData ? 'Editar Hallazgo' : 'Nuevo Hallazgo'}
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
                {context.fieldworkSessionName && (
                  <p><strong>Trabajo de Campo:</strong> {context.fieldworkSessionName}</p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Básica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Hallazgo *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Punta de proyectil lanceolada"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Hallazgo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="artifact">Artefacto</option>
                    <option value="feature">Estructura/Elemento</option>
                    <option value="ecofact">Ecofacto</option>
                    <option value="structure">Estructura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <Input
                    type="text"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="Ej: Sílex, Arcilla, Hueso"
                    className={errors.material ? 'border-red-500' : ''}
                  />
                  {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Catálogo *
                  </label>
                  <Input
                    type="text"
                    value={formData.catalogNumber}
                    onChange={(e) => handleInputChange('catalogNumber', e.target.value)}
                    placeholder="Ej: ART-001, FEAT-001"
                    className={errors.catalogNumber ? 'border-red-500' : ''}
                  />
                  {errors.catalogNumber && <p className="text-red-500 text-sm mt-1">{errors.catalogNumber}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción detallada del hallazgo"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Sección 2: Ubicación y Contexto */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Ubicación y Contexto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitud
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.coordinates[0]}
                    onChange={(e) => handleCoordinateChange(0, parseFloat(e.target.value))}
                    placeholder="Ej: -34.6037"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.coordinates[1]}
                    onChange={(e) => handleCoordinateChange(1, parseFloat(e.target.value))}
                    placeholder="Ej: -58.3816"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profundidad (m)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', parseFloat(e.target.value))}
                    placeholder="Ej: 0.5"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contexto de Hallazgo
                </label>
                <Input
                  type="text"
                  value={formData.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  placeholder="Ej: Estrato 2, Cuadrícula A3"
                />
              </div>
            </div>

            {/* Sección 3: Dimensiones y Estado */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📏 Dimensiones y Estado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largo (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.length || ''}
                    onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value))}
                    placeholder="Ej: 8.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.width || ''}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
                    placeholder="Ej: 2.3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alto (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.height || ''}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
                    placeholder="Ej: 0.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diámetro (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.diameter || ''}
                    onChange={(e) => handleDimensionChange('diameter', parseFloat(e.target.value))}
                    placeholder="Ej: 1.2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    placeholder="Ej: 15.2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de Conservación
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Fragmentado">Fragmentado</option>
                    <option value="Deteriorado">Deteriorado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección 4: Asociaciones */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔗 Asociaciones</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hallazgos Asociados
                </label>
                {formData.associations.map((association, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={association}
                      onChange={(e) => handleArrayChange('associations', index, e.target.value)}
                      placeholder="Ej: ART-002, FEAT-001"
                      className="flex-1"
                    />
                    {formData.associations.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem('associations', index)}
                        className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                      >
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem('associations')}
                  className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                >
                  + Agregar Asociación
                </Button>
              </div>
            </div>

            {/* Sección 5: Documentación */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Documentación</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos
                  </label>
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={photo}
                        onChange={(e) => handleArrayChange('photos', index, e.target.value)}
                        placeholder="URL o ruta de la foto"
                        className="flex-1"
                      />
                      {formData.photos.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('photos', index)}
                          className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('photos')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    + Agregar Foto
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dibujos
                  </label>
                  {formData.drawings.map((drawing, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={drawing}
                        onChange={(e) => handleArrayChange('drawings', index, e.target.value)}
                        placeholder="URL o ruta del dibujo"
                        className="flex-1"
                      />
                      {formData.drawings.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeArrayItem('drawings', index)}
                          className="px-3 py-2 bg-red-500 text-white hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem('drawings')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    + Agregar Dibujo
                  </Button>
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
                {initialData ? 'Actualizar' : 'Crear'} Hallazgo
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default FindingForm; 