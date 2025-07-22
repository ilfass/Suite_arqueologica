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
  subscription_plan: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  institution: string;
  created_at: string;
  last_login: string;
  storage_used: string;
  storage_limit: string;
  projects_count: number;
  subscription_expires: string;
}

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
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
          subscription_plan: 'premium',
          status: 'active',
          institution: 'INAH',
          created_at: '2023-06-15T10:00:00Z',
          last_login: '2024-01-15T14:30:00Z',
          storage_used: '2.5 GB',
          storage_limit: '10 GB',
          projects_count: 3,
          subscription_expires: '2024-12-31T23:59:59Z'
        },
        {
          id: '2',
          full_name: 'Lic. Carlos Pérez',
          email: 'carlos.perez@unam.mx',
          role: 'RESEARCHER',
          subscription_plan: 'basic',
          status: 'active',
          institution: 'UNAM',
          created_at: '2023-08-20T10:00:00Z',
          last_login: '2024-01-15T13:45:00Z',
          storage_used: '1.2 GB',
          storage_limit: '5 GB',
          projects_count: 1,
          subscription_expires: '2024-06-30T23:59:59Z'
        },
        {
          id: '3',
          full_name: 'Est. Ana Martínez',
          email: 'ana.martinez@udg.mx',
          role: 'STUDENT',
          subscription_plan: 'free',
          status: 'active',
          institution: 'Universidad de Guadalajara',
          created_at: '2024-01-10T10:00:00Z',
          last_login: '2024-01-15T12:20:00Z',
          storage_used: '500 MB',
          storage_limit: '1 GB',
          projects_count: 1,
          subscription_expires: '2024-12-31T23:59:59Z'
        },
        {
          id: '4',
          full_name: 'Dr. Roberto López',
          email: 'roberto.lopez@inah.gob.mx',
          role: 'DIRECTOR',
          subscription_plan: 'premium',
          status: 'suspended',
          institution: 'INAH',
          created_at: '2023-03-15T10:00:00Z',
          last_login: '2023-12-20T10:00:00Z',
          storage_used: '8.5 GB',
          storage_limit: '10 GB',
          projects_count: 5,
          subscription_expires: '2024-03-15T23:59:59Z'
        },
        {
          id: '5',
          full_name: 'Universidad Nacional Autónoma de México',
          email: 'admin@unam.mx',
          role: 'INSTITUTION',
          subscription_plan: 'enterprise',
          status: 'active',
          institution: 'UNAM',
          created_at: '2023-01-01T10:00:00Z',
          last_login: '2024-01-15T16:45:00Z',
          storage_used: '45.2 GB',
          storage_limit: '100 GB',
          projects_count: 12,
          subscription_expires: '2024-12-31T23:59:59Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}/edit`);
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus as 'active' | 'suspended' } : user
    ));
  };

  const handleUpgradePlan = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}/subscription`);
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/dashboard/admin/users/${userId}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      DIRECTOR: 'bg-orange-100 text-orange-800',
      RESEARCHER: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-purple-100 text-purple-800',
      INSTITUTION: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesPlan = selectedPlan === 'all' || user.subscription_plan === selectedPlan;
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.institution.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesPlan && matchesSearch;
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
                Administrador: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push('/dashboard/admin/users/new')}>
                🆕 Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card title="Filtros y Búsqueda">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, email o institución..."
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
                <option value="ADMIN">Administradores</option>
                <option value="DIRECTOR">Directores</option>
                <option value="RESEARCHER">Investigadores</option>
                <option value="STUDENT">Estudiantes</option>
                <option value="INSTITUTION">Instituciones</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los planes</option>
                <option value="free">Gratuito</option>
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Empresarial</option>
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
          <Card title="Estadísticas de Usuarios">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                  {users.filter(u => u.subscription_plan === 'premium').length}
                </div>
                <div className="text-sm text-gray-600">Usuarios Premium</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {users.filter(u => u.subscription_plan === 'enterprise').length}
                </div>
                <div className="text-sm text-gray-600">Instituciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {users.filter(u => u.status === 'suspended').length}
                </div>
                <div className="text-sm text-gray-600">Suspendidos</div>
              </div>
            </div>
          </Card>
        </div>

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
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(user.subscription_plan)}`}>
                          {user.subscription_plan === 'free' ? 'Gratuito' : 
                           user.subscription_plan === 'basic' ? 'Básico' : 
                           user.subscription_plan === 'premium' ? 'Premium' : 'Empresarial'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Expira: {new Date(user.subscription_expires).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? 'Activo' : 
                           user.status === 'inactive' ? 'Inactivo' : 
                           user.status === 'suspended' ? 'Suspendido' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{user.storage_used} / {user.storage_limit}</div>
                          <div className="text-xs text-gray-500">{user.projects_count} proyectos</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            Ver
                          </Button>
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
                            onClick={() => handleUpgradePlan(user.id)}
                          >
                            Suscripción
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={user.status === 'active' ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'}
                          >
                            {user.status === 'active' ? 'Suspender' : 'Activar'}
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
                <p className="text-gray-600 mb-6">Ajusta los filtros para ver más opciones</p>
                <Button onClick={() => router.push('/dashboard/admin/users/new')}>
                  Crear Nuevo Usuario
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage; 