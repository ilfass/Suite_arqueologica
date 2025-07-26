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
  setProject: (project: string) => void;
  setArea: (area: string) => void;
  setSite: (site: string) => void;
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
      console.log('🔄 Cargando contexto desde localStorage...');
      const saved = localStorage.getItem('investigator-context');
      console.log('📦 Datos guardados:', saved);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('🔍 Datos parseados:', parsed);
        setContextState({
          project: parsed.project || '',
          area: parsed.area || '',
          site: parsed.site || ''
        });
        console.log('✅ Contexto cargado:', {
          project: parsed.project || '',
          area: parsed.area || '',
          site: parsed.site || ''
        });
      } else {
        console.log('❌ No hay datos guardados en localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading investigator context:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 Carga completada, isLoading = false');
    }
  }, []);

  // Guardar contexto en localStorage
  const saveContext = useCallback((newContext: InvestigatorContext) => {
    try {
      localStorage.setItem('investigator-context', JSON.stringify(newContext));
      console.log('💾 Contexto guardado:', newContext);
    } catch (error) {
      console.error('Error saving investigator context:', error);
    }
  }, []);

  // Establecer contexto completo
  const setContext = useCallback((newContext: InvestigatorContext) => {
    console.log('🔧 Estableciendo contexto completo:', newContext);
    setContextState(newContext);
    saveContext(newContext);
  }, [saveContext]);

  // Establecer solo proyecto
  const setProject = useCallback((project: string) => {
    console.log('🔧 Estableciendo proyecto:', project);
    const newContext = { ...context, project, area: '', site: '' };
    setContextState(newContext);
    saveContext(newContext);
  }, [context, saveContext]);

  // Establecer solo área
  const setArea = useCallback((area: string) => {
    console.log('🔧 Estableciendo área:', area);
    const newContext = { ...context, area, site: '' };
    setContextState(newContext);
    saveContext(newContext);
  }, [context, saveContext]);

  // Establecer solo sitio
  const setSite = useCallback((site: string) => {
    console.log('🔧 Estableciendo sitio:', site);
    const newContext = { ...context, site };
    setContextState(newContext);
    saveContext(newContext);
  }, [context, saveContext]);

  // Limpiar contexto
  const clearContext = useCallback(() => {
    console.log('🗑️ Limpiando contexto');
    setContextState({ project: '', area: '', site: '' });
    localStorage.removeItem('investigator-context');
  }, []);

  // Verificar si hay contexto válido (proyecto y área son suficientes)
  // El contexto es válido si tiene proyecto y área, pero puede tener sitio opcional
  const hasContext = Boolean(context.project && context.area);
  
  // El contexto está completo si tiene proyecto, área y sitio
  const isContextComplete = Boolean(context.project && context.area && context.site);

  // Cargar contexto al montar - LÓGICA ULTRA SIMPLIFICADA
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('🚀 Hook montado, cargando contexto...');
    
    // Función interna para cargar contexto
    const loadContextFromStorage = () => {
      try {
        const saved = localStorage.getItem('investigator-context');
        console.log('📦 Datos en localStorage:', saved);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('✅ Datos parseados:', parsed);
          setContextState({
            project: parsed.project || '',
            area: parsed.area || '',
            site: parsed.site || ''
          });
          console.log('✅ Contexto establecido:', {
            project: parsed.project || '',
            area: parsed.area || '',
            site: parsed.site || ''
          });
        } else {
          console.log('❌ No hay datos guardados en localStorage');
        }
      } catch (error) {
        console.error('❌ Error cargando contexto:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Cargar inmediatamente
    loadContextFromStorage();
    
    // También cargar después de un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(loadContextFromStorage, 100);
    
    return () => clearTimeout(timer);
  }, []); // Solo se ejecuta al montar

  // Sincronizar contexto cuando la ventana recibe foco
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocus = () => {
      console.log('🔄 Ventana enfocada, recargando contexto...');
      loadContext();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Página visible, recargando contexto...');
        loadContext();
      }
    };

    // Guardar contexto antes de salir de la página
    const handleBeforeUnload = () => {
      if (hasContext) {
        console.log('💾 Guardando contexto antes de salir...');
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
    setProject,
    setArea,
    setSite,
    clearContext,
    hasContext,
    isLoading
  };
};

export default useInvestigatorContext; 