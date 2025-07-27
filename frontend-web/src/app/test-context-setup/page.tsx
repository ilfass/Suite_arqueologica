'use client';

import React, { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TestContextSetup: React.FC = () => {
  const { context, setContext, hasContext, isLoading } = useInvestigatorContext();
  const [message, setMessage] = useState('');

  // Contextos de prueba predefinidos
  const testContexts = [
    {
      name: 'Contexto Completo (Todas las Herramientas)',
      context: {
        project: 'Proyecto Cazadores Recolectores Pampeanos',
        area: 'Pampa Húmeda',
        site: 'Sitio La Laguna'
      }
    },
    {
      name: 'Contexto Mínimo (Herramientas Básicas)',
      context: {
        project: 'Proyecto Análisis de ADN Antiguo',
        area: 'Pampa Seca',
        site: ''
      }
    },
    {
      name: 'Sin Contexto (Herramientas Deshabilitadas)',
      context: {
        project: '',
        area: '',
        site: ''
      }
    }
  ];

  const setTestContext = (testContext: any) => {
    try {
      setContext(testContext);
      setMessage(`✅ Contexto establecido: ${testContext.project} > ${testContext.area} > ${testContext.site}`);
    } catch (error) {
      setMessage(`❌ Error al establecer contexto: ${error}`);
    }
  };

  const clearTestContext = () => {
    try {
      setContext({ project: '', area: '', site: '' });
      setMessage('🗑️ Contexto limpiado');
    } catch (error) {
      setMessage(`❌ Error al limpiar contexto: ${error}`);
    }
  };

  const checkContextStatus = () => {
    const hasMinimal = context.project && context.area;
    const hasComplete = context.project && context.area && context.site;
    
    return {
      hasMinimal,
      hasComplete,
      minimalStatus: hasMinimal ? '✅ Habilitado' : '❌ Deshabilitado',
      completeStatus: hasComplete ? '✅ Habilitado' : '❌ Deshabilitado',
      minimalColor: hasMinimal ? 'text-green-600' : 'text-red-600',
      completeColor: hasComplete ? 'text-green-600' : 'text-red-600'
    };
  };

  const contextStatus = checkContextStatus();

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
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🔧 Configuración de Contexto de Prueba</h1>
          <p className="text-gray-600 mb-6">
            Esta página te permite establecer un contexto de prueba para habilitar el mapeo SIG integrado.
          </p>
        </Card>

        {/* Estado Actual */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Estado Actual del Contexto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Contexto Actual:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Proyecto:</strong> {context.project || 'No establecido'}</div>
                <div><strong>Área:</strong> {context.area || 'No establecida'}</div>
                <div><strong>Sitio:</strong> {context.site || 'No establecido'}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Estado de las Herramientas:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Herramientas Básicas:</strong> <span className={contextStatus.minimalColor}>{contextStatus.minimalStatus}</span></div>
                <div><strong>Mapeo SIG:</strong> <span className={contextStatus.completeColor}>{contextStatus.completeStatus}</span></div>
                <div><strong>Contexto Válido:</strong> {hasContext ? '✅ Sí' : '❌ No'}</div>
              </div>
            </div>
          </div>

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}
        </Card>

        {/* Contextos de Prueba */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🧪 Contextos de Prueba Predefinidos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {testContexts.map((testContext, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">{testContext.name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  <div><strong>Proyecto:</strong> {testContext.context.project}</div>
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
              🗺️ Ir al Dashboard del Investigador
            </Button>
          </div>
        </Card>

        {/* Instrucciones */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Instrucciones</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Para habilitar las herramientas:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li><strong>Herramientas Básicas:</strong> Selecciona proyecto y área</li>
                <li><strong>Mapeo SIG:</strong> Selecciona proyecto, área y sitio</li>
                <li>Verifica que el estado muestre "✅ Habilitado"</li>
                <li>Ve al Dashboard del Investigador</li>
                <li>Las herramientas correspondientes estarán habilitadas</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Requisitos por herramienta:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li><strong>Herramientas Básicas:</strong> Proyecto + Área</li>
                <li><strong>Mapeo SIG Integrado:</strong> Proyecto + Área + Sitio</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <strong>💡 Nota:</strong> El contexto se guarda en localStorage del navegador. 
              Si cambias de navegador o borras los datos, necesitarás establecer el contexto nuevamente.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestContextSetup; 