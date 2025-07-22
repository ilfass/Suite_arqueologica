'use client';

import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Finding {
  id: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'other';
  coordinates: [number, number];
  depth: number;
  description: string;
  date_found: string;
  catalog_number?: string;
}

interface FindingFormProps {
  finding?: Finding | null;
  onSave: (finding: Finding) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const FindingForm: React.FC<FindingFormProps> = ({
  finding,
  onSave,
  onCancel,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    type: 'ceramic' as Finding['type'],
    coordinates: [19.4326, -99.1332] as [number, number],
    depth: 0,
    description: '',
    date_found: new Date().toISOString().split('T')[0],
    catalog_number: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (finding) {
      setFormData({
        type: finding.type,
        coordinates: finding.coordinates,
        depth: finding.depth,
        description: finding.description,
        date_found: finding.date_found,
        catalog_number: finding.catalog_number || ''
      });
    } else {
      setFormData({
        type: 'ceramic',
        coordinates: [19.4326, -99.1332],
        depth: 0,
        description: '',
        date_found: new Date().toISOString().split('T')[0],
        catalog_number: ''
      });
    }
    setErrors({});
  }, [finding]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.depth < 0) {
      newErrors.depth = 'La profundidad debe ser mayor o igual a 0';
    }

    if (formData.coordinates[0] < -90 || formData.coordinates[0] > 90) {
      newErrors.latitude = 'La latitud debe estar entre -90 y 90';
    }

    if (formData.coordinates[1] < -180 || formData.coordinates[1] > 180) {
      newErrors.longitude = 'La longitud debe estar entre -180 y 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const findingData: Finding = {
      id: finding?.id || `finding-${Date.now()}`,
      type: formData.type,
      coordinates: formData.coordinates,
      depth: formData.depth,
      description: formData.description,
      date_found: formData.date_found,
      catalog_number: formData.catalog_number || undefined
    };

    onSave(findingData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCoordinateChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newCoordinates = [...formData.coordinates] as [number, number];
      newCoordinates[index] = numValue;
      setFormData(prev => ({
        ...prev,
        coordinates: newCoordinates
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {finding ? 'Editar Hallazgo' : 'Agregar Nuevo Hallazgo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de hallazgo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Hallazgo
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as Finding['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ceramic">Cerámica</option>
              <option value="lithic">Lítico</option>
              <option value="bone">Óseo</option>
              <option value="metal">Metal</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitud
              </label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates[0]}
                onChange={(e) => handleCoordinateChange(0, e.target.value)}
                placeholder="19.4326"
                className={errors.latitude ? 'border-red-500' : ''}
              />
              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud
              </label>
              <Input
                type="number"
                step="any"
                value={formData.coordinates[1]}
                onChange={(e) => handleCoordinateChange(1, e.target.value)}
                placeholder="-99.1332"
                className={errors.longitude ? 'border-red-500' : ''}
              />
              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
              )}
            </div>
          </div>

          {/* Profundidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profundidad (metros)
            </label>
            <Input
              type="number"
              step="0.1"
              value={formData.depth}
              onChange={(e) => handleInputChange('depth', parseFloat(e.target.value))}
              placeholder="0.0"
              className={errors.depth ? 'border-red-500' : ''}
            />
            {errors.depth && (
              <p className="text-red-500 text-xs mt-1">{errors.depth}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el hallazgo encontrado..."
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Fecha de hallazgo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Hallazgo
            </label>
            <Input
              type="date"
              value={formData.date_found}
              onChange={(e) => handleInputChange('date_found', e.target.value)}
            />
          </div>

          {/* Número de catálogo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Catálogo (opcional)
            </label>
            <Input
              type="text"
              value={formData.catalog_number}
              onChange={(e) => handleInputChange('catalog_number', e.target.value)}
              placeholder="CER-001"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {finding ? 'Actualizar' : 'Guardar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindingForm; 