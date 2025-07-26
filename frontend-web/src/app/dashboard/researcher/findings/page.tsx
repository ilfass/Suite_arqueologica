'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useUnifiedContext } from '@/hooks/useUnifiedContext';

interface Finding {
  id: string;
  name: string;
  type: string; // Permitir cualquier string para tipos personalizados
  material: string;
  description: string;
  coordinates?: [number, number];
  depth?: number;
  context: string;
  siteId: string;
  siteName: string;
  projectId: string;
  projectName: string;
  discoveredBy: string;
  discoveredDate: string;
  status: 'new' | 'analyzed' | 'documented' | 'archived';
  photoUrl?: string;
  notes?: string;
}

const FindingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useUnifiedContext();
  
  // Debug del contexto
  console.log('🔍 Findings Page - Context:', context);
  console.log('🔍 Findings Page - Has Context:', hasContext);
  console.log('🔍 Findings Page - Is Loading:', isLoading);
  
  // Función global para testing (solo en desarrollo)
  if (typeof window !== 'undefined') {
    (window as any).setTestContext = () => {
      const testContext = {
        project_id: 'proj-test-001',
        project_name: 'Proyecto Cazadores Recolectores - La Laguna',
        area_id: 'area-test-001',
        area_name: 'Laguna La Brava',
        site_id: 'site-test-001',
        site_name: 'Sitio Pampeano La Laguna'
      };
      localStorage.setItem('unified-context', JSON.stringify(testContext));
      console.log('🔧 Contexto de prueba establecido:', testContext);
      window.location.reload();
    };
    
    (window as any).clearTestContext = () => {
      localStorage.removeItem('unified-context');
      console.log('🗑️ Contexto de prueba eliminado');
      window.location.reload();
    };
  }
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'analyzed' | 'documented' | 'archived'>('all');
  const [showNewFindingModal, setShowNewFindingModal] = useState(false);
  const [showCustomTypeModal, setShowCustomTypeModal] = useState(false);
  const [customTypeName, setCustomTypeName] = useState('');
  const [customTypes, setCustomTypes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom-finding-types');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newFinding, setNewFinding] = useState({
    name: '',
    type: 'lithic' as string,
    material: '',
    description: '',
    coordinates: [0, 0] as [number, number],
    depth: 0,
    context: '',
    discoveredDate: new Date().toISOString().split('T')[0],
    notes: '',
    catalogNumber: '',
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    weight: 0,
    condition: 'excellent' as const,
    culturalPeriod: '',
    excavationUnit: '',
    stratigraphicLayer: '',
    associatedFeatures: '',
    preservationNotes: ''
  });

  // Datos simulados de hallazgos
  const mockFindings: Finding[] = [
    {
      id: '1',
      name: 'Punta de Proyectil Cola de Pescado',
      type: 'lithic',
      material: 'Sílice',
      description: 'Punta de proyectil tipo Cola de Pescado, retoque bifacial, base cóncava',
      coordinates: [-38.1234, -61.5678],
      depth: 0.45,
      context: 'Cuadrícula A1, nivel 2',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      discoveredBy: 'Dr. Carlos Pérez',
      discoveredDate: '2024-03-10',
      status: 'new',
      notes: 'Hallazgo excepcional, excelente estado de conservación'
    },
    {
      id: '2',
      name: 'Fragmento de Vasija Cerámica',
      type: 'ceramic',
      material: 'Arcilla',
      description: 'Fragmento de vasija con decoración incisa geométrica',
      coordinates: [-38.1235, -61.5679],
      depth: 0.32,
      context: 'Cuadrícula B2, nivel 1',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      discoveredBy: 'Lic. Ana Rodríguez',
      discoveredDate: '2024-03-08',
      status: 'analyzed',
      notes: 'Decoración típica del período tardío'
    },
    {
      id: '3',
      name: 'Raspador de Cuarzo',
      type: 'lithic',
      material: 'Cuarzo',
      description: 'Raspador para procesamiento de cueros y madera',
      coordinates: [-38.2345, -61.6789],
      depth: 0.28,
      context: 'Superficie, hallazgo aislado',
      siteId: '2',
      siteName: 'Excavación Arroyo Seco 2',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      discoveredBy: 'Téc. Juan López',
      discoveredDate: '2024-03-05',
      status: 'documented',
      notes: 'Herramienta bien conservada con huellas de uso'
    },
    {
      id: '4',
      name: 'Fragmento Óseo de Guanaco',
      type: 'bone',
      material: 'Hueso',
      description: 'Fragmento de costilla de guanaco con marcas de corte',
      coordinates: [-38.3456, -61.7890],
      depth: 0.15,
      context: 'Cuadrícula C3, nivel 1',
      siteId: '3',
      siteName: 'Monte Hermoso Playa',
      projectId: '2',
      projectName: 'Estudio de Poblamiento Pampeano',
      discoveredBy: 'Dr. Laura Martínez',
      discoveredDate: '2024-03-12',
      status: 'new',
      notes: 'Evidencia de procesamiento de fauna'
    },
    {
      id: '5',
      name: 'Concha de Molusco',
      type: 'shell',
      material: 'Concha',
      description: 'Concha de molusco marino con perforación artificial',
      coordinates: [-38.3457, -61.7891],
      depth: 0.22,
      context: 'Cuadrícula D1, nivel 2',
      siteId: '3',
      siteName: 'Monte Hermoso Playa',
      projectId: '2',
      projectName: 'Estudio de Poblamiento Pampeano',
      discoveredBy: 'Lic. Pedro Gómez',
      discoveredDate: '2024-03-15',
      status: 'analyzed',
      notes: 'Posible adorno o herramienta'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setFindings(mockFindings);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFindings = findings.filter(finding => 
    filter === 'all' ? true : finding.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'analyzed': return 'bg-blue-100 text-blue-800';
      case 'documented': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo';
      case 'analyzed': return 'Analizado';
      case 'documented': return 'Documentado';
      case 'archived': return 'Archivado';
      default: return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lithic': return '🪨';
      case 'ceramic': return '🏺';
      case 'bone': return '🦴';
      case 'shell': return '🐚';
      case 'wood': return '🪵';
      case 'other': return '🔍';
      default: return '🔍'; // Para tipos personalizados
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'lithic': return 'Lítico';
      case 'ceramic': return 'Cerámica';
      case 'bone': return 'Hueso';
      case 'shell': return 'Concha';
      case 'wood': return 'Madera';
      case 'other': return 'Otro';
      default: return type; // Para tipos personalizados, mostrar el nombre tal como está
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lithic': return 'bg-orange-100 text-orange-800';
      case 'ceramic': return 'bg-red-100 text-red-800';
      case 'bone': return 'bg-yellow-100 text-yellow-800';
      case 'shell': return 'bg-blue-100 text-blue-800';
      case 'wood': return 'bg-green-100 text-green-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800'; // Para tipos personalizados
    }
  };

  // Funciones para manejar el formulario de nuevo hallazgo
  const handleSaveFinding = async () => {
    try {
      const findingData = {
        ...newFinding,
        id: `finding-${Date.now()}`,
        siteId: context.site_id || '1',
        siteName: context.site_name || 'Sitio Actual',
        projectId: context.project_id || '1',
        projectName: context.project_name || 'Proyecto Actual',
        discoveredBy: user?.full_name || 'Usuario Actual',
        status: 'new' as const
      };

      // Aquí se guardaría en la base de datos
      console.log('Guardando hallazgo:', findingData);
      
      // Agregar a la lista local
      setFindings(prev => [...prev, findingData]);
      
      // Cerrar modal y limpiar formulario
      setShowNewFindingModal(false);
      setNewFinding({
        name: '',
        type: 'lithic',
        material: '',
        description: '',
        coordinates: [0, 0],
        depth: 0,
        context: '',
        discoveredDate: new Date().toISOString().split('T')[0],
        notes: '',
        catalogNumber: '',
        dimensions: { length: 0, width: 0, height: 0 },
        weight: 0,
        condition: 'excellent',
        culturalPeriod: '',
        excavationUnit: '',
        stratigraphicLayer: '',
        associatedFeatures: '',
        preservationNotes: ''
      });
      
      alert('Hallazgo guardado exitosamente');
    } catch (error) {
      console.error('Error guardando hallazgo:', error);
      alert('Error al guardar el hallazgo');
    }
  };

  const handleCancelFinding = () => {
    setShowNewFindingModal(false);
    setNewFinding({
      name: '',
      type: 'lithic',
      material: '',
      description: '',
      coordinates: [0, 0],
      depth: 0,
      context: '',
      discoveredDate: new Date().toISOString().split('T')[0],
      notes: '',
      catalogNumber: '',
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      condition: 'excellent',
      culturalPeriod: '',
      excavationUnit: '',
      stratigraphicLayer: '',
      associatedFeatures: '',
      preservationNotes: ''
    });
  };

  // Función para abrir el modal con información de contexto pre-cargada
  const handleOpenNewFindingModal = () => {
    // Cargar información de contexto si está disponible
    const contextInfo = [];
    if (context.project_name) contextInfo.push(`Proyecto: ${context.project_name}`);
    if (context.area_name) contextInfo.push(`Área: ${context.area_name}`);
    if (context.site_name) contextInfo.push(`Sitio: ${context.site_name}`);
    
    const contextString = contextInfo.join(', ') || 'Contexto no especificado';
    
    console.log('🔧 Abriendo modal con contexto:', contextString);
    
    setNewFinding(prev => ({
      ...prev,
      context: contextString
    }));
    
    setShowNewFindingModal(true);
  };

  // Funciones para manejar tipos personalizados
  const handleAddCustomType = () => {
    if (customTypeName.trim()) {
      const newCustomTypes = [...customTypes, customTypeName.trim()];
      setCustomTypes(newCustomTypes);
      localStorage.setItem('custom-finding-types', JSON.stringify(newCustomTypes));
      setNewFinding(prev => ({ ...prev, type: customTypeName.trim() }));
      setCustomTypeName('');
      setShowCustomTypeModal(false);
    }
  };

  const handleRemoveCustomType = (typeToRemove: string) => {
    const newCustomTypes = customTypes.filter(type => type !== typeToRemove);
    setCustomTypes(newCustomTypes);
    localStorage.setItem('custom-finding-types', JSON.stringify(newCustomTypes));
  };

  // Obtener todos los tipos disponibles
  const getAllTypes = () => {
    const baseTypes = [
      { value: 'lithic', label: 'Lítico' },
      { value: 'ceramic', label: 'Cerámico' },
      { value: 'bone', label: 'Óseo' },
      { value: 'shell', label: 'Concha' },
      { value: 'wood', label: 'Madera' },
      { value: 'other', label: 'Otro' }
    ];
    
    const customTypeOptions = customTypes.map(type => ({
      value: type,
      label: type
    }));
    
    return [...baseTypes, ...customTypeOptions];
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando hallazgos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Hallazgos Recientes</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔍 Hallazgos Recientes</h1>
            <p className="mt-2 text-gray-600">Explora los hallazgos arqueológicos más recientes</p>
            
            {/* Debug del contexto */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔍 Debug - Estado del Contexto:</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <div><strong>Proyecto:</strong> {context.project_name || 'No establecido'}</div>
                <div><strong>Área:</strong> {context.area_name || 'No establecida'}</div>
                <div><strong>Sitio:</strong> {context.site_name || 'No establecido'}</div>
                <div><strong>Has Context:</strong> {hasContext ? 'SÍ' : 'NO'}</div>
                <div><strong>Is Loading:</strong> {isLoading ? 'SÍ' : 'NO'}</div>
              </div>
            </div>
          </div>
                      <div className="flex space-x-2">
              <Button onClick={handleOpenNewFindingModal}>
                ➕ Nuevo Hallazgo
              </Button>
              
              {/* Botones de test */}
              <Button 
                variant="outline"
                onClick={() => {
                  const testContext = {
                    project_id: 'proj-test-001',
                    project_name: 'Proyecto Cazadores Recolectores - La Laguna',
                    area_id: 'area-test-001',
                    area_name: 'Laguna La Brava',
                    site_id: 'site-test-001',
                    site_name: 'Sitio Pampeano La Laguna'
                  };
                  localStorage.setItem('unified-context', JSON.stringify(testContext));
                  console.log('🔧 Contexto de prueba establecido:', testContext);
                  window.location.reload();
                }}
              >
                🔧 Test Contexto
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('unified-context');
                  console.log('🗑️ Contexto eliminado');
                  window.location.reload();
                }}
              >
                🗑️ Limpiar
              </Button>
            </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos ({findings.length})
            </Button>
            <Button
              variant={filter === 'new' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('new')}
            >
              Nuevos ({findings.filter(f => f.status === 'new').length})
            </Button>
            <Button
              variant={filter === 'analyzed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('analyzed')}
            >
              Analizados ({findings.filter(f => f.status === 'analyzed').length})
            </Button>
            <Button
              variant={filter === 'documented' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('documented')}
            >
              Documentados ({findings.filter(f => f.status === 'documented').length})
            </Button>
            <Button
              variant={filter === 'archived' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('archived')}
            >
              Archivados ({findings.filter(f => f.status === 'archived').length})
            </Button>
          </div>
        </div>

        {/* Lista de Hallazgos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFindings.map((finding) => (
            <Card key={finding.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(finding.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {finding.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {finding.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(finding.type)}`}>
                      {getTypeText(finding.type)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(finding.status)}`}>
                      {getStatusText(finding.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">📍 Sitio:</span>
                    {finding.siteName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">🔍 Contexto:</span>
                    {finding.context}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">👤 Descubierto por:</span>
                    {finding.discoveredBy}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">📅 Fecha:</span>
                    {new Date(finding.discoveredDate).toLocaleDateString('es-ES')}
                  </div>
                  {finding.coordinates && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">🗺️ Coordenadas:</span>
                      {finding.coordinates[0].toFixed(4)}, {finding.coordinates[1].toFixed(4)}
                    </div>
                  )}
                  {finding.depth && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📏 Profundidad:</span>
                      {finding.depth}m
                    </div>
                  )}
                  {finding.notes && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📝 Notas:</span>
                      {finding.notes}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/findings/${finding.id}`)}
                  >
                    👁️ Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/artifacts`)}
                  >
                    🏺 Artefactos
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredFindings.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay hallazgos</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no tienes hallazgos registrados.'
                  : `No hay hallazgos en estado "${getStatusText(filter)}".`
                }
              </p>
              <Button onClick={() => router.push('/dashboard/researcher/surface-mapping')}>
                Registrar Primer Hallazgo
              </Button>
            </div>
          </Card>
        )}

        {/* Modal para agregar tipo personalizado */}
        {showCustomTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">➕ Agregar Tipo Personalizado</h2>
                <p className="text-gray-600 mt-1">Crear un nuevo tipo de hallazgo personalizado</p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Tipo</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="Ej: Textil, Metal, Vidrio..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomType()}
                  />
                </div>

                {customTypes.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipos Personalizados Existentes</label>
                    <div className="space-y-2">
                      {customTypes.map((type, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{type}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCustomType(type)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCustomTypeModal(false);
                      setCustomTypeName('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAddCustomType}
                    disabled={!customTypeName.trim()}
                  >
                    Agregar Tipo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Nuevo Hallazgo */}
        {showNewFindingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">📋 Nuevo Hallazgo Arqueológico</h2>
                <p className="text-gray-600 mt-1">Registro siguiendo estándares internacionales de arqueología</p>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleSaveFinding(); }}>
                  {/* Información de Contexto (Pre-llenada) */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">📍 Información de Contexto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Proyecto</label>
                        <input 
                          type="text" 
                          className="w-full border border-blue-200 rounded p-2 bg-blue-100" 
                          value={context.project_name || 'No especificado'} 
                          disabled 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Área</label>
                        <input 
                          type="text" 
                          className="w-full border border-blue-200 rounded p-2 bg-blue-100" 
                          value={context.area_name || 'No especificado'} 
                          disabled 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Sitio</label>
                        <input 
                          type="text" 
                          className="w-full border border-blue-200 rounded p-2 bg-blue-100" 
                          value={context.site_name || 'No especificado'} 
                          disabled 
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-blue-800 mb-1">Contexto Completo</label>
                      <input 
                        type="text" 
                        className="w-full border border-blue-200 rounded p-2 bg-blue-100" 
                        value={newFinding.context} 
                        disabled 
                      />
                    </div>
                  </div>

                  {/* Información Básica del Hallazgo */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">* Nombre/Descripción</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.name}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">* Tipo de Hallazgo</label>
                        <div className="flex space-x-2">
                          <select 
                            className="flex-1 border rounded p-2"
                            value={newFinding.type}
                            onChange={(e) => setNewFinding(prev => ({ ...prev, type: e.target.value }))}
                            required
                          >
                            {getAllTypes().map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCustomTypeModal(true)}
                            className="whitespace-nowrap"
                          >
                            ➕ Nuevo
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">* Material</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.material}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, material: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">* Fecha de Descubrimiento</label>
                        <input 
                          type="date" 
                          className="w-full border rounded p-2" 
                          value={newFinding.discoveredDate}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, discoveredDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ubicación y Contexto */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Ubicación y Contexto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas (Latitud)</label>
                        <input 
                          type="number" 
                          step="any"
                          className="w-full border rounded p-2" 
                          value={newFinding.coordinates[0]}
                          onChange={(e) => setNewFinding(prev => ({ 
                            ...prev, 
                            coordinates: [parseFloat(e.target.value), prev.coordinates[1]] 
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas (Longitud)</label>
                        <input 
                          type="number" 
                          step="any"
                          className="w-full border rounded p-2" 
                          value={newFinding.coordinates[1]}
                          onChange={(e) => setNewFinding(prev => ({ 
                            ...prev, 
                            coordinates: [prev.coordinates[0], parseFloat(e.target.value)] 
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profundidad (metros)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full border rounded p-2" 
                          value={newFinding.depth}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, depth: parseFloat(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Excavación</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.excavationUnit}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, excavationUnit: e.target.value }))}
                          placeholder="Ej: Cuadrícula A1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capa Estratigráfica</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.stratigraphicLayer}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, stratigraphicLayer: e.target.value }))}
                          placeholder="Ej: Nivel 2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contexto Específico</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.context}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, context: e.target.value }))}
                          placeholder="Ej: Fosa de basura, hogar, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Características Físicas */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📏 Características Físicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitud (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full border rounded p-2" 
                          value={newFinding.dimensions.length}
                          onChange={(e) => setNewFinding(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full border rounded p-2" 
                          value={newFinding.dimensions.width}
                          onChange={(e) => setNewFinding(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full border rounded p-2" 
                          value={newFinding.dimensions.height}
                          onChange={(e) => setNewFinding(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso (g)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full border rounded p-2" 
                          value={newFinding.weight}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Cultural */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏛️ Información Cultural</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período Cultural</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.culturalPeriod}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, culturalPeriod: e.target.value }))}
                          placeholder="Ej: Período Tardío, Horizonte Temprano"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Conservación</label>
                        <select 
                          className="w-full border rounded p-2"
                          value={newFinding.condition}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, condition: e.target.value as any }))}
                        >
                          <option value="excellent">Excelente</option>
                          <option value="good">Bueno</option>
                          <option value="fair">Regular</option>
                          <option value="poor">Pobre</option>
                          <option value="fragmentary">Fragmentario</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Información Adicional</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada</label>
                        <textarea 
                          className="w-full border rounded p-2 h-20" 
                          value={newFinding.description}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción detallada del hallazgo, características técnicas, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Catálogo</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.catalogNumber}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, catalogNumber: e.target.value }))}
                          placeholder="Ej: LAG-2024-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Características Asociadas</label>
                        <input 
                          type="text" 
                          className="w-full border rounded p-2" 
                          value={newFinding.associatedFeatures}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, associatedFeatures: e.target.value }))}
                          placeholder="Ej: Fuego, enterramiento, estructura"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Preservación</label>
                        <textarea 
                          className="w-full border rounded p-2 h-16" 
                          value={newFinding.preservationNotes}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, preservationNotes: e.target.value }))}
                          placeholder="Notas sobre conservación, tratamiento necesario, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                        <textarea 
                          className="w-full border rounded p-2 h-16" 
                          value={newFinding.notes}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Observaciones adicionales, hipótesis, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelFinding}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      💾 Guardar Hallazgo
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindingsPage; 