'use client';

import { useState, useEffect } from 'react';
import useInvestigatorContext from '../../hooks/useInvestigatorContext';

export default function TestContextSimplePage() {
  const { context, setContext, hasContext, isLoading } = useInvestigatorContext();
  const [localStorageData, setLocalStorageData] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('investigator-context');
    setLocalStorageData(saved || 'No hay datos');
  }, []);

  const setTestContext = () => {
    const testContext = {
      project: 'Proyecto Cazadores Recolectores - La Laguna',
      area: 'Laguna La Brava',
      site: '' // Sitio opcional
    };
    
    setContext(testContext);
    setLocalStorageData(JSON.stringify(testContext));
  };

  const clearContext = () => {
    setContext({ project: '', area: '', site: '' });
    setLocalStorageData('No hay datos');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Test Simple de Contexto</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado del Contexto */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Estado del Contexto</h2>
          <div className="space-y-2">
            <div><strong>Proyecto:</strong> {context.project || 'No establecido'}</div>
            <div><strong>Área:</strong> {context.area || 'No establecida'}</div>
            <div><strong>Sitio:</strong> {context.site || 'No establecido'}</div>
            <div><strong>Has Context:</strong> {hasContext ? '✅ SÍ' : '❌ NO'}</div>
            <div><strong>Is Loading:</strong> {isLoading ? '⏳ SÍ' : '✅ NO'}</div>
          </div>
        </div>

        {/* localStorage */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">localStorage</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {localStorageData}
          </pre>
        </div>
      </div>

      {/* Botones */}
      <div className="mt-6 flex space-x-4">
        <button 
          onClick={setTestContext}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          🔧 Establecer Contexto Test
        </button>
        
        <button 
          onClick={clearContext}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          🗑️ Limpiar Contexto
        </button>

        <a 
          href="/dashboard/researcher/findings"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium inline-block"
        >
          🔍 Ir a Hallazgos
        </a>
      </div>

      {/* Instrucciones */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h3>
        <ol className="text-blue-800 space-y-1 text-sm">
          <li>1. Haz clic en "Establecer Contexto Test"</li>
          <li>2. Verifica que el contexto se establezca correctamente</li>
          <li>3. Haz clic en "Ir a Hallazgos"</li>
          <li>4. Verifica que el contexto aparezca en la página de hallazgos</li>
          <li>5. Haz clic en "Nuevo Hallazgo" y verifica que el contexto se cargue</li>
        </ol>
      </div>
    </div>
  );
} 