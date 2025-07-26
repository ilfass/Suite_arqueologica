'use client';

import React from 'react';
import { useUnifiedContext } from '../../hooks/useUnifiedContext';

const ContextBanner: React.FC = () => {
  const { context, hasContext, isContextComplete } = useUnifiedContext();

  if (!hasContext) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Sin contexto activo:</strong> Selecciona un proyecto, área y sitio para comenzar a trabajar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-l-4 p-4 mb-4 ${
      isContextComplete 
        ? 'bg-green-50 border-green-400' 
        : 'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isContextComplete 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {isContextComplete ? '✅' : '🎯'}
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-medium ${
              isContextComplete ? 'text-green-800' : 'text-blue-800'
            }`}>
              Contexto Arqueológico Activo
            </h3>
            <div className="mt-1 text-sm space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isContextComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                📋 {context.project_name || 'Sin proyecto'}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isContextComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                🗺️ {context.area_name || 'Sin área'}
              </span>
              {context.site_name && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isContextComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  🏛️ {context.site_name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isContextComplete && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Contexto parcial
            </span>
          )}
          {isContextComplete && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              Contexto completo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextBanner; 