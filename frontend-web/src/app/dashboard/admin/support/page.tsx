'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Ticket {
  id: string;
  title: string;
  description: string;
  user: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
}

const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTickets([
        {
          id: '1',
          title: 'Error al cargar imágenes en sitio arqueológico',
          description: 'No se pueden subir imágenes mayores a 5MB en la sección de sitios',
          user: 'Dr. María González',
          status: 'open',
          priority: 'high',
          category: 'Técnico',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Solicitud de nueva funcionalidad para reportes',
          description: 'Necesitamos exportar reportes en formato Excel con gráficos',
          user: 'Lic. Carlos Pérez',
          status: 'in_progress',
          priority: 'medium',
          category: 'Funcionalidad',
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-15T09:15:00Z',
          assigned_to: 'Equipo de Desarrollo'
        },
        {
          id: '3',
          title: 'Problema con permisos de usuario',
          description: 'Usuario no puede acceder a módulo de excavaciones',
          user: 'Est. Ana Martínez',
          status: 'resolved',
          priority: 'urgent',
          category: 'Acceso',
          created_at: '2024-01-13T16:45:00Z',
          updated_at: '2024-01-14T11:30:00Z',
          assigned_to: 'Admin'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tickets de soporte...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Soporte Técnico</h1>
              <p className="text-gray-600">Gestión de tickets y solicitudes de soporte</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => alert('Función en desarrollo')}>
                📝 Nuevo Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <Card title="Estadísticas de Soporte">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{tickets.length}</div>
                <div className="text-sm text-gray-600">Total de Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {tickets.filter(t => t.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">Tickets Abiertos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </div>
                <div className="text-sm text-gray-600">Resueltos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de tickets */}
        <Card title="Tickets de Soporte">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Abierto' : 
                         ticket.status === 'in_progress' ? 'En Progreso' : 
                         ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'low' ? 'Baja' : 
                         ticket.priority === 'medium' ? 'Media' : 
                         ticket.priority === 'high' ? 'Alta' : 'Urgente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver</Button>
                        <Button size="sm" variant="outline">Asignar</Button>
                        <Button size="sm" variant="outline">Responder</Button>
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

export default SupportPage; 