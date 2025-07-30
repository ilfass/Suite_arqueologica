'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AreaFormData {
  name: string;
  description: string;
  projectId: string;
  countries: string[];
  states: string[];
  municipalities: string[];
  coordinates: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  geographicContext: string;
  archaeologicalContext: string;
  environmentalContext: string;
  accessConditions: string;
  conservationStatus: string;
  researchHistory: string;
  currentThreats: string[];
  protectionMeasures: string;
  documentationLevel: string;
  priorityLevel: string;
  // Documentación asociada
  associatedDocuments: {
    title: string;
    authorRole: 'author' | 'coauthor' | 'other';
    isPublished: boolean;
    publicationLink?: string;
    notes?: string;
  }[];
}

interface AreaCreationFormProps {
  onSubmit: (data: AreaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  projectId: string;
  projectName: string;
}

const AreaCreationForm: React.FC<AreaCreationFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  projectId,
  projectName
}) => {
  // Lista completa de países del mundo
  const allCountries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
  ];

  const [formData, setFormData] = useState<AreaFormData>({
    name: '',
    description: '',
    projectId: projectId,
    countries: [],
    states: [],
    municipalities: [],
    coordinates: {
      north: '',
      south: '',
      east: '',
      west: ''
    },
    geographicContext: '',
    archaeologicalContext: '',
    environmentalContext: '',
    accessConditions: '',
    conservationStatus: '',
    researchHistory: '',
    currentThreats: [],
    protectionMeasures: '',
    documentationLevel: '',
    priorityLevel: '',
    associatedDocuments: []
  });

  const handleInputChange = (field: keyof AreaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoordinateChange = (coordinate: keyof AreaFormData['coordinates'], value: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [coordinate]: value
      }
    }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      handleInputChange('currentThreats', [...formData.currentThreats, value]);
    } else {
      handleInputChange('currentThreats', formData.currentThreats.filter(item => item !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

  const updateDocument = (index: number, field: keyof AreaFormData['associatedDocuments'][0], value: any) => {
    setFormData(prev => ({
      ...prev,
      associatedDocuments: prev.associatedDocuments.map((doc, i) => 
        i === index ? { ...doc, [field]: value } : doc
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">🌍 Crear Nueva Área/Región Arqueológica</h3>
              <p className="text-sm text-gray-600 mt-1">
                Proyecto: {projectName}
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
                  Nombre de la Área/Región *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Valle de Teotihuacán, Región Pampeana"
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
                Descripción de la Área/Región *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada de la área/región, características principales, extensión, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>
          </div>

          {/* 2. UBICACIÓN GEOGRÁFICA */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              2. 🌍 Ubicación Geográfica
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Países *
                </label>
                <div className="space-y-2">
                  <select 
                    onChange={(e) => {
                      if (e.target.value && !formData.countries.includes(e.target.value)) {
                        handleInputChange('countries', [...formData.countries, e.target.value]);
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar países (múltiples)</option>
                    {allCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {formData.countries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.countries.map((country, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {country}
                          <button
                            type="button"
                            onClick={() => handleInputChange('countries', formData.countries.filter((_, i) => i !== index))}
                            className="ml-2 text-blue-600 hover:text-blue-800"
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
                  Estados/Provincias
                </label>
                <div className="space-y-2">
                  <Input
                    placeholder="Escribir estado/provincia y presionar Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.states.includes(value)) {
                          handleInputChange('states', [...formData.states, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="w-full"
                  />
                  {formData.states.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.states.map((state, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {state}
                          <button
                            type="button"
                            onClick={() => handleInputChange('states', formData.states.filter((_, i) => i !== index))}
                            className="ml-2 text-green-600 hover:text-green-800"
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
                  Municipios/Ciudades
                </label>
                <div className="space-y-2">
                  <Input
                    placeholder="Escribir municipio/ciudad y presionar Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.municipalities.includes(value)) {
                          handleInputChange('municipalities', [...formData.municipalities, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="w-full"
                  />
                  {formData.municipalities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.municipalities.map((municipality, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          {municipality}
                          <button
                            type="button"
                            onClick={() => handleInputChange('municipalities', formData.municipalities.filter((_, i) => i !== index))}
                            className="ml-2 text-purple-600 hover:text-purple-800"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordenadas Geográficas (Límites del Área)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Norte</label>
                  <Input
                    value={formData.coordinates.north}
                    onChange={(e) => handleCoordinateChange('north', e.target.value)}
                    placeholder="Latitud"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sur</label>
                  <Input
                    value={formData.coordinates.south}
                    onChange={(e) => handleCoordinateChange('south', e.target.value)}
                    placeholder="Latitud"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Este</label>
                  <Input
                    value={formData.coordinates.east}
                    onChange={(e) => handleCoordinateChange('east', e.target.value)}
                    placeholder="Longitud"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Oeste</label>
                  <Input
                    value={formData.coordinates.west}
                    onChange={(e) => handleCoordinateChange('west', e.target.value)}
                    placeholder="Longitud"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. CONTEXTO ARQUEOLÓGICO */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              3. 🏛️ Contexto Arqueológico
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Arqueológico
              </label>
              <textarea
                value={formData.archaeologicalContext}
                onChange={(e) => handleInputChange('archaeologicalContext', e.target.value)}
                placeholder="Descripción del contexto arqueológico, tipos de sitios presentes, cronología, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historia de Investigación
              </label>
              <textarea
                value={formData.researchHistory}
                onChange={(e) => handleInputChange('researchHistory', e.target.value)}
                placeholder="Historia de investigaciones previas en la área, excavaciones realizadas, estudios publicados, etc."
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
          </div>

          {/* 4. CONTEXTO AMBIENTAL */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              4. 🌿 Contexto Ambiental
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Geográfico y Ambiental
              </label>
              <textarea
                value={formData.geographicContext}
                onChange={(e) => handleInputChange('geographicContext', e.target.value)}
                placeholder="Descripción del entorno geográfico, topografía, clima, vegetación, recursos hídricos, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Ambiental Específico
              </label>
              <textarea
                value={formData.environmentalContext}
                onChange={(e) => handleInputChange('environmentalContext', e.target.value)}
                placeholder="Condiciones ambientales específicas, ecosistemas, biodiversidad, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 5. CONSERVACIÓN Y AMENAZAS */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              5. 🛡️ Conservación y Amenazas
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenazas Actuales
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['Desarrollo urbano', 'Agricultura', 'Ganadería', 'Minería', 'Construcción de carreteras'].map((threat) => (
                    <label key={threat} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.currentThreats.includes(threat)}
                        onChange={(e) => handleCheckboxChange(threat, e.target.checked)}
                      />
                      {threat}
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Erosión', 'Inundaciones', 'Incendios', 'Vandalismo', 'Turismo no controlado'].map((threat) => (
                    <label key={threat} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.currentThreats.includes(threat)}
                        onChange={(e) => handleCheckboxChange(threat, e.target.checked)}
                      />
                      {threat}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medidas de Protección
              </label>
              <textarea
                value={formData.protectionMeasures}
                onChange={(e) => handleInputChange('protectionMeasures', e.target.value)}
                placeholder="Medidas de protección existentes o propuestas para la conservación del área"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Sección de Documentación Asociada */}
            <div className="border-t border-gray-200 pt-6 mt-6">
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
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Creando...' : '🌍 Crear Área/Región'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCreationForm; 