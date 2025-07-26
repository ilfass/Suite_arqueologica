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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Contexto de trabajo
  const [context, setContext] = useState<{ project: string; area: string; site: string }>({ project: '', area: '', site: '' });
  const [siteName, setSiteName] = useState('');

  const [records, setRecords] = useState<FieldRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'artifact' | 'context' | 'stratigraphy' | 'photo' | 'measurement'>('all');

  useEffect(() => {
    // Simular carga de datos
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
          created_by: 'Dr. Carlos Ruiz',
          status: 'reviewed'
        },
        {
          id: '3',
          type: 'stratigraphy',
          title: 'Perfil Estratigráfico Sector B',
          description: 'Secuencia estratigráfica completa del sector B',
          location: {
            grid_unit: 'B1',
            coordinates: {
              latitude: 19.4327,
              longitude: -99.1333,
              elevation: 2242
            }
          },
          measurements: {
            length: 200.0,
            width: 50.0,
            height: 3.5
          },
          materials: ['tierra', 'piedra', 'cerámica'],
          condition: 'excellent',
          photos: ['strat1.jpg', 'strat2.jpg', 'strat3.jpg'],
          notes: 'Perfil bien conservado con 5 niveles identificados',
          created_at: '2024-01-16T09:15:00Z',
          created_by: 'Dr. Ana Martínez',
          status: 'approved'
        }
      ]);
      setLoading(false);
    }, 1000);

    // Cargar contexto desde localStorage
    const syncContext = () => {
      try {
        const savedContext = localStorage.getItem('investigator-context');
        if (savedContext) {
          const contextData = JSON.parse(savedContext);
          setContext({
            project: contextData.projectName || '',
            area: contextData.areaName || '',
            site: contextData.siteName || ''
          });
          setSiteName(contextData.siteName || 'Sitio Actual');
        }
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };

    syncContext();
  }, []);

  const getTypeIcon = (type: string) => {
    const icons = {
      artifact: '🏺',
      context: '🏛️',
      stratigraphy: '📊',
      photo: '📷',
      measurement: '📏'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      artifact: 'Artefacto',
      context: 'Contexto',
      stratigraphy: 'Estratigrafía',
      photo: 'Fotografía',
      measurement: 'Medición'
    };
    return labels[type as keyof typeof labels] || 'Otro';
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
    const labels = {
      draft: 'Borrador',
      submitted: 'Enviado',
      reviewed: 'Revisado',
      approved: 'Aprobado'
    };
    return labels[status as keyof typeof labels] || 'Desconocido';
  };

  const filteredRecords = records.filter(record => 
    filter === 'all' || record.type === filter
  );

  const renderContextBanner = () => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">🏕️ Trabajo de Campo</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📋 Proyecto: {context.project || 'No seleccionado'}</span>
            <span>📍 Área: {context.area || 'No seleccionada'}</span>
            <span>🏛️ Sitio: {context.site || 'No seleccionado'}</span>
          </div>
        </div>
        <Button
          onClick={() => router.push('/dashboard/researcher')}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
        >
          ← Volver al Dashboard
        </Button>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder al trabajo de campo.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Trabajo de Campo</h1>
              <p className="text-blue-100">
                Registro de actividades de excavación y prospección - {user.email}
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

        {/* Filtros */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
            <div className="flex space-x-2">
              {(['all', 'artifact', 'context', 'stratigraphy', 'photo', 'measurement'] as const).map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 text-sm ${
                    filter === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type === 'all' ? 'Todos' : getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Lista de registros */}
        <div className="grid gap-6">
          {loading ? (
            <Card className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando registros de campo...</p>
              </div>
            </Card>
          ) : filteredRecords.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-gray-600">No se encontraron registros de campo.</p>
              </div>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getTypeIcon(record.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{record.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{record.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                          <p className="text-sm text-gray-700">Cuadrícula {record.location.grid_unit}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Materiales:</span>
                          <p className="text-sm text-gray-700">{record.materials.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Condición:</span>
                          <p className="text-sm text-gray-700 capitalize">{record.condition}</p>
                        </div>
                      </div>

                      {record.measurements && Object.keys(record.measurements).length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-500">Medidas:</span>
                          <div className="flex space-x-4 mt-1">
                            {record.measurements.length && (
                              <span className="text-sm text-gray-700">L: {record.measurements.length}cm</span>
                            )}
                            {record.measurements.width && (
                              <span className="text-sm text-gray-700">A: {record.measurements.width}cm</span>
                            )}
                            {record.measurements.height && (
                              <span className="text-sm text-gray-700">H: {record.measurements.height}cm</span>
                            )}
                            {record.measurements.weight && (
                              <span className="text-sm text-gray-700">P: {record.measurements.weight}g</span>
                            )}
                          </div>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-500">Notas:</span>
                          <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Creado por: {record.created_by}</span>
                        <span>{new Date(record.created_at).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => console.log('Editar registro:', record.id)}
                      className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => console.log('Ver detalles:', record.id)}
                      className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 text-sm"
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldworkPage; 