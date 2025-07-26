'use client';

import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

const ToolsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const tools = [
    {
      name: 'AI Tools',
      description: 'Herramientas de inteligencia artificial para análisis arqueológico',
      icon: '🤖',
      color: 'bg-blue-500',
      path: '/ai-tools',
      examples: ['Análisis de patrones', 'Clasificación automática', 'Predicciones']
    },
    {
      name: 'Artifact Documentation',
      description: 'Documentación detallada de artefactos arqueológicos',
      icon: '🏺',
      color: 'bg-green-500',
      path: '/artifact-documentation',
      examples: ['Fichas de artefactos', 'Fotografías', 'Mediciones']
    },
    {
      name: 'Collaboration',
      description: 'Herramientas de colaboración en equipo',
      icon: '👥',
      color: 'bg-purple-500',
      path: '/collaboration',
      examples: ['Compartir datos', 'Comentarios', 'Trabajo en equipo']
    },
    {
      name: 'Communication',
      description: 'Sistema de comunicación interna',
      icon: '💬',
      color: 'bg-orange-500',
      path: '/communication',
      examples: ['Mensajes', 'Notificaciones', 'Alertas']
    },
    {
      name: 'Export',
      description: 'Exportación de datos en múltiples formatos',
      icon: '📤',
      color: 'bg-red-500',
      path: '/export',
      examples: ['JSON', 'CSV', 'PDF', 'Shapefile']
    },
    {
      name: 'Fieldwork',
      description: 'Gestión de trabajo de campo',
      icon: '🏕️',
      color: 'bg-yellow-500',
      path: '/fieldwork',
      examples: ['Excavaciones', 'Prospecciones', 'Registro de campo']
    },
    {
      name: 'Grid Measurement',
      description: 'Sistema de medición y cuadrícula',
      icon: '📏',
      color: 'bg-indigo-500',
      path: '/grid-measurement',
      examples: ['Cuadrículas', 'Mediciones', 'Coordenadas']
    },
    {
      name: 'Laboratory',
      description: 'Gestión de análisis de laboratorio',
      icon: '🔬',
      color: 'bg-teal-500',
      path: '/laboratory',
      examples: ['Análisis cerámico', 'Datación', 'Estudios especializados']
    },
    {
      name: 'Mapping',
      description: 'Sistema de mapeo SIG integrado',
      icon: '🗺️',
      color: 'bg-pink-500',
      path: '/mapping',
      examples: ['Visualización', 'Análisis espacial', 'Exportación']
    },
    {
      name: 'Publications',
      description: 'Gestión de publicaciones y reportes',
      icon: '📚',
      color: 'bg-gray-500',
      path: '/publications',
      examples: ['Artículos', 'Informes', 'Presentaciones']
    },
    {
      name: 'Surface Mapping',
      description: 'Mapeo de superficie y prospección',
      icon: '🌍',
      color: 'bg-cyan-500',
      path: '/surface-mapping',
      examples: ['Prospección', 'Mapeo', 'Registro']
    },
    {
      name: 'Tasks',
      description: 'Gestión de tareas y proyectos',
      icon: '✅',
      color: 'bg-emerald-500',
      path: '/tasks',
      examples: ['Asignación', 'Seguimiento', 'Completado']
    },
    {
      name: 'Visualization',
      description: 'Herramientas de visualización de datos',
      icon: '📊',
      color: 'bg-violet-500',
      path: '/visualization',
      examples: ['Gráficos', 'Mapas', 'Diagramas']
    }
  ];

  const handleToolClick = (tool: any) => {
    // Por ahora, mostrar un mensaje de que la herramienta está en desarrollo
    alert(`${tool.name} está en desarrollo. Próximamente disponible.`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a las herramientas.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6" data-testid="tools-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🛠️ Herramientas de Investigación</h1>
              <p className="text-blue-100">
                Acceso a todas las herramientas especializadas para investigación arqueológica
              </p>
            </div>
            <Button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-white border-opacity-30"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Grid de herramientas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              data-testid={`tool-${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/[^a-z0-9-]/g, '')}`}
              onClick={() => handleToolClick(tool)}
            >
              <div className="flex items-start space-x-4">
                <div className={`text-3xl ${tool.color} text-white p-3 rounded-lg`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
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
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Información</h3>
          <p className="text-blue-700">
            Estas herramientas están diseñadas específicamente para investigadores arqueológicos. 
            Cada herramienta se integra con el sistema de gestión de datos arqueológicos para 
            proporcionar una experiencia de investigación completa y eficiente.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ToolsPage; 