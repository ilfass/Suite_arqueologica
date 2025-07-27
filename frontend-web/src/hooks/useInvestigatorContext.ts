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

  // Cargar contexto al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('🚀 Hook montado, cargando contexto...');
    
    // Cargar contexto directamente sin usar loadContext para evitar bucles
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
  }, []); // Solo se ejecuta al montar

  // Escuchar evento personalizado de actualización de contexto
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleContextUpdated = () => {
      console.log('🔄 Evento contextUpdated recibido, recargando contexto...');
      try {
        const saved = localStorage.getItem('investigator-context');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContextState({
            project: parsed.project || '',
            area: parsed.area || '',
            site: parsed.site || ''
          });
          console.log('✅ Contexto recargado desde evento:', parsed);
        }
      } catch (error) {
        console.error('Error reloading context from event:', error);
      }
    };

    window.addEventListener('contextUpdated', handleContextUpdated);

    return () => {
      window.removeEventListener('contextUpdated', handleContextUpdated);
    };
  }, []); // Solo se ejecuta al montar

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