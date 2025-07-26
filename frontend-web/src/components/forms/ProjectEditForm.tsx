'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ProjectFormData {
  name: string;
  code: string;
  description: string;
  projectType: string;
  customProjectType: string;
  chronologicalPeriod: string;
  customChronologicalPeriod: string;
  status: string;
  customStatus: string;
  
  // Ubicación
  countries: string[];
  states: string[];
  municipalities: string[];
  areas: string[];
  latitude: string;
  longitude: string;
  geographicContext: string;
  
  // Objetivos y metodología
  objectives: string;
  methodology: string;
  excavationTechniques: string[];
  documentationTechniques: string[];
  
  // Equipo
  director: string;
  coDirector: string;
  team: string;
  institutions: string;
  
  // Cronograma y presupuesto
  startDate: string;
  endDate: string;
  duration: string;
  budget: string;
  currency: string;
  
  // Permisos
  permits: string[];
  permitNumbers: string;
  
  // Conservación
  conservationPlan: string;
  materialManagement: string;
  
  // Difusión
  disseminationPlan: string;
  publications: string;
  events: string;
}

interface ProjectEditFormProps {
  project: ProjectFormData;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false
}) => {
  // Estados para opciones personalizadas
  const [showCustomProjectType, setShowCustomProjectType] = useState(false);
  const [showCustomChronologicalPeriod, setShowCustomChronologicalPeriod] = useState(false);
  const [showCustomStatus, setShowCustomStatus] = useState(false);
  
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

  const [formData, setFormData] = useState<ProjectFormData>(project);

  // Actualizar formData cuando cambie el proyecto
  useEffect(() => {
    setFormData(project);
  }, [project]);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof ProjectFormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentArray, value]);
    } else {
      handleInputChange(field, currentArray.filter(item => item !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">✏️ Editar Proyecto Arqueológico</h3>
              <p className="text-sm text-gray-600 mt-1">
                Modificar información del proyecto: {project.name}
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
                  Nombre del Proyecto *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Proyecto Arqueológico Valle del Cauca"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Proyecto
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Ej: PAVC-2024-001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Proyecto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del proyecto, objetivos principales, contexto histórico, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Proyecto *
                </label>
                <div className="space-y-2">
                  <select 
                    value={formData.projectType}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomProjectType(true);
                      } else {
                        setShowCustomProjectType(false);
                        handleInputChange('projectType', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="excavation">Excavación Arqueológica</option>
                    <option value="survey">Prospección Arqueológica</option>
                    <option value="conservation">Conservación y Restauración</option>
                    <option value="analysis">Análisis de Laboratorio</option>
                    <option value="documentation">Documentación y Registro</option>
                    <option value="monitoring">Monitoreo Arqueológico</option>
                    <option value="custom">➕ Agregar tipo personalizado</option>
                  </select>
                  {showCustomProjectType && (
                    <Input
                      value={formData.customProjectType}
                      onChange={(e) => handleInputChange('customProjectType', e.target.value)}
                      placeholder="Escribir tipo de proyecto personalizado"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Proyecto
                </label>
                <div className="space-y-2">
                  <select 
                    value={formData.status}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomStatus(true);
                      } else {
                        setShowCustomStatus(false);
                        handleInputChange('status', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planning">Planificación</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="suspended">Suspendido</option>
                    <option value="prospection">En Prospección</option>
                    <option value="excavation">En Excavación</option>
                    <option value="analysis">En Análisis</option>
                    <option value="publication">En Publicación</option>
                    <option value="custom">Otro</option>
                  </select>
                  {showCustomStatus && (
                    <Input
                      value={formData.customStatus}
                      onChange={(e) => handleInputChange('customStatus', e.target.value)}
                      placeholder="Escribir estado personalizado"
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. UBICACIÓN Y CONTEXTO GEOGRÁFICO */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              2. 🌍 Ubicación y Contexto Geográfico
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Áreas/Regiones
                </label>
                <div className="space-y-2">
                  <Input
                    placeholder="Escribir área/región y presionar Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.areas.includes(value)) {
                          handleInputChange('areas', [...formData.areas, value]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="w-full"
                  />
                  {formData.areas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.areas.map((area, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                          {area}
                          <button
                            type="button"
                            onClick={() => handleInputChange('areas', formData.areas.filter((_, i) => i !== index))}
                            className="ml-2 text-orange-600 hover:text-orange-800"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud
                </label>
                <Input
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Ej: 19.6925"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud
                </label>
                <Input
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="Ej: -98.8439"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contexto Geográfico
              </label>
              <textarea
                value={formData.geographicContext}
                onChange={(e) => handleInputChange('geographicContext', e.target.value)}
                placeholder="Descripción del contexto geográfico, topografía, clima, recursos naturales, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 3. OBJETIVOS Y METODOLOGÍA */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              3. 🎯 Objetivos y Metodología
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos del Proyecto *
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="Objetivos específicos del proyecto, preguntas de investigación, hipótesis, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metodología
              </label>
              <textarea
                value={formData.methodology}
                onChange={(e) => handleInputChange('methodology', e.target.value)}
                placeholder="Descripción detallada de la metodología: técnicas de excavación, prospección, registro, análisis de materiales, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Técnicas de Excavación
                </label>
                <div className="space-y-2">
                  {['Excavación estratigráfica', 'Excavación por cuadrícula', 'Excavación por niveles arbitrarios', 'Excavación de rescate', 'Prospección sistemática'].map((technique) => (
                    <label key={technique} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.excavationTechniques.includes(technique)}
                        onChange={(e) => handleCheckboxChange('excavationTechniques', technique, e.target.checked)}
                      />
                      {technique}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Técnicas de Documentación
                </label>
                <div className="space-y-2">
                  {['Fotografía arqueológica', 'Dibujo arqueológico', 'Fotogrametría', 'Escaneo 3D', 'GPS diferencial', 'SIG'].map((technique) => (
                    <label key={technique} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.documentationTechniques.includes(technique)}
                        onChange={(e) => handleCheckboxChange('documentationTechniques', technique, e.target.checked)}
                      />
                      {technique}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. EQUIPO DE TRABAJO */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              4. 👥 Equipo de Trabajo
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director del Proyecto *
                </label>
                <Input
                  value={formData.director}
                  onChange={(e) => handleInputChange('director', e.target.value)}
                  placeholder="Nombre completo del director"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Director
                </label>
                <Input
                  value={formData.coDirector}
                  onChange={(e) => handleInputChange('coDirector', e.target.value)}
                  placeholder="Nombre completo del co-director"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipo de Trabajo
              </label>
              <textarea
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                placeholder="Lista de miembros del equipo, roles, especialidades, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instituciones Participantes
              </label>
              <textarea
                value={formData.institutions}
                onChange={(e) => handleInputChange('institutions', e.target.value)}
                placeholder="Instituciones académicas, gubernamentales, privadas, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 5. CRONOGRAMA Y PRESUPUESTO */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              5. 📅 Cronograma y Presupuesto
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Finalización
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ej: 24 meses"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presupuesto
                </label>
                <Input
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Ej: 50000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select 
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                  <option value="BRL">BRL - Real Brasileño</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. PERMISOS Y AUTORIZACIONES */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              6. 📋 Permisos y Autorizaciones
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de Permisos Requeridos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['Permiso de excavación', 'Permiso de prospección', 'Autorización ambiental', 'Permiso de exportación'].map((permit) => (
                    <label key={permit} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.permits.includes(permit)}
                        onChange={(e) => handleCheckboxChange('permits', permit, e.target.checked)}
                      />
                      {permit}
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Permiso de investigación', 'Autorización de acceso', 'Permiso de muestreo', 'Autorización de publicación'].map((permit) => (
                    <label key={permit} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.permits.includes(permit)}
                        onChange={(e) => handleCheckboxChange('permits', permit, e.target.checked)}
                      />
                      {permit}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Números de Permisos
              </label>
              <textarea
                value={formData.permitNumbers}
                onChange={(e) => handleInputChange('permitNumbers', e.target.value)}
                placeholder="Números de permisos otorgados, fechas de emisión, instituciones emisoras, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 7. CONSERVACIÓN Y GESTIÓN */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              7. 🛡️ Conservación y Gestión
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Conservación
              </label>
              <textarea
                value={formData.conservationPlan}
                onChange={(e) => handleInputChange('conservationPlan', e.target.value)}
                placeholder="Plan de conservación de materiales, medidas de protección, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestión de Materiales
              </label>
              <textarea
                value={formData.materialManagement}
                onChange={(e) => handleInputChange('materialManagement', e.target.value)}
                placeholder="Plan de gestión de materiales arqueológicos, almacenamiento, catalogación, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 8. DIFUSIÓN Y PUBLICACIONES */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              8. 📚 Difusión y Publicaciones
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan de Difusión
              </label>
              <textarea
                value={formData.disseminationPlan}
                onChange={(e) => handleInputChange('disseminationPlan', e.target.value)}
                placeholder="Plan de difusión de resultados, actividades de divulgación, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publicaciones Previstas
              </label>
              <textarea
                value={formData.publications}
                onChange={(e) => handleInputChange('publications', e.target.value)}
                placeholder="Publicaciones previstas, artículos, libros, informes, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eventos y Presentaciones
              </label>
              <textarea
                value={formData.events}
                onChange={(e) => handleInputChange('events', e.target.value)}
                placeholder="Eventos, congresos, presentaciones, exposiciones, etc."
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
                className="bg-blue-600 hover:bg-blue-700"
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

export default ProjectEditForm; 