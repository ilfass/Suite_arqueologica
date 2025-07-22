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
  director: string;
  status: 'active' | 'completed' | 'suspended' | 'planning';
  start_date: string;
  end_date?: string;
  budget: number;
  budget_used: number;
  team_size: number;
  sites_count: number;
  objects_count: number;
  excavations_count: number;
  progress_percentage: number;
  last_update: string;
}

interface Researcher {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  projects_assigned: number;
  last_active: string;
  specialization: string;
  academic_degree: string;
  publications_count: number;
}

interface InstitutionalReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'project';
  period: string;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  created_by: string;
  created_at: string;
  projects_covered: number;
  researchers_involved: number;
}

interface Collaboration {
  id: string;
  institution_name: string;
  agreement_type: 'research' | 'excavation' | 'publication' | 'training';
  status: 'active' | 'expired' | 'pending';
  start_date: string;
  end_date: string;
  contact_person: string;
  contact_email: string;
  projects_count: number;
}

const InstitutionDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [reports, setReports] = useState<InstitutionalReport[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalResearchers: 0,
    totalSites: 0,
    totalObjects: 0,
    totalExcavations: 0,
    totalBudget: 0,
    budgetUsed: 0,
    activeCollaborations: 0,
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
          director: 'Dr. Roberto Martínez',
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          budget: 2500000,
          budget_used: 1200000,
          team_size: 12,
          sites_count: 3,
          objects_count: 156,
          excavations_count: 5,
          progress_percentage: 65,
          last_update: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          name: 'Excavación Chichen Itza',
          description: 'Nuevas excavaciones en el templo principal',
          director: 'Dr. Elena Rodríguez',
          status: 'planning',
          start_date: '2024-06-01',
          end_date: '2024-12-31',
          budget: 1800000,
          budget_used: 0,
          team_size: 8,
          sites_count: 1,
          objects_count: 0,
          excavations_count: 0,
          progress_percentage: 0,
          last_update: '2024-01-10T10:00:00Z'
        },
        {
          id: '3',
          name: 'Proyecto Palenque',
          description: 'Documentación del palacio real',
          director: 'Dr. Carlos Pérez',
          status: 'completed',
          start_date: '2023-09-01',
          end_date: '2024-01-31',
          budget: 1500000,
          budget_used: 1500000,
          team_size: 6,
          sites_count: 1,
          objects_count: 89,
          excavations_count: 3,
          progress_percentage: 100,
          last_update: '2024-01-31T16:00:00Z'
        }
      ]);

      setResearchers([
        {
          id: '1',
          full_name: 'Dr. Roberto Martínez',
          email: 'roberto.martinez@inah.gob.mx',
          role: 'DIRECTOR',
          status: 'active',
          projects_assigned: 2,
          last_active: '2024-01-15T14:30:00Z',
          specialization: 'Arqueología Maya',
          academic_degree: 'Doctorado',
          publications_count: 15
        },
        {
          id: '2',
          full_name: 'Dr. María González',
          email: 'maria.gonzalez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          projects_assigned: 1,
          last_active: '2024-01-15T13:45:00Z',
          specialization: 'Arqueología del Centro de México',
          academic_degree: 'Doctorado',
          publications_count: 8
        },
        {
          id: '3',
          full_name: 'Lic. Carlos Pérez',
          email: 'carlos.perez@inah.gob.mx',
          role: 'RESEARCHER',
          status: 'active',
          projects_assigned: 1,
          last_active: '2024-01-15T12:20:00Z',
          specialization: 'Cerámica Prehispánica',
          academic_degree: 'Maestría',
          publications_count: 5
        }
      ]);

      setReports([
        {
          id: '1',
          title: 'Reporte Anual 2023',
          type: 'annual',
          period: '2023',
          status: 'completed',
          created_by: 'Dr. Roberto Martínez',
          created_at: '2024-01-10T10:00:00Z',
          projects_covered: 3,
          researchers_involved: 8
        },
        {
          id: '2',
          title: 'Reporte Mensual - Enero 2024',
          type: 'monthly',
          period: 'Enero 2024',
          status: 'in_progress',
          created_by: 'Dr. Elena Rodríguez',
          created_at: '2024-01-15T10:00:00Z',
          projects_covered: 2,
          researchers_involved: 5
        },
        {
          id: '3',
          title: 'Reporte Proyecto Teotihuacán',
          type: 'project',
          period: 'Q1 2024',
          status: 'draft',
          created_by: 'Dr. María González',
          created_at: '2024-01-14T16:00:00Z',
          projects_covered: 1,
          researchers_involved: 12
        }
      ]);

      setCollaborations([
        {
          id: '1',
          institution_name: 'Universidad Nacional Autónoma de México',
          agreement_type: 'research',
          status: 'active',
          start_date: '2023-01-01',
          end_date: '2025-12-31',
          contact_person: 'Dr. Ana López',
          contact_email: 'ana.lopez@unam.mx',
          projects_count: 2
        },
        {
          id: '2',
          institution_name: 'Universidad de Guadalajara',
          agreement_type: 'training',
          status: 'active',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          contact_person: 'Dr. Pedro Ramírez',
          contact_email: 'pedro.ramirez@udg.mx',
          projects_count: 1
        },
        {
          id: '3',
          institution_name: 'Museo Nacional de Antropología',
          agreement_type: 'publication',
          status: 'pending',
          start_date: '2024-03-01',
          end_date: '2024-12-31',
          contact_person: 'Lic. Carmen Vega',
          contact_email: 'carmen.vega@mna.inah.gob.mx',
          projects_count: 0
        }
      ]);

      setStats({
        totalProjects: 3,
        activeProjects: 1,
        totalResearchers: 3,
        totalSites: 5,
        totalObjects: 245,
        totalExcavations: 8,
        totalBudget: 5800000,
        budgetUsed: 2700000,
        activeCollaborations: 2,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateReport = () => {
    router.push('/dashboard/institution/reports/new');
  };

  const handleManageResearchers = () => {
    router.push('/dashboard/institution/researchers');
  };

  const handleViewProjects = () => {
    router.push('/dashboard/institution/projects');
  };

  const handleCollaborations = () => {
    router.push('/dashboard/institution/collaborations');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      planning: 'bg-gray-100 text-gray-800',
      draft: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard institucional...</p>
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
                Panel Institucional
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name} - Supervisión de Proyectos Arqueológicos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                INSTITUTION • {user?.institution}
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
              <div className="text-3xl font-bold text-purple-600">{stats.totalResearchers}</div>
              <div className="text-sm text-gray-600">Investigadores</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.activeCollaborations}</div>
              <div className="text-sm text-gray-600">Colaboraciones Activas</div>
            </div>
          </Card>
        </div>

        {/* Budget Overview */}
        <div className="mb-8">
          <Card title="Resumen Presupuestario">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalBudget)}</div>
                <div className="text-sm text-gray-600">Presupuesto Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.budgetUsed)}</div>
                <div className="text-sm text-gray-600">Presupuesto Utilizado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalBudget - stats.budgetUsed)}</div>
                <div className="text-sm text-gray-600">Presupuesto Disponible</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso Presupuestario</span>
                <span>{Math.round((stats.budgetUsed / stats.totalBudget) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.budgetUsed / stats.totalBudget) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card title="Acciones Rápidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={handleCreateReport}
                className="w-full"
              >
                📊 Generar Reporte
              </Button>
              <Button 
                variant="outline"
                onClick={handleManageResearchers}
                className="w-full"
              >
                👥 Gestionar Investigadores
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewProjects}
                className="w-full"
              >
                🏛️ Ver Proyectos
              </Button>
              <Button 
                variant="outline"
                onClick={handleCollaborations}
                className="w-full"
              >
                🤝 Colaboraciones
              </Button>
            </div>
          </Card>
        </div>

        {/* Projects and Researchers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <Card title="Proyectos Activos">
            <div className="space-y-4">
              {projects.filter(p => p.status === 'active').map((project) => (
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
                      <span className="text-gray-500">Director:</span>
                      <span className="font-medium ml-1">{project.director}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Equipo:</span>
                      <span className="font-medium ml-1">{project.team_size} personas</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Presupuesto:</span>
                      <span className="font-medium ml-1">{formatCurrency(project.budget)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Utilizado:</span>
                      <span className="font-medium ml-1">{formatCurrency(project.budget_used)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{project.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="outline">Reporte</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Researchers */}
          <Card title="Investigadores Activos">
            <div className="space-y-4">
              {researchers.map((researcher) => (
                <div key={researcher.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{researcher.full_name}</h3>
                      <p className="text-sm text-gray-600">{researcher.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(researcher.status)}`}>
                      {researcher.status === 'active' ? 'Activo' : 
                       researcher.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Rol:</span>
                      <span className="font-medium ml-1">{researcher.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Proyectos:</span>
                      <span className="font-medium ml-1">{researcher.projects_assigned}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Especialidad:</span>
                      <span className="font-medium ml-1">{researcher.specialization}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Publicaciones:</span>
                      <span className="font-medium ml-1">{researcher.publications_count}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Perfil</Button>
                      <Button size="sm" variant="outline">Proyectos</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reports and Collaborations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Reports */}
          <Card title="Reportes Recientes">
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status === 'draft' ? 'Borrador' : 
                       report.status === 'in_progress' ? 'En Progreso' : 
                       report.status === 'completed' ? 'Completado' : 'Aprobado'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium ml-1">
                        {report.type === 'monthly' ? 'Mensual' : 
                         report.type === 'quarterly' ? 'Trimestral' : 
                         report.type === 'annual' ? 'Anual' : 'Proyecto'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Período:</span>
                      <span className="font-medium ml-1">{report.period}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Proyectos:</span>
                      <span className="font-medium ml-1">{report.projects_covered}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Investigadores:</span>
                      <span className="font-medium ml-1">{report.researchers_involved}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Reporte</Button>
                      <Button size="sm" variant="outline">Descargar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Collaborations */}
          <Card title="Colaboraciones Institucionales">
            <div className="space-y-4">
              {collaborations.map((collaboration) => (
                <div key={collaboration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{collaboration.institution_name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}>
                      {collaboration.status === 'active' ? 'Activa' : 
                       collaboration.status === 'expired' ? 'Expirada' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium ml-1">
                        {collaboration.agreement_type === 'research' ? 'Investigación' : 
                         collaboration.agreement_type === 'excavation' ? 'Excavación' : 
                         collaboration.agreement_type === 'publication' ? 'Publicación' : 'Capacitación'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Proyectos:</span>
                      <span className="font-medium ml-1">{collaboration.projects_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contacto:</span>
                      <span className="font-medium ml-1">{collaboration.contact_person}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vigencia:</span>
                      <span className="font-medium ml-1">{collaboration.end_date}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="outline">Contactar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Institutional Statistics */}
        <div className="mt-8">
          <Card title="Estadísticas Institucionales">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSites}</div>
                <div className="text-sm text-gray-600">Sitios Arqueológicos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalObjects}</div>
                <div className="text-sm text-gray-600">Objetos Catalogados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalExcavations}</div>
                <div className="text-sm text-gray-600">Excavaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalResearchers}</div>
                <div className="text-sm text-gray-600">Investigadores</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InstitutionDashboardPage; 