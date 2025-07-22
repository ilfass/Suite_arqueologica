'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'field' | 'laboratory' | 'research' | 'documentation' | 'analysis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assigned_by: string;
  assigned_at: string;
  due_date: string;
  completed_at?: string;
  project_name: string;
  estimated_hours: number;
  actual_hours?: number;
  supervisor: string;
  attachments_count: number;
  comments_count: number;
}

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {
    // Simular carga de tareas
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          title: 'Documentar hallazgos del Sector Norte',
          description: 'Completar la documentación fotográfica y escrita de los objetos encontrados en el sector norte de la excavación.',
          type: 'documentation',
          priority: 'high',
          status: 'in_progress',
          assigned_by: 'Dr. María González',
          assigned_at: '2024-01-10T10:00:00Z',
          due_date: '2024-01-20T17:00:00Z',
          project_name: 'Proyecto Teotihuacán 2024',
          estimated_hours: 8,
          actual_hours: 4,
          supervisor: 'Dr. María González',
          attachments_count: 3,
          comments_count: 2
        },
        {
          id: '2',
          title: 'Análisis de muestras de suelo',
          description: 'Realizar análisis granulométrico de las muestras de suelo recolectadas en la excavación.',
          type: 'laboratory',
          priority: 'medium',
          status: 'pending',
          assigned_by: 'Lic. Carlos Pérez',
          assigned_at: '2024-01-12T14:30:00Z',
          due_date: '2024-01-25T17:00:00Z',
          project_name: 'Proyecto Teotihuacán 2024',
          estimated_hours: 6,
          supervisor: 'Lic. Carlos Pérez',
          attachments_count: 1,
          comments_count: 0
        },
        {
          id: '3',
          title: 'Revisión de literatura sobre cerámica maya',
          description: 'Revisar y resumir la literatura científica sobre técnicas de fabricación cerámica maya.',
          type: 'research',
          priority: 'low',
          status: 'completed',
          assigned_by: 'Dr. Ana López',
          assigned_at: '2024-01-08T09:15:00Z',
          due_date: '2024-01-15T17:00:00Z',
          completed_at: '2024-01-14T16:30:00Z',
          project_name: 'Proyecto Palenque',
          estimated_hours: 10,
          actual_hours: 12,
          supervisor: 'Dr. Ana López',
          attachments_count: 5,
          comments_count: 3
        },
        {
          id: '4',
          title: 'Mapeo del área de excavación',
          description: 'Completar el mapeo detallado del área de excavación utilizando estación total.',
          type: 'field',
          priority: 'urgent',
          status: 'overdue',
          assigned_by: 'Dr. Pedro Ramírez',
          assigned_at: '2024-01-05T11:00:00Z',
          due_date: '2024-01-12T17:00:00Z',
          project_name: 'Proyecto Teotihuacán 2024',
          estimated_hours: 4,
          actual_hours: 2,
          supervisor: 'Dr. Pedro Ramírez',
          attachments_count: 2,
          comments_count: 1
        },
        {
          id: '5',
          title: 'Análisis estadístico de datos de campo',
          description: 'Realizar análisis estadístico básico de los datos recolectados durante la excavación.',
          type: 'analysis',
          priority: 'medium',
          status: 'pending',
          assigned_by: 'Dr. Carmen Vega',
          assigned_at: '2024-01-13T15:45:00Z',
          due_date: '2024-01-30T17:00:00Z',
          project_name: 'Proyecto Teotihuacán 2024',
          estimated_hours: 8,
          supervisor: 'Dr. Carmen Vega',
          attachments_count: 4,
          comments_count: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartTask = (taskId: string) => {
    router.push(`/dashboard/student/tasks/${taskId}`);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed', completed_at: new Date().toISOString() } : task
    ));
  };

  const handleUpdateProgress = (taskId: string, hours: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, actual_hours: hours } : task
    ));
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      field: 'bg-blue-100 text-blue-800',
      laboratory: 'bg-purple-100 text-purple-800',
      research: 'bg-green-100 text-green-800',
      documentation: 'bg-orange-100 text-orange-800',
      analysis: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      field: '⛏️',
      laboratory: '🔬',
      research: '📚',
      documentation: '📝',
      analysis: '📊'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const diffTime = new Date(dueDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesStatus && matchesPriority;
  });

  if (loading) {
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Mis Tareas
              </h1>
              <p className="text-gray-600">
                Estudiante: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/student')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="overdue">Vencidas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Resumen de tareas */}
        <div className="mt-8">
          <Card title="Resumen de Tareas">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {tasks.filter(t => t.status === 'overdue').length}
                </div>
                <div className="text-sm text-gray-600">Vencidas</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de tareas */}
        <div className="mt-8">
          <Card title={`Tareas (${filteredTasks.length})`}>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getTypeIcon(task.type)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>📁 {task.project_name}</span>
                          <span>👨‍🏫 {task.supervisor}</span>
                          <span>⏱️ {task.estimated_hours}h estimadas</span>
                          {task.actual_hours && (
                            <span>⏱️ {task.actual_hours}h reales</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}>
                          {task.type === 'field' ? 'Campo' : 
                           task.type === 'laboratory' ? 'Laboratorio' : 
                           task.type === 'research' ? 'Investigación' : 
                           task.type === 'documentation' ? 'Documentación' : 'Análisis'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'low' ? 'Baja' : 
                           task.priority === 'medium' ? 'Media' : 
                           task.priority === 'high' ? 'Alta' : 'Urgente'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' ? 'Pendiente' : 
                           task.status === 'in_progress' ? 'En Progreso' : 
                           task.status === 'completed' ? 'Completada' : 'Vencida'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {isOverdue(task.due_date) ? (
                          <span className="text-red-600">Vencida hace {Math.abs(getDaysUntilDue(task.due_date))} días</span>
                        ) : (
                          <span>Vence en {getDaysUntilDue(task.due_date)} días</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStartTask(task.id)}
                      >
                        {task.status === 'completed' ? 'Ver Detalles' : 'Comenzar'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        📎 Archivos ({task.attachments_count})
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        💬 Comentarios ({task.comments_count})
                      </Button>
                    </div>
                    
                    {task.status !== 'completed' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateProgress(task.id, (task.actual_hours || 0) + 1)}
                        >
                          ⏱️ +1h
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          ✅ Completar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
                <p className="text-gray-600">No se encontraron tareas con los filtros aplicados</p>
              </div>
            )}
          </Card>
        </div>

        {/* Próximas tareas */}
        <div className="mt-8">
          <Card title="Próximas Tareas">
            <div className="space-y-3">
              {tasks
                .filter(task => task.status !== 'completed' && !isOverdue(task.due_date))
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .slice(0, 5)
                .map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{getTypeIcon(task.type)}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600">Vence en {getDaysUntilDue(task.due_date)} días</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'low' ? 'Baja' : 
                         task.priority === 'medium' ? 'Media' : 
                         task.priority === 'high' ? 'Alta' : 'Urgente'}
                      </span>
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TasksPage; 