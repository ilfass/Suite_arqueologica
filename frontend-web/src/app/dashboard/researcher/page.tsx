'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planning';
  startDate: string;
  endDate?: string;
}

interface Area {
  id: string;
  name: string;
  description: string;
  coordinates?: [number, number];
  projectId: string;
}

interface Site {
  id: string;
  name: string;
  description: string;
  coordinates?: [number, number];
  areaId: string;
  projectId: string;
}

const ResearcherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Estados para el flujo jerárquico
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<string>('');
  
  // Estados para formularios modales
  const [showNewArea, setShowNewArea] = useState(false);
  const [showNewSite, setShowNewSite] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', description: '', coordinates: [0, 0] as [number, number] });
  const [newSite, setNewSite] = useState({ name: '', description: '', coordinates: [0, 0] as [number, number] });

  // Datos simulados
  const [projects, setProjects] = useState<Project[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSites: 0,
    totalArtifacts: 0,
    totalSamples: 0,
    pendingTasks: 0,
    recentFindings: 0,
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'Proyecto Cazadores Recolectores - La Laguna',
          description: 'Estudio de ocupaciones tempranas en la región pampeana',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2025-12-31'
        },
        {
          id: '2',
          name: 'Estudio de Poblamiento Pampeano',
          description: 'Investigación sobre patrones de asentamiento',
          status: 'active',
          startDate: '2024-03-01'
        },
        {
          id: '3',
          name: 'Arqueología de la Llanura Bonaerense',
          description: 'Análisis de sitios costeros y de interior',
          status: 'planning',
          startDate: '2025-01-01'
        }
      ]);

      setAreas([
        {
          id: '1',
          name: 'Laguna La Brava',
          description: 'Sector norte de la laguna con ocupaciones tempranas',
          coordinates: [-38.1234, -61.5678],
          projectId: '1'
        },
        {
          id: '2',
          name: 'Arroyo Seco',
          description: 'Zona de cauces antiguos con hallazgos líticos',
          coordinates: [-38.2345, -61.6789],
          projectId: '1'
        },
        {
          id: '3',
          name: 'Monte Hermoso',
          description: 'Sitio costero con ocupaciones múltiples',
          coordinates: [-38.3456, -61.7890],
          projectId: '2'
        }
      ]);

      setSites([
        {
          id: '1',
          name: 'Sitio Laguna La Brava Norte',
          description: 'Concentración de artefactos líticos en superficie',
          coordinates: [-38.1234, -61.5678],
          areaId: '1',
          projectId: '1'
        },
        {
          id: '2',
          name: 'Excavación Arroyo Seco 2',
          description: 'Sondeo estratigráfico en cauce antiguo',
          coordinates: [-38.2345, -61.6789],
          areaId: '2',
          projectId: '1'
        },
        {
          id: '3',
          name: 'Monte Hermoso Playa',
          description: 'Sitio costero con ocupaciones del Holoceno',
          coordinates: [-38.3456, -61.7890],
          areaId: '3',
          projectId: '2'
        }
      ]);

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
    // Solo permitir navegación si hay un sitio seleccionado
    if (!selectedSite) {
      alert('Por favor, selecciona un proyecto, área y sitio antes de continuar.');
      return;
    }
    router.push(path);
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedArea('');
    setSelectedSite('');
  };

  const handleAreaChange = (areaId: string) => {
    setSelectedArea(areaId);
    setSelectedSite('');
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
  };

  const handleAddArea = () => {
    if (!selectedProject) {
      alert('Por favor, selecciona un proyecto primero.');
      return;
    }

    const area: Area = {
      id: Date.now().toString(),
      name: newArea.name,
      description: newArea.description,
      coordinates: newArea.coordinates,
      projectId: selectedProject
    };
    setAreas([...areas, area]);
    setNewArea({ name: '', description: '', coordinates: [0, 0] });
    setShowNewArea(false);
  };

  const handleAddSite = () => {
    if (!selectedArea) {
      alert('Por favor, selecciona un área primero.');
      return;
    }

    const site: Site = {
      id: Date.now().toString(),
      name: newSite.name,
      description: newSite.description,
      coordinates: newSite.coordinates,
      areaId: selectedArea,
      projectId: selectedProject
    };
    setSites([...sites, site]);
    setNewSite({ name: '', description: '', coordinates: [0, 0] });
    setShowNewSite(false);
  };

  // Filtrar áreas y sitios según selección
  const filteredAreas = areas.filter(area => area.projectId === selectedProject);
  const filteredSites = sites.filter(site => site.areaId === selectedArea);

  // Herramientas organizadas por categorías
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
                Bienvenido, {user?.full_name || 'Investigador'}. Selecciona tu contexto de trabajo.
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
        {/* Flujo de Selección Jerárquica */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">🧭 Contexto de Trabajo</h2>
            
            {/* Selección de Proyecto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ Selecciona un Proyecto
              </label>
              {projects.length > 0 ? (
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Selecciona un proyecto --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.status === 'active' ? 'Activo' : project.status === 'planning' ? 'Planificación' : 'Completado'})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800">
                    Todavía no estás asociado a ningún proyecto. Contactá al administrador para sumarte o crear uno.
                  </p>
                </div>
              )}
            </div>

            {/* Selección de Área/Región */}
            {selectedProject && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2️⃣ Selecciona un Área/Región
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Selecciona un área --</option>
                    {filteredAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setShowNewArea(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    ➕ Agregar nueva Área/Región
                  </Button>
                </div>
              </div>
            )}

            {/* Selección de Sitio */}
            {selectedArea && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3️⃣ Selecciona un Sitio
                </label>
                <div className="flex space-x-2">
                  <select
                    value={selectedSite}
                    onChange={(e) => handleSiteChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Selecciona un sitio --</option>
                    {filteredSites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setShowNewSite(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    ➕ Agregar nuevo Sitio
                  </Button>
                </div>
              </div>
            )}

            {/* Estado del Contexto */}
            {selectedSite && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <span className="text-green-600 text-xl mr-2">✅</span>
                  <div>
                    <p className="text-green-800 font-medium">Contexto de trabajo definido</p>
                    <p className="text-green-700 text-sm">
                      Proyecto: {projects.find(p => p.id === selectedProject)?.name} | 
                      Área: {areas.find(a => a.id === selectedArea)?.name} | 
                      Sitio: {sites.find(s => s.id === selectedSite)?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Estadísticas */}
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

        {/* Herramientas (solo visibles si hay sitio seleccionado) */}
        {selectedSite ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Herramientas de Investigación</h2>
            
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
        ) : (
          <Card className="mb-8">
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">🧭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecciona tu contexto de trabajo
              </h3>
              <p className="text-gray-600">
                Para acceder a las herramientas de investigación, primero debes seleccionar un proyecto, área y sitio.
              </p>
            </div>
          </Card>
        )}

        {/* Acciones Rápidas */}
        {selectedSite && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Acciones Rápidas</h2>
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
        )}
      </main>

      {/* Modal para agregar área */}
      {showNewArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">➕ Agregar Nueva Área/Región</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Área/Región</label>
                <Input
                  value={newArea.name}
                  onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                  placeholder="Ej: Laguna La Brava"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
                <textarea
                  value={newArea.description}
                  onChange={(e) => setNewArea({...newArea, description: e.target.value})}
                  placeholder="Descripción del área o región"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitud (opcional)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newArea.coordinates[0]}
                    onChange={(e) => setNewArea({...newArea, coordinates: [parseFloat(e.target.value), newArea.coordinates[1]]})}
                    placeholder="-38.1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitud (opcional)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newArea.coordinates[1]}
                    onChange={(e) => setNewArea({...newArea, coordinates: [newArea.coordinates[0], parseFloat(e.target.value)]})}
                    placeholder="-61.5678"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewArea(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddArea}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar sitio */}
      {showNewSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">➕ Agregar Nuevo Sitio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
                <Input
                  value={newSite.name}
                  onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                  placeholder="Ej: Sitio Laguna La Brava Norte"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción Breve</label>
                <textarea
                  value={newSite.description}
                  onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                  placeholder="Descripción breve del sitio"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitud (opcional)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newSite.coordinates[0]}
                    onChange={(e) => setNewSite({...newSite, coordinates: [parseFloat(e.target.value), newSite.coordinates[1]]})}
                    placeholder="-38.1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitud (opcional)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newSite.coordinates[1]}
                    onChange={(e) => setNewSite({...newSite, coordinates: [newSite.coordinates[0], parseFloat(e.target.value)]})}
                    placeholder="-61.5678"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewSite(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSite}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard; 