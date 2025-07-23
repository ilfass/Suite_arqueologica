'use client';

import { useState, useEffect, useCallback } from 'react';

interface InvestigatorContext {
  project: string;
  area: string;
  site: string;
}

interface UseInvestigatorContextReturn {
  context: InvestigatorContext;
  setContext: (context: InvestigatorContext) => void;
  clearContext: () => void;
  hasContext: boolean;
  isLoading: boolean;
}

const useInvestigatorContext = (): UseInvestigatorContextReturn => {
  const [context, setContextState] = useState<InvestigatorContext>({ project: '', area: '', site: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar contexto desde localStorage
  const loadContext = useCallback(() => {
    try {
      const saved = localStorage.getItem('investigator-context');
      if (saved) {
        const parsed = JSON.parse(saved);
        setContextState({
          project: parsed.project || '',
          area: parsed.area || '',
          site: parsed.site || ''
        });
      }
    } catch (error) {
      console.error('Error loading investigator context:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar contexto en localStorage
  const saveContext = useCallback((newContext: InvestigatorContext) => {
    try {
      localStorage.setItem('investigator-context', JSON.stringify(newContext));
    } catch (error) {
      console.error('Error saving investigator context:', error);
    }
  }, []);

  // Establecer contexto
  const setContext = useCallback((newContext: InvestigatorContext) => {
    setContextState(newContext);
    saveContext(newContext);
  }, [saveContext]);

  // Limpiar contexto
  const clearContext = useCallback(() => {
    setContextState({ project: '', area: '', site: '' });
    localStorage.removeItem('investigator-context');
  }, []);

  // Verificar si hay contexto completo
  const hasContext = Boolean(context.project && context.area && context.site);

  // Cargar contexto al montar
  useEffect(() => {
    loadContext();
  }, [loadContext]);

  // Sincronizar contexto cuando la ventana recibe foco
  useEffect(() => {
    const handleFocus = () => {
      loadContext();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadContext();
      }
    };

    // Guardar contexto antes de salir de la página
    const handleBeforeUnload = () => {
      if (hasContext) {
        saveContext(context);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loadContext, saveContext, hasContext, context]);

  return {
    context,
    setContext,
    clearContext,
    hasContext,
    isLoading
  };
};

export default useInvestigatorContext; 