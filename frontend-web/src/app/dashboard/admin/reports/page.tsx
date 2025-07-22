'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface SystemReport {
  id: string;
  title: string;
  type: 'usage' | 'revenue' | 'performance' | 'security' | 'user_activity';
  description: string;
  generated_at: string;
  period: string;
  status: 'completed' | 'generating' | 'failed';
  file_size: string;
  format: string;
  data_points: number;
  summary: string;
}

const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<SystemReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  useEffect(() => {
    // Simular carga de reportes
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'Reporte de Uso del Sistema - Enero 2024',
          type: 'usage',
          description: 'Análisis detallado del uso de la plataforma por usuarios y funcionalidades',
          generated_at: '2024-01-15T10:00:00Z',
          period: 'Enero 2024',
          status: 'completed',
          file_size: '2.5 MB',
          format: 'PDF',
          data_points: 1247,
          summary: 'Aumento del 15% en usuarios activos, mayor uso de herramientas de análisis'
        },
        {
          id: '2',
          title: 'Reporte de Ingresos - Q4 2023',
          type: 'revenue',
          description: 'Análisis financiero de suscripciones y ingresos del cuarto trimestre',
          generated_at: '2024-01-10T14:30:00Z',
          period: 'Q4 2023',
          status: 'completed',
          file_size: '1.8 MB',
          format: 'PDF, XLSX',
          data_points: 89,
          summary: 'Crecimiento del 23% en ingresos, 45 nuevas suscripciones premium'
        },
        {
          id: '3',
          title: 'Reporte de Rendimiento del Sistema',
          type: 'performance',
          description: 'Métricas de rendimiento, tiempos de respuesta y disponibilidad',
          generated_at: '2024-01-14T09:15:00Z',
          period: 'Últimos 30 días',
          status: 'completed',
          file_size: '3.2 MB',
          format: 'PDF',
          data_points: 567,
          summary: '99.8% de disponibilidad, tiempo de respuesta promedio de 245ms'
        },
        {
          id: '4',
          title: 'Reporte de Actividad de Usuarios',
          type: 'user_activity',
          description: 'Análisis de patrones de uso y comportamiento de usuarios',
          generated_at: '2024-01-12T16:45:00Z',
          period: 'Diciembre 2023',
          status: 'completed',
          file_size: '4.1 MB',
          format: 'PDF, CSV',
          data_points: 2341,
          summary: 'Pico de actividad entre 9-11 AM, mayor uso en días laborables'
        },
        {
          id: '5',
          title: 'Reporte de Seguridad - Auditoría',
          type: 'security',
          description: 'Auditoría de seguridad, intentos de acceso y vulnerabilidades',
          generated_at: '2024-01-08T11:20:00Z',
          period: 'Últimos 90 días',
          status: 'completed',
          file_size: '1.5 MB',
          format: 'PDF',
          data_points: 123,
          summary: '0 incidentes de seguridad críticos, 15 intentos de acceso bloqueados'
        },
        {
          id: '6',
          title: 'Reporte de Uso - Generando...',
          type: 'usage',
          description: 'Reporte de uso del sistema para el período actual',
          generated_at: '2024-01-15T15:00:00Z',
          period: 'Enero 2024',
          status: 'generating',
          file_size: '0 MB',
          format: 'PDF',
          data_points: 0,
          summary: 'Generando reporte...'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerateReport = () => {
    router.push('/dashboard/admin/reports/generate');
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Descargando reporte:', reportId);
    alert('Descarga iniciada. El archivo se guardará en tu carpeta de descargas.');
  };

  const handleViewReport = (reportId: string) => {
    router.push(`/dashboard/admin/reports/${reportId}`);
  };

  const handleScheduleReport = (reportId: string) => {
    router.push(`/dashboard/admin/reports/${reportId}/schedule`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      generating: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      usage: 'bg-blue-100 text-blue-800',
      revenue: 'bg-green-100 text-green-800',
      performance: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800',
      user_activity: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      usage: '📊',
      revenue: '💰',
      performance: '⚡',
      security: '🔒',
      user_activity: '👥'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesPeriod = selectedPeriod === 'all' || report.period === selectedPeriod;
    return matchesType && matchesPeriod;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
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
                Reportes del Sistema
              </h1>
              <p className="text-gray-600">
                Administrador: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={handleGenerateReport}>
                📊 Generar Reporte
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
                Tipo de Reporte
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="usage">Uso del Sistema</option>
                <option value="revenue">Ingresos</option>
                <option value="performance">Rendimiento</option>
                <option value="security">Seguridad</option>
                <option value="user_activity">Actividad de Usuarios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los períodos</option>
                <option value="Enero 2024">Enero 2024</option>
                <option value="Q4 2023">Q4 2023</option>
                <option value="Últimos 30 días">Últimos 30 días</option>
                <option value="Diciembre 2023">Diciembre 2023</option>
                <option value="Últimos 90 días">Últimos 90 días</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="mt-8">
          <Card title="Estadísticas de Reportes">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{reports.length}</div>
                <div className="text-sm text-gray-600">Total de Reportes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {reports.filter(r => r.status === 'generating').length}
                </div>
                <div className="text-sm text-gray-600">Generando</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {reports.reduce((sum, r) => sum + r.data_points, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Puntos de Datos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de reportes */}
        <div className="mt-8">
          <Card title={`Reportes Disponibles (${filteredReports.length})`}>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getTypeIcon(report.type)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>📅 {report.period}</span>
                          <span>📊 {report.data_points} puntos de datos</span>
                          <span>📁 {report.file_size}</span>
                          <span>📄 {report.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                          {report.type === 'usage' ? 'Uso' : 
                           report.type === 'revenue' ? 'Ingresos' : 
                           report.type === 'performance' ? 'Rendimiento' : 
                           report.type === 'security' ? 'Seguridad' : 'Actividad'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status === 'completed' ? 'Completado' : 
                           report.status === 'generating' ? 'Generando' : 'Fallido'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(report.generated_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  {report.summary && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Resumen:</strong> {report.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewReport(report.id)}
                      >
                        Ver Reporte
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        📊 Gráficos
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        📋 Metadatos
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {report.status === 'completed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleDownloadReport(report.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          📥 Descargar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleReport(report.id)}
                      >
                        ⏰ Programar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reportes</h3>
                <p className="text-gray-600 mb-6">Ajusta los filtros o genera un nuevo reporte</p>
                <Button onClick={handleGenerateReport}>
                  Generar Nuevo Reporte
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Tipos de reportes disponibles */}
        <div className="mt-8">
          <Card title="Tipos de Reportes Disponibles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-medium text-gray-900">Uso del Sistema</h3>
                <p className="text-sm text-gray-600 mb-3">Métricas de uso por usuarios y funcionalidades</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generar
                </Button>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-medium text-gray-900">Ingresos</h3>
                <p className="text-sm text-gray-600 mb-3">Análisis financiero de suscripciones</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generar
                </Button>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-medium text-gray-900">Rendimiento</h3>
                <p className="text-sm text-gray-600 mb-3">Métricas de rendimiento del sistema</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generar
                </Button>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-medium text-gray-900">Seguridad</h3>
                <p className="text-sm text-gray-600 mb-3">Auditoría de seguridad y accesos</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generar
                </Button>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-medium text-gray-900">Actividad de Usuarios</h3>
                <p className="text-sm text-gray-600 mb-3">Patrones de uso y comportamiento</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generar
                </Button>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-medium text-gray-900">Personalizado</h3>
                <p className="text-sm text-gray-600 mb-3">Crea reportes con parámetros específicos</p>
                <Button size="sm" variant="outline" className="w-full">
                  Crear
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage; 