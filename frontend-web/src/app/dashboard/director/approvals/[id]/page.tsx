'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

interface ApprovalRequest {
  id: string;
  type: 'site' | 'artifact' | 'excavation' | 'report';
  title: string;
  description: string;
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  files: string[];
  comments: string;
  location?: string;
  date_range?: string;
  budget?: number;
}

const ApprovalDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const approvalId = params?.id as string;
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos de la aprobación
    setTimeout(() => {
      setApproval({
        id: approvalId,
        type: 'site',
        title: 'Nuevo sitio: Templo de la Luna',
        description: 'Propuesta para registrar un nuevo sitio arqueológico en el área del Templo de la Luna, incluyendo documentación fotográfica y planimetría detallada.',
        submitted_by: 'Dr. María González',
        submitted_at: '2024-01-15T10:30:00Z',
        status: 'pending',
        priority: 'high',
        files: [
          'documentacion_fotografica.pdf',
          'planimetria_detallada.dwg',
          'informe_preliminar.docx'
        ],
        comments: 'Sitio de gran importancia histórica que requiere documentación urgente debido a condiciones climáticas.',
        location: 'Teotihuacán, Estado de México',
        date_range: '15 de enero - 30 de marzo, 2024',
        budget: 150000
      });
      setLoading(false);
    }, 1000);
  }, [approvalId]);

  const handleApprove = () => {
    router.push(`/dashboard/director/approvals/${approvalId}/approve`);
  };

  const handleReject = () => {
    router.push(`/dashboard/director/approvals/${approvalId}/reject`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'site': return '🏛️';
      case 'artifact': return '🏺';
      case 'excavation': return '⛏️';
      case 'report': return '📄';
      default: return '📋';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'site': return 'Sitio Arqueológico';
      case 'artifact': return 'Artefacto';
      case 'excavation': return 'Excavación';
      case 'report': return 'Reporte';
      default: return 'Solicitud';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la solicitud...</p>
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card title="Solicitud no encontrada">
          <p>No se encontró la solicitud solicitada.</p>
          <Button onClick={() => router.push('/dashboard/director')}>Volver al Dashboard</Button>
        </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">{approval.title}</h1>
              <p className="text-gray-600">Detalles de la Solicitud de Aprobación</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
                Volver al Dashboard
              </Button>
              {approval.status === 'pending' && (
                <>
                  <Button 
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ✅ Aprobar
                  </Button>
                  <Button 
                    onClick={handleReject}
                    variant="outline"
                    className="text-red-600 border-red-300"
                  >
                    ❌ Rechazar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Información de la Solicitud">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(approval.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{getTypeLabel(approval.type)}</h3>
                    <p className="text-sm text-gray-500">Tipo de solicitud</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700">{approval.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Solicitante:</span>
                    <span className="ml-2 text-sm font-medium">{approval.submitted_by}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha de envío:</span>
                    <span className="ml-2 text-sm">{new Date(approval.submitted_at).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      approval.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {approval.status === 'pending' ? 'Pendiente' : 
                       approval.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      approval.priority === 'high' ? 'bg-red-100 text-red-800' :
                      approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {approval.priority === 'high' ? 'Alta' : 
                       approval.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                </div>

                {approval.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                    <span className="ml-2 text-sm">{approval.location}</span>
                  </div>
                )}

                {approval.date_range && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Período:</span>
                    <span className="ml-2 text-sm">{approval.date_range}</span>
                  </div>
                )}

                {approval.budget && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Presupuesto:</span>
                    <span className="ml-2 text-sm">${approval.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Comentarios del Solicitante">
              <p className="text-gray-700">{approval.comments}</p>
            </Card>

            <Card title="Archivos Adjuntos">
              <div className="space-y-2">
                {approval.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">📎</span>
                      <span className="text-sm font-medium text-gray-900">{file}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Acciones">
              <div className="space-y-3">
                {approval.status === 'pending' ? (
                  <>
                    <Button 
                      onClick={handleApprove}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      ✅ Aprobar Solicitud
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="outline"
                      className="w-full text-red-600 border-red-300"
                    >
                      ❌ Rechazar Solicitud
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Esta solicitud ya ha sido {approval.status === 'approved' ? 'aprobada' : 'rechazada'}
                    </p>
                  </div>
                )}
                
                <Button variant="outline" size="sm" className="w-full">
                  📧 Contactar Solicitante
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📋 Ver Historial
                </Button>
              </div>
            </Card>

            <Card title="Información del Sistema">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">ID de Solicitud:</span>
                  <span className="ml-2 font-mono">{approval.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Creada:</span>
                  <span className="ml-2">{new Date(approval.submitted_at).toLocaleString('es-ES')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Última actualización:</span>
                  <span className="ml-2">{new Date().toLocaleString('es-ES')}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovalDetailsPage; 