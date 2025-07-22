'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SurfaceFinding {
  id: string;
  name: string;
  type: 'lithic' | 'ceramic' | 'bone' | 'shell' | 'other';
  material: string;
  coordinates: [number, number];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  date: string;
  site: string;
  collector: string;
  photoUrl?: string;
}

const SurfaceMappingPage: React.FC = () => {
  const [findings, setFindings] = useState<SurfaceFinding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<SurfaceFinding | null>(null);
  const [showAddFinding, setShowAddFinding] = useState(false);
  const [newFinding, setNewFinding] = useState({
    name: '',
    type: 'lithic' as const,
    material: '',
    coordinates: [0, 0] as [number, number],
    condition: 'good' as const,
    description: '',
    site: '',
    collector: ''
  });

  // Datos simulados con ejemplos pampeanos
  useEffect(() => {
    setFindings([
      {
        id: '1',
        name: 'Punta de Proyectil Cola de Pescado',
        type: 'lithic',
        material: 'Sílice',
        coordinates: [-38.1234, -61.5678],
        condition: 'excellent',
        description: 'Punta de proyectil tipo Cola de Pescado, retoque bifacial, base cóncava',
        date: '2025-07-22',
        site: 'Laguna La Brava',
        collector: 'Dr. Pérez'
      },
      {
        id: '2',
        name: 'Fragmento de Cerámica',
        type: 'ceramic',
        material: 'Arcilla',
        coordinates: [-38.2345, -61.6789],
        condition: 'good',
        description: 'Fragmento de cerámica con decoración incisa',
        date: '2025-07-21',
        site: 'Arroyo Seco',
        collector: 'Dr. Pérez'
      },
      {
        id: '3',
        name: 'Hueso de Guanaco',
        type: 'bone',
        material: 'Hueso',
        coordinates: [-38.3456, -61.7890],
        condition: 'fair',
        description: 'Fragmento de hueso de guanaco con marcas de corte',
        date: '2025-07-20',
        site: 'Monte Hermoso',
        collector: 'Dr. Pérez'
      },
      {
        id: '4',
        name: 'Raspador Lítico',
        type: 'lithic',
        material: 'Cuarzo',
        coordinates: [-38.4567, -61.8901],
        condition: 'good',
        description: 'Raspador lítico con retoque unifacial',
        date: '2025-07-19',
        site: 'Laguna La Brava',
        collector: 'Dr. Pérez'
      }
    ]);
  }, []);

  const handleAddFinding = () => {
    const finding: SurfaceFinding = {
      id: Date.now().toString(),
      name: newFinding.name,
      type: newFinding.type,
      material: newFinding.material,
      coordinates: newFinding.coordinates,
      condition: newFinding.condition,
      description: newFinding.description,
      site: newFinding.site,
      collector: newFinding.collector,
      date: new Date().toISOString().split('T')[0]
    };
    setFindings([...findings, finding]);
    setNewFinding({ name: '', type: 'lithic', material: '', coordinates: [0, 0], condition: 'good', description: '', site: '', collector: '' });
    setShowAddFinding(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lithic': return '🪨';
      case 'ceramic': return '🏺';
      case 'bone': return '🦴';
      case 'shell': return '🐚';
      case 'other': return '🔍';
      default: return '🔍';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lithic': return 'bg-orange-100 text-orange-800';
      case 'ceramic': return 'bg-red-100 text-red-800';
      case 'bone': return 'bg-yellow-100 text-yellow-800';
      case 'shell': return 'bg-blue-100 text-blue-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🌍 Mapeo de Superficie</h1>
        <Button onClick={() => setShowAddFinding(true)}>
          ➕ Agregar Hallazgo
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{findings.length}</div>
            <div className="text-sm text-gray-600">Total Hallazgos</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {findings.filter(f => f.type === 'lithic').length}
            </div>
            <div className="text-sm text-gray-600">Artefactos Líticos</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {findings.filter(f => f.type === 'ceramic').length}
            </div>
            <div className="text-sm text-gray-600">Cerámica</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {findings.filter(f => f.type === 'bone').length}
            </div>
            <div className="text-sm text-gray-600">Restos Óseos</div>
          </div>
        </Card>
      </div>

      {/* Lista de Hallazgos */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Registro de Hallazgos en Superficie</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hallazgo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sitio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {findings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getTypeIcon(finding.type)}</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(finding.type)}`}>
                          {finding.type === 'lithic' ? 'Lítico' :
                           finding.type === 'ceramic' ? 'Cerámica' :
                           finding.type === 'bone' ? 'Hueso' :
                           finding.type === 'shell' ? 'Concha' : 'Otro'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{finding.name}</div>
                      <div className="text-sm text-gray-500">{finding.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{finding.site}</div>
                      <div className="text-xs text-gray-500">
                        {finding.coordinates[0].toFixed(4)}, {finding.coordinates[1].toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{finding.material}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConditionColor(finding.condition)}`}>
                        {finding.condition === 'excellent' ? 'Excelente' :
                         finding.condition === 'good' ? 'Bueno' :
                         finding.condition === 'fair' ? 'Regular' : 'Pobre'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {finding.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => setSelectedFinding(finding)}>
                        👁️ Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal para agregar hallazgo */}
      {showAddFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">➕ Agregar Nuevo Hallazgo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Hallazgo</label>
                <Input
                  value={newFinding.name}
                  onChange={(e) => setNewFinding({...newFinding, name: e.target.value})}
                  placeholder="Ej: Punta de Proyectil Cola de Pescado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={newFinding.type}
                  onChange={(e) => setNewFinding({...newFinding, type: e.target.value as any})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="lithic">🪨 Artefacto Lítico</option>
                  <option value="ceramic">🏺 Cerámica</option>
                  <option value="bone">🦴 Hueso</option>
                  <option value="shell">🐚 Concha</option>
                  <option value="other">🔍 Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <Input
                  value={newFinding.material}
                  onChange={(e) => setNewFinding({...newFinding, material: e.target.value})}
                  placeholder="Ej: Sílice, Arcilla, Hueso"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitud</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newFinding.coordinates[0]}
                    onChange={(e) => setNewFinding({...newFinding, coordinates: [parseFloat(e.target.value), newFinding.coordinates[1]]})}
                    placeholder="-38.1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitud</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newFinding.coordinates[1]}
                    onChange={(e) => setNewFinding({...newFinding, coordinates: [newFinding.coordinates[0], parseFloat(e.target.value)]})}
                    placeholder="-61.5678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado de Conservación</label>
                <select
                  value={newFinding.condition}
                  onChange={(e) => setNewFinding({...newFinding, condition: e.target.value as any})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="excellent">Excelente</option>
                  <option value="good">Bueno</option>
                  <option value="fair">Regular</option>
                  <option value="poor">Pobre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sitio</label>
                <Input
                  value={newFinding.site}
                  onChange={(e) => setNewFinding({...newFinding, site: e.target.value})}
                  placeholder="Ej: Laguna La Brava"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={newFinding.description}
                  onChange={(e) => setNewFinding({...newFinding, description: e.target.value})}
                  placeholder="Descripción detallada del hallazgo"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddFinding(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddFinding}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver hallazgo */}
      {selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">🌍 Detalles del Hallazgo</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(selectedFinding.type)}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(selectedFinding.type)}`}>
                    {selectedFinding.type === 'lithic' ? 'Artefacto Lítico' :
                     selectedFinding.type === 'ceramic' ? 'Cerámica' :
                     selectedFinding.type === 'bone' ? 'Hueso' :
                     selectedFinding.type === 'shell' ? 'Concha' : 'Otro'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-sm text-gray-900">{selectedFinding.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sitio</label>
                <p className="text-sm text-gray-900">{selectedFinding.site}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coordenadas</label>
                <p className="text-sm text-gray-900">
                  {selectedFinding.coordinates[0].toFixed(6)}, {selectedFinding.coordinates[1].toFixed(6)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <p className="text-sm text-gray-900">{selectedFinding.material}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConditionColor(selectedFinding.condition)}`}>
                  {selectedFinding.condition === 'excellent' ? 'Excelente' :
                   selectedFinding.condition === 'good' ? 'Bueno' :
                   selectedFinding.condition === 'fair' ? 'Regular' : 'Pobre'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-sm text-gray-900">{selectedFinding.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <p className="text-sm text-gray-900">{selectedFinding.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Recolector</label>
                <p className="text-sm text-gray-900">{selectedFinding.collector}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                📷 Agregar Foto
              </Button>
              <Button variant="outline" onClick={() => setSelectedFinding(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurfaceMappingPage; 