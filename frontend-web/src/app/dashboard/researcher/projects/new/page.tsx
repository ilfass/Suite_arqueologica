'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import { createProject, getSites } from '../../../../../lib/projectApi';

interface ProjectForm {
  name: string;
  description: string;
  methodology: string;
  objectives: string[];
  start_date: string;
  end_date: string;
  budget: number;
  team_size: number;
  director: string;
  site_id: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
}

interface Site {
  id: string;
  name: string;
  location: string;
}

// 1. NUEVOS TIPOS PARA ÁREA
interface AreaForm {
  id?: string;
  name: string;
  countries: string[];
  provinces: string[];
  latitude?: string;
  longitude?: string;
  size?: string;
  size_unit?: string;
  description?: string;
}

const NewProjectPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<ProjectForm>({
    name: '',
    description: '',
    methodology: '',
    objectives: [''],
    start_date: '',
    end_date: '',
    budget: 0,
    team_size: 1,
    director: user?.full_name || '',
    site_id: '',
    status: 'planning'
  });

  // 2. AGREGAR ESTADO PARA ÁREAS Y MODAL
  const [areas, setAreas] = useState<AreaForm[]>([]); // Áreas existentes
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]); // IDs de áreas seleccionadas
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [newArea, setNewArea] = useState<AreaForm>({
    name: '',
    countries: [],
    provinces: [],
    latitude: '',
    longitude: '',
    size: '',
    size_unit: 'hectares',
    description: ''
  });

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setSitesLoading(true);
        const sitesData = await getSites();
        setSites(sitesData);
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Error al cargar los sitios arqueológicos');
      } finally {
        setSitesLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleInputChange = (field: keyof ProjectForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...form.objectives];
    newObjectives[index] = value;
    setForm(prev => ({ ...prev, objectives: newObjectives }));
  };

  const addObjective = () => {
    setForm(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  };

  const removeObjective = (index: number) => {
    if (form.objectives.length > 1) {
      const newObjectives = form.objectives.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, objectives: newObjectives }));
    }
  };

  // 3. HANDLERS PARA ÁREAS
  const handleAreaInputChange = (field: keyof AreaForm, value: any) => {
    setNewArea(prev => ({ ...prev, [field]: value }));
  };
  const handleAddArea = () => {
    if (!newArea.name.trim()) return;
    const id = `${newArea.name}-${Date.now()}`;
    setAreas(prev => [...prev, { ...newArea, id }]);
    setSelectedAreas(prev => [...prev, id]);
    setNewArea({ name: '', countries: [], provinces: [], latitude: '', longitude: '', size: '', size_unit: 'hectares', description: '' });
    setShowAreaModal(false);
  };
  const handleSelectAreas = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedAreas(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filtrar objetivos vacíos
      const filteredObjectives = form.objectives.filter(obj => obj.trim() !== '');

      // Preparar el array de áreas para el backend
      const areasPayload = selectedAreas.map(id => {
        // Buscar si es un área nueva (no tiene UUID)
        const areaObj = areas.find(a => a.id === id);
        if (areaObj && (!id.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i))) {
          // Es un área nueva (no UUID v4)
          const { id, ...rest } = areaObj;
          return rest;
        }
        // Si es un área existente, solo enviar el ID
        return id;
      });

      const projectData = {
        ...form,
        objectives: filteredObjectives,
        budget: parseFloat(form.budget.toString()),
        team_size: parseInt(form.team_size.toString()),
        areas: areasPayload
      };

      await createProject(projectData);

      alert('Proyecto creado exitosamente');
      router.push('/dashboard/researcher/projects');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Error al crear el proyecto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  if (sitesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sitios arqueológicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Proyecto Arqueológico</h1>
              <p className="text-gray-600">Crear un nuevo proyecto de investigación</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/researcher/projects')}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="text-red-600">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Información básica */}
            <Card title="Información Básica del Proyecto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <Input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Excavación del Templo Mayor - Temporada 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe el proyecto, su contexto histórico y objetivos principales..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metodología *
                  </label>
                  <textarea
                    value={form.methodology}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    placeholder="Describe la metodología de excavación, documentación y análisis..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Objetivos */}
            <Card title="Objetivos del Proyecto">
              <div className="space-y-4">
                {form.objectives.map((objective, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objetivo ${index + 1}`}
                      className="flex-1"
                    />
                    {form.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addObjective}
                  className="w-full"
                >
                  ➕ Agregar Objetivo
                </Button>
              </div>
            </Card>

            {/* Fechas y Presupuesto */}
            <Card title="Fechas y Presupuesto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presupuesto (MXN) *
                  </label>
                  <Input
                    type="number"
                    value={form.budget}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño del Equipo *
                  </label>
                  <Input
                    type="number"
                    value={form.team_size}
                    onChange={(e) => handleInputChange('team_size', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>

              {calculateDuration() > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Duración del proyecto: <strong>{calculateDuration()} días</strong>
                  </p>
                </div>
              )}
            </Card>

            {/* Equipo y Sitio */}
            <Card title="Equipo y Sitio Arqueológico">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Director del Proyecto *
                  </label>
                  <Input
                    type="text"
                    value={form.director}
                    onChange={(e) => handleInputChange('director', e.target.value)}
                    placeholder="Nombre completo del director"
                    required
                  />
                </div>

                {/* Quitar selección de sitio arqueológico del formulario */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Arqueológico *
                  </label>
                  <select
                    value={form.site_id}
                    onChange={(e) => handleInputChange('site_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar sitio arqueológico</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name} - {site.location}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Áreas o Regiones */}
                <Card title="Áreas o Regiones del Proyecto">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecciona una o más áreas/regiones *
                    </label>
                    <select
                      multiple
                      value={selectedAreas}
                      onChange={handleSelectAreas}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      size={Math.max(3, areas.length)}
                    >
                      {areas.length === 0 && <option disabled>No hay áreas/region registradas</option>}
                      {areas.map(area => (
                        <option key={area.id} value={area.id}>{area.name} ({area.countries.join(', ')})</option>
                      ))}
                    </select>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAreaModal(true)}>
                      ➕ Crear nueva área/región
                    </Button>
                    {/* Modal para crear nueva área */}
                    {showAreaModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                          <h2 className="text-lg font-bold mb-4">Nueva Área/Región</h2>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                              <Input value={newArea.name} onChange={e => handleAreaInputChange('name', e.target.value)} required />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">País(es) *</label>
                              <Input value={newArea.countries.join(', ')} onChange={e => handleAreaInputChange('countries', e.target.value.split(',').map((s: string) => s.trim()))} placeholder="Ej: Argentina, Uruguay" required />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Provincia(s)/Estado(s) *</label>
                              <Input value={newArea.provinces.join(', ')} onChange={e => handleAreaInputChange('provinces', e.target.value.split(',').map((s: string) => s.trim()))} placeholder="Ej: Buenos Aires, Entre Ríos" required />
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                                <Input value={newArea.latitude} onChange={e => handleAreaInputChange('latitude', e.target.value)} placeholder="Ej: -38.1234" />
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                                <Input value={newArea.longitude} onChange={e => handleAreaInputChange('longitude', e.target.value)} placeholder="Ej: -61.5678" />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                                <Input value={newArea.size} onChange={e => handleAreaInputChange('size', e.target.value)} placeholder="Ej: 1500" />
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                                <select value={newArea.size_unit} onChange={e => handleAreaInputChange('size_unit', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                  <option value="hectares">Hectáreas</option>
                                  <option value="acres">Acres</option>
                                  <option value="m2">m²</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                              <textarea value={newArea.description} onChange={e => handleAreaInputChange('description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={2} />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => setShowAreaModal(false)}>Cancelar</Button>
                            <Button type="button" onClick={handleAddArea}>Agregar Área</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado Inicial
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planning">Planificación</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/researcher/projects')}
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
                  'Crear Proyecto'
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewProjectPage; 