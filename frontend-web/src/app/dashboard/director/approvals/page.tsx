'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface ApprovalRequest {
  id: string;
  type: 'site' | 'artifact' | 'excavation' | 'report' | 'field_note';
  title: string;
  description: string;
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  project_name: string;
  files_count: number;
  comments?: string;
}

const ApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Simular carga de solicitudes de aprobación
    setTimeout(() => {
      setApprovalRequests([
        {
          id: '1',
          type: 'site',
          title: 'Nuevo sitio: Templo de la Luna',
          description: 'Propuesta para registrar un nuevo sitio arqueológico en el sector norte de Teotihuacán',
          submitted_by: 'Dr. María González',
          submitted_at: '2024-01-15T10:30:00Z',
          status: 'pending',
          priority: 'high',
          project_name: 'Proyecto Teotihuacán 2024',
          files_count: 3
        },
        {
          id: '2',
          type: 'artifact',
          title: 'Máscara de Jade - Catálogo ART-001',
          description: 'Solicitud de aprobación para catalogar una máscara ceremonial de jade',
          submitted_by: 'Lic. Carlos Pérez',
          submitted_at: '2024-01-15T09:15:00Z',
          status: 'pending',
          priority: 'medium',
          project_name: 'Proyecto Teotihuacán 2024',
          files_count: 5
        },
        {
          id: '3',
          type: 'report',
          title: 'Reporte preliminar - Sector Norte',
          description: 'Reporte preliminar de las excavaciones realizadas en el sector norte',
          submitted_by: 'Dr. María González',
          submitted_at: '2024-01-14T16:45:00Z',
          status: 'pending',
          priority: 'low',
          project_name: 'Proyecto Teotihuacán 2024',
          files_count: 2
        },
        {
          id: '4',
          type: 'excavation',
          title: 'Nueva excavación: Sector Este',
          description: 'Propuesta para iniciar excavaciones en el sector este del sitio',
          submitted_by: 'Lic. Carlos Pérez',
          submitted_at: '2024-01-13T14:20:00Z',
          status: 'approved',
          priority: 'high',
          project_name: 'Proyecto Teotihuacán 2024',
          files_count: 4
        },
        {
          id: '5',
          type: 'field_note',
          title: 'Nota de campo: Descubrimiento de cerámica',
          description: 'Nota de campo sobre el descubrimiento de fragmentos cerámicos',
          submitted_by: 'Est. Ana Martínez',
          submitted_at: '2024-01-12T11:30:00Z',
          status: 'rejected',
          priority: 'low',
          project_name: 'Proyecto Teotihuacán 2024',
          files_count: 1,
          comments: 'Requiere más detalles sobre la ubicación exacta'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (requestId: string) => {
    setApprovalRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (requestId: string) => {
    const comments = prompt('Motivo del rechazo:');
    if (comments) {
      setApprovalRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected', comments } : req
      ));
    }
  };

  const handleViewDetails = (requestId: string) => {
    router.push(`/dashboard/director/approvals/${requestId}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      site: '🏛️',
      artifact: '🏺',
      excavation: '⛏️',
      report: '📊',
      field_note: '📝'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const filteredRequests = approvalRequests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesType = selectedType === 'all' || request.type === selectedType;
    return matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aprobaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Solicitudes de Aprobación
              </h1>
              <p className="text-gray-600">
                Director: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="site">Sitios</option>
                <option value="artifact">Objetos</option>
                <option value="excavation">Excavaciones</option>
                <option value="report">Reportes</option>
                <option value="field_note">Notas de Campo</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de solicitudes */}
        <div className="mt-8">
          <Card title={`Solicitudes (${filteredRequests.length})`}>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getTypeIcon(request.type)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                        <p className="text-sm text-gray-600">{request.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Por: {request.submitted_by}</span>
                          <span>Proyecto: {request.project_name}</span>
                          <span>📎 {request.files_count} archivos</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status === 'pending' ? 'Pendiente' : 
                           request.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority === 'high' ? 'Alta' : 
                           request.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.submitted_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  {request.comments && (
                    <div className="bg-red-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-red-800">
                        <strong>Comentarios:</strong> {request.comments}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(request.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        Descargar Archivos
                      </Button>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          ✅ Aprobar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-300"
                          onClick={() => handleReject(request.id)}
                        >
                          ❌ Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
                <p className="text-gray-600">No se encontraron solicitudes con los filtros aplicados</p>
              </div>
            )}
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
          <Card title="Estadísticas de Aprobaciones">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {approvalRequests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {approvalRequests.filter(r => r.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Aprobadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {approvalRequests.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-600">Rechazadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {approvalRequests.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ApprovalsPage; 