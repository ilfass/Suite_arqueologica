'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SiteFormData {
  name: string;
  alternativeNames: string[];
  description: string;
  projectId: string;
  areaId: string;
  siteType: string;
  customSiteType: string;
  chronologicalPeriod: string;
  customChronologicalPeriod: string;
  coordinates: {
    latitude: string;
    longitude: string;
    elevation: string;
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
    area: string;
  };
  archaeologicalFeatures: string[];
  materials: string[];
  conservationStatus: string;
  excavationHistory: string;
  currentCondition: string;
  threats: string[];
  protectionStatus: string;
  accessConditions: string;
  documentationLevel: string;
  priorityLevel: string;
  notes: string;
}

interface SiteEditFormProps {
  site: SiteFormData;
  onSubmit: (data: SiteFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  projectName: string;
  areaName: string;
}

const SiteEditForm: React.FC<SiteEditFormProps> = ({
  site,
  onSubmit,
  onCancel,
  loading = false,
  projectName,
  areaName
}) => {
  const [showCustomSiteType, setShowCustomSiteType] = useState(false);
  const [showCustomChronologicalPeriod, setShowCustomChronologicalPeriod] = useState(false);

  const [formData, setFormData] = useState<SiteFormData>(site);

  // Actualizar formData cuando cambie el sitio
  useEffect(() => {
    setFormData(site);
  }, [site]);

  const handleInputChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoordinateChange = (coordinate: keyof SiteFormData['coordinates'], value: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [coordinate]: value
      }
    }));
  };

  const handleDimensionChange = (dimension: keyof SiteFormData['dimensions'], value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const handleArrayInput = (field: keyof SiteFormData, value: string) => {
    if (value.trim() && !(formData[field] as string[]).includes(value.trim())) {
      handleInputChange(field, [...(formData[field] as string[]), value.trim()]);
    }
  };

  const handleArrayRemove = (field: keyof SiteFormData, index: number) => {
    handleInputChange(field, (formData[field] as string[]).filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (field: keyof SiteFormData, value: string, checked: boolean) => {
    if (checked) {
      handleInputChange(field, [...(formData[field] as string[]), value]);
    } else {
      handleInputChange(field, (formData[field] as string[]).filter(item => item !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">✏️ Editar Sitio/Yacimiento Arqueológico</h3>
              <p className="text-sm text-gray-600 mt-1">
                Proyecto: {projectName} | Área: {areaName} | Sitio: {site.name}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* 1. INFORMACIÓN BÁSICA */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              1. 📋 Información Básica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Sitio/Yacimiento *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Pirámide del Sol, Templo Mayor"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Prioridad
                </label>
                <select 
                  value={formData.priorityLevel}
                  onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar prioridad</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombres Alternativos
              </label>
              <div className="space-y-2">
                <Input
                  placeholder="Escribir nombre alternativo y presionar Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayInput('alternativeNames', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full"
                />
                {formData.alternativeNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.alternativeNames.map((name, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                        {name}
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('alternativeNames', index)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Sitio *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del sitio, características principales, función, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Sitio *
                </label>
                <div className="space-y-2">
                  <select 
                    value={formData.siteType}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomSiteType(true);
                      } else {
                        setShowCustomSiteType(false);
                        handleInputChange('siteType', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="piramide">Pirámide</option>
                    <option value="templo">Templo</option>
                    <option value="palacio">Palacio</option>
                    <option value="plaza">Plaza</option>
                    <option value="tumba">Tumba</option>
                    <option value="asentamiento">Asentamiento</option>
                    <option value="fortaleza">Fortaleza</option>
                    <option value="acueducto">Acueducto</option>
                    <option value="camino">Camino</option>
                    <option value="cantera">Cantera</option>
                    <option value="taller">Taller</option>
                    <option value="custom">➕ Agregar tipo personalizado</option>
                  </select>
                  {showCustomSiteType && (
                    <Input
                      value={formData.customSiteType}
                      onChange={(e) => handleInputChange('customSiteType', e.target.value)}
                      placeholder="Escribir tipo de sitio personalizado"
                      className="w-full"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período Cronológico
                </label>
                <div className="space-y-2">
                  <select 
                    value={formData.chronologicalPeriod}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomChronologicalPeriod(true);
                      } else {
                        setShowCustomChronologicalPeriod(false);
                        handleInputChange('chronologicalPeriod', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar período</option>
                    <option value="preceramic">Precerámico</option>
                    <option value="formative_early">Formativo Temprano</option>
                    <option value="formative_middle">Formativo Medio</option>
                    <option value="formative_late">Formativo Tardío</option>
                    <option value="regional_developments">Desarrollos Regionales</option>
                    <option value="inca_empire">Imperio Inca</option>
                    <option value="colonial">Período Colonial</option>
                    <option value="republican">Período Republicano</option>
                    <option value="medieval">Medieval</option>
                    <option value="roman">Período Romano</option>
                    <option value="iberian">Período Ibérico</option>
                    <option value="custom">➕ Agregar período personalizado</option>
                  </select>
                  {showCustomChronologicalPeriod && (
                    <Input
                      value={formData.customChronologicalPeriod}
                      onChange={(e) => handleInputChange('customChronologicalPeriod', e.target.value)}
                      placeholder="Escribir período cronológico personalizado"
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. UBICACIÓN Y DIMENSIONES */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              2. 📍 Ubicación y Dimensiones
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud *
                </label>
                <Input
                  value={formData.coordinates.latitude}
                  onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                  placeholder="Ej: 19.6925"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud *
                </label>
                <Input
                  value={formData.coordinates.longitude}
                  onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                  placeholder="Ej: -98.8439"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elevación (m)
                </label>
                <Input
                  value={formData.coordinates.elevation}
                  onChange={(e) => handleCoordinateChange('elevation', e.target.value)}
                  placeholder="Ej: 2300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensiones
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Largo (m)</label>
                  <Input
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ancho (m)</label>
                  <Input
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Alto (m)</label>
                  <Input
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Área (m²)</label>
                  <Input
                    value={formData.dimensions.area}
                    onChange={(e) => handleDimensionChange('area', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. CARACTERÍSTICAS ARQUEOLÓGICAS */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              3. 🏺 Características Arqueológicas
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elementos Arqueológicos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['Muros', 'Pisos', 'Escaleras', 'Columnas', 'Pilastras', 'Nichos'].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.archaeologicalFeatures.includes(feature)}
                        onChange={(e) => handleCheckboxChange('archaeologicalFeatures', feature, e.target.checked)}
                      />
                      {feature}
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Fogones', 'Enterramientos', 'Ollas', 'Canaletas', 'Drenajes', 'Almacenes'].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.archaeologicalFeatures.includes(feature)}
                        onChange={(e) => handleCheckboxChange('archaeologicalFeatures', feature, e.target.checked)}
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materiales Principales
              </label>
              <div className="space-y-2">
                <Input
                  placeholder="Escribir material y presionar Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleArrayInput('materials', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full"
                />
                {formData.materials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                        {material}
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('materials', index)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. ESTADO Y CONSERVACIÓN */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              4. 🛡️ Estado y Conservación
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Conservación
                </label>
                <select 
                  value={formData.conservationStatus}
                  onChange={(e) => handleInputChange('conservationStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="excelente">Excelente</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="deteriorado">Deteriorado</option>
                  <option value="crítico">Crítico</option>
                  <option value="destruido">Destruido</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Actual
                </label>
                <select 
                  value={formData.currentCondition}
                  onChange={(e) => handleInputChange('currentCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar condición</option>
                  <option value="excavado">Excavado</option>
                  <option value="parcialmente_excavado">Parcialmente excavado</option>
                  <option value="no_excavado">No excavado</option>
                  <option value="restaurado">Restaurado</option>
                  <option value="en_restauracion">En restauración</option>
                  <option value="cubierto">Cubierto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenazas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['Erosión', 'Inundaciones', 'Incendios', 'Vandalismo', 'Turismo no controlado'].map((threat) => (
                    <label key={threat} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.threats.includes(threat)}
                        onChange={(e) => handleCheckboxChange('threats', threat, e.target.checked)}
                      />
                      {threat}
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Desarrollo urbano', 'Agricultura', 'Ganadería', 'Minería', 'Construcción'].map((threat) => (
                    <label key={threat} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.threats.includes(threat)}
                        onChange={(e) => handleCheckboxChange('threats', threat, e.target.checked)}
                      />
                      {threat}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Protección
                </label>
                <select 
                  value={formData.protectionStatus}
                  onChange={(e) => handleInputChange('protectionStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar protección</option>
                  <option value="protegido">Protegido</option>
                  <option value="parcialmente_protegido">Parcialmente protegido</option>
                  <option value="no_protegido">No protegido</option>
                  <option value="en_proceso">En proceso de protección</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condiciones de Acceso
                </label>
                <select 
                  value={formData.accessConditions}
                  onChange={(e) => handleInputChange('accessConditions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar acceso</option>
                  <option value="fácil">Fácil</option>
                  <option value="moderado">Moderado</option>
                  <option value="difícil">Difícil</option>
                  <option value="muy_difícil">Muy difícil</option>
                  <option value="inaccesible">Inaccesible</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. HISTORIA Y DOCUMENTACIÓN */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              5. 📚 Historia y Documentación
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historia de Excavación
              </label>
              <textarea
                value={formData.excavationHistory}
                onChange={(e) => handleInputChange('excavationHistory', e.target.value)}
                placeholder="Historia de excavaciones previas, fechas, arqueólogos responsables, hallazgos principales, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Documentación
              </label>
              <select 
                value={formData.documentationLevel}
                onChange={(e) => handleInputChange('documentationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar nivel</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="pobre">Pobre</option>
                <option value="sin_documentacion">Sin documentación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales, observaciones especiales, recomendaciones, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </form>

        {/* BOTONES DE ACCIÓN */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              * Campos obligatorios
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={() => onSubmit(formData)} 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Guardando...' : '💾 Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteEditForm; 