'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ResearcherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSites: 0,
    totalArtifacts: 0,
    totalSamples: 0,
    pendingTasks: 0,
    recentFindings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de estadísticas para el demo
    setTimeout(() => {
      setStats({
        activeProjects: 3,
        totalSites: 12,
        totalArtifacts: 247,
        totalSamples: 89,
        pendingTasks: 8,
        recentFindings: 15,
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

  // Herramientas organizadas por categorías con ejemplos pampeanos
  const researchTools = [
    // PLANIFICACIÓN Y GESTIÓN
    {
      id: 'projects',
      name: 'Gestión de Proyectos',
      icon: '📋',
      description: 'Crear, editar y archivar proyectos arqueológicos',
      category: 'Planificación',
      color: 'bg-blue-500',
      examples: [
        'Proyecto Cazadores Recolectores - La Laguna',
        'Estudio de Poblamiento Pampeano',
        'Arqueología de la Llanura Bonaerense'
      ]
    },
    {
      id: 'mapping',
      name: 'Mapeo SIG Integrado',
      icon: '🗺️',
      description: 'Planificación y mapeo del sitio con GPS',
      category: 'Planificación',
      color: 'bg-green-500',
      examples: [
        'Mapeo de Sitio Laguna La Brava',
        'Georreferenciación Arroyo Seco',
        'Cartografía de Monte Hermoso'
      ]
    },

    // TRABAJO DE CAMPO
    {
      id: 'fieldwork',
      name: 'Trabajo de Campo',
      icon: '⛏️',
      description: 'Gestión de prospecciones y excavaciones',
      category: 'Campo',
      color: 'bg-orange-500',
      examples: [
        'Excavación en Sitio Laguna La Brava',
        'Prospección Arroyo Seco 2',
        'Sondeo Monte Hermoso'
      ]
    },
    {
      id: 'surface-mapping',
      name: 'Mapeo de Superficie',
      icon: '🌍',
      description: 'Registro de hallazgos en superficie',
      category: 'Campo',
      color: 'bg-teal-500',
      examples: [
        'Recolección Laguna La Brava',
        'Mapeo Arroyo Seco',
        'Registro Monte Hermoso'
      ]
    },
    {
      id: 'grid-measurement',
      name: 'Medición de Cuadrícula',
      icon: '📏',
      description: 'Sistema de coordenadas y mediciones',
      category: 'Campo',
      color: 'bg-purple-500',
      examples: [
        'Cuadrícula Laguna La Brava',
        'Mediciones Arroyo Seco',
        'Sistema Monte Hermoso'
      ]
    },

    // ANÁLISIS Y DOCUMENTACIÓN
    {
      id: 'laboratory',
      name: 'Laboratorio',
      icon: '🔬',
      description: 'Gestión de muestras y análisis',
      category: 'Análisis',
      color: 'bg-indigo-500',
      examples: [
        'Análisis C14 Laguna La Brava',
        'Estudios de Cerámica Arroyo Seco',
        'Análisis Lítico Monte Hermoso'
      ]
    },
    {
      id: 'artifacts',
      name: 'Materialidad y Catalogación',
      icon: '🏺',
      description: 'Inventario y catalogación de artefactos',
      category: 'Análisis',
      color: 'bg-red-500',
      examples: [
        'Catálogo Lítico Laguna La Brava',
        'Cerámica Arroyo Seco',
        'Artefactos Monte Hermoso'
      ]
    },
    {
      id: 'artifact-documentation',
      name: 'Documentación de Artefactos',
      icon: '📝',
      description: 'Fichas técnicas y dibujos arqueológicos',
      category: 'Análisis',
      color: 'bg-pink-500',
      examples: [
        'Fichas Laguna La Brava',
        'Dibujos Arroyo Seco',
        'Documentación Monte Hermoso'
      ]
    },

    // COMUNICACIÓN Y DIFUSIÓN
    {
      id: 'publications',
      name: 'Publicaciones y Difusión',
      icon: '📑',
      description: 'Informes técnicos y resultados',
      category: 'Difusión',
      color: 'bg-yellow-500',
      examples: [
        'Informe Laguna La Brava',
        'Paper Arroyo Seco',
        'Poster Monte Hermoso'
      ]
    },
    {
      id: 'communication',
      name: 'Comunicación',
      icon: '💬',
      description: 'Mensajería interna y notificaciones',
      category: 'Difusión',
      color: 'bg-cyan-500',
      examples: [
        'Equipo Laguna La Brava',
        'Comunicación Arroyo Seco',
        'Notificaciones Monte Hermoso'
      ]
    },

    // HERRAMIENTAS AVANZADAS
    {
      id: 'visualization',
      name: 'Visualización de Datos',
      icon: '📊',
      description: 'Dashboard analítico y gráficos',
      category: 'Análisis',
      color: 'bg-emerald-500',
      examples: [
        'Estadísticas Laguna La Brava',
        'Gráficos Arroyo Seco',
        'Análisis Monte Hermoso'
      ]
    },
    {
      id: 'ai-tools',
      name: 'Herramientas de IA',
      icon: '🤖',
      description: 'Clasificación automática y análisis predictivo',
      category: 'Tecnología',
      color: 'bg-violet-500',
      examples: [
        'IA Laguna La Brava',
        'ML Arroyo Seco',
        'Predicción Monte Hermoso'
      ]
    },
    {
      id: 'tools',
      name: 'Herramientas Generales',
      icon: '🧰',
      description: 'Plantillas, test y formación',
      category: 'Apoyo',
      color: 'bg-gray-500',
      examples: [
        'Plantillas Pampeanas',
        'Test Arqueología',
        'Formación Regional'
      ]
    },
    {
      id: 'export',
      name: 'Exportación',
      icon: '📤',
      description: 'Backups y repositorio de datos',
      category: 'Apoyo',
      color: 'bg-slate-500',
      examples: [
        'Backup Laguna La Brava',
        'Export Arroyo Seco',
        'Repositorio Monte Hermoso'
      ]
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'project',
      title: 'Proyecto Cazadores Recolectores - La Laguna',
      description: 'Inicio de excavación en sitio pampeano Laguna La Brava',
      date: '2024-01-15',
      status: 'en_progress',
      site: 'Laguna La Brava'
    },
    {
      id: '2',
      type: 'sample',
      title: 'Muestra C14 Enviada al Laboratorio',
      description: 'Carbón de hogar para datación radiocarbono - Arroyo Seco',
      date: '2024-01-14',
      status: 'sent_to_lab',
      site: 'Arroyo Seco'
    },
    {
      id: '3',
      type: 'mapping',
      title: 'Mapeo SIG Completado',
      description: 'Georreferenciación de 15 hallazgos líticos - Monte Hermoso',
      date: '2024-01-13',
      status: 'completed',
      site: 'Monte Hermoso'
    },
    {
      id: '4',
      type: 'artifact',
      title: 'Nuevo Hallazgo Documentado',
      description: 'Punta de proyectil tipo Cola de Pescado - Laguna La Brava',
      date: '2024-01-12',
      status: 'documented',
      site: 'Laguna La Brava'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return '📋';
      case 'sample': return '🧪';
      case 'mapping': return '🗺️';
      case 'artifact': return '🏺';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Planificación': return 'bg-blue-50 border-blue-200';
      case 'Campo': return 'bg-orange-50 border-orange-200';
      case 'Análisis': return 'bg-purple-50 border-purple-200';
      case 'Difusión': return 'bg-yellow-50 border-yellow-200';
      case 'Tecnología': return 'bg-violet-50 border-violet-200';
      case 'Apoyo': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard de investigador...</p>
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
                Dashboard de Investigador
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name || 'Investigador'}. Herramientas de campo y documentación arqueológica.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                INVESTIGADOR • PREMIUM
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
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
              <div className="text-3xl font-bold text-blue-600">{stats.activeProjects}</div>
              <div className="text-sm text-gray-600">Proyectos Activos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalSites}</div>
              <div className="text-sm text-gray-600">Sitios Arqueológicos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalArtifacts}</div>
              <div className="text-sm text-gray-600">Artefactos Catalogados</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalSamples}</div>
              <div className="text-sm text-gray-600">Muestras en Análisis</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.pendingTasks}</div>
              <div className="text-sm text-gray-600">Tareas Pendientes</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.recentFindings}</div>
              <div className="text-sm text-gray-600">Hallazgos Recientes</div>
            </div>
          </Card>
        </div>

        {/* Herramientas Organizadas por Categorías */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Herramientas de Investigación</h2>
          
          {/* Planificación */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Planificación y Gestión
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Planificación').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trabajo de Campo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Trabajo de Campo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Campo').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Análisis y Documentación */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Análisis y Documentación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Análisis').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Comunicación y Difusión */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Comunicación y Difusión
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Difusión').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Herramientas Avanzadas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
              Herramientas Avanzadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Tecnología').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Herramientas de Apoyo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Herramientas de Apoyo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchTools.filter(tool => tool.category === 'Apoyo').map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Ejemplos de la Región Pampeana:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tool.examples.map((example, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleNavigation(`/dashboard/researcher/${tool.id}`)}
                    >
                      Abrir Herramienta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
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
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{activity.date}</p>
                          <span className="text-xs text-blue-600 font-medium">📍 {activity.site}</span>
                        </div>
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

        {/* Acciones Rápidas */}
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
      </main>
    </div>
  );
};

export default ResearcherDashboard; 