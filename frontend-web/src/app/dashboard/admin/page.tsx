'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSites: 0,
    totalObjects: 0,
    totalExcavations: 0,
    activeUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de estadísticas para el demo
    setTimeout(() => {
      setStats({
        totalUsers: 156,
        totalSites: 89,
        totalObjects: 1247,
        totalExcavations: 67,
        activeUsers: 89,
        premiumUsers: 23,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleAction = (action: string) => {
    console.log(`Acción admin: ${action}`);
    
    switch (action) {
      case 'Ver usuarios':
        router.push('/dashboard/admin/users');
        break;
      case 'Gestionar suscripciones':
        router.push('/dashboard/admin/subscriptions');
        break;
      case 'Ver reportes':
        router.push('/dashboard/admin/reports');
        break;
      case 'Exportar datos':
        router.push('/dashboard/admin/export');
        break;
      case 'Configuración':
        router.push('/dashboard/admin/settings');
        break;
      case 'Políticas':
        router.push('/dashboard/admin/policies');
        break;
      case 'Ver instituciones':
        router.push('/dashboard/admin/institutions');
        break;
      case 'Aprobar solicitudes':
        router.push('/dashboard/admin/approvals');
        break;
      case 'Crear backup':
        router.push('/dashboard/admin/backup');
        break;
      case 'Logs de seguridad':
        router.push('/dashboard/admin/security-logs');
        break;
      case 'Ver tickets':
        router.push('/dashboard/admin/support');
        break;
      case 'Documentación':
        router.push('/dashboard/admin/documentation');
        break;
      default:
        alert(`Función ${action} - En desarrollo`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard administrativo...</p>
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
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                ADMIN • PREMIUM
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
                data-testid="logout-button"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Usuarios Totales</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.activeUsers}</div>
              <div className="text-sm text-gray-600">Usuarios Activos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.premiumUsers}</div>
              <div className="text-sm text-gray-600">Usuarios Premium</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalSites}</div>
              <div className="text-sm text-gray-600">Sitios Arqueológicos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalObjects}</div>
              <div className="text-sm text-gray-600">Objetos Catalogados</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.totalExcavations}</div>
              <div className="text-sm text-gray-600">Excavaciones</div>
            </div>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Gestión de Usuarios"
            subtitle="Administra cuentas y permisos"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Gestiona usuarios, roles, suscripciones y límites de uso.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Ver usuarios')}>Ver usuarios</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Gestionar suscripciones')}>Gestionar suscripciones</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Estadísticas del Sistema"
            subtitle="Métricas y reportes"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Analiza el uso de la plataforma y genera reportes.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Ver reportes')}>Ver reportes</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Exportar datos')}>Exportar datos</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Configuración del Sistema"
            subtitle="Ajustes globales"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Configura parámetros del sistema y políticas de uso.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Configuración')}>Configuración</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Políticas')}>Políticas</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Gestión de Instituciones"
            subtitle="Administra instituciones"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Gestiona instituciones y sus investigadores asociados.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Ver instituciones')}>Ver instituciones</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Aprobar solicitudes')}>Aprobar solicitudes</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Backup y Seguridad"
            subtitle="Respaldo de datos"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Gestiona respaldos y configuración de seguridad.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Crear backup')}>Crear backup</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Logs de seguridad')}>Logs de seguridad</Button>
              </div>
            </div>
          </Card>

          <Card
            title="Soporte y Ayuda"
            subtitle="Atención al usuario"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Gestiona tickets de soporte y documentación.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleAction('Ver tickets')}>Ver tickets</Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('Documentación')}>Documentación</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="mt-8">
          <Card title="Navegación Rápida">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/sites')}
                className="w-full"
              >
                🏛️ Sitios Arqueológicos
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/objects')}
                className="w-full"
              >
                🏺 Objetos
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/excavations')}
                className="w-full"
              >
                ⛏️ Excavaciones
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/plans')}
                className="w-full"
              >
                💳 Planes y Suscripciones
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card title="Actividad Reciente del Sistema">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Nuevo usuario registrado</p>
                  <p className="text-xs text-gray-500">dr.perez@unam.mx - hace 30 minutos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Suscripción actualizada</p>
                  <p className="text-xs text-gray-500">Universidad de Guadalajara - hace 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Backup automático completado</p>
                  <p className="text-xs text-gray-500">Base de datos - hace 6 horas</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage; 