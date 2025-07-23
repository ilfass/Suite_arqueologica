'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Finding {
  id: string;
  name: string;
  type: 'lithic' | 'ceramic' | 'bone' | 'shell' | 'other';
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
  const { user } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'analyzed' | 'documented' | 'archived'>('all');

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
      case 'other': return '🔍';
      default: return '🔍';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'lithic': return 'Lítico';
      case 'ceramic': return 'Cerámica';
      case 'bone': return 'Hueso';
      case 'shell': return 'Concha';
      case 'other': return 'Otro';
      default: return 'Hallazgo';
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
        <ContextBanner
          project={context.project}
          area={context.area}
          site={context.site}
          showBackButton={true}
          showChangeButton={false}
        />
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
          <span className="text-gray-900 font-medium">Hallazgos Recientes</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔍 Hallazgos Recientes</h1>
            <p className="mt-2 text-gray-600">Explora los hallazgos arqueológicos más recientes</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher/surface-mapping')}>
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
      </div>
    </div>
  );
};

export default FindingsPage; 