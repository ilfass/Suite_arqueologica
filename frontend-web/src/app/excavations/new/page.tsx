'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../lib/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewExcavationPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    excavation_code: '',
    site_id: '',
    name: '',
    description: '',
    objectives: [''],
    research_questions: [''],
    methodology: '',
    excavation_strategy: '',
    start_date: '',
    end_date: '',
    planned_duration: '',
    season_number: '',
    team_leader: '',
    external_collaborators: [''],
    institutions_involved: [''],
    excavation_area: '',
    area_unit: 'm2',
    grid_system: '',
    depth_excavated: '',
    depth_unit: 'cm',
    excavation_method: '',
    stratigraphic_recording: true,
    three_dimensional_recording: false,
    sampling_strategy: '',
    sieving_methods: [''],
    findings_summary: '',
    objects_recovered: '',
    features_identified: [''],
    structures_discovered: [''],
    human_remains: false,
    faunal_remains: false,
    botanical_remains: false,
    field_notes: true,
    photographic_documentation: true,
    video_documentation: false,
    drawings_created: true,
    mapping_completed: false,
    laboratory_analysis_planned: [''],
    dating_samples_collected: '',
    conservation_treatments_applied: [''],
    status: 'planned' as const,
    progress_percentage: '',
    budget_allocated: '',
    budget_currency: 'MXN',
    equipment_used: [''],
    permits_obtained: false,
    permit_numbers: [''],
    permit_expiry_date: '',
    landowner_permission: false,
    notes: ''
  });

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sitesData = await apiClient.getSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };

    fetchSites();
  }, []);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar datos para enviar
      const excavationData = {
        ...formData,
        planned_duration: formData.planned_duration ? parseInt(formData.planned_duration) : undefined,
        season_number: formData.season_number ? parseInt(formData.season_number) : undefined,
        excavation_area: formData.excavation_area ? parseFloat(formData.excavation_area) : undefined,
        depth_excavated: formData.depth_excavated ? parseFloat(formData.depth_excavated) : undefined,
        objects_recovered: formData.objects_recovered ? parseInt(formData.objects_recovered) : undefined,
        dating_samples_collected: formData.dating_samples_collected ? parseInt(formData.dating_samples_collected) : undefined,
        progress_percentage: formData.progress_percentage ? parseInt(formData.progress_percentage) : undefined,
        budget_allocated: formData.budget_allocated ? parseFloat(formData.budget_allocated) : undefined,
        // Filtrar arrays vacíos
        objectives: (formData.objectives as string[]).filter(obj => obj.trim() !== ''),
        research_questions: (formData.research_questions as string[]).filter(q => q.trim() !== ''),
        external_collaborators: (formData.external_collaborators as string[]).filter(c => c.trim() !== ''),
        institutions_involved: (formData.institutions_involved as string[]).filter(i => i.trim() !== ''),
        sieving_methods: (formData.sieving_methods as string[]).filter(s => s.trim() !== ''),
        features_identified: (formData.features_identified as string[]).filter(f => f.trim() !== ''),
        structures_discovered: (formData.structures_discovered as string[]).filter(s => s.trim() !== ''),
        laboratory_analysis_planned: (formData.laboratory_analysis_planned as string[]).filter(l => l.trim() !== ''),
        conservation_treatments_applied: (formData.conservation_treatments_applied as string[]).filter(c => c.trim() !== ''),
        equipment_used: (formData.equipment_used as string[]).filter(e => e.trim() !== ''),
        permit_numbers: (formData.permit_numbers as string[]).filter(p => p.trim() !== '')
      };

      await apiClient.createExcavation(excavationData);
      router.push('/excavations');
    } catch (error) {
      console.error('Error creating excavation:', error);
      alert('Error al crear la excavación. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Excavación</h1>
          <p className="text-gray-600">Planifica y registra una nueva excavación arqueológica</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Excavación *
                  </label>
                  <Input
                    type="text"
                    value={formData.excavation_code}
                    onChange={(e) => handleInputChange('excavation_code', e.target.value)}
                    placeholder="Ej: EXC-2024-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Arqueológico *
                  </label>
                  <select
                    value={formData.site_id}
                    onChange={(e) => handleInputChange('site_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar sitio</option>
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Excavación *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Excavación Templo Principal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planificada</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completada</option>
                    <option value="suspended">Suspendida</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe la excavación, su propósito y contexto"
                />
              </div>
            </div>

            {/* Cronología */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cronología</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración Planificada (días)
                  </label>
                  <Input
                    type="number"
                    value={formData.planned_duration}
                    onChange={(e) => handleInputChange('planned_duration', e.target.value)}
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Temporada
                  </label>
                  <Input
                    type="number"
                    value={formData.season_number}
                    onChange={(e) => handleInputChange('season_number', e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progreso (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) => handleInputChange('progress_percentage', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Equipo y colaboradores */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Equipo y Colaboradores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Líder del Equipo
                  </label>
                  <Input
                    type="text"
                    value={formData.team_leader}
                    onChange={(e) => handleInputChange('team_leader', e.target.value)}
                    placeholder="Dr. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instituciones Involucradas
                  </label>
                  {formData.institutions_involved.map((institution, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <Input
                        type="text"
                        value={institution}
                        onChange={(e) => handleArrayChange('institutions_involved', index, e.target.value)}
                        placeholder="Universidad Nacional"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('institutions_involved', index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('institutions_involved')}
                  >
                    Agregar Institución
                  </Button>
                </div>
              </div>
            </div>

            {/* Metodología */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Metodología</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metodología
                  </label>
                  <textarea
                    value={formData.methodology}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe la metodología de excavación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estrategia de Excavación
                  </label>
                  <textarea
                    value={formData.excavation_strategy}
                    onChange={(e) => handleInputChange('excavation_strategy', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe la estrategia de excavación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Excavación
                  </label>
                  <select
                    value={formData.excavation_method}
                    onChange={(e) => handleInputChange('excavation_method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar método</option>
                    <option value="open_area">Área abierta</option>
                    <option value="trench">Trinchera</option>
                    <option value="test_pit">Pozo de prueba</option>
                    <option value="step_trench">Trinchera escalonada</option>
                    <option value="box_grid">Cuadrícula</option>
                    <option value="quadrant">Cuadrante</option>
                    <option value="arbitrary_levels">Niveles arbitrarios</option>
                    <option value="natural_levels">Niveles naturales</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema de Cuadrícula
                  </label>
                  <Input
                    type="text"
                    value={formData.grid_system}
                    onChange={(e) => handleInputChange('grid_system', e.target.value)}
                    placeholder="Ej: 1x1m, 2x2m"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área de Excavación
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.excavation_area}
                      onChange={(e) => handleInputChange('excavation_area', e.target.value)}
                      placeholder="0.0"
                      className="flex-1"
                    />
                    <select
                      value={formData.area_unit}
                      onChange={(e) => handleInputChange('area_unit', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="m2">m²</option>
                      <option value="hectares">hectáreas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profundidad Excavada
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.depth_excavated}
                      onChange={(e) => handleInputChange('depth_excavated', e.target.value)}
                      placeholder="0.0"
                      className="flex-1"
                    />
                    <select
                      value={formData.depth_unit}
                      onChange={(e) => handleInputChange('depth_unit', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentación */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documentación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stratigraphic_recording}
                      onChange={(e) => handleInputChange('stratigraphic_recording', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Registro estratigráfico</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.three_dimensional_recording}
                      onChange={(e) => handleInputChange('three_dimensional_recording', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Registro tridimensional</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.field_notes}
                      onChange={(e) => handleInputChange('field_notes', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Notas de campo</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.photographic_documentation}
                      onChange={(e) => handleInputChange('photographic_documentation', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Documentación fotográfica</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.video_documentation}
                      onChange={(e) => handleInputChange('video_documentation', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Documentación en video</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.drawings_created}
                      onChange={(e) => handleInputChange('drawings_created', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Dibujos creados</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.mapping_completed}
                      onChange={(e) => handleInputChange('mapping_completed', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Mapeo completado</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Hallazgos */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hallazgos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resumen de Hallazgos
                  </label>
                  <textarea
                    value={formData.findings_summary}
                    onChange={(e) => handleInputChange('findings_summary', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe los hallazgos principales"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objetos Recuperados
                    </label>
                    <Input
                      type="number"
                                              value={formData.objects_recovered}
                        onChange={(e) => handleInputChange('objects_recovered', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.human_remains}
                        onChange={(e) => handleInputChange('human_remains', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Restos humanos</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.faunal_remains}
                        onChange={(e) => handleInputChange('faunal_remains', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Restos faunísticos</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.botanical_remains}
                        onChange={(e) => handleInputChange('botanical_remains', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Restos botánicos</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Presupuesto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Presupuesto y Recursos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presupuesto Asignado
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.budget_allocated}
                      onChange={(e) => handleInputChange('budget_allocated', e.target.value)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <select
                      value={formData.budget_currency}
                      onChange={(e) => handleInputChange('budget_currency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipamiento Utilizado
                  </label>
                  {formData.equipment_used.map((equipment, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <Input
                        type="text"
                        value={equipment}
                        onChange={(e) => handleArrayChange('equipment_used', index, e.target.value)}
                        placeholder="Ej: Pala, pincel, cámara"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('equipment_used', index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('equipment_used')}
                  >
                    Agregar Equipamiento
                  </Button>
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permisos y Autorizaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permits_obtained}
                      onChange={(e) => handleInputChange('permits_obtained', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Permisos obtenidos</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.landowner_permission}
                      onChange={(e) => handleInputChange('landowner_permission', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Permiso del propietario</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento de Permisos
                  </label>
                  <Input
                    type="date"
                    value={formData.permit_expiry_date}
                    onChange={(e) => handleInputChange('permit_expiry_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones adicionales, consideraciones especiales, etc."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/excavations')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Excavación'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewExcavationPage; 