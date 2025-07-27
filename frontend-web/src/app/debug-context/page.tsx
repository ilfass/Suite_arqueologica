'use client';

import React, { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DebugContext: React.FC = () => {
  const { context, setContext, hasContext, isLoading } = useInvestigatorContext();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Verificar localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('investigator-context');
      setLocalStorageData(saved ? JSON.parse(saved) : null);
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, []);

  // Calcular información de debug
  useEffect(() => {
    const hasMinimal = Boolean(context.project && context.area);
    const hasComplete = Boolean(context.project && context.area && context.site);
    
    setDebugInfo({
      hasMinimal,
      hasComplete,
      hasContext,
      isLoading,
      contextKeys: Object.keys(context),
      contextValues: Object.values(context),
      localStorageData,
      localStorageKeys: localStorageData ? Object.keys(localStorageData) : [],
      localStorageValues: localStorageData ? Object.values(localStorageData) : []
    });
  }, [context, hasContext, isLoading, localStorageData]);

  const setTestContext = (testContext: any) => {
    try {
      setContext(testContext);
      // Actualizar localStorage data
      setTimeout(() => {
        const saved = localStorage.getItem('investigator-context');
        setLocalStorageData(saved ? JSON.parse(saved) : null);
      }, 100);
    } catch (error) {
      console.error('Error setting context:', error);
    }
  };

  const clearTestContext = () => {
    try {
      setContext({ project: '', area: '', site: '' });
      localStorage.removeItem('investigator-context');
      setLocalStorageData(null);
    } catch (error) {
      console.error('Error clearing context:', error);
    }
  };

  const testContexts = [
    {
      name: 'Contexto Completo',
      context: {
        project: 'Proyecto de Prueba Completo',
        area: 'Área de Prueba',
        site: 'Sitio de Prueba'
      }
    },
    {
      name: 'Contexto Mínimo',
      context: {
        project: 'Proyecto de Prueba Mínimo',
        area: 'Área de Prueba',
        site: ''
      }
    },
    {
      name: 'Sin Contexto',
      context: {
        project: '',
        area: '',
        site: ''
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cargando...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🔍 Debug del Contexto</h1>
          <p className="text-gray-600 mb-6">
            Página para debuggear el estado del contexto y verificar la lógica de habilitación de herramientas.
          </p>
        </Card>

        {/* Estado Actual */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Estado Actual</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Contexto del Hook:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Proyecto:</strong> {context.project || 'No establecido'}</div>
                <div><strong>Área:</strong> {context.area || 'No establecida'}</div>
                <div><strong>Sitio:</strong> {context.site || 'No establecido'}</div>
                <div><strong>hasContext:</strong> {hasContext ? '✅ Sí' : '❌ No'}</div>
                <div><strong>isLoading:</strong> {isLoading ? '🔄 Sí' : '✅ No'}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">localStorage:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Datos:</strong> {localStorageData ? '✅ Presente' : '❌ Ausente'}</div>
                {localStorageData && (
                  <>
                    <div><strong>Proyecto:</strong> {localStorageData.project || 'No establecido'}</div>
                    <div><strong>Área:</strong> {localStorageData.area || 'No establecida'}</div>
                    <div><strong>Sitio:</strong> {localStorageData.site || 'No establecido'}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Información de Debug */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔧 Información de Debug</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Lógica de Habilitación:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>hasMinimalContext:</strong> {debugInfo.hasMinimal ? '✅ Sí' : '❌ No'}</div>
                <div><strong>hasCompleteContext:</strong> {debugInfo.hasComplete ? '✅ Sí' : '❌ No'}</div>
                <div><strong>Herramientas Básicas:</strong> {debugInfo.hasMinimal ? '✅ Habilitadas' : '❌ Deshabilitadas'}</div>
                <div><strong>Mapeo SIG:</strong> {debugInfo.hasComplete ? '✅ Habilitado' : '❌ Deshabilitado'}</div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Estructura de Datos:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Claves del contexto:</strong> {debugInfo.contextKeys?.join(', ') || 'Ninguna'}</div>
                <div><strong>Valores del contexto:</strong> {debugInfo.contextValues?.join(', ') || 'Ninguno'}</div>
                <div><strong>Claves localStorage:</strong> {debugInfo.localStorageKeys?.join(', ') || 'Ninguna'}</div>
                <div><strong>Valores localStorage:</strong> {debugInfo.localStorageValues?.join(', ') || 'Ninguno'}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contextos de Prueba */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🧪 Contextos de Prueba</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {testContexts.map((testContext, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">{testContext.name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  <div><strong>Proyecto:</strong> {testContext.context.project || 'No establecido'}</div>
                  <div><strong>Área:</strong> {testContext.context.area || 'No establecida'}</div>
                  <div><strong>Sitio:</strong> {testContext.context.site || 'No establecido'}</div>
                </div>
                <Button
                  onClick={() => setTestContext(testContext.context)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Establecer
                </Button>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={clearTestContext}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              🗑️ Limpiar Contexto
            </Button>
            
            <Button
              onClick={() => window.open('/dashboard/researcher', '_blank')}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              🗺️ Ir al Dashboard
            </Button>
          </div>
        </Card>

        {/* Raw Data */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 Datos Crudos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contexto del Hook:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(context, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">localStorage:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DebugContext; 