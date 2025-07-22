'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Card from '../../../../../../components/ui/Card';
import Button from '../../../../../../components/ui/Button';

interface InstitutionUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'RESEARCHER' | 'DIRECTOR' | 'STUDENT' | 'INSTITUTION' | 'GUEST';
  status: 'active' | 'inactive' | 'pending';
  last_login: string;
  created_at: string;
  projects_count: number;
  objects_count: number;
  excavations_count: number;
  department?: string;
  position?: string;
  phone?: string;
}

const InstitutionUsersPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id as string;
  const [users, setUsers] = useState<InstitutionUser[]>([]);
  const [institutionName, setInstitutionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstitutionName('Universidad Nacional Autónoma de México');
      setUsers([
        {
          id: '1',
          name: 'Dr. María González',
          email: 'maria.gonzalez@unam.mx',
          role: 'RESEARCHER',
          status: 'active',
          last_login: '2024-01-15T16:30:00Z',
          created_at: '2023-03-15T10:00:00Z',
          projects_count: 3,
          objects_count: 45,
          excavations_count: 2,
          department: 'Arqueología',
          position: 'Investigadora Principal',
          phone: '+52 55 5622 1234'
        },
        {
          id: '2',
          name: 'Lic. Carlos Pérez',
          email: 'carlos.perez@unam.mx',
          role: 'RESEARCHER',
          status: 'active',
          last_login: '2024-01-15T14:20:00Z',
          created_at: '2023-06-20T09:00:00Z',
          projects_count: 2,
          objects_count: 28,
          excavations_count: 1,
          department: 'Arqueología',
          position: 'Investigador Asociado',
          phone: '+52 55 5622 5678'
        },
        {
          id: '3',
          name: 'Est. Ana Martínez',
          email: 'ana.martinez@unam.mx',
          role: 'STUDENT',
          status: 'active',
          last_login: '2024-01-15T12:15:00Z',
          created_at: '2023-09-01T08:00:00Z',
          projects_count: 1,
          objects_count: 12,
          excavations_count: 0,
          department: 'Arqueología',
          position: 'Estudiante de Maestría'
        },
        {
          id: '4',
          name: 'Dr. Roberto Silva',
          email: 'roberto.silva@unam.mx',
          role: 'DIRECTOR',
          status: 'active',
          last_login: '2024-01-15T10:45:00Z',
          created_at: '2023-01-10T11:00:00Z',
          projects_count: 5,
          objects_count: 89,
          excavations_count: 3,
          department: 'Arqueología',
          position: 'Director del Departamento',
          phone: '+52 55 5622 9012'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [institutionId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👑';
      case 'RESEARCHER': return '🔬';
      case 'DIRECTOR': return '👨‍💼';
      case 'STUDENT': return '🎓';
      case 'INSTITUTION': return '🏛️';
      case 'GUEST': return '👤';
      default: return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'RESEARCHER': return 'Investigador';
      case 'DIRECTOR': return 'Director';
      case 'STUDENT': return 'Estudiante';
      case 'INSTITUTION': return 'Institución';
      case 'GUEST': return 'Invitado';
      default: return 'Usuario';
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios de la institución...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Usuarios de {institutionName}</h1>
              <p className="text-gray-600">Gestión de usuarios de la institución</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push(`/dashboard/admin/institutions/${institutionId}`)}>
                Volver a Institución
              </Button>
              <Button onClick={() => alert('Función en desarrollo')}>
                👤 Agregar Usuario
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="mb-8">
          <Card title="Estadísticas de Usuarios">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total de Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'RESEARCHER').length}
                </div>
                <div className="text-sm text-gray-600">Investigadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {users.filter(u => u.role === 'STUDENT').length}
                </div>
                <div className="text-sm text-gray-600">Estudiantes</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de usuarios */}
        <Card title="Lista de Usuarios">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyectos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.department && (
                          <div className="text-xs text-gray-400">{user.department}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getRoleIcon(user.role)}</span>
                        <span className="text-sm text-gray-900">{getRoleLabel(user.role)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Activo' : 
                         user.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-center">
                        <div className="font-medium">{user.projects_count}</div>
                        <div className="text-xs text-gray-500">Proyectos</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-center">
                                        <div className="font-medium">{user.objects_count}</div>
                <div className="text-xs text-gray-500">Objetos</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.last_login).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Ver</Button>
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm" variant="outline">Suspender</Button>
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

export default InstitutionUsersPage; 