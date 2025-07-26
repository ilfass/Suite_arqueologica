'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'message' | 'comment' | 'notification';
  projectId?: string;
  artifactId?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen: string;
}

interface Project {
  id: string;
  name: string;
  members: string[];
  lastActivity: string;
  status: string;
}

const CollaborationPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  // Datos simulados
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'Dr. María González',
      content: 'He completado el análisis de las muestras de C14 del sitio La Laguna. Los resultados sugieren una ocupación continua durante el Holoceno Tardío.',
      timestamp: '2024-01-20 14:30',
      type: 'message',
      projectId: 'proj-001'
    },
    {
      id: '2',
      sender: 'Lic. Carlos Ruiz',
      content: 'Excelente trabajo María. ¿Podrías compartir los datos para incluirlos en el informe preliminar?',
      timestamp: '2024-01-20 14:45',
      type: 'message',
      projectId: 'proj-001'
    },
    {
      id: '3',
      sender: 'Dra. Ana Martínez',
      content: 'Comentario: La estratigrafía en la unidad CU-03 muestra una secuencia muy interesante. Sugiero documentar con más detalle.',
      timestamp: '2024-01-20 13:20',
      type: 'comment',
      artifactId: 'ART-015'
    },
    {
      id: '4',
      sender: 'Sistema',
      content: 'Nueva versión del proyecto "Cazadores Recolectores Pampa" ha sido subida por Dr. Roberto Silva',
      timestamp: '2024-01-20 12:15',
      type: 'notification',
      projectId: 'proj-002'
    },
    {
      id: '5',
      sender: 'Dr. Roberto Silva',
      content: 'He actualizado el mapeo SIG con los nuevos hallazgos del sector norte. Incluí las coordenadas GPS y las mediciones.',
      timestamp: '2024-01-20 11:30',
      type: 'message',
      projectId: 'proj-001'
    }
  ];

  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. María González',
      role: 'Investigadora Principal',
      avatar: '👩‍🔬',
      status: 'online',
      lastSeen: 'Ahora'
    },
    {
      id: '2',
      name: 'Lic. Carlos Ruiz',
      role: 'Arqueólogo de Campo',
      avatar: '👨‍🔬',
      status: 'online',
      lastSeen: '2 min'
    },
    {
      id: '3',
      name: 'Dra. Ana Martínez',
      role: 'Especialista en Cerámica',
      avatar: '👩‍🔬',
      status: 'busy',
      lastSeen: '15 min'
    },
    {
      id: '4',
      name: 'Dr. Roberto Silva',
      role: 'Geólogo',
      avatar: '👨‍🔬',
      status: 'offline',
      lastSeen: '1 hora'
    },
    {
      id: '5',
      name: 'Lic. Patricia López',
      role: 'Conservadora',
      avatar: '👩‍🔬',
      status: 'online',
      lastSeen: 'Ahora'
    }
  ];

  const mockProjects: Project[] = [
    {
      id: 'proj-001',
      name: 'Cazadores Recolectores de la Pampa Húmeda',
      members: ['Dr. María González', 'Lic. Carlos Ruiz', 'Dra. Ana Martínez'],
      lastActivity: '2024-01-20 14:45',
      status: 'Activo'
    },
    {
      id: 'proj-002',
      name: 'Análisis de ADN Antiguo en Restos Óseos',
      members: ['Dr. Roberto Silva', 'Dra. Patricia López'],
      lastActivity: '2024-01-20 12:15',
      status: 'En Revisión'
    },
    {
      id: 'proj-003',
      name: 'Metodología de Excavación en Sitios Pampeanos',
      members: ['Dr. María González', 'Lic. Carlos Ruiz'],
      lastActivity: '2024-01-19 16:30',
      status: 'Completado'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
    setTeamMembers(mockTeamMembers);
    setProjects(mockProjects);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: user?.full_name || 'Usuario',
        content: newMessage,
        timestamp: new Date().toLocaleString(),
        type: 'message',
        projectId: selectedProject !== 'all' ? selectedProject : undefined
      };
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'comment': return '💭';
      case 'notification': return '🔔';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Colaboración
                </h1>
                <p className="mt-2 text-gray-600">
                  Comunicación y trabajo en equipo
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  📅 Calendario
                </Button>
                <Button variant="outline">
                  📋 Tareas
                </Button>
                <Button variant="primary">
                  👥 Invitar Miembro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Members */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Equipo de Trabajo
                </h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">{member.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                        <p className="text-xs text-gray-400">Última vez: {member.lastSeen}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        💬
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Projects */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Proyectos Activos
                </h3>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.members.length} miembros • {project.lastActivity}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {project.status}
                        </span>
                        <Button variant="outline" size="sm">
                          👁️ Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mensajes del Equipo
                  </h3>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="all">Todos los proyectos</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                {/* Messages List */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {messages
                    .filter(msg => selectedProject === 'all' || msg.projectId === selectedProject)
                    .map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm">{getMessageTypeIcon(message.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {message.projectId && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {projects.find(p => p.id === message.projectId)?.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="primary" onClick={handleSendMessage}>
                    📤 Enviar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Collaboration Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Calendar */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Calendario Compartido
                  </h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📅</span>
                      <p className="text-gray-600">Calendario de actividades</p>
                      <p className="text-sm text-gray-500">Integración con Google Calendar</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">Reunión de equipo</span>
                      <span className="text-xs text-blue-600">Hoy 15:00</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Excavación sitio La Laguna</span>
                      <span className="text-xs text-green-600">Mañana 08:00</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Version Control */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Control de Versiones
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">Informe La Laguna v2.1</p>
                        <p className="text-xs text-gray-500">Actualizado hace 2 horas</p>
                      </div>
                      <Button variant="outline" size="sm">
                        📥 Descargar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">Datos SIG v1.5</p>
                        <p className="text-xs text-gray-500">Actualizado hace 1 día</p>
                      </div>
                      <Button variant="outline" size="sm">
                        📥 Descargar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">Fotos de campo v3.0</p>
                        <p className="text-xs text-gray-500">Actualizado hace 3 días</p>
                      </div>
                      <Button variant="outline" size="sm">
                        📥 Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Audit Log */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Registro de Auditoría
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 text-sm">
                    <span>Dr. María González actualizó datos de C14</span>
                    <span className="text-gray-500">Hace 30 min</span>
                  </div>
                  <div className="flex items-center justify-between p-2 text-sm">
                    <span>Lic. Carlos Ruiz subió fotos de excavación</span>
                    <span className="text-gray-500">Hace 1 hora</span>
                  </div>
                  <div className="flex items-center justify-between p-2 text-sm">
                    <span>Dra. Ana Martínez comentó en artefacto ART-015</span>
                    <span className="text-gray-500">Hace 2 horas</span>
                  </div>
                  <div className="flex items-center justify-between p-2 text-sm">
                    <span>Dr. Roberto Silva creó nuevo proyecto</span>
                    <span className="text-gray-500">Hace 1 día</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage; 