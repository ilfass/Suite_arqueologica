import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// TIPOS DE CONTEXTO UNIFICADO
// ============================================================================

export interface UnifiedContext {
  project_id: string;
  project_name: string;
  area_id: string;
  area_name: string;
  site_id?: string;
  site_name?: string;
}

export interface ContextState {
  context: UnifiedContext | null;
  isLoading: boolean;
  error: string | null;
  hasContext: boolean;
  isContextComplete: boolean;
}

// ============================================================================
// HOOK UNIFICADO DE CONTEXTO
// ============================================================================

export const useUnifiedContext = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ContextState>({
    context: null,
    isLoading: true,
    error: null,
    hasContext: false,
    isContextComplete: false
  });

  // ============================================================================
  // FUNCIONES DE API
  // ============================================================================

  const fetchContext = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false, hasContext: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/context/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const context = data.data.context;
      const hasContext = data.data.hasContext;
      const isContextComplete = hasContext && context?.site_id;

      setState({
        context,
        isLoading: false,
        error: null,
        hasContext,
        isContextComplete
      });

      // Guardar en localStorage como backup
      if (context) {
        localStorage.setItem('unified-context', JSON.stringify(context));
      } else {
        localStorage.removeItem('unified-context');
      }

    } catch (error) {
      console.error('Error fetching context:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, [user]);

  const updateContext = useCallback(async (contextData: UnifiedContext) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/context/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contextData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const context = data.data.context;
      const hasContext = true;
      const isContextComplete = Boolean(context?.site_id);

      setState({
        context,
        isLoading: false,
        error: null,
        hasContext,
        isContextComplete
      });

      // Guardar en localStorage como backup
      localStorage.setItem('unified-context', JSON.stringify(context));

      return context;

    } catch (error) {
      console.error('Error updating context:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
      throw error;
    }
  }, [user]);

  const clearContext = useCallback(async () => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/context/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setState({
        context: null,
        isLoading: false,
        error: null,
        hasContext: false,
        isContextComplete: false
      });

      // Limpiar localStorage
      localStorage.removeItem('unified-context');

    } catch (error) {
      console.error('Error clearing context:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
      throw error;
    }
  }, [user]);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const setProject = useCallback(async (projectId: string, projectName: string) => {
    const newContext: UnifiedContext = {
      project_id: projectId,
      project_name: projectName,
      area_id: '',
      area_name: '',
      site_id: undefined,
      site_name: undefined
    };
    return await updateContext(newContext);
  }, [updateContext]);

  const setArea = useCallback(async (areaId: string, areaName: string) => {
    if (!state.context?.project_id) {
      throw new Error('Debe seleccionar un proyecto primero');
    }

    const newContext: UnifiedContext = {
      ...state.context,
      area_id: areaId,
      area_name: areaName,
      site_id: undefined,
      site_name: undefined
    };
    return await updateContext(newContext);
  }, [state.context, updateContext]);

  const setSite = useCallback(async (siteId: string, siteName: string) => {
    if (!state.context?.project_id || !state.context?.area_id) {
      throw new Error('Debe seleccionar un proyecto y área primero');
    }

    const newContext: UnifiedContext = {
      ...state.context,
      site_id: siteId,
      site_name: siteName
    };
    return await updateContext(newContext);
  }, [state.context, updateContext]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Cargar contexto al montar el componente
  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  // Cargar contexto desde localStorage como fallback
  useEffect(() => {
    if (!user && !state.isLoading) {
      const savedContext = localStorage.getItem('unified-context');
      if (savedContext) {
        try {
          const context = JSON.parse(savedContext);
          const hasContext = Boolean(context?.project_id && context?.area_id);
          const isContextComplete = hasContext && Boolean(context?.site_id);
          
          setState({
            context,
            isLoading: false,
            error: null,
            hasContext,
            isContextComplete
          });
        } catch (error) {
          console.error('Error parsing saved context:', error);
          localStorage.removeItem('unified-context');
        }
      }
    }
  }, [user, state.isLoading]);

  // ============================================================================
  // RETORNO
  // ============================================================================

  return {
    // Estado
    context: state.context,
    isLoading: state.isLoading,
    error: state.error,
    hasContext: state.hasContext,
    isContextComplete: state.isContextComplete,

    // Acciones
    fetchContext,
    updateContext,
    clearContext,
    setProject,
    setArea,
    setSite,

    // Utilidades
    getContextDisplay: () => {
      if (!state.context) return 'Sin contexto';
      const { project_name, area_name, site_name } = state.context;
      if (site_name) {
        return `${project_name} > ${area_name} > ${site_name}`;
      }
      return `${project_name} > ${area_name}`;
    },

    getContextLevel: () => {
      if (!state.context) return 'none';
      if (state.context.site_id) return 'complete';
      if (state.context.area_id) return 'partial';
      return 'project';
    }
  };
}; 