'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LogoutButton from '../../../components/ui/LogoutButton';

interface AssignedProject {
  id: string;
  name: string;
  description: string;
  supervisor: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'suspended';
  tasks_assigned: number;
  tasks_completed: number;
  last_activity: string;
}

interface FieldNote {
  id: string;
  title: string;
  project_name: string;
  content: string;
  weather: string;
  temperature: number;
  humidity: number;
  photos_count: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'fieldwork' | 'laboratory' | 'documentation' | 'analysis';
  duration: string;
  completed: boolean;
  progress: number;
}

interface PendingTask {
  id: string;
  title: string;
  project_name: string;
  type: 'data_entry' | 'photo_documentation' | 'measurement' | 'cataloging';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const StudentDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [assignedProjects, setAssignedProjects] = useState<AssignedProject[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [stats, setStats] = useState({
    assignedProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    fieldNotesCount: 0,
    tutorialsCompleted: 0,
    totalTutorials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos para el demo
    setTimeout(() => {
      setAssignedProjects([
        {
          id: '1',
          name: 'Proyecto Teotihuacán - Sector Norte',
          description: 'Participación en excavación del sector norte de Teotihuacán',
          supervisor: 'Dr. María González',
          start_date: '2024-01-15',
          end_date: '2024-06-15',
          status: 'active',
          tasks_assigned: 8,
          tasks_completed: 5,
          last_activity: '2024-01-15T14:30:00Z'
        }
      ]);

      setFieldNotes([
        {
          id: '1',
          title: 'Primer día de excavación',
          project_name: 'Proyecto Teotihuacán - Sector Norte',
          content: 'Hoy fue mi primer día participando en la excavación. Aprendí sobre el uso correcto de las herramientas y la importancia de la documentación detallada.',
          weather: 'Soleado',
          temperature: 28,
          humidity: 65,
          photos_count: 5,
          status: 'submitted',
          feedback: 'Excelente documentación. Continúa con el mismo nivel de detalle.',
          created_at: '2024-01-15T16:30:00Z'
        },
        {
          id: '2',
          title: 'Descubrimiento de fragmento cerámico',
          project_name: 'Proyecto Teotihuacán - Sector Norte',
          content: 'Encontré un fragmento de cerámica decorada. Lo documenté siguiendo el protocolo establecido.',
          weather: 'Nublado',
          temperature: 24,
          humidity: 70,
          photos_count: 3,
          status: 'draft',
          created_at: '2024-01-14T15:45:00Z'
        }
      ]);

      setTutorials([
        {
          id: '1',
          title: 'Introducción a la Arqueología de Campo',
          description: 'Conceptos básicos y técnicas fundamentales para trabajo de campo',
          category: 'fieldwork',
          duration: '2 horas',
          completed: true,
          progress: 100
        },
        {
          id: '2',
          title: 'Documentación Fotográfica Arqueológica',
          description: 'Técnicas de fotografía para documentación arqueológica',
          category: 'documentation',
          duration: '1.5 horas',
          completed: false,
          progress: 60
        },
        {
          id: '3',
                  title: 'Catalogación de Objetos',
        description: 'Procedimientos para catalogar y clasificar objetos',
          category: 'laboratory',
          duration: '3 horas',
          completed: false,
          progress: 0
        }
      ]);

      setPendingTasks([
        {
          id: '1',
          title: 'Documentar hallazgos del sector A',
          project_name: 'Proyecto Teotihuacán - Sector Norte',
          type: 'data_entry',
          priority: 'high',
          due_date: '2024-01-20',
          status: 'in_progress'
        },
        {
          id: '2',
          title: 'Fotografiar fragmentos cerámicos',
          project_name: 'Proyecto Teotihuacán - Sector Norte',
          type: 'photo_documentation',
          priority: 'medium',
          due_date: '2024-01-18',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Medir estructuras identificadas',
          project_name: 'Proyecto Teotihuacán - Sector Norte',
          type: 'measurement',
          priority: 'low',
          due_date: '2024-01-25',
          status: 'pending'
        }
      ]);

      setStats({
        assignedProjects: 1,
        completedTasks: 5,
        pendingTasks: 3,
        fieldNotesCount: 2,
        tutorialsCompleted: 1,
        totalTutorials: 3,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateFieldNote = () => {
    router.push('/dashboard/student/field-notes/new');
  };

  const handleViewTutorials = () => {
    router.push('/dashboard/student/tutorials');
  };

  const handleViewTasks = () => {
    router.push('/dashboard/student/tasks');
  };

  const handleViewPublicData = () => {
    router.push('/dashboard/student/public-data');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-blue-100 text-blue-800'
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
          <p className="mt-4 text-gray-600">Cargando dashboard de estudiante...</p>
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
                Panel de Estudiante
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name} - Aprendizaje y Participación en Proyectos
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                STUDENT • {user?.institution}
              </span>
              <LogoutButton size="sm" />
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
              <div className="text-3xl font-bold text-blue-600">{stats.assignedProjects}</div>
              <div className="text-sm text-gray-600">Proyectos Asignados</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
              <div className="text-sm text-gray-600">Tareas Completadas</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.pendingTasks}</div>
              <div className="text-sm text-gray-600">Tareas Pendientes</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.tutorialsCompleted}/{stats.totalTutorials}</div>
              <div className="text-sm text-gray-600">Tutoriales Completados</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card title="Acciones Rápidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={handleCreateFieldNote}
                className="w-full"
              >
                📝 Nueva Nota de Campo
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewTutorials}
                className="w-full"
              >
                📚 Ver Tutoriales
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewTasks}
                className="w-full"
              >
                ✅ Mis Tareas
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewPublicData}
                className="w-full"
              >
                🌐 Datos Públicos
              </Button>
            </div>
          </Card>
        </div>

        {/* Assigned Projects and Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Projects */}
          <Card title="Proyectos Asignados">
            <div className="space-y-4">
              {assignedProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === 'active' ? 'Activo' : 
                       project.status === 'completed' ? 'Completado' : 'Suspendido'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Supervisor:</span>
                      <span className="font-medium ml-1">{project.supervisor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tareas:</span>
                      <span className="font-medium ml-1">{project.tasks_completed}/{project.tasks_assigned}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Inicio:</span>
                      <span className="font-medium ml-1">{project.start_date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Última Actividad:</span>
                      <span className="font-medium ml-1">{new Date(project.last_activity).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="outline">Ver Tareas</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card title="Tareas Pendientes">
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'pending' ? 'Pendiente' : 
                         task.status === 'in_progress' ? 'En Progreso' : 'Completada'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : 
                         task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Proyecto: {task.project_name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium ml-1">
                        {task.type === 'data_entry' ? 'Entrada de Datos' :
                         task.type === 'photo_documentation' ? 'Documentación Fotográfica' :
                         task.type === 'measurement' ? 'Medición' : 'Catalogación'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha Límite:</span>
                      <span className="font-medium ml-1">{task.due_date}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="outline">Comenzar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Field Notes */}
        <div className="mt-8">
          <Card title="Mis Notas de Campo">
            <div className="space-y-4">
              {fieldNotes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-600">Proyecto: {note.project_name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                        {note.status === 'draft' ? 'Borrador' : 
                         note.status === 'submitted' ? 'Enviada' : 
                         note.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 line-clamp-3">{note.content}</p>
                  {note.feedback && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Feedback:</strong> {note.feedback}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      🌤️ {note.weather} • {note.temperature}°C • {note.humidity}% • 📸 {note.photos_count} fotos
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Completa</Button>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tutorials Progress */}
        <div className="mt-8">
          <Card title="Progreso de Tutoriales">
            <div className="space-y-4">
              {tutorials.map((tutorial) => (
                <div key={tutorial.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600">{tutorial.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tutorial.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tutorial.completed ? 'Completado' : 'En Progreso'}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{tutorial.duration}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{tutorial.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tutorial.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Continuar</Button>
                    <Button size="sm" variant="outline">Ver Certificado</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Learning Resources */}
        <div className="mt-8">
          <Card title="Recursos de Aprendizaje">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">📚 Tutoriales</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">Técnicas de Campo</Button>
                  <Button variant="outline" size="sm" className="w-full">Documentación</Button>
                  <Button variant="outline" size="sm" className="w-full">Laboratorio</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">📖 Guías</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">Manual de Campo</Button>
                  <Button variant="outline" size="sm" className="w-full">Protocolos</Button>
                  <Button variant="outline" size="sm" className="w-full">Glosario</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">🌐 Recursos</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={handleViewPublicData} className="w-full">Datos Públicos</Button>
                  <Button variant="outline" size="sm" className="w-full">Biblioteca Digital</Button>
                  <Button variant="outline" size="sm" className="w-full">Contacto Supervisor</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardPage; 