'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface SecurityLog {
  id: string;
  user: string;
  action: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failed' | 'warning';
  timestamp: string;
  details: string;
  location?: string;
}

const SecurityLogsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLogs([
        {
          id: '1',
          user: 'dr.perez@unam.mx',
          action: 'LOGIN_SUCCESS',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          timestamp: '2024-01-15T14:30:00Z',
          details: 'Inicio de sesión exitoso',
          location: 'Ciudad de México, MX'
        },
        {
          id: '2',
          user: 'unknown@example.com',
          action: 'LOGIN_FAILED',
          ip_address: '203.45.67.89',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          status: 'failed',
          timestamp: '2024-01-15T14:25:00Z',
          details: 'Contraseña incorrecta',
          location: 'Buenos Aires, AR'
        },
        {
          id: '3',
          user: 'admin@inah.gob.mx',
          action: 'DATA_EXPORT',
          ip_address: '10.0.0.50',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success',
          timestamp: '2024-01-15T14:20:00Z',
          details: 'Exportación de datos de usuarios',
          location: 'Oficina INAH, MX'
        },
        {
          id: '4',
          user: 'estudiante@universidad.edu',
          action: 'PERMISSION_DENIED',
          ip_address: '172.16.0.25',
          user_agent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B)',
          status: 'warning',
          timestamp: '2024-01-15T14:15:00Z',
          details: 'Intento de acceso a área restringida',
          location: 'Universidad, MX'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS': return '✅';
      case 'LOGIN_FAILED': return '❌';
      case 'DATA_EXPORT': return '📤';
      case 'PERMISSION_DENIED': return '⚠️';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando logs de seguridad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Logs de Seguridad</h1>
              <p className="text-gray-600">Registro de actividad y eventos de seguridad</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => alert('Función en desarrollo')}>
                📥 Exportar Logs
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <Card title="Estadísticas de Seguridad">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{logs.length}</div>
                <div className="text-sm text-gray-600">Total de Eventos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {logs.filter(l => l.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Exitosos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {logs.filter(l => l.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Fallidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {logs.filter(l => l.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Advertencias</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de logs */}
        <Card title="Registros de Seguridad">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.action}</div>
                          <div className="text-sm text-gray-500">{log.details}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status === 'success' ? 'Exitoso' : 
                         log.status === 'failed' ? 'Fallido' : 'Advertencia'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.location || 'Desconocida'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver Detalles</Button>
                        <Button size="sm" variant="outline">Investigar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SecurityLogsPage; 