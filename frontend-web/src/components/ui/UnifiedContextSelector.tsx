'use client';

import React, { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from './Card';

interface UnifiedContextSelectorProps {
  className?: string;
  onContextChange?: (context: any) => void;
}

interface Project {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  project_id: string;
}

interface Site {
  id: string;
  name: string;
  area_id: string;
}

const UnifiedContextSelector: React.FC<UnifiedContextSelectorProps> = ({ 
  className = '',
  onContextChange 
}) => {
  const {
    context,
    isLoading,
    hasContext,
    setProject,
    setArea,
    setSite,
    clearContext
  } = useInvestigatorContext();
  const { user } = useAuth();

  // Estados para los datos del backend
  const [projects, setProjects] = useState<Project[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedProjects, setHasLoadedProjects] = useState(false);

  // Funciones auxiliares para compatibilidad
  const isContextComplete = Boolean(context.project && context.area && context.site);
  const errorContext = null; // No hay manejo de errores en useInvestigatorContext
  
  const getContextDisplay = () => {
    if (!hasContext) return 'Sin contexto';
    let display = context.project;
    if (context.area) display += ` > ${context.area}`;
    if (context.site) display += ` > ${context.site}`;
    return display;
  };
  
  const getContextLevel = () => {
    if (!hasContext) return 'none';
    if (isContextComplete) return 'complete';
    return 'partial';
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSite, setSelectedSite] = useState('');

  // ============================================================================
  // FUNCIONES PARA CARGAR DATOS DEL BACKEND
  // ============================================================================

  // Cargar proyectos del usuario autenticado
  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:4000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar proyectos: ${response.status}`);
      }

              const data = await response.json();
        console.log('📋 Proyectos cargados (Unified):', data.data);
        setProjects(data.data || []);
        setHasLoadedProjects(true);
      } catch (err) {
        console.error('❌ Error cargando proyectos (Unified):', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setProjects([]);
      } finally {
        setLoading(false);
      }
  };

  // Cargar áreas del proyecto seleccionado
  const loadAreas = async (projectId: string) => {
    if (!user || !projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:4000/api/areas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar áreas: ${response.status}`);
      }

      const data = await response.json();
      console.log('🗺️ Áreas cargadas (Unified):', data.data);
      
      // Filtrar áreas por proyecto
      const projectAreas = data.data.filter((area: Area) => area.project_id === projectId);
      setAreas(projectAreas);
    } catch (err) {
      console.error('❌ Error cargando áreas (Unified):', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setAreas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar sitios del área seleccionada
  const loadSites = async (areaId: string) => {
    if (!user || !areaId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:4000/api/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar sitios: ${response.status}`);
      }

      const data = await response.json();
      console.log('🏛️ Sitios cargados (Unified):', data.data);
      
      // Filtrar sitios por área
      const areaSites = data.data.filter((site: Site) => site.area_id === areaId);
      setSites(areaSites);
    } catch (err) {
      console.error('❌ Error cargando sitios (Unified):', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNCIONES UTILITARIAS
  // ============================================================================

  const getAreasForProject = (projectId: string) => {
    return areas.filter(area => area.project_id === projectId);
  };

  const getSitesForArea = (areaId: string) => {
    return sites.filter(site => site.area_id === areaId);
  };

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Cargar datos iniciales cuando se abre el selector
  useEffect(() => {
    if (isOpen && user && !loading && !hasLoadedProjects) {
      loadProjects();
    }
  }, [isOpen, user]);

  // Cargar áreas cuando se selecciona un proyecto
  useEffect(() => {
    if (selectedProject && user) {
      loadAreas(selectedProject);
    }
  }, [selectedProject, user]);

  // Cargar sitios cuando se selecciona un área
  useEffect(() => {
    if (selectedArea && user) {
      loadSites(selectedArea);
    }
  }, [selectedArea, user]);

  // Inicializar selecciones cuando se carga el contexto
  useEffect(() => {
    if (context) {
      // Buscar el proyecto por nombre
      const project = projects.find(p => p.name === context.project);
      setSelectedProject(project?.id || '');
      
      // Buscar el área por nombre
      const area = areas.find(a => a.name === context.area);
      setSelectedArea(area?.id || '');
      
      // Buscar el sitio por nombre
      const site = sites.find(s => s.name === context.site);
      setSelectedSite(site?.id || '');
    }
  }, [context, projects, areas, sites]);

  // ============================================================================
  // MANEJADORES DE EVENTOS
  // ============================================================================

  const handleProjectChange = async (projectId: string) => {
    try {
      setSelectedProject(projectId);
      setSelectedArea('');
      setSelectedSite('');
      
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setProject(project.name);
          
          if (onContextChange) {
            onContextChange({
              project: project.name,
              area: '',
              site: ''
            });
          }
        }
      }
    } catch (error) {
      console.error('Error setting project:', error);
    }
  };

  const handleAreaChange = async (areaId: string) => {
    try {
      setSelectedArea(areaId);
      setSelectedSite('');
      
      if (areaId) {
        const area = areas.find(a => a.id === areaId);
        if (area) {
          setArea(area.name);
          
          if (onContextChange) {
            onContextChange({
              ...context,
              area: area.name,
              site: ''
            });
          }
        }
      }
    } catch (error) {
      console.error('Error setting area:', error);
    }
  };

  const handleSiteChange = async (siteId: string) => {
    try {
      setSelectedSite(siteId);
      
      if (siteId) {
        const site = sites.find(s => s.id === siteId);
        if (site) {
          setSite(site.name);
          
          if (onContextChange) {
            onContextChange({
              ...context,
              site: site.name
            });
          }
        }
      }
    } catch (error) {
      console.error('Error setting site:', error);
    }
  };

  const handleClearContext = async () => {
    try {
      await clearContext();
      setSelectedProject('');
      setSelectedArea('');
      setSelectedSite('');
      setIsOpen(false);
      
      if (onContextChange) {
        onContextChange(null);
      }
    } catch (error) {
      console.error('Error clearing context:', error);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    
    // Disparar evento personalizado para notificar cambio de contexto
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('contextUpdated', {
        detail: { source: 'selector' }
      }));
      console.log('🔄 Evento contextUpdated disparado');
    }, 100);
    
    // Notificar el cambio de contexto al componente padre
    if (onContextChange && context) {
      onContextChange({
        project: context.project,
        area: context.area,
        site: context.site
      });
    }
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Cargando contexto...</span>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-gray-500">Debe iniciar sesión para seleccionar contexto</p>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            if (isOpen) loadProjects();
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Botón para abrir el selector */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          hasContext
            ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span>📍</span>
        <span className="text-sm font-medium">
          {hasContext ? getContextDisplay() : 'Seleccionar Contexto'}
        </span>
        {hasContext && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isContextComplete 
              ? 'bg-green-200 text-green-800' 
              : 'bg-blue-200 text-blue-800'
          }`}>
            {isContextComplete ? 'Completo' : 'Parcial'}
          </span>
        )}
      </button>

      {/* Modal del selector */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seleccionar Contexto
                </h3>
                <button
                  onClick={() => {
                    setHasLoadedProjects(false);
                    setError(null);
                    loadProjects();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  {loading ? '🔄' : '🔄 Recargar'}
                </button>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando datos...</p>
                </div>
              )}

              {/* Proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  disabled={loading}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    loading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Seleccionar proyecto...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {projects.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 mt-1">No hay proyectos disponibles</p>
                )}
              </div>

              {/* Área */}
              {selectedProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área *
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    disabled={loading}
                    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      loading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Seleccionar área...</option>
                    {getAreasForProject(selectedProject).map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                  {getAreasForProject(selectedProject).length === 0 && !loading && (
                    <p className="text-sm text-gray-500 mt-1">No hay áreas disponibles para este proyecto</p>
                  )}
                </div>
              )}

              {/* Sitio */}
              {selectedArea && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio (Opcional)
                  </label>
                  <select
                    value={selectedSite}
                    onChange={(e) => handleSiteChange(e.target.value)}
                    disabled={loading}
                    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      loading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Seleccionar sitio (opcional)...</option>
                    {getSitesForArea(selectedArea).map(site => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                  {getSitesForArea(selectedArea).length === 0 && !loading && (
                    <p className="text-sm text-gray-500 mt-1">No hay sitios disponibles para esta área</p>
                  )}
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleClearContext}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedProject || !selectedArea}
                  className={`px-4 py-2 rounded ${
                    selectedProject && selectedArea
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnifiedContextSelector; 