'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'suspended' | 'planning';
  start_date: string;
  end_date?: string;
  team_size: number;
  sites_count: number;
  objects_count: number;
  excavations_count: number;
  budget?: number;
  institution: string;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  last_active: string;
  projects_assigned: number;
}

interface ApprovalRequest {
  id: string;
  type: 'site' | 'artifact' | 'excavation' | 'report';
  title: string;
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

const DirectorDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    totalSites: 0,
    totalObjects: 0,
    totalExcavations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos para el demo
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Proyecto Teotihuacán 2024',
          description: 'Investigación integral de la ciudad de Teotihuacán',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          team_size: 12,
          sites_count: 3,
          objects_count: 156,
          excavations_count: 5,
          budget: 2500000,
          institution: 'INAH',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Excavación Chichen Itza',
          description: 'Nuevas excavaciones en el templo principal',
          status: 'planning',
          start_date: '2024-06-01',
          team_size: 8,
          sites_count: 1,
          objects_count: 0,
          excavations_count: 0,
          budget: 1800000,
          institution: 'INAH',
          created_at: '2024-03-01T10:00:00Z'
        }
      ]);

      setUsers([
        {
          id: '1',
          full_name: 'Dr. María González',
          email: 'maria.gonzalez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          last_active: '2024-01-15T14:30:00Z',
          projects_assigned: 2
        },
        {
          id: '2',
          full_name: 'Lic. Carlos Pérez',
          email: 'carlos.perez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          last_active: '2024-01-15T13:45:00Z',
          projects_assigned: 1
        },
        {
          id: '3',
          full_name: 'Est. Ana Martínez',
          email: 'ana.martinez@unam.mx',
          role: 'STUDENT',
          status: 'active',
          last_active: '2024-01-15T12:20:00Z',
          projects_assigned: 1
        }
      ]);

      setApprovalRequests([
        {
          id: '1',
          type: 'site',
          title: 'Nuevo sitio: Templo de la Luna',
          submitted_by: 'Dr. María González',
          submitted_at: '2024-01-15T10:30:00Z',
          status: 'pending',
          priority: 'high'
        },
        {
          id: '2',
          type: 'artifact',
          title: 'Máscara de Jade - Catálogo ART-001',
          submitted_by: 'Lic. Carlos Pérez',
          submitted_at: '2024-01-15T09:15:00Z',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'report',
          title: 'Reporte preliminar - Sector Norte',
          submitted_by: 'Dr. María González',
          submitted_at: '2024-01-14T16:45:00Z',
          status: 'pending',
          priority: 'low'
        }
      ]);

      setStats({
        totalProjects: 2,
        activeProjects: 1,
        totalUsers: 3,
        pendingApprovals: 3,
        totalSites: 4,
        totalObjects: 156,
        totalExcavations: 5,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateProject = () => {
    router.push('/dashboard/director/projects/new');
  };

  const handleManageUsers = () => {
    router.push('/dashboard/director/users');
  };

  const handleApprovals = () => {
    router.push('/dashboard/director/approvals');
  };

  const handleReports = () => {
    router.push('/dashboard/director/reports');
  };

  const handleBackup = () => {
    router.push('/dashboard/director/backup');
  };

  const handleViewProjectDetails = (projectId: string) => {
    router.push(`/dashboard/director/projects/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/director/projects/${projectId}/edit`);
  };

  const handleViewApprovalDetails = (approvalId: string) => {
    router.push(`/dashboard/director/approvals/${approvalId}`);
  };

  const handleApproveRequest = (approvalId: string) => {
    router.push(`/dashboard/director/approvals/${approvalId}/approve`);
  };

  const handleRejectRequest = (approvalId: string) => {
    router.push(`/dashboard/director/approvals/${approvalId}/reject`);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/dashboard/director/users/${userId}/edit`);
  };

  const handleDeactivateUser = (userId: string) => {
    router.push(`/dashboard/director/users/${userId}/deactivate`);
  };

  const handleSystemAction = (action: string) => {
    switch (action) {
      case 'templates':
        router.push('/dashboard/director/system/templates');
        break;
      case 'reports':
        router.push('/dashboard/director/system/reports');
        break;
      case 'projects':
        router.push('/dashboard/director/system/projects');
        break;
      case 'logs':
        router.push('/dashboard/director/system/logs');
        break;
      case 'policies':
        router.push('/dashboard/director/system/policies');
        break;
      case 'monthly-report':
        router.push('/dashboard/director/system/monthly-report');
        break;
      case 'stats':
        router.push('/dashboard/director/system/stats');
        break;
      case 'audit':
        router.push('/dashboard/director/system/audit');
        break;
      default:
        alert('Función en desarrollo');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      planning: 'bg-gray-100 text-gray-800',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard de director...</p>
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
                Panel de Dirección
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name} - Gestión de Proyectos Arqueológicos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                DIRECTOR • {user?.institution}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-300 hover:bg-red-50"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Proyectos Totales</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.activeProjects}</div>
              <div className="text-sm text-gray-600">Proyectos Activos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Usuarios Activos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</div>
              <div className="text-sm text-gray-600">Aprobaciones Pendientes</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card title="Acciones Rápidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={handleCreateProject}
                className="w-full"
              >
                🆕 Nuevo Proyecto
              </Button>
              <Button 
                variant="outline"
                onClick={handleManageUsers}
                className="w-full"
              >
                👥 Gestionar Usuarios
              </Button>
              <Button 
                variant="outline"
                onClick={handleApprovals}
                className="w-full"
              >
                ✅ Aprobaciones ({stats.pendingApprovals})
              </Button>
              <Button 
                variant="outline"
                onClick={handleReports}
                className="w-full"
              >
                📊 Generar Reportes
              </Button>
            </div>
          </Card>
        </div>

        {/* Projects and Approvals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects */}
          <Card title="Proyectos Activos">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'active' ? 'Activo' : 
                       project.status === 'completed' ? 'Completado' : 
                       project.status === 'suspended' ? 'Suspendido' : 'Planificación'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Equipo:</span>
                      <span className="font-medium ml-1">{project.team_size} personas</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sitios:</span>
                      <span className="font-medium ml-1">{project.sites_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Objetos:</span>
                      <span className="font-medium ml-1">{project.objects_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Excavaciones:</span>
                      <span className="font-medium ml-1">{project.excavations_count}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewProjectDetails(project.id)}>Ver Detalles</Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditProject(project.id)}>Editar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Approval Requests */}
          <Card title="Solicitudes de Aprobación">
            <div className="space-y-4">
              {approvalRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600">Por: {request.submitted_by}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? 'Pendiente' : 
                         request.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority === 'high' ? 'Alta' : 
                         request.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Enviado: {new Date(request.submitted_at).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveRequest(request.id)}>Aprobar</Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => handleRejectRequest(request.id)}>Rechazar</Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewApprovalDetails(request.id)}>Ver Detalles</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Management */}
        <div className="mt-8">
          <Card title="Gestión de Equipo">
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
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
                          <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>Editar</Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => handleDeactivateUser(user.id)}>Desactivar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Management */}
        <div className="mt-8">
          <Card title="Gestión del Sistema">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Configuración</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('templates')}>Plantillas de Fichas</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('reports')}>Formatos de Reporte</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('projects')}>Configuración de Proyectos</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Seguridad</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={handleBackup} className="w-full">Crear Backup</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('logs')}>Logs de Acceso</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('policies')}>Políticas de Seguridad</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Reportes</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('monthly-report')}>Reporte Mensual</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('stats')}>Estadísticas de Uso</Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleSystemAction('audit')}>Auditoría</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DirectorDashboardPage; 