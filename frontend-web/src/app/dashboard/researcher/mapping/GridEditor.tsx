'use client';

import React, { useState, useEffect } from 'react';
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
  status: 'planned' | 'active' | 'completed';
  findings_count: number;
  depth: number;
  area: number;
  notes?: string;
}

interface GridEditorProps {
  gridUnits: GridUnit[];
  onSave: (gridUnits: GridUnit[]) => void;
  onCancel: () => void;
  isOpen: boolean;
  onGridUnitsChange?: (gridUnits: GridUnit[]) => void; // Nueva prop para sincronizar
}

const GridEditor: React.FC<GridEditorProps> = ({
  gridUnits,
  onSave,
  onCancel,
  isOpen,
  onGridUnitsChange
}) => {
  const [units, setUnits] = useState<GridUnit[]>(gridUnits);
  const [editingUnit, setEditingUnit] = useState<GridUnit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUnits(gridUnits);
  }, [gridUnits]);

  const handleAddUnit = () => {
    const newUnit: GridUnit = {
      id: `grid-${Date.now()}`,
      code: '',
      coordinates: {
        north: 19.4326,
        south: 19.4325,
        east: -99.1332,
        west: -99.1333
      },
      status: 'planned',
      findings_count: 0,
      depth: 0,
      area: 100,
      notes: ''
    };
    setEditingUnit(newUnit);
    setShowForm(true);
  };

  const handleEditUnit = (unit: GridUnit) => {
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleDeleteUnit = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cuadrícula?')) {
      setIsLoading(true);
      try {
        // Llamar al backend para eliminar
        const response = await fetch(`/api/excavations/grid-units/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const updatedUnits = units.filter(unit => unit.id !== id);
          setUnits(updatedUnits);
          onGridUnitsChange?.(updatedUnits);
        } else {
          alert('Error al eliminar la cuadrícula');
        }
      } catch (error) {
        console.error('Error deleting grid unit:', error);
        alert('Error al eliminar la cuadrícula');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = (unit: GridUnit) => {
    const newErrors: Record<string, string> = {};

    if (!unit.code.trim()) {
      newErrors.code = 'El código es requerido';
    }

    if (unit.coordinates.north <= unit.coordinates.south) {
      newErrors.coordinates = 'La coordenada norte debe ser mayor que la sur';
    }

    if (unit.coordinates.east <= unit.coordinates.west) {
      newErrors.coordinates = 'La coordenada este debe ser mayor que la oeste';
    }

    if (unit.area <= 0) {
      newErrors.area = 'El área debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUnit = async (unit: GridUnit) => {
    if (!validateForm(unit)) {
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      if (editingUnit?.id && editingUnit.id.startsWith('grid-')) {
        // Es una nueva unidad, crear en el backend
        response = await fetch('http://localhost:4000/api/excavations/grid-units', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: unit.code,
            coordinates: unit.coordinates,
            status: unit.status,
            depth: unit.depth,
            area: unit.area,
            findings_count: unit.findings_count,
            notes: unit.notes
          }),
        });
      } else {
        // Actualizar unidad existente
        response = await fetch(`http://localhost:4000/api/excavations/grid-units/${unit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: unit.code,
            coordinates: unit.coordinates,
            status: unit.status,
            depth: unit.depth,
            area: unit.area,
            findings_count: unit.findings_count,
            notes: unit.notes
          }),
        });
      }

      if (response.ok) {
        const savedUnit = await response.json();
        
        if (editingUnit?.id && editingUnit.id.startsWith('grid-')) {
          // Agregar nueva unidad
          const updatedUnits = [...units, savedUnit];
          setUnits(updatedUnits);
          onGridUnitsChange?.(updatedUnits);
        } else {
          // Actualizar unidad existente
          const updatedUnits = units.map(u => u.id === unit.id ? savedUnit : u);
          setUnits(updatedUnits);
          onGridUnitsChange?.(updatedUnits);
        }

        setShowForm(false);
        setEditingUnit(null);
      } else {
        alert('Error al guardar la cuadrícula');
      }
    } catch (error) {
      console.error('Error saving grid unit:', error);
      alert('Error al guardar la cuadrícula');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingUnit(null);
    setErrors({});
  };

  const handleSaveAll = () => {
    onSave(units);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Planificada';
      case 'active': return 'Activa';
      case 'completed': return 'Completada';
      default: return 'Desconocida';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editor de Cuadrículas</h2>
          <div className="flex space-x-3">
            <Button onClick={handleAddUnit} disabled={isLoading}>
              ➕ Agregar Cuadrícula
            </Button>
            <Button onClick={handleSaveAll} disabled={isLoading}>
              💾 Guardar Cambios
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              ✕ Cerrar
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
            ⏳ Procesando cambios...
          </div>
        )}

        {/* Lista de cuadrículas */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Cuadrículas Existentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordenadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {unit.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                        {getStatusLabel(unit.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-xs">
                        N: {unit.coordinates.north.toFixed(6)}<br/>
                        S: {unit.coordinates.south.toFixed(6)}<br/>
                        E: {unit.coordinates.east.toFixed(6)}<br/>
                        O: {unit.coordinates.west.toFixed(6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.area} m²
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUnit(unit)}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={isLoading}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario de edición */}
        {showForm && editingUnit && (
          <GridUnitForm
            unit={editingUnit}
            onSave={handleSaveUnit}
            onCancel={handleCancelEdit}
            errors={errors}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

// Componente interno para el formulario de cuadrícula
interface GridUnitFormProps {
  unit: GridUnit;
  onSave: (unit: GridUnit) => void;
  onCancel: () => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

const GridUnitForm: React.FC<GridUnitFormProps> = ({
  unit,
  onSave,
  onCancel,
  errors,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<GridUnit>(unit);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoordinateChange = (coordinate: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordinate]: numValue
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Cuadrícula
          </label>
          <Input
            type="text"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            placeholder="A1"
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="text-red-500 text-xs mt-1">{errors.code}</p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as GridUnit['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="planned">Planificada</option>
            <option value="active">Activa</option>
            <option value="completed">Completada</option>
          </select>
        </div>

        {/* Coordenadas */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordenadas
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Norte</label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates.north}
                onChange={(e) => handleCoordinateChange('north', e.target.value)}
                placeholder="19.4326"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sur</label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates.south}
                onChange={(e) => handleCoordinateChange('south', e.target.value)}
                placeholder="19.4325"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Este</label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates.east}
                onChange={(e) => handleCoordinateChange('east', e.target.value)}
                placeholder="-99.1332"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Oeste</label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates.west}
                onChange={(e) => handleCoordinateChange('west', e.target.value)}
                placeholder="-99.1333"
              />
            </div>
          </div>
          {errors.coordinates && (
            <p className="text-red-500 text-xs mt-1">{errors.coordinates}</p>
          )}
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área (m²)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.area}
            onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
            placeholder="100"
            className={errors.area ? 'border-red-500' : ''}
          />
          {errors.area && (
            <p className="text-red-500 text-xs mt-1">{errors.area}</p>
          )}
        </div>

        {/* Profundidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profundidad Actual (m)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.depth}
            onChange={(e) => handleInputChange('depth', parseFloat(e.target.value))}
            placeholder="0.0"
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Notas sobre la cuadrícula..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default GridEditor; 