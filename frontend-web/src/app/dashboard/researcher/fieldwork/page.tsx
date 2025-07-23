'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface FieldRecord {
  id: string;
  type: 'artifact' | 'context' | 'stratigraphy' | 'photo' | 'measurement';
  title: string;
  description: string;
  location: {
    grid_unit: string;
    coordinates: {
      latitude: number;
      longitude: number;
      elevation: number;
    };
  };
  measurements: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  materials: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  photos: string[];
  notes: string;
  created_at: string;
  created_by: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

const FieldworkPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  // Contexto de trabajo
  const [context, setContext] = useState<{ project: string; area: string; site: string }>({ project: '', area: '', site: '' });
  const [siteName, setSiteName] = useState('');

  const [records, setRecords] = useState<FieldRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'artifact' | 'context' | 'stratigraphy' | 'photo' | 'measurement'>('all');

  useEffect(() => {
    setTimeout(() => {
      setRecords([
        {
          id: '1',
          type: 'artifact',
          title: 'Vaso Cerámico Decorado',
          description: 'Vaso ceremonial con decoración policroma, posiblemente del período clásico',
          location: {
            grid_unit: 'A1',
            coordinates: {
              latitude: 19.4326,
              longitude: -99.1332,
              elevation: 2240
            }
          },
          measurements: {
            length: 15.5,
            width: 12.3,
            height: 8.7,
            weight: 0.85
          },
          materials: ['cerámica', 'pigmento'],
          condition: 'good',
          photos: ['photo1.jpg', 'photo2.jpg'],
          notes: 'Hallazgo en contexto ritual, asociado a ofrenda',
          created_at: '2024-01-15T14:30:00Z',
          created_by: 'Dr. María González',
          status: 'approved'
        },
        {
          id: '2',
          type: 'context',
          title: 'Contexto Estratigráfico Nivel 3',
          description: 'Capa de ceniza y carbón asociada a actividad ritual',
          location: {
            grid_unit: 'A2',
            coordinates: {
              latitude: 19.4326,
              longitude: -99.1331,
              elevation: 2238
            }
          },
          measurements: {
            length: 45.0,
            width: 30.0,
            height: 0.15
          },
          materials: ['ceniza', 'carbón', 'tierra'],
          condition: 'fair',
          photos: ['context1.jpg'],
          notes: 'Capa de 15cm de espesor, color gris oscuro',
          created_at: '2024-01-15T16:45:00Z',
          created_by: 'Lic. Carlos Pérez',
          status: 'submitted'
        },
        {
          id: '3',
          type: 'stratigraphy',
          title: 'Perfil Estratigráfico Sector Norte',
          description: 'Secuencia estratigráfica completa del sector norte',
          location: {
            grid_unit: 'B1',
            coordinates: {
              latitude: 19.4325,
              longitude: -99.1332,
              elevation: 2235
            }
          },
          measurements: {
            height: 3.2
          },
          materials: ['tierra', 'piedra', 'adobe'],
          condition: 'excellent',
          photos: ['profile1.jpg', 'profile2.jpg', 'profile3.jpg'],
          notes: 'Perfil de 3.2m de altura, 5 niveles identificados',
          created_at: '2024-01-14T10:20:00Z',
          created_by: 'Est. Ana Martínez',
          status: 'reviewed'
        }
      ]);
      setLoading(false);
    }, 1000);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artifact': return '🏺';
      case 'context': return '🏛️';
      case 'stratigraphy': return '📊';
      case 'photo': return '📸';
      case 'measurement': return '📏';
      default: return '📋';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'artifact': return 'Artefacto';
      case 'context': return 'Contexto';
      case 'stratigraphy': return 'Estratigrafía';
      case 'photo': return 'Fotografía';
      case 'measurement': return 'Medición';
      default: return 'Registro';
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'submitted': return 'Enviado';
      case 'reviewed': return 'Revisado';
      case 'approved': return 'Aprobado';
      default: return 'Desconocido';
    }
  };

  // Filtrar registros por sitio activo (simulación: si tuvieran campo site)
  // Aquí se asume que en el futuro los registros tendrán un campo site o location.site
  // Por ahora, no se filtra realmente porque los datos simulados no lo tienen
  const filteredRecords = context.site
    ? records // Aquí deberías filtrar por siteName o context.site si los datos lo tuvieran
    : [];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando registros de campo...</p>
        </div>
      </div>
    );
  }

  // Si no hay contexto, mostrar mensaje y botón para ir al dashboard
  if (!context.project || !context.area || !context.site) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para acceder al trabajo de campo, primero debes seleccionar un proyecto, área y sitio.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContextBanner()}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trabajo de Campo</h1>
              <p className="text-gray-600">Formularios digitales y registro fotográfico con funcionalidad offline</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/researcher')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push('/dashboard/researcher/fieldwork/new')}>
                📝 Nuevo Registro
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <Card title="Resumen de Campo">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredRecords.length}</div>
                <div className="text-sm text-gray-600">Total de Registros</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {filteredRecords.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Aprobados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {filteredRecords.filter(r => r.type === 'artifact').length}
                </div>
                <div className="text-sm text-gray-600">Objetos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {filteredRecords.reduce((sum, r) => sum + r.photos.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Fotografías</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <Card title="Filtros">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todos ({filteredRecords.length})
              </Button>
              <Button 
                variant={filter === 'artifact' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('artifact')}
              >
                🏺 Objetos ({filteredRecords.filter(r => r.type === 'artifact').length})
              </Button>
              <Button 
                variant={filter === 'context' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('context')}
              >
                🏛️ Contextos ({filteredRecords.filter(r => r.type === 'context').length})
              </Button>
              <Button 
                variant={filter === 'stratigraphy' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('stratigraphy')}
              >
                📊 Estratigrafía ({filteredRecords.filter(r => r.type === 'stratigraphy').length})
              </Button>
              <Button 
                variant={filter === 'photo' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('photo')}
              >
                📸 Fotografías ({filteredRecords.filter(r => r.type === 'photo').length})
              </Button>
              <Button 
                variant={filter === 'measurement' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('measurement')}
              >
                📏 Mediciones ({filteredRecords.filter(r => r.type === 'measurement').length})
              </Button>
            </div>
          </Card>
        </div>

        {/* Herramientas rápidas */}
        <div className="mb-8">
          <Card title="Herramientas Rápidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">📷</span>
                <span className="text-sm">Tomar Foto</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">📏</span>
                <span className="text-sm">Medir</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">📍</span>
                <span className="text-sm">GPS</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-2">📱</span>
                <span className="text-sm">Escaneo QR</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Lista de registros */}
        <Card title={`Registros de Campo (${filteredRecords.length})`}>
          <div className="space-y-6">
            {filteredRecords.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(record.type)}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                      <p className="text-sm text-gray-500">{getTypeLabel(record.type)} • {record.location.grid_unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver</Button>
                      <Button size="sm" variant="outline">Editar</Button>
                      <Button size="sm" variant="outline">Fotos</Button>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{record.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                    <span className="ml-2 text-sm">{record.location.grid_unit}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Materiales:</span>
                    <span className="ml-2 text-sm">{record.materials.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Condición:</span>
                    <span className="ml-2 text-sm capitalize">{record.condition}</span>
                  </div>
                </div>

                {record.measurements && Object.keys(record.measurements).length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Medidas:</span>
                    <div className="mt-1 flex space-x-4 text-sm">
                      {record.measurements.length && (
                        <span>L: {record.measurements.length}cm</span>
                      )}
                      {record.measurements.width && (
                        <span>A: {record.measurements.width}cm</span>
                      )}
                      {record.measurements.height && (
                        <span>H: {record.measurements.height}cm</span>
                      )}
                      {record.measurements.weight && (
                        <span>P: {record.measurements.weight}kg</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>📸 {record.photos.length} fotos</span>
                    <span>👤 {record.created_by}</span>
                  </div>
                  <span>{new Date(record.created_at).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default FieldworkPage; 