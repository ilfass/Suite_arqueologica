'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useUnifiedContext } from '@/hooks/useUnifiedContext';
import FindingForm from '@/components/forms/FindingForm';

interface Finding {
  id: string;
  name: string;
  type: string;
  material: string;
  description: string;
  coordinates?: [number, number];
  depth?: number;
  context: string;
  site_id: string;
  site_name: string;
  project_id: string;
  project_name: string;
  discovered_by: string;
  discovered_date: string;
  status: 'new' | 'analyzed' | 'documented' | 'archived';
  photo_url?: string;
  notes?: string;
}

const FindingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useUnifiedContext();
  
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

  // Cargar hallazgos desde la API
  useEffect(() => {
    const loadFindings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.error('No hay token de autenticación');
          return;
        }

        const response = await fetch('/api/findings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFindings(data.data || []);
            console.log('✅ Hallazgos cargados desde la API:', data.data?.length || 0);
          } else {
            console.error('❌ Error en respuesta de API:', data);
          }
        } else {
          console.error('❌ Error cargando hallazgos:', response.status);
        }
      } catch (error) {
        console.error('❌ Error cargando hallazgos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadFindings();
    }
  }, [authLoading, user]);

  const filteredFindings = findings.filter(finding => 
    filter === 'all' ? true : finding.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'analyzed': return 'bg-green-100 text-green-800';
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
      case 'artifact': return '🏺';
      case 'lithic': return '🗿';
      case 'ceramic': return '🏺';
      case 'bone': return '🦴';
      case 'metal': return '⚔️';
      case 'textile': return '🧵';
      case 'wood': return '🪵';
      default: return '🔍';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'artifact': return 'Artefacto';
      case 'lithic': return 'Lítico';
      case 'ceramic': return 'Cerámica';
      case 'bone': return 'Hueso';
      case 'metal': return 'Metal';
      case 'textile': return 'Textil';
      case 'wood': return 'Madera';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'artifact': return 'bg-orange-100 text-orange-800';
      case 'lithic': return 'bg-gray-100 text-gray-800';
      case 'ceramic': return 'bg-red-100 text-red-800';
      case 'bone': return 'bg-yellow-100 text-yellow-800';
      case 'metal': return 'bg-blue-100 text-blue-800';
      case 'textile': return 'bg-pink-100 text-pink-800';
      case 'wood': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para guardar hallazgo usando la API
  const handleSaveFinding = async (findingData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.error('No hay token de autenticación');
        return;
      }

      const response = await fetch('/api/findings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(findingData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Recargar hallazgos
          const refreshResponse = await fetch('/api/findings', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setFindings(refreshData.data || []);
            }
          }

          setShowNewFindingModal(false);
          console.log('✅ Hallazgo guardado exitosamente');
        } else {
          console.error('❌ Error guardando hallazgo:', data);
        }
      } else {
        console.error('❌ Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('❌ Error guardando hallazgo:', error);
    }
  };

  const handleCancelFinding = () => {
    setShowNewFindingModal(false);
  };

  // Función para abrir el modal con información de contexto pre-cargada
  const handleOpenNewFindingModal = () => {
    console.log('🔍 handleOpenNewFindingModal llamado');
    console.log('🔍 Contexto actual:', context);
    
    if (!context || !context.project_id || !context.area_id || !context.site_id) {
      console.log('❌ Contexto incompleto, mostrando alerta');
      alert('⚠️ Debe seleccionar un contexto arqueológico completo (Proyecto, Área y Sitio) antes de crear un nuevo hallazgo.');
      return;
    }
    
    console.log('✅ Contexto completo, abriendo modal');
    setShowNewFindingModal(true);
  };

  const handleAddCustomType = () => {
    if (customTypeName.trim() && !customTypes.includes(customTypeName.trim())) {
      const newTypes = [...customTypes, customTypeName.trim()];
      setCustomTypes(newTypes);
      localStorage.setItem('custom-finding-types', JSON.stringify(newTypes));
      setCustomTypeName('');
      setShowCustomTypeModal(false);
    }
  };

  const handleRemoveCustomType = (typeToRemove: string) => {
    const newTypes = customTypes.filter(type => type !== typeToRemove);
    setCustomTypes(newTypes);
    localStorage.setItem('custom-finding-types', JSON.stringify(newTypes));
  };

  const getAllTypes = () => {
    const baseTypes = ['artifact', 'lithic', 'ceramic', 'bone', 'metal', 'textile', 'wood'];
    return [...baseTypes, ...customTypes];
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
      {/* Banner de contexto */}
      {hasContext && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Contexto actual:</span> {context?.project_name} › {context?.area_name} › {context?.site_name}
            </p>
          </div>
        </div>
      )}

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
          <span className="text-gray-900 font-medium">Hallazgos</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔍 Hallazgos Arqueológicos</h1>
            <p className="mt-2 text-gray-600">Gestiona todos tus hallazgos y artefactos</p>
          </div>
          <Button onClick={handleOpenNewFindingModal}>
            ➕ Nuevo Hallazgo
          </Button>
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

        {/* Grid de hallazgos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFindings.map((finding) => (
            <Card key={finding.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(finding.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{finding.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(finding.type)}`}>
                        {getTypeText(finding.type)}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(finding.status)}`}>
                    {getStatusText(finding.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Material:</span> {finding.material || 'No especificado'}</p>
                  <p><span className="font-medium">Contexto:</span> {finding.context || 'No especificado'}</p>
                  <p><span className="font-medium">Descubierto por:</span> {finding.discovered_by}</p>
                  <p><span className="font-medium">Fecha:</span> {finding.discovered_date}</p>
                  {finding.coordinates && (
                    <p><span className="font-medium">Coordenadas:</span> {finding.coordinates[0]}, {finding.coordinates[1]}</p>
                  )}
                  {finding.depth && (
                    <p><span className="font-medium">Profundidad:</span> {finding.depth}m</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/researcher/findings/${finding.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/researcher/findings/${finding.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredFindings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay hallazgos</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Aún no has registrado ningún hallazgo. ¡Comienza explorando!'
                : `No hay hallazgos con estado "${getStatusText(filter)}"`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={handleOpenNewFindingModal}>
                ➕ Crear Primer Hallazgo
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de nuevo hallazgo */}
      {showNewFindingModal && (
        <FindingForm
          isOpen={showNewFindingModal}
          onClose={() => setShowNewFindingModal(false)}
          onSubmit={handleSaveFinding}
          context={{
            projectId: context?.project_id || '',
            projectName: context?.project_name || '',
            areaId: context?.area_id || '',
            areaName: context?.area_name || '',
            siteId: context?.site_id || '',
            siteName: context?.site_name || '',
            fieldworkSessionId: ''
          }}
        />
      )}

      {/* Modal de tipo personalizado */}
      {showCustomTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Tipo Personalizado</h3>
            <input
              type="text"
              value={customTypeName}
              onChange={(e) => setCustomTypeName(e.target.value)}
              placeholder="Nombre del tipo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex space-x-2">
              <Button onClick={handleAddCustomType}>
                Agregar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomTypeModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindingsPage; 