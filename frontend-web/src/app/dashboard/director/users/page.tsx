'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  institution: string;
  specialization?: string;
  projects_assigned: number;
  last_active: string;
  created_at: string;
}

const ManageUsersPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carga de usuarios
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          full_name: 'Dr. María González',
          email: 'maria.gonzalez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          institution: 'INAH',
          specialization: 'Arqueología Maya',
          projects_assigned: 2,
          last_active: '2024-01-15T14:30:00Z',
          created_at: '2023-06-15T10:00:00Z'
        },
        {
          id: '2',
          full_name: 'Lic. Carlos Pérez',
          email: 'carlos.perez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          institution: 'INAH',
          specialization: 'Cerámica Prehispánica',
          projects_assigned: 1,
          last_active: '2024-01-15T13:45:00Z',
          created_at: '2023-08-20T10:00:00Z'
        },
        {
          id: '3',
          full_name: 'Est. Ana Martínez',
          email: 'ana.martinez@unam.mx',
          role: 'STUDENT',
          status: 'active',
          institution: 'UNAM',
          specialization: 'Arqueología',
          projects_assigned: 1,
          last_active: '2024-01-15T12:20:00Z',
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '4',
          full_name: 'Dr. Roberto López',
          email: 'roberto.lopez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'inactive',
          institution: 'INAH',
          specialization: 'Arqueología del Centro',
          projects_assigned: 0,
          last_active: '2023-12-20T10:00:00Z',
          created_at: '2023-03-15T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateUser = () => {
    router.push('/dashboard/director/users/new');
  };

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/director/users/${userId}/edit`);
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus as 'active' | 'inactive' } : user
    ));
  };

  const handleAssignProject = (userId: string) => {
    router.push(`/dashboard/director/users/${userId}/assign-project`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      RESEARCHER: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-purple-100 text-purple-800',
      DIRECTOR: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
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
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600">
                Director: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
                Volver al Dashboard
              </Button>
              <Button onClick={handleCreateUser}>
                🆕 Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <Card title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los roles</option>
                <option value="RESEARCHER">Investigadores</option>
                <option value="STUDENT">Estudiantes</option>
                <option value="DIRECTOR">Directores</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de usuarios */}
        <div className="mt-8">
          <Card title={`Usuarios (${filteredUsers.length})`}>
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
                      Proyectos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.institution}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        {user.specialization && (
                          <div className="text-xs text-gray-500 mt-1">{user.specialization}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Activo' : 
                           user.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.projects_assigned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.last_active).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user.id)}
                          >
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={user.status === 'active' ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'}
                          >
                            {user.status === 'active' ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAssignProject(user.id)}
                          >
                            Asignar Proyecto
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                <p className="text-gray-600 mb-6">Ajusta los filtros o crea un nuevo usuario</p>
                <Button onClick={handleCreateUser}>
                  Crear Nuevo Usuario
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
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
      </main>
    </div>
  );
};

export default ManageUsersPage; 