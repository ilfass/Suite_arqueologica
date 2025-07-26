'use client';

import React, { useState } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';

interface ContextSelectorProps {
  className?: string;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({ className = '' }) => {
  const { context, setProject, setArea, setSite, clearContext, hasContext } = useInvestigatorContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug del contexto en ContextSelector
  console.log('🔍 ContextSelector - Context:', context);
  console.log('🔍 ContextSelector - Has Context:', hasContext);

  // Datos de ejemplo para proyectos, áreas y sitios
  const projects = [
    'Proyecto Cazadores Recolectores - La Laguna',
    'Estudio de Poblamiento Pampeano',
    'Arqueología de la Llanura Bonaerense',
    'Arqueología Prehispánica del Valle del Cauca',
    'Sitios Arqueológicos del Desierto de Atacama',
    'Arqueología Medieval de Castilla y León'
  ];

  const areas = [
    'Laguna La Brava',
    'Arroyo Seco',
    'Monte Hermoso',
    'Costa Bonaerense',
    'Valle del Cauca Central',
    'Cordillera Occidental',
    'Desierto de Atacama Norte',
    'Salar de Atacama',
    'Valle del Duero',
    'Sierra de Gredos'
  ];

  const getSitesForArea = (area: string) => {
    const siteMap: { [key: string]: string[] } = {
      'Laguna La Brava': [
        'Sitio Pampeano La Laguna',
        'Sitio Laguna Brava Norte',
        'Sitio Laguna Brava Sur'
      ],
      'Arroyo Seco': [
        'Sitio Arroyo Seco 2',
        'Sitio Arroyo Seco Norte',
        'Sitio Arroyo Seco Sur'
      ],
      'Monte Hermoso': [
        'Sitio Monte Hermoso',
        'Sitio Monte Hermoso Este',
        'Sitio Monte Hermoso Oeste'
      ],
      'Costa Bonaerense': [
        'Sitio Costa Bonaerense',
        'Sitio Playa Dorada',
        'Sitio Costa Sur'
      ],
      'Valle del Cauca Central': [
        'Sitio Valle del Cauca',
        'Sitio Valle Central Norte',
        'Sitio Valle Central Sur'
      ],
      'Cordillera Occidental': [
        'Sitio Cordillera Occidental',
        'Sitio Cordillera Norte',
        'Sitio Cordillera Sur'
      ],
      'Desierto de Atacama Norte': [
        'Sitio Desierto Atacama',
        'Sitio Atacama Norte',
        'Sitio Atacama Central'
      ],
      'Salar de Atacama': [
        'Sitio Salar de Atacama',
        'Sitio Salar Norte',
        'Sitio Salar Sur'
      ],
      'Valle del Duero': [
        'Sitio Valle del Duero',
        'Sitio Duero Norte',
        'Sitio Duero Sur'
      ],
      'Sierra de Gredos': [
        'Sitio Sierra de Gredos',
        'Sitio Gredos Norte',
        'Sitio Gredos Sur'
      ]
    };
    
    return siteMap[area] || [];
  };

  const sites = getSitesForArea(context.area);

  const handleProjectChange = (project: string) => {
    console.log('🔧 ContextSelector - Estableciendo proyecto:', project);
    setProject(project);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, project, area: '', site: '' };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleAreaChange = (area: string) => {
    console.log('🔧 ContextSelector - Estableciendo área:', area);
    setArea(area);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, area, site: '' };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleSiteChange = (site: string) => {
    console.log('🔧 ContextSelector - Estableciendo sitio:', site);
    setSite(site);
    // Guardar inmediatamente en localStorage
    const newContext = { ...context, site };
    localStorage.setItem('investigator-context', JSON.stringify(newContext));
    console.log('💾 Contexto guardado en localStorage:', newContext);
  };

  const handleClearContext = () => {
    clearContext();
    setIsOpen(false);
  };

  // No cerrar automáticamente el selector cuando se selecciona área
  // Solo cerrar cuando se complete el contexto o se limpie
  const handleCompleteSelection = () => {
    if (context.project && context.area && context.site) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón para abrir/cerrar selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
          hasContext 
            ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">📍</span>
        <span className="font-medium">
          {hasContext ? 'Contexto Activo' : 'Seleccionar Contexto'}
        </span>
        {hasContext && (
          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
            {context.site ? 'Completo' : 'Parcial'}
          </span>
        )}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Información del contexto actual */}
      {hasContext && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <div><strong>Proyecto:</strong> {context.project}</div>
            <div><strong>Área:</strong> {context.area}</div>
            <div><strong>Sitio:</strong> {context.site || 'No especificado'}</div>
          </div>
        </div>
      )}

      {/* Modal de selección */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Contexto</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Proyecto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proyecto *
              </label>
              <select
                value={context.project}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar proyecto...</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área/Región *
              </label>
              <select
                value={context.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                disabled={!context.project}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !context.project ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Seleccionar área...</option>
                {context.project && areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Sitio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio (Opcional)
              </label>
              <select
                value={context.site}
                onChange={(e) => handleSiteChange(e.target.value)}
                disabled={!context.area}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !context.area ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Seleccionar sitio (opcional)...</option>
                {context.area && sites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
              {context.area && sites.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No hay sitios disponibles para esta área</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleClearContext}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
              >
                🗑️ Limpiar Contexto
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextSelector; 