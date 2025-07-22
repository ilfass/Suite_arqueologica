'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface GridUnit {
  id: string;
  code: string;
  coordinates: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  status: 'planned' | 'active' | 'completed';
  depth: number;
  notes: string;
  created_at: string;
}

const GridMeasurementPage: React.FC = () => {
  const { user } = useAuth();
  const [gridUnits, setGridUnits] = useState<GridUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<GridUnit | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newUnit, setNewUnit] = useState({
    code: '',
    width: 1,
    height: 1,
    depth: 0,
    notes: ''
  });

  useEffect(() => {
    // Simular datos de cuadrículas
    setGridUnits([
      {
        id: '1',
        code: 'A1',
        coordinates: {
          north: 19.6915,
          south: 19.6914,
          east: -98.8441,
          west: -98.8442
        },
        dimensions: {
          width: 2,
          height: 2
        },
        status: 'active',
        depth: 0.5,
        notes: 'Cuadrícula en sector norte, hallazgos cerámicos',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        code: 'A2',
        coordinates: {
          north: 19.6914,
          south: 19.6913,
          east: -98.8441,
          west: -98.8442
        },
        dimensions: {
          width: 2,
          height: 2
        },
        status: 'planned',
        depth: 0,
        notes: 'Cuadrícula planificada para excavación',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        code: 'B1',
        coordinates: {
          north: 19.6915,
          south: 19.6914,
          east: -98.8442,
          west: -98.8443
        },
        dimensions: {
          width: 2,
          height: 2
        },
        status: 'completed',
        depth: 1.2,
        notes: 'Excavación completada, muro prehispánico encontrado',
        created_at: '2024-01-10T10:00:00Z'
      }
    ]);
  }, []);

  const handleCreateUnit = () => {
    if (!newUnit.code) return;

    const unit: GridUnit = {
      id: Date.now().toString(),
      code: newUnit.code,
      coordinates: {
        north: 19.6915,
        south: 19.6914,
        east: -98.8441,
        west: -98.8442
      },
      dimensions: {
        width: newUnit.width,
        height: newUnit.height
      },
      status: 'planned',
      depth: newUnit.depth,
      notes: newUnit.notes,
      created_at: new Date().toISOString()
    };

    setGridUnits([...gridUnits, unit]);
    setNewUnit({ code: '', width: 1, height: 1, depth: 0, notes: '' });
    setIsCreating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'active': return 'En Progreso';
      case 'planned': return 'Planificada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Medición de Cuadrícula
                </h1>
                <p className="mt-2 text-gray-600">
                  Crear y gestionar cuadrículas de excavación arqueológica
                </p>
              </div>
              <Button 
                variant="primary"
                onClick={() => setIsCreating(true)}
              >
                + Nueva Cuadrícula
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cuadrículas de Excavación</h2>
          
          {/* Grid Visualization */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualización de Cuadrícula</h3>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {Array.from({ length: 36 }, (_, i) => {
                  const row = Math.floor(i / 6) + 1;
                  const col = String.fromCharCode(65 + (i % 6));
                  const code = `${col}${row}`;
                  const unit = gridUnits.find(u => u.code === code);
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                        unit 
                          ? unit.status === 'completed' 
                            ? 'bg-green-500 text-white border-green-600' 
                            : unit.status === 'active'
                            ? 'bg-blue-500 text-white border-blue-600'
                            : 'bg-yellow-500 text-white border-yellow-600'
                          : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => unit && setSelectedUnit(unit)}
                    >
                      {code}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>Completada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span>En Progreso</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span>Planificada</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Grid Units List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lista de Cuadrículas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridUnits.map((unit) => (
              <Card key={unit.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{unit.code}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                      {getStatusLabel(unit.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dimensiones:</span>
                      <span className="font-medium">{unit.dimensions.width}m × {unit.dimensions.height}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Profundidad:</span>
                      <span className="font-medium">{unit.depth}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Área:</span>
                      <span className="font-medium">{unit.dimensions.width * unit.dimensions.height}m²</span>
                    </div>
                  </div>
                  
                  {unit.notes && (
                    <p className="text-sm text-gray-600 mb-4">{unit.notes}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedUnit(unit)}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/dashboard/researcher/grid-measurement/${unit.id}`}
                    >
                      Medir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Create New Unit Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Cuadrícula</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Cuadrícula
                    </label>
                    <Input
                      type="text"
                      value={newUnit.code}
                      onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value })}
                      placeholder="Ej: A1, B2, etc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ancho (m)
                      </label>
                      <Input
                        type="number"
                        value={newUnit.width}
                        onChange={(e) => setNewUnit({ ...newUnit, width: Number(e.target.value) })}
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alto (m)
                      </label>
                      <Input
                        type="number"
                        value={newUnit.height}
                        onChange={(e) => setNewUnit({ ...newUnit, height: Number(e.target.value) })}
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profundidad Inicial (m)
                    </label>
                    <Input
                      type="number"
                      value={newUnit.depth}
                      onChange={(e) => setNewUnit({ ...newUnit, depth: Number(e.target.value) })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={newUnit.notes}
                      onChange={(e) => setNewUnit({ ...newUnit, notes: e.target.value })}
                      placeholder="Observaciones sobre la cuadrícula..."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={handleCreateUnit}
                    disabled={!newUnit.code}
                  >
                    Crear Cuadrícula
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Selected Unit Details */}
        {selectedUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalles de Cuadrícula {selectedUnit.code}
                  </h3>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUnit(null)}
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUnit.status)}`}>
                          {getStatusLabel(selectedUnit.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dimensiones:</span>
                        <span>{selectedUnit.dimensions.width}m × {selectedUnit.dimensions.height}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Área:</span>
                        <span>{selectedUnit.dimensions.width * selectedUnit.dimensions.height}m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profundidad:</span>
                        <span>{selectedUnit.depth}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coordenadas GPS</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Norte:</span>
                        <span>{selectedUnit.coordinates.north}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sur:</span>
                        <span>{selectedUnit.coordinates.south}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Este:</span>
                        <span>{selectedUnit.coordinates.east}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Oeste:</span>
                        <span>{selectedUnit.coordinates.west}°</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedUnit.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-sm text-gray-600">{selectedUnit.notes}</p>
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = `/dashboard/researcher/grid-measurement/${selectedUnit.id}`}
                  >
                    Ir a Medición
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedUnit(null)}
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

export default GridMeasurementPage; 