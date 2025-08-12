'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardStats {
  sites: number;
  objects: number;
  excavations: number;
  projects: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    sites: 0,
    objects: 0,
    excavations: 0,
    projects: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      fetchDashboardStats();
    }
  }, [user, loading]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      
      // Obtener token de autenticación
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No hay token de autenticación');
        return;
      }
      
      // Fetch stats from API con autenticación
      const [sitesRes, objectsRes, excavationsRes] = await Promise.all([
        fetch('/api/sites', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/objects', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/excavations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const sites = sitesRes.ok ? await sitesRes.json() : { data: [] };
      const objects = objectsRes.ok ? await objectsRes.json() : { data: [] };
      const excavations = excavationsRes.ok ? await excavationsRes.json() : { data: [] };

      setStats({
        sites: sites.data?.length || 0,
        objects: objects.data?.length || 0,
        excavations: excavations.data?.length || 0,
        projects: 0 // TODO: Implement projects API
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      admin: 'Administrador',
      researcher: 'Investigador',
      student: 'Estudiante',
      director: 'Director',
      institution: 'Institución',
      guest: 'Invitado'
    };
    return roleNames[role] || role;
  };

  const getWelcomeMessage = (role: string) => {
    const messages: { [key: string]: string } = {
      admin: 'Bienvenido al panel de administración',
      researcher: 'Bienvenido a tu espacio de investigación',
      student: 'Bienvenido a tu área de estudio',
      director: 'Bienvenido al panel de dirección',
      institution: 'Bienvenido al panel institucional',
      guest: 'Bienvenido a la Suite Arqueológica'
    };
    return messages[role] || 'Bienvenido al dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getWelcomeMessage(user.role)}
          </h1>
          <p className="mt-2 text-gray-600">
            Rol: {getRoleDisplayName(user.role)} | {user.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">🏛️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sitios Arqueológicos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.sites}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">🏺</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Objetos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.objects}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">⛏️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Excavaciones
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.excavations}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-lg">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Proyectos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loadingStats ? '...' : stats.projects}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/sites"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    🏛️
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Ver Sitios
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Explorar sitios arqueológicos registrados
                  </p>
                </div>
              </a>

              <a
                href="/objects"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    🏺
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Ver Objetos
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Revisar catálogo de objetos arqueológicos
                  </p>
                </div>
              </a>

              <a
                href="/excavations"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    ⛏️
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Ver Excavaciones
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Consultar proyectos de excavación
                  </p>
                </div>
              </a>

              <a
                href="/profile"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-700 ring-4 ring-white">
                    👤
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Mi Perfil
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gestionar información personal
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500">No hay actividad reciente</p>
              <p className="text-sm text-gray-400 mt-2">
                Las actividades aparecerán aquí cuando comiences a usar el sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 