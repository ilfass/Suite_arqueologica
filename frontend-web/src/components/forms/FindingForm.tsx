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
    projectId: context?.projectId || '',
    conservationTreatment: '',
    analyses: [],
    currentLocation: '',
    conservationNotes: '',
    associatedDocuments: []
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
    } else if (unifiedContext?.project_id) {
      // Usar contexto unificado si está disponible
      setFormData(prev => ({
        ...prev,
        projectId: unifiedContext?.project_id || '',
        areaId: unifiedContext?.area_id || '',
        siteId: unifiedContext?.site_id || ''
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

  // Funciones para manejar documentación asociada
  const addDocument = () => {
    const newDocument = {
      title: '',
      authorRole: 'author' as const,
      isPublished: false,
      publicationLink: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      associatedDocuments: [...prev.associatedDocuments, newDocument]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      associatedDocuments: prev.associatedDocuments.filter((_, i) => i !== index)
    }));
  };

  const updateDocument = (index: number, field: keyof FindingFormData['associatedDocuments'][0], value: any) => {
    setFormData(prev => ({
      ...prev,
      associatedDocuments: prev.associatedDocuments.map((doc, i) => 
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  if (!isOpen) return null;

  console.log('🔍 FindingForm renderizando con isOpen:', isOpen);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          width: '100%',
          maxWidth: '896px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
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
                    <option value="artifact">Artefacto (Objeto manufacturado)</option>
                    <option value="feature">Elemento/Feature (Estructura no móvil)</option>
                    <option value="ecofact">Ecofacto (Material orgánico no modificado)</option>
                    <option value="structure">Estructura (Construcción arquitectónica)</option>
                    <option value="sample">Muestra (Para análisis)</option>
                    <option value="human_remains">Restos Humanos</option>
                    <option value="faunal">Fauna</option>
                    <option value="floral">Flora</option>
                    <option value="geological">Geológico</option>
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

            {/* Sección 4.5: Análisis y Conservación */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔬 Análisis y Conservación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="excellent">Excelente - Sin alteraciones</option>
                    <option value="good">Bueno - Alteraciones menores</option>
                    <option value="fair">Regular - Alteraciones moderadas</option>
                    <option value="poor">Pobre - Alteraciones severas</option>
                    <option value="fragmentary">Fragmentario - Muy deteriorado</option>
                    <option value="unstable">Inestable - Requiere intervención</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tratamiento de Conservación
                  </label>
                  <select
                    value={formData.conservationTreatment || ''}
                    onChange={(e) => handleInputChange('conservationTreatment', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tratamiento</option>
                    <option value="none">Ninguno requerido</option>
                    <option value="cleaning">Limpieza básica</option>
                    <option value="consolidation">Consolidación</option>
                    <option value="restoration">Restauración</option>
                    <option value="stabilization">Estabilización</option>
                    <option value="specialized">Tratamiento especializado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Análisis Realizados
                  </label>
                  <div className="space-y-2">
                    {['Radiocarbono', 'Termoluminiscencia', 'Análisis de composición', 'Análisis de uso', 'Análisis de residuos', 'Análisis de ADN'].map((analysis) => (
                      <label key={analysis} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={formData.analyses?.includes(analysis) || false}
                          onChange={(e) => {
                            const currentAnalyses = formData.analyses || [];
                            if (e.target.checked) {
                              handleInputChange('analyses', [...currentAnalyses, analysis]);
                            } else {
                              handleInputChange('analyses', currentAnalyses.filter(a => a !== analysis));
                            }
                          }}
                        />
                        {analysis}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación Actual
                  </label>
                  <select
                    value={formData.currentLocation || ''}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar ubicación</option>
                    <option value="field">En campo</option>
                    <option value="laboratory">En laboratorio</option>
                    <option value="storage">En almacén</option>
                    <option value="museum">En museo</option>
                    <option value="exhibition">En exhibición</option>
                    <option value="loan">En préstamo</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas de Conservación
                </label>
                <textarea
                  value={formData.conservationNotes || ''}
                  onChange={(e) => handleInputChange('conservationNotes', e.target.value)}
                  placeholder="Notas específicas sobre conservación, tratamientos aplicados, recomendaciones futuras..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
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

            {/* Sección 6: Documentación Asociada */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">📚 Documentación Asociada</h3>
                <Button
                  type="button"
                  onClick={addDocument}
                  className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
                >
                  + Agregar Documento
                </Button>
              </div>
              
              {formData.associatedDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay documentos asociados</p>
                  <p className="text-sm">Haz clic en "Agregar Documento" para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.associatedDocuments.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-800">Documento {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕ Eliminar
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título del Documento *
                          </label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={(e) => updateDocument(index, 'title', e.target.value)}
                            placeholder="Título del artículo, informe, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tu Rol en el Documento
                          </label>
                          <select
                            value={doc.authorRole}
                            onChange={(e) => updateDocument(index, 'authorRole', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="author">Autor Principal</option>
                            <option value="coauthor">Co-autor</option>
                            <option value="other">Otro (especificar en notas)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={doc.isPublished}
                            onChange={(e) => updateDocument(index, 'isPublished', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            ¿Está publicado?
                          </span>
                        </label>
                      </div>
                      
                      {doc.isPublished && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enlace de Publicación
                          </label>
                          <input
                            type="url"
                            value={doc.publicationLink || ''}
                            onChange={(e) => updateDocument(index, 'publicationLink', e.target.value)}
                            placeholder="https://doi.org/... o URL de la publicación"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas Adicionales
                        </label>
                        <textarea
                          value={doc.notes || ''}
                          onChange={(e) => updateDocument(index, 'notes', e.target.value)}
                          placeholder="Información adicional sobre el documento, co-autores, revista, etc."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
      </div>
    </div>
  );
};

export default FindingForm; 