'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

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
}

const ArtifactsPage: React.FC = () => {
  const { user } = useAuth();
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

  // Datos simulados de hallazgos arqueológicos de la región pampeana
  const mockArtifacts: Artifact[] = [
    {
      id: '1',
      name: 'Punta de Proyectil Bifacial',
      type: 'Arma',
      material: 'Sílex',
      period: 'Holoceno Tardío',
      location: 'Sitio La Laguna, Pampa Húmeda',
      coordinates: { lat: -34.6037, lng: -58.3816 },
      dimensions: { length: 4.2, width: 1.8, height: 0.3 },
      weight: 12.5,
      condition: 'Excelente',
      description: 'Punta de proyectil con retoque bifacial, posiblemente utilizada para caza de guanacos',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['2', '3'],
      excavationUnit: 'CU-01',
      stratigraphicUnit: 'SU-03',
      dateFound: '2024-01-15',
      foundBy: 'Dr. María González',
      status: 'Documentado'
    },
    {
      id: '2',
      name: 'Raspador de Cuarzo',
      type: 'Herramienta',
      material: 'Cuarzo',
      period: 'Holoceno Medio',
      location: 'Sitio Arroyo Seco, Pampa Seca',
      coordinates: { lat: -36.3216, lng: -60.2163 },
      dimensions: { length: 3.1, width: 2.4, height: 0.8 },
      weight: 8.2,
      condition: 'Bueno',
      description: 'Raspador para procesamiento de cueros y madera',
      photos: ['/api/placeholder/400/300'],
      relatedArtifacts: ['1'],
      excavationUnit: 'CU-02',
      stratigraphicUnit: 'SU-05',
      dateFound: '2024-01-14',
      foundBy: 'Lic. Carlos Ruiz',
      status: 'En Análisis'
    },
    {
      id: '3',
      name: 'Fragmento de Cerámica',
      type: 'Cerámica',
      material: 'Arcilla',
      period: 'Holoceno Tardío',
      location: 'Sitio Laguna de los Padres',
      coordinates: { lat: -37.9547, lng: -57.5874 },
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
      status: 'Restaurado'
    },
    {
      id: '4',
      name: 'Punta de Flecha',
      type: 'Arma',
      material: 'Obsidiana',
      period: 'Holoceno Tardío',
      location: 'Sitio Tandil, Sierras Pampeanas',
      coordinates: { lat: -37.3214, lng: -59.1332 },
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
      status: 'Documentado'
    },
    {
      id: '5',
      name: 'Molino de Piedra',
      type: 'Herramienta',
      material: 'Granito',
      period: 'Holoceno Medio',
      location: 'Sitio Mar Chiquita',
      coordinates: { lat: -37.7489, lng: -57.4444 },
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
      status: 'En Conservación'
    }
  ];

  useEffect(() => {
    setArtifacts(mockArtifacts);
    setFilteredArtifacts(mockArtifacts);
  }, []);

  useEffect(() => {
    let filtered = artifacts;
    
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
  }, [filters, artifacts]);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Inventario y catalogación de artefactos arqueológicos
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  📊 Exportar CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  📄 Exportar PDF
                </Button>
                <Button variant="primary">
                  ➕ Nuevo Hallazgo
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