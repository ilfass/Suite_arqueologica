'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import ContextBanner from '../../../../components/ui/ContextBanner';
import useInvestigatorContext from '../../../../hooks/useInvestigatorContext';
import { useRouter } from 'next/navigation';

interface Artifact {
  id: string;
  name: string;
  type: string;
  material: string;
  period: string;
  location: string;
  coordinates: { lat: number; lng: number };
  dimensions: { length: number; width: number; height: number };
  weight: number;
  condition: string;
  description: string;
  photos: string[];
  relatedArtifacts: string[];
  excavationUnit: string;
  stratigraphicUnit: string;
  dateFound: string;
  foundBy: string;
  status: string;
  projectId: string;
  areaId: string;
  siteId: string;
}

const ArtifactsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    material: '',
    period: '',
    condition: '',
    status: ''
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

  // Datos simulados de hallazgos arqueológicos de la región pampeana con contexto
  const mockArtifacts: Artifact[] = [
    // Proyecto 1 - Laguna La Brava
    {
      id: '1',
      name: 'Punta de Proyectil Cola de Pescado',
      type: 'Arma',
      material: 'Sílex',
      period: 'Holoceno Tardío',
      location: 'Sitio Laguna La Brava Norte',
      coordinates: { lat: -38.1234, lng: -61.5678 },
      dimensions: { length: 4.2, width: 1.8, height: 0.3 },
      weight: 12.5,
      condition: 'Excelente',
      description: 'Punta de proyectil tipo Cola de Pescado, retoque bifacial, base cóncava',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['2', '3'],
      excavationUnit: 'CU-01',
      stratigraphicUnit: 'SU-03',
      dateFound: '2024-01-15',
      foundBy: 'Dr. Pérez',
      status: 'Documentado',
      projectId: '1',
      areaId: '1',
      siteId: '1'
    },
    {
      id: '2',
      name: 'Raspador de Cuarzo',
      type: 'Herramienta',
      material: 'Cuarzo',
      period: 'Holoceno Medio',
      location: 'Sitio Laguna La Brava Norte',
      coordinates: { lat: -38.1235, lng: -61.5679 },
      dimensions: { length: 3.1, width: 2.4, height: 0.8 },
      weight: 8.2,
      condition: 'Bueno',
      description: 'Raspador para procesamiento de cueros y madera',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['1'],
      excavationUnit: 'CU-02',
      stratigraphicUnit: 'SU-05',
      dateFound: '2024-01-14',
      foundBy: 'Dr. Pérez',
      status: 'En Análisis',
      projectId: '1',
      areaId: '1',
      siteId: '1'
    },
    {
      id: '3',
      name: 'Fragmento de Cerámica',
      type: 'Cerámica',
      material: 'Arcilla',
      period: 'Holoceno Tardío',
      location: 'Sitio Laguna La Brava Norte',
      coordinates: { lat: -38.1236, lng: -61.5680 },
      dimensions: { length: 6.8, width: 5.2, height: 0.4 },
      weight: 15.3,
      condition: 'Regular',
      description: 'Fragmento de vasija con decoración incisa',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['4'],
      excavationUnit: 'CU-03',
      stratigraphicUnit: 'SU-02',
      dateFound: '2024-01-13',
      foundBy: 'Dra. Ana Martínez',
      status: 'Restaurado',
      projectId: '1',
      areaId: '1',
      siteId: '1'
    },
    // Proyecto 2 - Arroyo Seco
    {
      id: '4',
      name: 'Punta de Flecha',
      type: 'Arma',
      material: 'Obsidiana',
      period: 'Holoceno Tardío',
      location: 'Sitio Arroyo Seco',
      coordinates: { lat: -38.2345, lng: -61.6789 },
      dimensions: { length: 2.8, width: 1.2, height: 0.2 },
      weight: 3.1,
      condition: 'Excelente',
      description: 'Punta de flecha pequeña para caza menor',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['1'],
      excavationUnit: 'CU-04',
      stratigraphicUnit: 'SU-01',
      dateFound: '2024-01-12',
      foundBy: 'Dr. Roberto Silva',
      status: 'Documentado',
      projectId: '1',
      areaId: '2',
      siteId: '2'
    },
    // Proyecto 3 - Monte Hermoso
    {
      id: '5',
      name: 'Molino de Piedra',
      type: 'Herramienta',
      material: 'Granito',
      period: 'Holoceno Medio',
      location: 'Sitio Monte Hermoso',
      coordinates: { lat: -38.3456, lng: -61.7890 },
      dimensions: { length: 25.0, width: 18.0, height: 8.0 },
      weight: 4500.0,
      condition: 'Bueno',
      description: 'Molino para procesamiento de semillas y granos',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: [],
      excavationUnit: 'CU-05',
      stratigraphicUnit: 'SU-04',
      dateFound: '2024-01-11',
      foundBy: 'Lic. Patricia López',
      status: 'En Conservación',
      projectId: '2',
      areaId: '3',
      siteId: '3'
    }
  ];

  useEffect(() => {
    setArtifacts(mockArtifacts);
    setFilteredArtifacts(mockArtifacts);
  }, []);

  useEffect(() => {
    let filtered = artifacts;
    
    // Filtrar por contexto si está disponible
    if (hasContext && context.project && context.area && context.site) {
      filtered = filtered.filter(artifact => 
        artifact.projectId === context.project &&
        artifact.areaId === context.area &&
        artifact.siteId === context.site
      );
    }
    
    // Aplicar filtros adicionales
    if (filters.type) {
      filtered = filtered.filter(artifact => artifact.type === filters.type);
    }
    if (filters.material) {
      filtered = filtered.filter(artifact => artifact.material === filters.material);
    }
    if (filters.period) {
      filtered = filtered.filter(artifact => artifact.period === filters.period);
    }
    if (filters.condition) {
      filtered = filtered.filter(artifact => artifact.condition === filters.condition);
    }
    if (filters.status) {
      filtered = filtered.filter(artifact => artifact.status === filters.status);
    }
    
    setFilteredArtifacts(filtered);
  }, [filters, artifacts, hasContext, context]);

  const artifactTypes = [...new Set(artifacts.map(a => a.type))];
  const materials = [...new Set(artifacts.map(a => a.material))];
  const periods = [...new Set(artifacts.map(a => a.period))];
  const conditions = [...new Set(artifacts.map(a => a.condition))];
  const statuses = [...new Set(artifacts.map(a => a.status))];

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    // Simulación de exportación
    console.log(`Exportando en formato ${format}`);
    alert(`Exportación en formato ${format.toUpperCase()} iniciada`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Documentado': return 'bg-green-100 text-green-800';
      case 'En Análisis': return 'bg-yellow-100 text-yellow-800';
      case 'Restaurado': return 'bg-blue-100 text-blue-800';
      case 'En Conservación': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'bg-green-100 text-green-800';
      case 'Bueno': return 'bg-blue-100 text-blue-800';
      case 'Regular': return 'bg-yellow-100 text-yellow-800';
      case 'Pobre': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Arrays simulados para nombres de contexto
  const projects = [
    { id: '1', name: 'Proyecto Cazadores Recolectores - La Laguna' },
    { id: '2', name: 'Estudio de Poblamiento Pampeano' },
    { id: '3', name: 'Arqueología de la Llanura Bonaerense' }
  ];
  const areas = [
    { id: '1', name: 'Laguna La Brava', projectId: '1' },
    { id: '2', name: 'Arroyo Seco', projectId: '1' },
    { id: '3', name: 'Monte Hermoso', projectId: '2' }
  ];
  const sites = [
    { id: '1', name: 'Sitio Laguna La Brava Norte', areaId: '1' },
    { id: '2', name: 'Sitio Arroyo Seco', areaId: '2' },
    { id: '3', name: 'Sitio Monte Hermoso', areaId: '3' }
  ];

  const projectName = projects.find(p => p.id === context.project)?.name;
  const areaName = areas.find(a => a.id === context.area)?.name;
  const siteName = sites.find(s => s.id === context.site)?.name;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contexto...</p>
        </div>
      </div>
    );
  }

  if (!hasContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🧭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contexto Requerido</h2>
          <p className="text-gray-600 mb-6">
            Para ver los artefactos, primero debes seleccionar un contexto de trabajo en el dashboard.
          </p>
          <Button onClick={() => router.push('/dashboard/researcher')}>
            Ir al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      <ContextBanner
        project={context.project}
        area={context.area}
        site={context.site}
        projectName={projectName}
        areaName={areaName}
        siteName={siteName}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Hallazgos
                </h1>
                <p className="mt-2 text-gray-600">
                  Inventario y catalogación de artefactos arqueológicos en {siteName}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  📊 Exportar CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  📄 Exportar PDF
                </Button>
                <Button variant="primary" onClick={() => router.push('/dashboard/researcher/artifacts/new')}>
                  ➕ Nuevo Artefacto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">Todos los tipos</option>
              {artifactTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.material}
              onChange={(e) => setFilters({...filters, material: e.target.value})}
            >
              <option value="">Todos los materiales</option>
              {materials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.period}
              onChange={(e) => setFilters({...filters, period: e.target.value})}
            >
              <option value="">Todos los períodos</option>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.condition}
              onChange={(e) => setFilters({...filters, condition: e.target.value})}
            >
              <option value="">Todas las condiciones</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Todos los estados</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <Button variant="outline" onClick={() => setFilters({
              type: '', material: '', period: '', condition: '', status: ''
            })}>
              🔄 Limpiar
            </Button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              📋 Lista
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              🗂️ Cuadrícula
            </Button>
            <Button
              variant={viewMode === 'map' ? 'primary' : 'outline'}
              onClick={() => setViewMode('map')}
            >
              🗺️ Mapa
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredArtifacts.map((artifact) => (
              <Card key={artifact.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏺</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{artifact.name}</h3>
                        <p className="text-sm text-gray-600">{artifact.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {artifact.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {artifact.material}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(artifact.status)}`}>
                            {artifact.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(artifact.condition)}`}>
                            {artifact.condition}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <span>📍 {artifact.location}</span>
                          <span className="ml-4">📅 {artifact.dateFound}</span>
                          <span className="ml-4">👤 {artifact.foundBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        👁️ Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        ✏️ Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact) => (
              <Card key={artifact.id}>
                <div className="p-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🏺</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{artifact.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{artifact.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {artifact.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(artifact.status)}`}>
                      {artifact.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <div>📍 {artifact.location}</div>
                    <div>📅 {artifact.dateFound}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      👁️ Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      ✏️ Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'map' && (
          <Card>
            <div className="p-6">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <p className="text-gray-600">Mapa interactivo de hallazgos</p>
                  <p className="text-sm text-gray-500">Integración con Leaflet/Mapbox</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {filteredArtifacts.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <span className="text-6xl block mb-4">🔍</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron hallazgos</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArtifactsPage; 