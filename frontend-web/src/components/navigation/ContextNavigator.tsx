'use client';

import React, { useState, useEffect } from 'react';
import { useArchaeological } from '../../contexts/ArchaeologicalContext';
import { ArchaeologicalContext as ArchContext } from '../../types/archaeological';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ContextNavigatorProps {
  onContextChange: (context: Partial<ArchContext>) => void;
  currentContext: Partial<ArchContext>;
}

type NavigationLevel = 'projects' | 'areas' | 'sites';

const ContextNavigator: React.FC<ContextNavigatorProps> = ({ 
  onContextChange, 
  currentContext 
}) => {
  const { state, dispatch } = useArchaeological();
  
  // Agregar data-testid para pruebas
  const testId = 'context-navigator';
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('projects');
  const [selectedItems, setSelectedItems] = useState<Partial<ArchContext>>({});

  // Determinar el nivel actual basado en el contexto
  useEffect(() => {
    if (currentContext.projectId && !currentContext.areaId) {
      setCurrentLevel('areas');
    } else if (currentContext.areaId && !currentContext.siteId) {
      setCurrentLevel('sites');
    } else if (currentContext.projectId && currentContext.areaId && currentContext.siteId) {
      // Contexto completo - no mostrar cards
      setCurrentLevel('projects');
    } else {
      setCurrentLevel('projects');
    }
  }, [currentContext]);

  // Obtener datos filtrados según el nivel
  const getLevelData = () => {
    switch (currentLevel) {
      case 'projects':
        return state.projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          subtitle: project.institution,
          icon: '📋',
          color: 'blue'
        }));
      
      case 'areas':
        return state.areas
          .filter(area => !currentContext.projectId || area.projectId === currentContext.projectId)
          .map(area => ({
            id: area.id,
            name: area.name,
            description: area.description,
            subtitle: area.characteristics.join(', '),
            icon: '🗺️',
            color: 'green'
          }));
      
      case 'sites':
        return state.sites
          .filter(site => !currentContext.areaId || site.areaId === currentContext.areaId)
          .map(site => ({
            id: site.id,
            name: site.name,
            description: site.description,
            subtitle: site.siteType,
            icon: '🏛️',
            color: 'purple'
          }));
      
      default:
        return [];
    }
  };

  const handleItemSelect = (item: any) => {
    const newContext = { ...currentContext };
    
    switch (currentLevel) {
      case 'projects':
        newContext.projectId = item.id;
        newContext.projectName = item.name;
        newContext.areaId = '';
        newContext.areaName = '';
        newContext.siteId = '';
        newContext.siteName = '';
        break;
      
      case 'areas':
        newContext.areaId = item.id;
        newContext.areaName = item.name;
        newContext.siteId = '';
        newContext.siteName = '';
        break;
      
      case 'sites':
        newContext.siteId = item.id;
        newContext.siteName = item.name;
        break;
    }
    
    onContextChange(newContext);
  };

  const handleBack = () => {
    const newContext = { ...currentContext };
    
    switch (currentLevel) {
      case 'areas':
        newContext.projectId = '';
        newContext.projectName = '';
        setCurrentLevel('projects');
        break;
      
      case 'sites':
        newContext.areaId = '';
        newContext.areaName = '';
        setCurrentLevel('areas');
        break;
    }
    
    onContextChange(newContext);
  };

  const handleReset = () => {
    onContextChange({});
    setCurrentLevel('projects');
  };

  const getLevelTitle = () => {
    switch (currentLevel) {
      case 'projects': return 'Proyectos';
      case 'areas': return 'Áreas/Regiones';
      case 'sites': return 'Sitios';
      default: return '';
    }
  };

  const getLevelDescription = () => {
    switch (currentLevel) {
      case 'projects': return 'Selecciona un proyecto arqueológico';
      case 'areas': return 'Selecciona un área o región del proyecto';
      case 'sites': return 'Selecciona un sitio arqueológico';
      default: return '';
    }
  };

  const levelData = getLevelData();
  // El contexto está completo solo si tiene proyecto, área Y sitio
  const isContextComplete = currentContext.projectId && currentContext.areaId && currentContext.siteId;

  return (
    <div className="w-full" data-testid={testId}>
      {/* Header del navegador */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{getLevelTitle()}</h2>
            <p className="text-sm text-gray-600">{getLevelDescription()}</p>
          </div>
          <div className="flex items-center space-x-2">
            {currentLevel !== 'projects' && !isContextComplete && (
              <Button
                onClick={handleBack}
                className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 text-sm"
              >
                ← Volver
              </Button>
            )}
            {(currentContext.projectId || currentContext.areaId || currentContext.siteId) && (
              <Button
                onClick={handleReset}
                className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 text-sm"
              >
                🔄 Reiniciar
              </Button>
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        {(currentContext.projectId || currentContext.areaId || currentContext.siteId) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span>Contexto:</span>
            {currentContext.projectId && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                📋 {currentContext.projectName}
              </span>
            )}
            {currentContext.areaId && (
              <>
                <span>→</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  🗺️ {currentContext.areaName}
                </span>
              </>
            )}
            {currentContext.siteId && (
              <>
                <span>→</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  🏛️ {currentContext.siteName}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mostrar mensaje cuando el contexto está completo */}
      {isContextComplete && (
        <Card className="p-8 text-center">
          <div className="text-green-600">
            <div className="text-4xl mb-4">✅</div>
                         <h3 className="text-lg font-semibold mb-2">
               {isContextComplete ? 'Contexto Completo' : 'Contexto Configurado'}
             </h3>
             <p className="text-sm">
               {isContextComplete 
                 ? 'El contexto arqueológico está completamente configurado con Proyecto, Área y Sitio.'
                 : 'El contexto arqueológico está configurado con Proyecto y Área. Puedes seleccionar un Sitio opcional.'
               }
               <br />
               Puedes usar todas las herramientas del sistema.
             </p>
          </div>
        </Card>
      )}

      {/* Tarjetas del nivel actual - solo mostrar si el contexto no está completo */}
      {!isContextComplete && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levelData.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md border-2 p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  currentContext[`${currentLevel.slice(0, -1)}Id` as keyof ArchContext] === item.id
                    ? `border-${item.color}-400 bg-${item.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-2xl text-${item.color}-600`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje cuando no hay datos */}
          {levelData.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold mb-2">No hay {getLevelTitle().toLowerCase()}</h3>
                <p className="text-sm">
                  {currentLevel === 'projects' 
                    ? 'No hay proyectos disponibles. Crea uno nuevo para comenzar.'
                    : `No hay ${getLevelTitle().toLowerCase()} disponibles para el contexto seleccionado.`
                  }
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ContextNavigator; 