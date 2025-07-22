'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Artifact {
  id: string;
  catalog_number: string;
  name: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'textile' | 'wood' | 'other';
  category: string;
  material: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    thickness?: number;
    diameter?: number;
  };
  weight?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'fragmentary';
  discovery_location: {
    latitude: number;
    longitude: number;
    depth?: number;
    context?: string;
  };
  discovery_date: string;
  description: string;
  function_hypothesis?: string;
  cultural_period?: string;
  photos: string[];
  drawings: string[];
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const ArtifactDocumentationPage: React.FC = () => {
  const { user } = useAuth();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isAddingArtifact, setIsAddingArtifact] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newArtifact, setNewArtifact] = useState({
    name: '',
    type: 'ceramic' as const,
    category: '',
    material: '',
    condition: 'good' as const,
    description: '',
    function_hypothesis: '',
    cultural_period: '',
    notes: '',
    dimensions: { length: 0, width: 0, height: 0, thickness: 0, diameter: 0 },
    weight: 0
  });

  useEffect(() => {
    // Simular datos de artefactos
    setArtifacts([
      {
        id: '1',
        catalog_number: 'ART-001',
        name: 'Vasija Cerámica Decorada',
        type: 'ceramic',
        category: 'Vasija',
        material: 'Cerámica',
        dimensions: { length: 15, width: 12, height: 8, thickness: 0.5 },
        weight: 250,
        condition: 'good',
        discovery_location: {
          latitude: 19.6915,
          longitude: -98.8441,
          depth: 0.5,
          context: 'Cuadrícula A1, Nivel 2'
        },
        discovery_date: '2024-01-15',
        description: 'Vasija globular con decoración incisa en el cuello',
        function_hypothesis: 'Almacenamiento de líquidos',
        cultural_period: 'Clásico Tardío',
        photos: ['photo1.jpg', 'photo2.jpg'],
        drawings: ['drawing1.jpg'],
        notes: 'Fragmento de vasija con decoración geométrica',
        created_by: 'researcher1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        catalog_number: 'ART-002',
        name: 'Punta de Proyectil',
        type: 'lithic',
        category: 'Herramienta',
        material: 'Obsidiana',
        dimensions: { length: 4, width: 2, height: 0.5 },
        weight: 15,
        condition: 'excellent',
        discovery_location: {
          latitude: 19.6914,
          longitude: -98.8442,
          depth: 0.3,
          context: 'Cuadrícula B1, Superficie'
        },
        discovery_date: '2024-01-14',
        description: 'Punta de proyectil bifacial con retoque fino',
        function_hypothesis: 'Caza o guerra',
        cultural_period: 'Preclásico',
        photos: ['photo3.jpg'],
        drawings: ['drawing2.jpg'],
        notes: 'Punta completa, excelente conservación',
        created_by: 'researcher1',
        created_at: '2024-01-14T10:00:00Z',
        updated_at: '2024-01-14T10:00:00Z'
      },
      {
        id: '3',
        catalog_number: 'ART-003',
        name: 'Fragmento de Hueso Trabajado',
        type: 'bone',
        category: 'Adorno',
        material: 'Hueso',
        dimensions: { length: 8, width: 2, height: 1 },
        weight: 25,
        condition: 'fair',
        discovery_location: {
          latitude: 19.6913,
          longitude: -98.8443,
          depth: 0.8,
          context: 'Cuadrícula C1, Nivel 3'
        },
        discovery_date: '2024-01-13',
        description: 'Fragmento de hueso con perforaciones decorativas',
        function_hypothesis: 'Adorno personal',
        cultural_period: 'Clásico',
        photos: ['photo4.jpg'],
        drawings: ['drawing3.jpg'],
        notes: 'Posible parte de un collar o pulsera',
        created_by: 'researcher1',
        created_at: '2024-01-13T10:00:00Z',
        updated_at: '2024-01-13T10:00:00Z'
      }
    ]);
  }, []);

  const handleAddArtifact = () => {
    if (!newArtifact.name || !newArtifact.material) return;

    const artifact: Artifact = {
      id: Date.now().toString(),
      catalog_number: `ART-${String(artifacts.length + 1).padStart(3, '0')}`,
      name: newArtifact.name,
      type: newArtifact.type,
      category: newArtifact.category,
      material: newArtifact.material,
      dimensions: newArtifact.dimensions,
      weight: newArtifact.weight,
      condition: newArtifact.condition,
      discovery_location: {
        latitude: 19.6915 + (Math.random() - 0.5) * 0.001,
        longitude: -98.8441 + (Math.random() - 0.5) * 0.001,
        depth: Math.random() * 2,
        context: 'Cuadrícula A1'
      },
      discovery_date: new Date().toISOString().split('T')[0],
      description: newArtifact.description,
      function_hypothesis: newArtifact.function_hypothesis,
      cultural_period: newArtifact.cultural_period,
      photos: [],
      drawings: [],
      notes: newArtifact.notes,
      created_by: user?.id || 'researcher1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setArtifacts([...artifacts, artifact]);
    setNewArtifact({
      name: '',
      type: 'ceramic',
      category: '',
      material: '',
      condition: 'good',
      description: '',
      function_hypothesis: '',
      cultural_period: '',
      notes: '',
      dimensions: { length: 0, width: 0, height: 0, thickness: 0, diameter: 0 },
      weight: 0
    });
    setIsAddingArtifact(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ceramic': return '🏺';
      case 'lithic': return '🗿';
      case 'bone': return '🦴';
      case 'metal': return '⚔️';
      case 'textile': return '🧵';
      case 'wood': return '🪵';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ceramic': return 'Cerámica';
      case 'lithic': return 'Lítico';
      case 'bone': return 'Hueso';
      case 'metal': return 'Metal';
      case 'textile': return 'Textil';
      case 'wood': return 'Madera';
      default: return 'Otro';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      case 'fragmentary': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Mala';
      case 'fragmentary': return 'Fragmentario';
      default: return 'Desconocida';
    }
  };

  const filteredArtifacts = artifacts
    .filter(artifact => filter === 'all' || artifact.type === filter)
    .filter(artifact => 
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.catalog_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.material.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Documentación de Artefactos
                </h1>
                <p className="mt-2 text-gray-600">
                  Catalogar y registrar artefactos arqueológicos
                </p>
              </div>
              <Button 
                variant="primary"
                onClick={() => setIsAddingArtifact(true)}
              >
                + Nuevo Artefacto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🏺</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cerámica</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {artifacts.filter(a => a.type === 'ceramic').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🗿</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Lítico</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {artifacts.filter(a => a.type === 'lithic').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🦴</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Hueso</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {artifacts.filter(a => a.type === 'bone').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚔️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Metal</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {artifacts.filter(a => a.type === 'metal').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar Artefactos
                  </label>
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, catálogo o material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Tipo
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Todos los Tipos</option>
                    <option value="ceramic">🏺 Cerámica</option>
                    <option value="lithic">🗿 Lítico</option>
                    <option value="bone">🦴 Hueso</option>
                    <option value="metal">⚔️ Metal</option>
                    <option value="textile">🧵 Textil</option>
                    <option value="wood">🪵 Madera</option>
                    <option value="other">🔍 Otro</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Artifacts List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artefactos Catalogados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtifacts.map((artifact) => (
              <Card key={artifact.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(artifact.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {artifact.catalog_number}
                        </h3>
                        <p className="text-sm text-gray-600">{artifact.name}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(artifact.condition)}`}>
                      {getConditionLabel(artifact.condition)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium">{getTypeLabel(artifact.type)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Material:</span>
                      <span className="font-medium">{artifact.material}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Categoría:</span>
                      <span className="font-medium">{artifact.category}</span>
                    </div>
                    {artifact.weight && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Peso:</span>
                        <span className="font-medium">{artifact.weight}g</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fotos:</span>
                      <span className="font-medium">{artifact.photos.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dibujos:</span>
                      <span className="font-medium">{artifact.drawings.length}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{artifact.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedArtifact(artifact)}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/dashboard/researcher/artifact-documentation/${artifact.id}`}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add New Artifact Modal */}
        {isAddingArtifact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Artefacto</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Artefacto
                    </label>
                    <Input
                      type="text"
                      value={newArtifact.name}
                      onChange={(e) => setNewArtifact({ ...newArtifact, name: e.target.value })}
                      placeholder="Ej: Vasija Cerámica Decorada"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newArtifact.type}
                      onChange={(e) => setNewArtifact({ ...newArtifact, type: e.target.value as any })}
                    >
                      <option value="ceramic">🏺 Cerámica</option>
                      <option value="lithic">🗿 Lítico</option>
                      <option value="bone">🦴 Hueso</option>
                      <option value="metal">⚔️ Metal</option>
                      <option value="textile">🧵 Textil</option>
                      <option value="wood">🪵 Madera</option>
                      <option value="other">🔍 Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <Input
                      type="text"
                      value={newArtifact.category}
                      onChange={(e) => setNewArtifact({ ...newArtifact, category: e.target.value })}
                      placeholder="Ej: Vasija, Herramienta, Adorno..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <Input
                      type="text"
                      value={newArtifact.material}
                      onChange={(e) => setNewArtifact({ ...newArtifact, material: e.target.value })}
                      placeholder="Ej: Cerámica, Obsidiana, Hueso..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Conservación
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newArtifact.condition}
                      onChange={(e) => setNewArtifact({ ...newArtifact, condition: e.target.value as any })}
                    >
                      <option value="excellent">Excelente</option>
                      <option value="good">Buena</option>
                      <option value="fair">Regular</option>
                      <option value="poor">Mala</option>
                      <option value="fragmentary">Fragmentario</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (gramos)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.weight}
                      onChange={(e) => setNewArtifact({ ...newArtifact, weight: Number(e.target.value) })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newArtifact.description}
                    onChange={(e) => setNewArtifact({ ...newArtifact, description: e.target.value })}
                    placeholder="Descripción detallada del artefacto..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hipótesis de Función
                    </label>
                    <Input
                      type="text"
                      value={newArtifact.function_hypothesis}
                      onChange={(e) => setNewArtifact({ ...newArtifact, function_hypothesis: e.target.value })}
                      placeholder="Ej: Almacenamiento, Caza, Adorno..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período Cultural
                    </label>
                    <Input
                      type="text"
                      value={newArtifact.cultural_period}
                      onChange={(e) => setNewArtifact({ ...newArtifact, cultural_period: e.target.value })}
                      placeholder="Ej: Clásico, Preclásico..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largo (cm)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.dimensions.length}
                      onChange={(e) => setNewArtifact({ 
                        ...newArtifact, 
                        dimensions: { ...newArtifact.dimensions, length: Number(e.target.value) }
                      })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ancho (cm)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.dimensions.width}
                      onChange={(e) => setNewArtifact({ 
                        ...newArtifact, 
                        dimensions: { ...newArtifact.dimensions, width: Number(e.target.value) }
                      })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alto (cm)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.dimensions.height}
                      onChange={(e) => setNewArtifact({ 
                        ...newArtifact, 
                        dimensions: { ...newArtifact.dimensions, height: Number(e.target.value) }
                      })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grosor (cm)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.dimensions.thickness}
                      onChange={(e) => setNewArtifact({ 
                        ...newArtifact, 
                        dimensions: { ...newArtifact.dimensions, thickness: Number(e.target.value) }
                      })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diámetro (cm)
                    </label>
                    <Input
                      type="number"
                      value={newArtifact.dimensions.diameter}
                      onChange={(e) => setNewArtifact({ 
                        ...newArtifact, 
                        dimensions: { ...newArtifact.dimensions, diameter: Number(e.target.value) }
                      })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionales
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newArtifact.notes}
                    onChange={(e) => setNewArtifact({ ...newArtifact, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={handleAddArtifact}
                    disabled={!newArtifact.name || !newArtifact.material}
                  >
                    Agregar Artefacto
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsAddingArtifact(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Selected Artifact Details */}
        {selectedArtifact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{getTypeIcon(selectedArtifact.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedArtifact.catalog_number}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedArtifact.name}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedArtifact(null)}
                  >
                    Cerrar
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tipo:</span>
                        <span>{getTypeLabel(selectedArtifact.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categoría:</span>
                        <span>{selectedArtifact.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Material:</span>
                        <span>{selectedArtifact.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(selectedArtifact.condition)}`}>
                          {getConditionLabel(selectedArtifact.condition)}
                        </span>
                      </div>
                      {selectedArtifact.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Peso:</span>
                          <span>{selectedArtifact.weight}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contexto de Hallazgo</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha:</span>
                        <span>{selectedArtifact.discovery_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profundidad:</span>
                        <span>{selectedArtifact.discovery_location.depth}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contexto:</span>
                        <span>{selectedArtifact.discovery_location.context}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fotos:</span>
                        <span>{selectedArtifact.photos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dibujos:</span>
                        <span>{selectedArtifact.drawings.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedArtifact.dimensions.length && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Dimensiones</h4>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Largo:</span>
                        <span>{selectedArtifact.dimensions.length} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ancho:</span>
                        <span>{selectedArtifact.dimensions.width} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Alto:</span>
                        <span>{selectedArtifact.dimensions.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Grosor:</span>
                        <span>{selectedArtifact.dimensions.thickness} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Diámetro:</span>
                        <span>{selectedArtifact.dimensions.diameter} cm</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{selectedArtifact.description}</p>
                </div>
                
                {selectedArtifact.function_hypothesis && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Hipótesis de Función</h4>
                    <p className="text-sm text-gray-600">{selectedArtifact.function_hypothesis}</p>
                  </div>
                )}
                
                {selectedArtifact.cultural_period && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Período Cultural</h4>
                    <p className="text-sm text-gray-600">{selectedArtifact.cultural_period}</p>
                  </div>
                )}
                
                {selectedArtifact.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-sm text-gray-600">{selectedArtifact.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = `/dashboard/researcher/artifact-documentation/${selectedArtifact.id}`}
                  >
                    Editar Artefacto
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedArtifact(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactDocumentationPage; 