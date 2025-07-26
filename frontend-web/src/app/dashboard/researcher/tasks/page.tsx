'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type: 'fieldwork' | 'analysis' | 'documentation' | 'report' | 'meeting';
  assignedTo: string;
  dueDate: string;
  siteId?: string;
  siteName?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
}

const TasksPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all');

  // Datos simulados de tareas
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Completar excavación cuadrícula A1',
      description: 'Finalizar excavación en cuadrícula A1 del sitio Laguna La Brava',
      priority: 'high',
      status: 'in_progress',
      type: 'fieldwork',
      assignedTo: 'Dr. Carlos Pérez',
      dueDate: '2024-03-15',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      createdAt: '2024-02-01'
    },
    {
      id: '2',
      title: 'Análisis de materiales líticos',
      description: 'Clasificar y analizar artefactos líticos de la excavación',
      priority: 'medium',
      status: 'pending',
      type: 'analysis',
      assignedTo: 'Lic. Ana Rodríguez',
      dueDate: '2024-03-20',
      siteId: '1',
      siteName: 'Sitio Laguna La Brava Norte',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      createdAt: '2024-02-05'
    },
    {
      id: '3',
      title: 'Preparar informe de avance',
      description: 'Redactar informe de avance del proyecto para CONICET',
      priority: 'urgent',
      status: 'pending',
      type: 'report',
      assignedTo: 'Dr. María González',
      dueDate: '2024-03-10',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      createdAt: '2024-02-10'
    },
    {
      id: '4',
      title: 'Reunión de equipo',
      description: 'Reunión semanal para coordinar actividades de campo',
      priority: 'low',
      status: 'completed',
      type: 'meeting',
      assignedTo: 'Todo el equipo',
      dueDate: '2024-03-08',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      createdAt: '2024-03-01'
    },
    {
      id: '5',
      title: 'Documentar hallazgos',
      description: 'Fotografiar y documentar hallazgos de superficie',
      priority: 'medium',
      status: 'pending',
      type: 'documentation',
      assignedTo: 'Téc. Juan López',
      dueDate: '2024-03-25',
      siteId: '2',
      siteName: 'Excavación Arroyo Seco 2',
      projectId: '1',
      projectName: 'Proyecto Cazadores Recolectores - La Laguna',
      createdAt: '2024-02-15'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : task.status === filter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return 'Desconocida';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fieldwork': return '⛏️';
      case 'analysis': return '🔬';
      case 'documentation': return '📝';
      case 'report': return '📊';
      case 'meeting': return '👥';
      default: return '📋';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'fieldwork': return 'Trabajo de Campo';
      case 'analysis': return 'Análisis';
      case 'documentation': return 'Documentación';
      case 'report': return 'Informe';
      case 'meeting': return 'Reunión';
      default: return 'Tarea';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      {hasContext && (
        <ContextBanner
          project={context.project}
          area={context.area}
          site={context.site}
          showBackButton={true}
          showChangeButton={false}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Tareas Pendientes</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Tareas Pendientes</h1>
            <p className="mt-2 text-gray-600">Gestiona las tareas y actividades del proyecto</p>
          </div>
          <Button onClick={() => router.push('/dashboard/researcher')}>
            ➕ Nueva Tarea
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({tasks.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendientes ({tasks.filter(t => t.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_progress')}
            >
              En Progreso ({tasks.filter(t => t.status === 'in_progress').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completadas ({tasks.filter(t => t.status === 'completed').length})
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('cancelled')}
            >
              Canceladas ({tasks.filter(t => t.status === 'cancelled').length})
            </Button>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{getTypeIcon(task.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">👤 Asignada a:</span>
                    {task.assignedTo}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">📅 Fecha límite:</span>
                    <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}>
                      {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      {isOverdue(task.dueDate) && ' (Vencida)'}
                    </span>
                  </div>
                  {task.siteName && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">📍 Sitio:</span>
                      {task.siteName}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">🔍 Tipo:</span>
                    {getTypeText(task.type)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/researcher/tasks/${task.id}`)}
                  >
                    👁️ Ver Detalles
                  </Button>
                  {task.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Marcar como en progreso
                        setTasks(prev => prev.map(t => 
                          t.id === task.id ? { ...t, status: 'in_progress' } : t
                        ));
                      }}
                    >
                      ▶️ Iniciar
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Marcar como completada
                        setTasks(prev => prev.map(t => 
                          t.id === task.id ? { ...t, status: 'completed' } : t
                        ));
                      }}
                    >
                      ✅ Completar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay tareas</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no tienes tareas registradas.'
                  : `No hay tareas en estado "${getStatusText(filter)}".`
                }
              </p>
              <Button onClick={() => router.push('/dashboard/researcher')}>
                Crear Primera Tarea
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TasksPage; 