'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface SurfaceFinding {
  id: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'other';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  size: {
    length?: number;
    width?: number;
    height?: number;
  };
  material: string;
  date_found: string;
  photos: string[];
  notes: string;
  catalog_number?: string;
}

const SurfaceMappingPage: React.FC = () => {
  const { user } = useAuth();
  const [findings, setFindings] = useState<SurfaceFinding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<SurfaceFinding | null>(null);
  const [isAddingFinding, setIsAddingFinding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newFinding, setNewFinding] = useState({
    type: 'ceramic' as const,
    description: '',
    condition: 'good' as const,
    material: '',
    notes: '',
    size: { length: 0, width: 0, height: 0 }
  });

  useEffect(() => {
    // Simular datos de hallazgos en superficie
    setFindings([
      {
        id: '1',
        type: 'ceramic',
        coordinates: {
          latitude: 19.6915,
          longitude: -98.8441
        },
        description: 'Fragmento de vasija con decoración incisa',
        condition: 'good',
        size: { length: 8, width: 6, height: 2 },
        material: 'Cerámica',
        date_found: '2024-01-15',
        photos: ['photo1.jpg', 'photo2.jpg'],
        notes: 'Encontrado en sector norte, cerca del muro',
        catalog_number: 'CER-001'
      },
      {
        id: '2',
        type: 'lithic',
        coordinates: {
          latitude: 19.6914,
          longitude: -98.8442
        },
        description: 'Punta de proyectil de obsidiana',
        condition: 'excellent',
        size: { length: 4, width: 2, height: 1 },
        material: 'Obsidiana',
        date_found: '2024-01-14',
        photos: ['photo3.jpg'],
        notes: 'Punta completa, excelente conservación',
        catalog_number: 'LIT-001'
      },
      {
        id: '3',
        type: 'bone',
        coordinates: {
          latitude: 19.6913,
          longitude: -98.8443
        },
        description: 'Fragmento de hueso trabajado',
        condition: 'fair',
        size: { length: 12, width: 3, height: 2 },
        material: 'Hueso',
        date_found: '2024-01-13',
        photos: ['photo4.jpg'],
        notes: 'Posible herramienta o adorno',
        catalog_number: 'BON-001'
      }
    ]);
  }, []);

  const handleAddFinding = () => {
    if (!newFinding.description || !newFinding.material) return;

    const finding: SurfaceFinding = {
      id: Date.now().toString(),
      type: newFinding.type,
      coordinates: {
        latitude: 19.6915 + (Math.random() - 0.5) * 0.001,
        longitude: -98.8441 + (Math.random() - 0.5) * 0.001
      },
      description: newFinding.description,
      condition: newFinding.condition,
      size: newFinding.size,
      material: newFinding.material,
      date_found: new Date().toISOString().split('T')[0],
      photos: [],
      notes: newFinding.notes,
      catalog_number: `${newFinding.type.toUpperCase()}-${String(findings.length + 1).padStart(3, '0')}`
    };

    setFindings([...findings, finding]);
    setNewFinding({
      type: 'ceramic',
      description: '',
      condition: 'good',
      material: '',
      notes: '',
      size: { length: 0, width: 0, height: 0 }
    });
    setIsAddingFinding(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ceramic': return '🏺';
      case 'lithic': return '🗿';
      case 'bone': return '🦴';
      case 'metal': return '⚔️';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ceramic': return 'Cerámica';
      case 'lithic': return 'Lítico';
      case 'bone': return 'Hueso';
      case 'metal': return 'Metal';
      default: return 'Otro';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Mala';
      default: return 'Desconocida';
    }
  };

  const filteredFindings = filter === 'all' 
    ? findings 
    : findings.filter(finding => finding.type === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mapeo de Superficie
                </h1>
                <p className="mt-2 text-gray-600">
                  Documentar y catalogar hallazgos en superficie
                </p>
              </div>
              <Button 
                variant="primary"
                onClick={() => setIsAddingFinding(true)}
              >
                + Nuevo Hallazgo
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
                    {findings.filter(f => f.type === 'ceramic').length}
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
                    {findings.filter(f => f.type === 'lithic').length}
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
                    {findings.filter(f => f.type === 'bone').length}
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
                    {findings.filter(f => f.type === 'metal').length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Todos ({findings.length})
                </Button>
                <Button 
                  variant={filter === 'ceramic' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('ceramic')}
                >
                  🏺 Cerámica ({findings.filter(f => f.type === 'ceramic').length})
                </Button>
                <Button 
                  variant={filter === 'lithic' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('lithic')}
                >
                  🗿 Lítico ({findings.filter(f => f.type === 'lithic').length})
                </Button>
                <Button 
                  variant={filter === 'bone' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('bone')}
                >
                  🦴 Hueso ({findings.filter(f => f.type === 'bone').length})
                </Button>
                <Button 
                  variant={filter === 'metal' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('metal')}
                >
                  ⚔️ Metal ({findings.filter(f => f.type === 'metal').length})
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Findings List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hallazgos en Superficie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFindings.map((finding) => (
              <Card key={finding.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(finding.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {finding.catalog_number}
                        </h3>
                        <p className="text-sm text-gray-600">{getTypeLabel(finding.type)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(finding.condition)}`}>
                      {getConditionLabel(finding.condition)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{finding.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Material:</span>
                      <span className="font-medium">{finding.material}</span>
                    </div>
                    {finding.size.length && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tamaño:</span>
                        <span className="font-medium">
                          {finding.size.length}×{finding.size.width}×{finding.size.height} cm
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fecha:</span>
                      <span className="font-medium">{finding.date_found}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fotos:</span>
                      <span className="font-medium">{finding.photos.length}</span>
                    </div>
                  </div>
                  
                  {finding.notes && (
                    <p className="text-sm text-gray-600 mb-4">{finding.notes}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedFinding(finding)}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/dashboard/researcher/surface-mapping/${finding.id}`}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add New Finding Modal */}
        {isAddingFinding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Hallazgo en Superficie</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Hallazgo
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newFinding.type}
                      onChange={(e) => setNewFinding({ ...newFinding, type: e.target.value as any })}
                    >
                      <option value="ceramic">🏺 Cerámica</option>
                      <option value="lithic">🗿 Lítico</option>
                      <option value="bone">🦴 Hueso</option>
                      <option value="metal">⚔️ Metal</option>
                      <option value="other">🔍 Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Conservación
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newFinding.condition}
                      onChange={(e) => setNewFinding({ ...newFinding, condition: e.target.value as any })}
                    >
                      <option value="excellent">Excelente</option>
                      <option value="good">Buena</option>
                      <option value="fair">Regular</option>
                      <option value="poor">Mala</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newFinding.description}
                    onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                    placeholder="Descripción detallada del hallazgo..."
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <Input
                    type="text"
                    value={newFinding.material}
                    onChange={(e) => setNewFinding({ ...newFinding, material: e.target.value })}
                    placeholder="Ej: Cerámica, Obsidiana, Hueso..."
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largo (cm)
                    </label>
                    <Input
                      type="number"
                      value={newFinding.size.length}
                      onChange={(e) => setNewFinding({ 
                        ...newFinding, 
                        size: { ...newFinding.size, length: Number(e.target.value) }
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
                      value={newFinding.size.width}
                      onChange={(e) => setNewFinding({ 
                        ...newFinding, 
                        size: { ...newFinding.size, width: Number(e.target.value) }
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
                      value={newFinding.size.height}
                      onChange={(e) => setNewFinding({ 
                        ...newFinding, 
                        size: { ...newFinding.size, height: Number(e.target.value) }
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
                    value={newFinding.notes}
                    onChange={(e) => setNewFinding({ ...newFinding, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={handleAddFinding}
                    disabled={!newFinding.description || !newFinding.material}
                  >
                    Agregar Hallazgo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsAddingFinding(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Selected Finding Details */}
        {selectedFinding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{getTypeIcon(selectedFinding.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedFinding.catalog_number}
                      </h3>
                      <p className="text-sm text-gray-600">{getTypeLabel(selectedFinding.type)}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFinding(null)}
                  >
                    Cerrar
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(selectedFinding.condition)}`}>
                          {getConditionLabel(selectedFinding.condition)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Material:</span>
                        <span>{selectedFinding.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha:</span>
                        <span>{selectedFinding.date_found}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fotos:</span>
                        <span>{selectedFinding.photos.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coordenadas GPS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Latitud:</span>
                        <span>{selectedFinding.coordinates.latitude}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Longitud:</span>
                        <span>{selectedFinding.coordinates.longitude}°</span>
                      </div>
                    </div>
                    
                    {selectedFinding.size.length && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Dimensiones</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Largo:</span>
                            <span>{selectedFinding.size.length} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ancho:</span>
                            <span>{selectedFinding.size.width} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Alto:</span>
                            <span>{selectedFinding.size.height} cm</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{selectedFinding.description}</p>
                </div>
                
                {selectedFinding.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-sm text-gray-600">{selectedFinding.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = `/dashboard/researcher/surface-mapping/${selectedFinding.id}`}
                  >
                    Editar Hallazgo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedFinding(null)}
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

export default SurfaceMappingPage; 