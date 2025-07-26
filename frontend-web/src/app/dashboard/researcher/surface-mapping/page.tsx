'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';
import { useRouter } from 'next/navigation';

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
  projectId: string;
  areaId: string;
  siteId: string;
}

const SurfaceMappingPage: React.FC = () => {
  // Contexto de trabajo usando el hook personalizado
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  const [siteName, setSiteName] = useState('');

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

  // Datos simulados con ejemplos pampeanos y contexto
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
        collector: 'Dr. Pérez',
        projectId: '1',
        areaId: '1',
        siteId: '1'
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
        collector: 'Dr. Pérez',
        projectId: '1',
        areaId: '2',
        siteId: '2'
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
        collector: 'Dr. Pérez',
        projectId: '2',
        areaId: '3',
        siteId: '3'
      }
    ]);

    // Cargar contexto desde localStorage
    const loadContext = () => {
      try {
        const savedContext = localStorage.getItem('investigator-context');
        if (savedContext) {
          const contextData = JSON.parse(savedContext);
          setSiteName(contextData.siteName || 'Sitio Actual');
        }
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };

    loadContext();
  }, []);

  const handleAddFinding = (finding: Omit<SurfaceFinding, 'id' | 'date'>) => {
    const newFinding: SurfaceFinding = {
      ...finding,
      id: `finding-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setFindings([...findings, newFinding]);
    setShowAddFinding(false);
    setNewFinding({
      name: '',
      type: 'lithic',
      material: '',
      coordinates: [0, 0],
      condition: 'good',
      description: '',
      site: '',
      collector: ''
    });
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      lithic: '🪨',
      ceramic: '🏺',
      bone: '🦴',
      shell: '🐚',
      other: '📦'
    };
    return icons[type as keyof typeof icons] || '📦';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      lithic: 'bg-orange-100 text-orange-800',
      ceramic: 'bg-red-100 text-red-800',
      bone: 'bg-yellow-100 text-yellow-800',
      shell: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderContextBanner = () => (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">🗺️ Mapeo de Superficie</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📋 Proyecto: {context?.project || 'No seleccionado'}</span>
            <span>📍 Área: {context?.area || 'No seleccionada'}</span>
            <span>🏛️ Sitio: {context?.site || 'No seleccionado'}</span>
          </div>
        </div>
        <Button
          onClick={() => router.push('/dashboard/researcher')}
          className="px-4 py-2 bg-green-500 text-white hover:bg-green-600"
        >
          ← Volver al Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mapeo de Superficie</h1>
              <p className="text-green-100">
                Registro de hallazgos en superficie - Sistema de Gestión Arqueológica
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/dashboard/researcher')}
                className="px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-white border-opacity-30"
              >
                ← Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {renderContextBanner()}

        {/* Estadísticas */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{findings.length}</div>
              <div className="text-sm text-gray-600">Total Hallazgos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {findings.filter(f => f.type === 'lithic').length}
              </div>
              <div className="text-sm text-gray-600">Líticos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {findings.filter(f => f.type === 'ceramic').length}
              </div>
              <div className="text-sm text-gray-600">Cerámicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {findings.filter(f => f.type === 'bone').length}
              </div>
              <div className="text-sm text-gray-600">Óseos</div>
            </div>
          </div>
        </Card>

        {/* Controles */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Hallazgos de Superficie</h3>
            <Button
              onClick={() => setShowAddFinding(true)}
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600"
            >
              + Agregar Hallazgo
            </Button>
          </div>
        </Card>

        {/* Lista de hallazgos */}
        <div className="grid gap-6">
          {findings.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-gray-600">No se encontraron hallazgos de superficie.</p>
              </div>
            </Card>
          ) : (
            findings.map((finding) => (
              <Card key={finding.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getTypeIcon(finding.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{finding.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(finding.type)}`}>
                          {finding.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(finding.condition)}`}>
                          {finding.condition.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{finding.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Material:</span>
                          <p className="text-sm text-gray-700">{finding.material}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Coordenadas:</span>
                          <p className="text-sm text-gray-700">
                            {finding.coordinates[0].toFixed(4)}, {finding.coordinates[1].toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Sitio:</span>
                          <p className="text-sm text-gray-700">{finding.site}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Recolector: {finding.collector}</span>
                        <span>Fecha: {finding.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedFinding(finding)}
                      className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
                    >
                      Ver
                    </Button>
                    <Button
                      onClick={() => console.log('Editar hallazgo:', finding.id)}
                      className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 text-sm"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal para agregar hallazgo */}
      {showAddFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Agregar Hallazgo de Superficie</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <Input
                  type="text"
                  value={newFinding.name}
                  onChange={(e) => setNewFinding({...newFinding, name: e.target.value})}
                  placeholder="Ej: Punta de proyectil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={newFinding.type}
                  onChange={(e) => setNewFinding({...newFinding, type: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="lithic">Lítico</option>
                  <option value="ceramic">Cerámico</option>
                  <option value="bone">Óseo</option>
                  <option value="shell">Concha</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <Input
                  type="text"
                  value={newFinding.material}
                  onChange={(e) => setNewFinding({...newFinding, material: e.target.value})}
                  placeholder="Ej: Sílice, Arcilla"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newFinding.description}
                  onChange={(e) => setNewFinding({...newFinding, description: e.target.value})}
                  placeholder="Descripción detallada del hallazgo"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                onClick={() => setShowAddFinding(false)}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancelar
              </Button>
                             <Button
                 onClick={() => handleAddFinding({
                   ...newFinding,
                   projectId: context?.project || '',
                   areaId: context?.area || '',
                   siteId: context?.site || ''
                 })}
                 className="px-4 py-2 bg-green-500 text-white hover:bg-green-600"
               >
                 Agregar
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {selectedFinding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">{getTypeIcon(selectedFinding.type)}</div>
              <div>
                <h3 className="text-xl font-semibold">{selectedFinding.name}</h3>
                <p className="text-gray-600">{selectedFinding.type.toUpperCase()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p><strong>Descripción:</strong> {selectedFinding.description}</p>
              <p><strong>Material:</strong> {selectedFinding.material}</p>
              <p><strong>Condición:</strong> {selectedFinding.condition}</p>
              <p><strong>Coordenadas:</strong> {selectedFinding.coordinates[0]}, {selectedFinding.coordinates[1]}</p>
              <p><strong>Sitio:</strong> {selectedFinding.site}</p>
              <p><strong>Recolector:</strong> {selectedFinding.collector}</p>
              <p><strong>Fecha:</strong> {selectedFinding.date}</p>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
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