'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useArchaeological } from '../../../contexts/ArchaeologicalContext';
import { ArchaeologicalContext as ArchContext } from '../../../types/archaeological';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ContextNavigator from '../../../components/navigation/ContextNavigator';
import UnifiedContextSelector from '../../../components/ui/UnifiedContextSelector';
import ProjectCreationFormNew from '../../../components/forms/ProjectCreationFormNew';
import AreaCreationForm from '../../../components/forms/AreaCreationForm';
import SiteCreationForm from '../../../components/forms/SiteCreationForm';
import ProjectEditForm from '../../../components/forms/ProjectEditForm';
import AreaEditForm from '../../../components/forms/AreaEditForm';
import SiteEditForm from '../../../components/forms/SiteEditForm';
import FieldworkSessionForm from '../../../components/forms/FieldworkSessionForm';
import FindingForm from '../../../components/forms/FindingForm';
import Loader from '../../../components/ui/Loader';

const ResearcherDashboard: React.FC = () => {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const {
    state,
    dispatch,
    getAreasByProject,
    getSitesByArea,
    getFieldworkSessionsBySite,
    getFindingsByFieldworkSession,
    setCurrentContext,
    clearCurrentContext
  } = useArchaeological();

  // Estados para modales
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewArea, setShowNewArea] = useState(false);
  const [showNewSite, setShowNewSite] = useState(false);
  const [showNewFieldwork, setShowNewFieldwork] = useState(false);
  const [showNewFinding, setShowNewFinding] = useState(false);
  const [showNewReport, setShowNewReport] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showEditArea, setShowEditArea] = useState(false);
  const [showEditSite, setShowEditSite] = useState(false);

  // Estados para edición
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);

  // Estado del contexto actual
  const [currentContext, setCurrentContextState] = useState<Partial<ArchContext>>({});

  // Estado para colapsar/expandir estadísticas
  const [statsCollapsed, setStatsCollapsed] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);

  // Cargar contexto desde localStorage y refrescar usuario
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await refreshUser();
        
        // Cargar contexto guardado
        const savedContext = localStorage.getItem('investigator-context');
        if (savedContext) {
          try {
            const context = JSON.parse(savedContext);
            setCurrentContextState(context);
            setCurrentContext(context);
          } catch (error) {
            console.error('Error loading context:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setContextLoading(false);
      }
    };

    initializeDashboard();
  }, [refreshUser, setCurrentContext]);

  // Guardar contexto en localStorage
  const saveContext = (context: Partial<ArchContext>) => {
    localStorage.setItem('investigator-context', JSON.stringify(context));
    setCurrentContext(context as ArchContext);
    setCurrentContextState(context);
  };

  // Manejador de cambio de contexto desde el navegador
  const handleContextChange = (context: Partial<ArchContext>) => {
    saveContext(context);
  };

  // Manejadores de creación
  const handleAddProject = (formData: any) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      ...formData,
      areas: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    setShowNewProject(false);
  };

  const handleAddArea = (formData: any) => {
    const newArea = {
      id: `area-${Date.now()}`,
      ...formData,
      projectId: currentContext.projectId,
      sites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_AREA', payload: newArea });
    setShowNewArea(false);
  };

  const handleAddSite = (formData: any) => {
    const newSite = {
      id: `site-${Date.now()}`,
      ...formData,
      projectId: currentContext.projectId,
      areaId: currentContext.areaId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_SITE', payload: newSite });
    setShowNewSite(false);
  };

  const handleAddFieldworkSession = (formData: any) => {
    const newFieldworkSession = {
      id: `fieldwork-${Date.now()}`,
      ...formData,
      projectId: currentContext.projectId,
      areaId: currentContext.areaId,
      siteId: currentContext.siteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_FIELDWORK_SESSION', payload: newFieldworkSession });
    setShowNewFieldwork(false);
  };

  const handleAddFinding = (formData: any) => {
    const newFinding = {
      id: `finding-${Date.now()}`,
      ...formData,
      projectId: currentContext.projectId,
      areaId: currentContext.areaId,
      siteId: currentContext.siteId,
      fieldworkSessionId: currentContext.fieldworkSessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_FINDING', payload: newFinding });
    setShowNewFinding(false);
  };

  // Manejadores de edición
  const handleEditProject = (formData: any) => {
    if (editingProjectId) {
      dispatch({ type: 'UPDATE_PROJECT', payload: { id: editingProjectId, ...formData } });
      setShowEditProject(false);
      setEditingProjectId(null);
    }
  };

  const handleEditArea = (formData: any) => {
    if (editingAreaId) {
      dispatch({ type: 'UPDATE_AREA', payload: { id: editingAreaId, ...formData } });
      setShowEditArea(false);
      setEditingAreaId(null);
    }
  };

  const handleEditSite = (formData: any) => {
    if (editingSiteId) {
      dispatch({ type: 'UPDATE_SITE', payload: { id: editingSiteId, ...formData } });
      setShowEditSite(false);
      setEditingSiteId(null);
    }
  };

  // Manejador de navegación
  const handleNavigation = (path: string) => {
    if (path === '/mapping') {
      const context = {
        projectId: currentContext.projectId,
        projectName: currentContext.projectName,
        areaId: currentContext.areaId,
        areaName: currentContext.areaName,
        siteId: currentContext.siteId,
        siteName: currentContext.siteName
      };
      
      const params = new URLSearchParams();
      Object.entries(context).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      window.location.href = `/dashboard/researcher/mapping?${params.toString()}`;
    } else if (path === '/chronology') {
      window.location.href = `/dashboard/researcher/chronology?projectId=${currentContext.projectId}&areaId=${currentContext.areaId}&siteId=${currentContext.siteId}`;
    } else if (path === '/laboratory') {
      window.location.href = `/dashboard/researcher/laboratory?projectId=${currentContext.projectId}&areaId=${currentContext.areaId}&siteId=${currentContext.siteId}`;
    }
    else {
      window.location.href = `/dashboard/researcher${path}`;
    }
  };

  // Obtener datos filtrados
  const availableAreas = state.areas;
  const availableSites = state.sites;
  const availableFieldworkSessions = state.fieldworkSessions;
  const availableFindings = state.findings;

  // Estadísticas
  const stats = {
    projects: state.projects.length,
    areas: availableAreas.length,
    sites: availableSites.length,
    fieldworkSessions: availableFieldworkSessions.length,
    findings: availableFindings.length,
    samples: state.samples.length,
    laboratoryAnalyses: state.laboratoryAnalyses.length,
    chronologicalData: state.chronologicalData.length
  };

  // Herramientas de investigación
  const researchTools = [
    {
      name: 'Mapeo SIG Integrado',
      description: currentContext.projectId && currentContext.areaId && currentContext.siteId 
        ? `Sistema SIG para ${currentContext.siteName}`
        : 'Seleccione proyecto, área y sitio para acceder',
      icon: '🗺️',
      color: currentContext.projectId && currentContext.areaId && currentContext.siteId ? 'bg-green-500' : 'bg-gray-400',
      path: '/mapping',
      examples: currentContext.projectId && currentContext.areaId && currentContext.siteId 
        ? ['Visualizar sitios', 'Medir distancias', 'Exportar datos']
        : ['Requiere contexto completo']
    },
    {
      name: 'Trabajo de Campo',
      description: 'Registro de actividades de excavación y prospección',
      icon: '🏕️',
      color: 'bg-blue-500',
      path: '/fieldwork',
      examples: ['Excavaciones', 'Prospecciones', 'Registro de campo']
    },
    {
      name: 'Hallazgos',
      description: 'Catálogo de artefactos, estructuras y ecofactos',
      icon: '🔍',
      color: 'bg-purple-500',
      path: '/findings',
      examples: ['Artefactos líticos', 'Cerámica', 'Estructuras']
    },
    {
      name: 'Muestras',
      description: 'Gestión de muestras para análisis de laboratorio',
      icon: '🧪',
      color: 'bg-orange-500',
      path: '/samples',
      examples: ['Carbón', 'Suelos', 'Material orgánico']
    },
    {
      name: 'Laboratorio',
      description: 'Análisis y procesamiento de materiales',
      icon: '🔬',
      color: 'bg-red-500',
      path: '/laboratory',
      examples: ['Análisis cerámico', 'Datación', 'Estudios especializados']
    },
    {
      name: 'Cronología',
      description: 'Gestión de datos cronológicos y dataciones',
      icon: '⏰',
      color: 'bg-indigo-500',
      path: '/chronology',
      examples: ['Dataciones radiocarbónicas', 'Secuencias temporales']
    },
    {
      name: 'Reportes',
      description: 'Generación de informes y documentación',
      icon: '📊',
      color: 'bg-teal-500',
      path: '/reports',
      examples: ['Informes de campo', 'Catálogos', 'Publicaciones']
    },
    {
      name: 'Exportar Datos',
      description: 'Exportación de datos en diferentes formatos',
      icon: '📤',
      color: 'bg-yellow-500',
      path: '/export',
      examples: ['JSON', 'CSV', 'PDF', 'Shapefile']
    }
  ];

  if (authLoading || contextLoading) {
    return <Loader message="Cargando información del usuario..." />;
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder al dashboard del investigador.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6" data-testid="dashboard-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard del Investigador</h1>
              <p className="text-blue-100">
                Bienvenido, {user.email} - Sistema de Gestión Arqueológica Integrada
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/profile'}
                className="px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-white border-opacity-30"
              >
                👤 Perfil
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem('investigator-context');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600"
              >
                🚪 Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Banner de Contexto */}
        {/* Selector de Contexto Unificado */}
        <Card className="mb-6 p-6" data-testid="unified-context-selector">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🎯 Contexto Arqueológico Activo</h2>
            <div className="flex items-center space-x-2" data-testid="context-actions">
              <Button
                onClick={() => setShowNewProject(true)}
                className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
              >
                + Nuevo Proyecto
              </Button>
              <Button
                onClick={() => setShowNewArea(true)}
                className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 text-sm"
              >
                + Nueva Área
              </Button>
              <Button
                onClick={() => setShowNewSite(true)}
                className="px-3 py-1 bg-purple-500 text-white hover:bg-purple-600 text-sm"
              >
                + Nuevo Sitio
              </Button>
            </div>
          </div>
          <UnifiedContextSelector />
        </Card>

        {/* Estadísticas - ahora horizontal y full width */}
        <Card className="mb-6 p-6 w-full" data-testid="stats-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800" data-testid="stats-title">📊 Mis Estadísticas</h3>
            <Button
              onClick={() => setStatsCollapsed(!statsCollapsed)}
              className="px-2 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 text-sm"
            >
              {statsCollapsed ? '🔽 Expandir' : '🔼 Colapsar'}
            </Button>
          </div>
          {!statsCollapsed && (
            <div className="overflow-x-auto">
              <div className="flex flex-row gap-4 w-full">
                <div data-testid="stat-projects" className="flex flex-col items-center min-w-[120px] p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleNavigation('/projects')}>
                  <div className="text-2xl font-bold text-blue-600" data-testid="stat-count">{stats.projects}</div>
                  <div className="text-sm text-gray-600">Proyectos</div>
                </div>
                <div data-testid="stat-areas" className="flex flex-col items-center min-w-[120px] p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={() => handleNavigation('/sites')}>
                  <div className="text-2xl font-bold text-green-600" data-testid="stat-count">{stats.areas}</div>
                  <div className="text-sm text-gray-600">Áreas</div>
                </div>
                <div data-testid="stat-sites" className="flex flex-col items-center min-w-[120px] p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => handleNavigation('/sites')}>
                  <div className="text-2xl font-bold text-purple-600" data-testid="stat-count">{stats.sites}</div>
                  <div className="text-sm text-gray-600">Sitios</div>
                </div>
                <div data-testid="stat-fieldwork" className="flex flex-col items-center min-w-[120px] p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => handleNavigation('/fieldwork')}>
                  <div className="text-2xl font-bold text-orange-600" data-testid="stat-count">{stats.fieldworkSessions}</div>
                  <div className="text-sm text-gray-600">Trabajos de Campo</div>
                </div>
                <div data-testid="stat-findings" className="flex flex-col items-center min-w-[120px] p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={() => handleNavigation('/findings')}>
                  <div className="text-2xl font-bold text-red-600" data-testid="stat-count">{stats.findings}</div>
                  <div className="text-sm text-gray-600">Hallazgos</div>
                </div>
                <div data-testid="stat-samples" className="flex flex-col items-center min-w-[120px] p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => handleNavigation('/samples')}>
                  <div className="text-2xl font-bold text-yellow-600" data-testid="stat-count">{stats.samples}</div>
                  <div className="text-sm text-gray-600">Muestras</div>
                </div>
                <div data-testid="stat-analysis" className="flex flex-col items-center min-w-[120px] p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => handleNavigation('/laboratory')}>
                  <div className="text-2xl font-bold text-indigo-600" data-testid="stat-count">{stats.laboratoryAnalyses}</div>
                  <div className="text-sm text-gray-600">Análisis</div>
                </div>
                <div data-testid="stat-chronologies" className="flex flex-col items-center min-w-[120px] p-3 bg-teal-50 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors" onClick={() => handleNavigation('/chronology')}>
                  <div className="text-2xl font-bold text-teal-600" data-testid="stat-count">{stats.chronologicalData}</div>
                  <div className="text-sm text-gray-600">Cronologías</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Panel de Herramientas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Derecho - Herramientas */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Herramientas de Investigación</h3>
              <div className="flex flex-row gap-2 mb-4">
                <Button onClick={() => setShowNewFinding(true)} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">+ Nuevo Hallazgo</Button>
                <Button onClick={() => setShowNewReport(true)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">+ Nuevo Informe</Button>
                <Button onClick={() => handleNavigation('/reports')} className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300">Ver Informes</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchTools.map((tool, index) => (
                  <div
                    key={index}
                    data-testid={`tool-${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      tool.color === 'bg-gray-400' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      if (tool.color !== 'bg-gray-400') {
                        handleNavigation(tool.path);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${tool.color === 'bg-gray-400' ? 'text-gray-400' : ''}`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{tool.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.examples.map((example, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales - Simplificados por ahora */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nuevo Proyecto</h3>
            <p className="text-gray-600 mb-4">Funcionalidad de creación de proyectos en desarrollo.</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNewArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nueva Área</h3>
            <p className="text-gray-600 mb-4">Funcionalidad de creación de áreas en desarrollo.</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowNewArea(false)}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNewSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nuevo Sitio</h3>
            <p className="text-gray-600 mb-4">Funcionalidad de creación de sitios en desarrollo.</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowNewSite(false)}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNewFinding && (
        <FindingForm 
          isOpen={showNewFinding}
          onClose={() => setShowNewFinding(false)}
          onSubmit={handleAddFinding}
          context={currentContext.projectId && currentContext.areaId && currentContext.siteId ? (currentContext as any) : undefined}
        />
      )}

      {showNewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nuevo Informe</h3>
            {/* Aquí puedes agregar el formulario de informe o un placeholder */}
            <p className="text-gray-600 mb-4">Funcionalidad de creación de informes en desarrollo.</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowNewReport(false)} className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600">Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard; 