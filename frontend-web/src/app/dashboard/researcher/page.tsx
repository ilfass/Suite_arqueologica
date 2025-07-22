'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ResearcherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const fieldTools = [
    {
      id: 'projects',
      name: 'Gestión de Proyectos',
      icon: '📋',
      description: 'Crear, editar y archivar proyectos arqueológicos',
      color: 'bg-blue-500'
    },
    {
      id: 'mapping',
      name: 'Mapeo SIG Integrado',
      icon: '🗺️',
      description: 'Planificación y mapeo del sitio con GPS',
      color: 'bg-green-500'
    },
    {
      id: 'samples',
      name: 'Gestión de Muestras',
      icon: '🧪',
      description: 'Registro y análisis de muestras arqueológicas',
      color: 'bg-yellow-500'
    },
    {
      id: 'artifacts',
      name: 'Gestión de Hallazgos',
      icon: '🏺',
      description: 'Inventario y catalogación de artefactos',
      color: 'bg-purple-500'
    },
    {
      id: 'visualization',
      name: 'Visualización de Datos',
      icon: '📊',
      description: 'Dashboard analítico y gráficos',
      color: 'bg-red-500'
    },
    {
      id: 'reports',
      name: 'Editor Académico',
      icon: '📝',
      description: 'Generador de informes y publicaciones',
      color: 'bg-indigo-500'
    },
    {
      id: 'ai-tools',
      name: 'Herramientas de IA',
      icon: '🤖',
      description: 'Clasificación automática y análisis predictivo',
      color: 'bg-pink-500'
    },
    {
      id: 'collaboration',
      name: 'Colaboración',
      icon: '👥',
      description: 'Mensajería y trabajo en equipo',
      color: 'bg-orange-500'
    },
    {
      id: 'export',
      name: 'Exportación',
      icon: '📤',
      description: 'Backups y repositorio de datos',
      color: 'bg-teal-500'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'project',
      title: 'Proyecto Cazadores Recolectores - La Laguna',
      description: 'Inicio de excavación en sitio pampeano',
      date: '2024-01-15',
      status: 'en_progress'
    },
    {
      id: '2',
      type: 'sample',
      title: 'Muestra C14 Enviada al Laboratorio',
      description: 'Carbón de hogar para datación radiocarbono',
      date: '2024-01-14',
      status: 'sent_to_lab'
    },
    {
      id: '3',
      type: 'mapping',
      title: 'Mapeo SIG Completado',
      description: 'Georreferenciación de 15 hallazgos líticos',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: '4',
      type: 'artifact',
      title: 'Punta de Proyectil Documentada',
      description: 'Artefacto lítico con retoque bifacial',
      date: '2024-01-12',
      status: 'documented'
    },
    {
      id: '5',
      type: 'analysis',
      title: 'Análisis de ADN Iniciado',
      description: 'Muestra ósea de guanaco para análisis genético',
      date: '2024-01-11',
      status: 'analyzing'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return '📋';
      case 'sample': return '🧪';
      case 'mapping': return '🗺️';
      case 'artifact': return '🏺';
      case 'analysis': return '🔬';
      case 'excavation': return '⛏️';
      case 'measurement': return '📏';
      case 'photography': return '📷';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'documented': return 'bg-blue-100 text-blue-800';
      case 'sent_to_lab': return 'bg-purple-100 text-purple-800';
      case 'analyzing': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard de Investigador
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenido, {user?.full_name || 'Investigador'}. Herramientas de campo y documentación arqueológica.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⛏️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Excavaciones Activas</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🏺</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Artefactos Documentados</p>
                  <p className="text-2xl font-semibold text-gray-900">127</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📏</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Mediciones Realizadas</p>
                  <p className="text-2xl font-semibold text-gray-900">45</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📷</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Fotos de Campo</p>
                  <p className="text-2xl font-semibold text-gray-900">89</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Field Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Herramientas de Campo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldTools.map((tool) => (
              <Card key={tool.id}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mr-4`}>
                      <span className="text-white text-xl">{tool.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => window.location.href = `/dashboard/researcher/${tool.id}`}
                  >
                    Abrir Herramienta
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{getActivityIcon(activity.type)}</span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📷</span>
              <span className="text-sm">Tomar Foto</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📏</span>
              <span className="text-sm">Medir</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📍</span>
              <span className="text-sm">GPS</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm">Nota de Campo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard; 