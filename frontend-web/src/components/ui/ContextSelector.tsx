'use client';

import React, { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';
import { useAuth } from '../../contexts/AuthContext';

interface ContextSelectorProps {
  className?: string;
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

const ContextSelector: React.FC<ContextSelectorProps> = ({ className = '' }) => {
  const { context, setProject, setArea, setSite, clearContext, hasContext } = useInvestigatorContext();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Estados para los datos del backend
  const [projects, setProjects] = useState<Project[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debug del contexto en ContextSelector
  console.log('🔍 ContextSelector - Context:', context);
  console.log('🔍 ContextSelector - Has Context:', hasContext);
  console.log('🔍 ContextSelector - User:', user);

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
      console.log('📋 Proyectos cargados:', data.data);
      setProjects(data.data || []);
    } catch (err) {
      console.error('❌ Error cargando proyectos:', err);
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
      console.log('🗺️ Áreas cargadas:', data.data);
      
      // Filtrar áreas por proyecto (si el backend no lo hace automáticamente)
      const projectAreas = data.data.filter((area: Area) => area.project_id === projectId);
      setAreas(projectAreas);
    } catch (err) {
      console.error('❌ Error cargando áreas:', err);
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
      console.log('🏛️ Sitios cargados:', data.data);
      
      // Filtrar sitios por área (si el backend no lo hace automáticamente)
      const areaSites = data.data.filter((site: Site) => site.area_id === areaId);
      setSites(areaSites);
    } catch (err) {
      console.error('❌ Error cargando sitios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales cuando se abre el selector
  useEffect(() => {
    if (isOpen && user) {
      loadProjects();
    }
  }, [isOpen, user]);

  // Cargar áreas cuando se selecciona un proyecto
  useEffect(() => {
    if (context.project && user) {
      const selectedProject = projects.find(p => p.name === context.project);
      if (selectedProject) {
        loadAreas(selectedProject.id);
      }
    }
  }, [context.project, projects, user]);

  // Cargar sitios cuando se selecciona un área
  useEffect(() => {
    if (context.area && user) {
      const selectedArea = areas.find(a => a.name === context.area);
      if (selectedArea) {
        loadSites(selectedArea.id);
      }
    }
  }, [context.area, areas, user]);

  const handleProjectChange = (projectName: string) => {
    console.log('🔧 ContextSelector - Estableciendo proyecto:', projectName);
    setProject(projectName);
    // Limpiar áreas y sitios cuando cambia el proyecto
    setAreas([]);
    setSites([]);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, project: projectName, area: '', site: '' };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleAreaChange = (areaName: string) => {
    console.log('🔧 ContextSelector - Estableciendo área:', areaName);
    setArea(areaName);
    // Limpiar sitios cuando cambia el área
    setSites([]);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, area: areaName, site: '' };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleSiteChange = (siteName: string) => {
    console.log('🔧 ContextSelector - Estableciendo sitio:', siteName);
    setSite(siteName);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, site: siteName };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleClearContext = () => {
    clearContext();
    setIsOpen(false);
    // Limpiar también los datos cargados
    setProjects([]);
    setAreas([]);
    setSites([]);
  };

  // No cerrar automáticamente el selector cuando se selecciona área
  // Solo cerrar cuando se complete el contexto o se limpie
  const handleCompleteSelection = () => {
    if (context.project && context.area && context.site) {
      setIsOpen(false);
    }
  };

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
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <span>📍</span>
        <span>Seleccionar Contexto</span>
      </button>

      {/* Modal del selector */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-4 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seleccionar Contexto
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
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
                  value={context.project}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  disabled={loading}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Seleccionar proyecto...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {projects.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 mt-1">No hay proyectos disponibles</p>
                )}
              </div>

              {/* Área */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área/Región *
                </label>
                <select
                  value={context.area}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  disabled={!context.project || loading}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !context.project || loading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Seleccionar área...</option>
                  {context.project && areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {context.project && areas.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 mt-1">No hay áreas disponibles para este proyecto</p>
                )}
              </div>

              {/* Sitio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio (Opcional)
                </label>
                <select
                  value={context.site}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  disabled={!context.area || loading}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !context.area || loading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Seleccionar sitio (opcional)...</option>
                  {context.area && sites.map((site) => (
                    <option key={site.id} value={site.name}>
                      {site.name}
                    </option>
                  ))}
                </select>
                {context.area && sites.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 mt-1">No hay sitios disponibles para esta área</p>
                )}
              </div>

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
                  onClick={handleCompleteSelection}
                  disabled={!context.project || !context.area}
                  className={`px-4 py-2 rounded ${
                    context.project && context.area
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextSelector; 