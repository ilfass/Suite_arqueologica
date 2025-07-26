import React, { useState, useEffect } from 'react';
import { useUnifiedContext } from '../../hooks/useUnifiedContext';
import Button from './Button';
import Card from './Card';

// ============================================================================
// COMPONENTE SELECTOR DE CONTEXTO UNIFICADO
// ============================================================================

interface UnifiedContextSelectorProps {
  className?: string;
  onContextChange?: (context: any) => void;
}

const UnifiedContextSelector: React.FC<UnifiedContextSelectorProps> = ({ 
  className = '',
  onContextChange 
}) => {
  const {
    context,
    isLoading,
    error,
    hasContext,
    isContextComplete,
    setProject,
    setArea,
    setSite,
    clearContext,
    getContextDisplay,
    getContextLevel
  } = useUnifiedContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSite, setSelectedSite] = useState('');

  // ============================================================================
  // DATOS MOCK (en el futuro vendrán del backend)
  // ============================================================================

  const projects = [
    { id: 'proj-001', name: 'Proyecto Cazadores Recolectores - La Laguna' },
    { id: 'proj-002', name: 'Estudio de Poblamiento Pampeano' },
    { id: 'proj-003', name: 'Arqueología de la Llanura Bonaerense' },
    { id: 'proj-004', name: 'Arqueología Prehispánica del Valle del Cauca' },
    { id: 'proj-005', name: 'Sitios Arqueológicos del Desierto de Atacama' },
    { id: 'proj-006', name: 'Arqueología Medieval de Castilla y León' }
  ];

  const areas = [
    { id: 'area-001', name: 'Laguna La Brava', projectId: 'proj-001' },
    { id: 'area-002', name: 'Arroyo Seco', projectId: 'proj-001' },
    { id: 'area-003', name: 'Monte Hermoso', projectId: 'proj-002' },
    { id: 'area-004', name: 'Costa Bonaerense', projectId: 'proj-003' },
    { id: 'area-005', name: 'Valle del Cauca Central', projectId: 'proj-004' },
    { id: 'area-006', name: 'Cordillera Occidental', projectId: 'proj-004' },
    { id: 'area-007', name: 'Desierto de Atacama Norte', projectId: 'proj-005' },
    { id: 'area-008', name: 'Salar de Atacama', projectId: 'proj-005' },
    { id: 'area-009', name: 'Valle del Duero', projectId: 'proj-006' },
    { id: 'area-010', name: 'Sierra de Gredos', projectId: 'proj-006' }
  ];

  const sites = [
    { id: 'site-001', name: 'Sitio Pampeano La Laguna', areaId: 'area-001' },
    { id: 'site-002', name: 'Sitio Arroyo Seco Norte', areaId: 'area-002' },
    { id: 'site-003', name: 'Sitio Monte Hermoso Este', areaId: 'area-003' },
    { id: 'site-004', name: 'Sitio Costa Bonaerense Sur', areaId: 'area-004' },
    { id: 'site-005', name: 'Sitio Valle del Cauca Central', areaId: 'area-005' },
    { id: 'site-006', name: 'Sitio Cordillera Occidental', areaId: 'area-006' },
    { id: 'site-007', name: 'Sitio Desierto de Atacama Norte', areaId: 'area-007' },
    { id: 'site-008', name: 'Sitio Salar de Atacama', areaId: 'area-008' },
    { id: 'site-009', name: 'Sitio Valle del Duero', areaId: 'area-009' },
    { id: 'site-010', name: 'Sitio Sierra de Gredos', areaId: 'area-010' }
  ];

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const getAreasForProject = (projectId: string) => {
    return areas.filter(area => area.projectId === projectId);
  };

  const getSitesForArea = (areaId: string) => {
    return sites.filter(site => site.areaId === areaId);
  };

  // ============================================================================
  // MANEJADORES DE EVENTOS
  // ============================================================================

  const handleProjectChange = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      setSelectedProject(projectId);
      setSelectedArea('');
      setSelectedSite('');

      await setProject(projectId, project.name);
      
      if (onContextChange) {
        onContextChange({ projectId, projectName: project.name });
      }
    } catch (error) {
      console.error('Error setting project:', error);
    }
  };

  const handleAreaChange = async (areaId: string) => {
    try {
      const area = areas.find(a => a.id === areaId);
      if (!area) return;

      setSelectedArea(areaId);
      setSelectedSite('');

      await setArea(areaId, area.name);
      
      if (onContextChange) {
        onContextChange({ 
          projectId: selectedProject, 
          areaId, 
          areaName: area.name 
        });
      }
    } catch (error) {
      console.error('Error setting area:', error);
    }
  };

  const handleSiteChange = async (siteId: string) => {
    try {
      const site = sites.find(s => s.id === siteId);
      if (!site) return;

      setSelectedSite(siteId);

      await setSite(siteId, site.name);
      
      if (onContextChange) {
        onContextChange({ 
          projectId: selectedProject, 
          areaId: selectedArea, 
          siteId, 
          siteName: site.name 
        });
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
  };

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Inicializar selecciones cuando se carga el contexto
  useEffect(() => {
    if (context) {
      setSelectedProject(context.project_id);
      setSelectedArea(context.area_id);
      setSelectedSite(context.site_id || '');
    }
  }, [context]);

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

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Botón principal */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span>📍</span>
        <span className="text-sm">
          {hasContext ? getContextDisplay() : 'Seleccionar Contexto'}
        </span>
        {hasContext && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isContextComplete 
              ? 'bg-green-200 text-green-800' 
              : 'bg-yellow-200 text-yellow-800'
          }`}>
            {isContextComplete ? 'Completo' : 'Parcial'}
          </span>
        )}
      </Button>

      {/* Modal de selección */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Seleccionar Contexto
              </h3>

              {/* Proyecto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar proyecto...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar área...</option>
                    {getAreasForProject(selectedProject).map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin sitio específico</option>
                    {getSitesForArea(selectedArea).map(site => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Confirmar
                </Button>
                {hasContext && (
                  <Button
                    onClick={handleClearContext}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Limpiar
                  </Button>
                )}
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnifiedContextSelector; 