'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface ArtifactDocument {
  id: string;
  artifactName: string;
  catalogNumber: string;
  type: 'lithic' | 'ceramic' | 'bone' | 'metal' | 'other';
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  technicalDrawing: string;
  photos: string[];
  site: string;
  context: string;
  date: string;
  documenter: string;
  status: 'draft' | 'review' | 'approved';
}

const ArtifactDocumentationPage: React.FC = () => {
  const router = useRouter();
  // Contexto de trabajo
  const [context, setContext] = useState<{ project: string; area: string; site: string }>({ project: '', area: '', site: '' });
  const [siteName, setSiteName] = useState('');

  const [documents, setDocuments] = useState<ArtifactDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ArtifactDocument | null>(null);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({
    artifactName: '',
    catalogNumber: '',
    type: 'lithic' as const,
    material: '',
    dimensions: { length: 0, width: 0, height: 0 },
    weight: 0,
    condition: 'good' as const,
    description: '',
    technicalDrawing: '',
    site: '',
    context: '',
    documenter: ''
  });

  // Arrays simulados de proyectos y áreas (igual que en el dashboard)
  const projects = [
    { id: '1', name: 'Proyecto Cazadores Recolectores - La Laguna' },
    { id: '2', name: 'Estudio de Poblamiento Pampeano' },
    { id: '3', name: 'Arqueología de la Llanura Bonaerense' }
  ];
  const areas = [
    { id: '1', name: 'Laguna La Brava', projectId: '1' },
    { id: '2', name: 'Arroyo Seco', projectId: '1' },
    { id: '3', name: 'Monte Hermoso', projectId: '2' }
  ];

  // Datos simulados con ejemplos pampeanos
  useEffect(() => {
    setDocuments([
      {
        id: '1',
        artifactName: 'Punta de Proyectil Cola de Pescado',
        catalogNumber: 'LLB-001',
        type: 'lithic',
        material: 'Sílice',
        dimensions: { length: 4.5, width: 2.1, height: 0.8 },
        weight: 12.5,
        condition: 'excellent',
        description: 'Punta de proyectil tipo Cola de Pescado, retoque bifacial, base cóncava, filo convexo',
        technicalDrawing: 'dibujo_llb_001.svg',
        photos: ['foto_llb_001_1.jpg', 'foto_llb_001_2.jpg'],
        site: 'Laguna La Brava',
        context: 'Superficie, sector norte',
        date: '2025-07-22',
        documenter: 'Dr. Pérez',
        status: 'approved'
      },
      {
        id: '2',
        artifactName: 'Fragmento de Vasija Cerámica',
        catalogNumber: 'AS-002',
        type: 'ceramic',
        material: 'Arcilla',
        dimensions: { length: 8.2, width: 6.5, height: 1.2 },
        weight: 45.8,
        condition: 'good',
        description: 'Fragmento de vasija con decoración incisa, borde redondeado',
        technicalDrawing: 'dibujo_as_002.svg',
        photos: ['foto_as_002_1.jpg'],
        site: 'Arroyo Seco',
        context: 'Excavación, nivel 2',
        date: '2025-07-21',
        documenter: 'Dr. Pérez',
        status: 'review'
      },
      {
        id: '3',
        artifactName: 'Raspador Lítico',
        catalogNumber: 'MH-003',
        type: 'lithic',
        material: 'Cuarzo',
        dimensions: { length: 3.8, width: 2.9, height: 1.1 },
        weight: 8.3,
        condition: 'good',
        description: 'Raspador lítico con retoque unifacial, filo activo',
        technicalDrawing: 'dibujo_mh_003.svg',
        photos: ['foto_mh_003_1.jpg', 'foto_mh_003_2.jpg'],
        site: 'Monte Hermoso',
        context: 'Superficie, sector este',
        date: '2025-07-20',
        documenter: 'Dr. Pérez',
        status: 'draft'
      },
      {
        id: '4',
        artifactName: 'Hueso Trabajado',
        catalogNumber: 'LLB-004',
        type: 'bone',
        material: 'Hueso de Guanaco',
        dimensions: { length: 12.5, width: 2.8, height: 1.5 },
        weight: 23.1,
        condition: 'fair',
        description: 'Fragmento de hueso de guanaco con marcas de corte y pulido',
        technicalDrawing: 'dibujo_llb_004.svg',
        photos: ['foto_llb_004_1.jpg'],
        site: 'Laguna La Brava',
        context: 'Excavación, nivel 1',
        date: '2025-07-19',
        documenter: 'Dr. Pérez',
        status: 'approved'
      }
    ]);
  }, []);

  useEffect(() => {
    // Leer contexto de localStorage
    const saved = localStorage.getItem('investigator-context');
    if (saved) {
      const ctx = JSON.parse(saved);
      setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
    }
  }, []);

  // Sincronizar contexto al recibir foco o volver a la pestaña
  useEffect(() => {
    const syncContext = () => {
      const saved = localStorage.getItem('investigator-context');
      if (saved) {
        const ctx = JSON.parse(saved);
        setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
      }
    };
    window.addEventListener('focus', syncContext);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncContext();
    });
    return () => {
      window.removeEventListener('focus', syncContext);
      window.removeEventListener('visibilitychange', syncContext);
    };
  }, []);

  useEffect(() => {
    // Simular obtención del nombre del sitio activo
    const sitios = [
      { id: '1', name: 'Sitio Laguna La Brava Norte' },
      { id: '2', name: 'Excavación Arroyo Seco 2' },
      { id: '3', name: 'Monte Hermoso Playa' }
    ];
    const found = sitios.find(s => s.id === context.site);
    setSiteName(found ? found.name : context.site);
  }, [context]);

  // Filtrar documentos por sitio activo
  const filteredDocuments = context.site
    ? documents.filter(d => d.site === siteName || d.site === context.site)
    : [];

  // Banner de contexto activo
  const renderContextBanner = () => (
    context.project && context.area && context.site ? (
      <div className="sticky top-0 z-30 w-full bg-blue-50 border-b border-blue-200 py-2 px-4 flex items-center justify-between shadow-sm mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-blue-700 font-semibold">Trabajando en:</span>
          <span className="text-blue-900 font-bold">{projects.find(p => p.id === context.project)?.name || `Proyecto ${context.project}`}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">{areas.find(a => a.id === context.area)?.name || `Área ${context.area}`}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">{siteName || context.site}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/researcher')}>Cambiar Contexto</Button>
        </div>
      </div>
    ) : null
  );

  // Si no hay contexto, mostrar mensaje y botón para ir al dashboard
  if (!context.project || !context.area || !context.site) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para acceder a la documentación de artefactos, primero debes seleccionar un proyecto, área y sitio.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAddDocument = (doc: Omit<ArtifactDocument, 'id' | 'date' | 'status' | 'photos'>) => {
    setDocuments(prev => [
      ...prev,
      {
        ...doc,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        photos: []
      }
    ]);
    setNewDocument({
      artifactName: '',
      catalogNumber: '',
      type: 'lithic',
      material: '',
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      condition: 'good',
      description: '',
      technicalDrawing: '',
      site: '',
      context: '',
      documenter: ''
    });
    setShowAddDocument(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lithic': return '🪨';
      case 'ceramic': return '🏺';
      case 'bone': return '🦴';
      case 'metal': return '⚔️';
      case 'other': return '🔍';
      default: return '🔍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      case 'metal': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {renderContextBanner()}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📝 Documentación de Artefactos</h1>
        <Button onClick={() => setShowAddDocument(true)}>
          ➕ Nueva Ficha
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredDocuments.length}</div>
            <div className="text-sm text-gray-600">Total Fichas</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredDocuments.filter(d => d.type === 'lithic').length}
            </div>
            <div className="text-sm text-gray-600">Artefactos Líticos</div>
          </div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-red-600">
            {filteredDocuments.filter(d => d.type === 'ceramic').length}
          </div>
          <div className="text-sm text-gray-600">Cerámica</div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredDocuments.filter(d => d.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Aprobadas</div>
          </div>
        </Card>
      </div>

      {/* Lista de Documentos */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Fichas Técnicas de Artefactos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artefacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sitio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensiones</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getTypeIcon(document.type)}</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(document.type)}`}>
                          {document.type === 'lithic' ? 'Lítico' :
                            document.type === 'ceramic' ? 'Cerámica' :
                            document.type === 'bone' ? 'Hueso' :
                            document.type === 'metal' ? 'Metal' : 'Otro'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{document.artifactName}</div>
                      <div className="text-sm text-gray-500">{document.catalogNumber}</div>
                      <div className="text-xs text-gray-400">{document.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{document.site}</div>
                      <div className="text-xs text-gray-500">{document.context}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {document.dimensions.length}×{document.dimensions.width}×{document.dimensions.height} cm
                      </div>
                      <div className="text-xs text-gray-500">{document.weight} g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConditionColor(document.condition)}`}>
                        {document.condition === 'excellent' ? 'Excelente' :
                          document.condition === 'good' ? 'Bueno' :
                          document.condition === 'fair' ? 'Regular' : 'Pobre'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(document.status)}`}>
                        {document.status === 'draft' ? 'Borrador' :
                          document.status === 'review' ? 'En Revisión' : 'Aprobado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedDocument(document)}>
                          👁️ Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          ✏️ Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal para agregar documento */}
      {showAddDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">➕ Nueva Ficha Técnica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Artefacto</label>
                <Input
                  value={newDocument.artifactName}
                  onChange={(e) => setNewDocument({ ...newDocument, artifactName: e.target.value })}
                  placeholder="Ej: Punta de Proyectil Cola de Pescado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Catálogo</label>
                <Input
                  value={newDocument.catalogNumber}
                  onChange={(e) => setNewDocument({ ...newDocument, catalogNumber: e.target.value })}
                  placeholder="Ej: LLB-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="lithic">🪨 Artefacto Lítico</option>
                  <option value="ceramic">🏺 Cerámica</option>
                  <option value="bone">🦴 Hueso</option>
                  <option value="metal">⚔️ Metal</option>
                  <option value="other">🔍 Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <Input
                  value={newDocument.material}
                  onChange={(e) => setNewDocument({ ...newDocument, material: e.target.value })}
                  placeholder="Ej: Sílice, Arcilla, Hueso"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Largo (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newDocument.dimensions.length}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    dimensions: { ...newDocument.dimensions, length: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ancho (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newDocument.dimensions.width}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    dimensions: { ...newDocument.dimensions, width: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alto (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newDocument.dimensions.height}
                  onChange={(e) => setNewDocument({
                    ...newDocument,
                    dimensions: { ...newDocument.dimensions, height: parseFloat(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Peso (g)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newDocument.weight}
                  onChange={(e) => setNewDocument({ ...newDocument, weight: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado de Conservación</label>
                <select
                  value={newDocument.condition}
                  onChange={(e) => setNewDocument({ ...newDocument, condition: e.target.value as any })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="excellent">Excelente</option>
                  <option value="good">Bueno</option>
                  <option value="fair">Regular</option>
                  <option value="poor">Pobre</option>
                </select>
              </div>
              {/* Campo sitio autocompletado y oculto */}
              <input type="hidden" value={siteName} />
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Sitio</label>
                <Input
                  value={newDocument.site}
                  onChange={(e) => setNewDocument({ ...newDocument, site: e.target.value })}
                  placeholder="Ej: Laguna La Brava"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Contexto</label>
                <Input
                  value={newDocument.context}
                  onChange={(e) => setNewDocument({ ...newDocument, context: e.target.value })}
                  placeholder="Ej: Superficie, sector norte"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción Técnica</label>
                <textarea
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  placeholder="Descripción técnica detallada del artefacto"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddDocument(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Al guardar, autocompletar el sitio con el contexto
                handleAddDocument({ ...newDocument, site: siteName });
              }}>
                Crear Ficha
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver documento */}
      {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">📝 Ficha Técnica Completa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                    <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(selectedDocument.type)}</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(selectedDocument.type)}`}>
                      {selectedDocument.type === 'lithic' ? 'Artefacto Lítico' :
                       selectedDocument.type === 'ceramic' ? 'Cerámica' :
                       selectedDocument.type === 'bone' ? 'Hueso' :
                       selectedDocument.type === 'metal' ? 'Metal' : 'Otro'}
                    </span>
                  </div>
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-sm text-gray-900">{selectedDocument.artifactName}</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Catálogo</label>
                  <p className="text-sm text-gray-900">{selectedDocument.catalogNumber}</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material</label>
                  <p className="text-sm text-gray-900">{selectedDocument.material}</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sitio</label>
                  <p className="text-sm text-gray-900">{selectedDocument.site}</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contexto</label>
                  <p className="text-sm text-gray-900">{selectedDocument.context}</p>
                    </div>
                  </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dimensiones</label>
                  <p className="text-sm text-gray-900">
                    {selectedDocument.dimensions.length} × {selectedDocument.dimensions.width} × {selectedDocument.dimensions.height} cm
                  </p>
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Peso</label>
                  <p className="text-sm text-gray-900">{selectedDocument.weight} g</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getConditionColor(selectedDocument.condition)}`}>
                    {selectedDocument.condition === 'excellent' ? 'Excelente' :
                     selectedDocument.condition === 'good' ? 'Bueno' :
                     selectedDocument.condition === 'fair' ? 'Regular' : 'Pobre'}
                  </span>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status === 'draft' ? 'Borrador' :
                     selectedDocument.status === 'review' ? 'En Revisión' : 'Aprobado'}
                  </span>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha</label>
                  <p className="text-sm text-gray-900">{selectedDocument.date}</p>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documentador</label>
                  <p className="text-sm text-gray-900">{selectedDocument.documenter}</p>
                      </div>
                    </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción Técnica</label>
                <p className="text-sm text-gray-900">{selectedDocument.description}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dibujo Técnico</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <span className="text-4xl">📐</span>
                    <p className="text-sm text-gray-600 mt-2">{selectedDocument.technicalDrawing}</p>
                  </div>
                </div>
                      </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Fotografías</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedDocument.photos.map((photo, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <span className="text-2xl">📷</span>
                        <p className="text-xs text-gray-600 mt-1">{photo}</p>
                      </div>
                    </div>
                  ))}
                </div>
                  </div>
                  </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                📐 Agregar Dibujo
              </Button>
              <Button variant="outline">
                📷 Agregar Foto
                  </Button>
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                    Cerrar
                  </Button>
                </div>
              </div>
          </div>
        )}
    </div>
  );
};

export default ArtifactDocumentationPage; 