'use client';

import { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';

export default function TestContextVisualPage() {
  const { context, setContext, hasContext, isLoading } = useInvestigatorContext();
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [manualContext, setManualContext] = useState({
    project: '',
    area: '',
    site: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('investigator-context');
    setLocalStorageData(saved || 'No hay datos');
  }, [context]);

  const setTestContext = () => {
    const testContext = {
      project: 'Proyecto Cazadores Recolectores - La Laguna',
      area: 'Laguna La Brava',
      site: 'Sitio Pampeano La Laguna'
    };
    setContext(testContext);
    setLocalStorageData(JSON.stringify(testContext));
  };

  const setTestContextPartial = () => {
    const testContext = {
      project: 'Proyecto Cazadores Recolectores - La Laguna',
      area: 'Laguna La Brava',
      site: ''
    };
    setContext(testContext);
    setLocalStorageData(JSON.stringify(testContext));
  };

  const clearContext = () => {
    setContext({ project: '', area: '', site: '' });
    setLocalStorageData('No hay datos');
  };

  const setManualContextHandler = () => {
    setContext(manualContext);
    setLocalStorageData(JSON.stringify(manualContext));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Test Visual de Contexto</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estado del Contexto */}
        <div className="bg-white p-6 rounded-lg shadow-md border" data-testid="context-status">
          <h2 className="text-xl font-semibold mb-4">Estado del Contexto</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Proyecto:</span>
              <span className={context.project ? 'text-green-600' : 'text-red-500'}>
                {context.project || 'No establecido'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Área:</span>
              <span className={context.area ? 'text-green-600' : 'text-red-500'}>
                {context.area || 'No establecida'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sitio:</span>
              <span className={context.site ? 'text-green-600' : 'text-gray-500'}>
                {context.site || 'No especificado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Has Context:</span>
              <span className={hasContext ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                {hasContext ? '✅ SÍ' : '❌ NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Is Loading:</span>
              <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                {isLoading ? '⏳ SÍ' : '✅ NO'}
              </span>
            </div>
          </div>
        </div>

        {/* localStorage */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">localStorage</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
            {localStorageData}
          </pre>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🔧 Acciones de Prueba</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={setTestContext}
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            🧪 Contexto Completo
          </button>
          <button
            onClick={setTestContextPartial}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            🧪 Contexto Parcial
          </button>
          <button
            onClick={clearContext}
            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            🗑️ Limpiar
          </button>
          <a
            href="/dashboard/researcher/findings"
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium text-center inline-block"
          >
            🔍 Ir a Hallazgos
          </a>
        </div>
      </div>

      {/* Contexto Manual */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">✏️ Contexto Manual</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Proyecto"
            value={manualContext.project}
            onChange={(e) => setManualContext(prev => ({ ...prev, project: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Área"
            value={manualContext.area}
            onChange={(e) => setManualContext(prev => ({ ...prev, area: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Sitio (opcional)"
            value={manualContext.site}
            onChange={(e) => setManualContext(prev => ({ ...prev, site: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          onClick={setManualContextHandler}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
        >
          ✅ Establecer Contexto Manual
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-8 bg-green-50 p-6 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">📋 Instrucciones de Prueba:</h3>
        <ol className="text-green-800 space-y-2 text-sm">
          <li>1. <strong>Recarga la página</strong> - verifica si el contexto se carga automáticamente</li>
          <li>2. <strong>Usa "Contexto Completo"</strong> - establece proyecto, área y sitio</li>
          <li>3. <strong>Usa "Contexto Parcial"</strong> - establece solo proyecto y área</li>
          <li>4. <strong>Ve a Hallazgos</strong> - verifica que el contexto aparezca correctamente</li>
          <li>5. <strong>Prueba "Nuevo Hallazgo"</strong> - verifica que el contexto se cargue en el modal</li>
          <li>6. <strong>Usa Contexto Manual</strong> - prueba con datos personalizados</li>
        </ol>
      </div>

      {/* Debug Info */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">🔍 Debug Info:</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR'}</div>
          <div><strong>localStorage disponible:</strong> {typeof window !== 'undefined' && window.localStorage ? 'SÍ' : 'NO'}</div>
          <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
        </div>
      </div>
    </div>
  );
} 