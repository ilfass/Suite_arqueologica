'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../lib/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewObjectPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<any[]>([]); // Changed ArchaeologicalSite to any[]
  const [formData, setFormData] = useState({
    catalog_number: '',
    site_id: '',
    name: '',
    object_type: '',
    primary_material: '',
    condition: 'good',
    description: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm'
    },
    weight: '',
    weight_unit: 'grams',
    discovery_date: '',
    stratigraphic_unit: '',
    depth: '',
    depth_unit: 'cm',
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar datos para enviar
      const artifactData = {
        ...formData,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined,
          unit: formData.dimensions.unit
        },
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        depth: formData.depth ? parseFloat(formData.depth) : undefined
      };

      await apiClient.createObject(artifactData);
      router.push('/objects');
    } catch (error) {
      console.error('Error creating object:', error);
      alert('Error al crear el objeto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Nuevo Objeto</h1>
          <p className="text-gray-600">Completa la información del objeto encontrado</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Catálogo *
                </label>
                <Input
                  type="text"
                  value={formData.catalog_number}
                  onChange={(e) => handleInputChange('catalog_number', e.target.value)}
                  placeholder="Ej: ART-2024-001"
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
                  Nombre del Objeto *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Máscara de Jade"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Objeto *
                </label>
                <select
                  value={formData.object_type}
                  onChange={(e) => handleInputChange('object_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="tool">Herramienta</option>
                  <option value="ceramic">Cerámica</option>
                  <option value="lithic">Lítico</option>
                  <option value="metal">Metal</option>
                  <option value="bone">Hueso</option>
                  <option value="shell">Concha</option>
                  <option value="wood">Madera</option>
                  <option value="textile">Textil</option>
                  <option value="leather">Cuero</option>
                  <option value="glass">Vidrio</option>
                  <option value="stone">Piedra</option>
                  <option value="jewelry">Joyería</option>
                  <option value="weapon">Arma</option>
                  <option value="ornament">Ornamento</option>
                  <option value="ritual_object">Objeto ritual</option>
                  <option value="architectural_element">Elemento arquitectónico</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Principal *
                </label>
                <Input
                  type="text"
                  value={formData.primary_material}
                  onChange={(e) => handleInputChange('primary_material', e.target.value)}
                  placeholder="Ej: Jade, Cerámica, Obsidiana"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Conservación
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excelente</option>
                  <option value="good">Bueno</option>
                  <option value="fair">Regular</option>
                  <option value="poor">Pobre</option>
                  <option value="fragmentary">Fragmentario</option>
                </select>
              </div>
            </div>

            {/* Dimensiones */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensiones</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largo
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alto
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad
                  </label>
                  <select
                    value={formData.dimensions.unit}
                    onChange={(e) => handleDimensionChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Peso y contexto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.0"
                    className="flex-1"
                  />
                  <select
                    value={formData.weight_unit}
                    onChange={(e) => handleInputChange('weight_unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="grams">gramos</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Descubrimiento
                </label>
                <Input
                  type="date"
                  value={formData.discovery_date}
                  onChange={(e) => handleInputChange('discovery_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad Estratigráfica
                </label>
                <Input
                  type="text"
                  value={formData.stratigraphic_unit}
                  onChange={(e) => handleInputChange('stratigraphic_unit', e.target.value)}
                  placeholder="Ej: SU-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profundidad
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', e.target.value)}
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

            {/* Descripción y notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el objeto, su función, decoración, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones adicionales, estado de conservación, etc."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/objects')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Objeto'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewObjectPage; 