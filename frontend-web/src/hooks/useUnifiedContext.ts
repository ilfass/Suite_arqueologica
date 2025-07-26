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
// HOOK UNIFICADO DE CONTEXTO (VERSIÓN SIMPLIFICADA)
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

  // Cargar contexto desde localStorage al inicio
  useEffect(() => {
    try {
      const savedContext = localStorage.getItem('unified-context');
      if (savedContext) {
        const context = JSON.parse(savedContext);
        const hasContext = !!context.project_id;
        const isContextComplete = hasContext && !!context.site_id;
        
        setState({
          context,
          isLoading: false,
          error: null,
          hasContext,
          isContextComplete
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading context from localStorage:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE API (SIMPLIFICADAS)
  // ============================================================================

  const fetchContext = useCallback(async () => {
    // Por ahora, solo cargar desde localStorage
    console.log('Fetching context from localStorage...');
  }, []);

  const updateContext = useCallback(async (contextData: UnifiedContext) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Guardar en localStorage
      localStorage.setItem('unified-context', JSON.stringify(contextData));
      
      const hasContext = !!contextData.project_id;
      const isContextComplete = hasContext && !!contextData.site_id;
      
      setState({
        context: contextData,
        isLoading: false,
        error: null,
        hasContext,
        isContextComplete
      });
      
      console.log('Context updated:', contextData);
    } catch (error) {
      console.error('Error updating context:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  const clearContext = useCallback(async () => {
    try {
      localStorage.removeItem('unified-context');
      setState({
        context: null,
        isLoading: false,
        error: null,
        hasContext: false,
        isContextComplete: false
      });
      console.log('Context cleared');
    } catch (error) {
      console.error('Error clearing context:', error);
    }
  }, []);

  // ============================================================================
  // FUNCIONES UTILITARIAS
  // ============================================================================

  const setProject = useCallback((projectId: string, projectName: string) => {
    const currentContext = state.context || {
      project_id: '',
      project_name: '',
      area_id: '',
      area_name: '',
      site_id: '',
      site_name: ''
    };
    
    updateContext({
      ...currentContext,
      project_id: projectId,
      project_name: projectName,
      area_id: '',
      area_name: '',
      site_id: '',
      site_name: ''
    });
  }, [state.context, updateContext]);

  const setArea = useCallback((areaId: string, areaName: string) => {
    if (!state.context?.project_id) {
      console.warn('No project selected. Please select a project first.');
      return;
    }
    
    updateContext({
      ...state.context,
      area_id: areaId,
      area_name: areaName,
      site_id: '',
      site_name: ''
    });
  }, [state.context, updateContext]);

  const setSite = useCallback((siteId: string, siteName: string) => {
    if (!state.context?.project_id || !state.context?.area_id) {
      console.warn('No project or area selected. Please select them first.');
      return;
    }
    
    updateContext({
      ...state.context,
      site_id: siteId,
      site_name: siteName
    });
  }, [state.context, updateContext]);

  // ============================================================================
  // FUNCIONES DE DISPLAY Y UTILIDAD
  // ============================================================================

  const getContextDisplay = useCallback(() => {
    if (!state.context) return 'Sin contexto';
    
    const { project_name, area_name, site_name } = state.context;
    
    if (site_name) {
      return `${project_name} > ${area_name} > ${site_name}`;
    } else if (area_name) {
      return `${project_name} > ${area_name}`;
    } else if (project_name) {
      return project_name;
    }
    
    return 'Sin contexto';
  }, [state.context]);

  const getContextLevel = useCallback(() => {
    if (!state.context) return 'none';
    
    const { project_id, area_id, site_id } = state.context;
    
    if (site_id) return 'site';
    if (area_id) return 'area';
    if (project_id) return 'project';
    
    return 'none';
  }, [state.context]);

  const getContextSummary = useCallback(() => {
    if (!state.context) return null;
    
    const { project_name, area_name, site_name } = state.context;
    
    return {
      project: project_name,
      area: area_name,
      site: site_name
    };
  }, [state.context]);

  const isContextValid = useCallback(() => {
    return state.hasContext && !!state.context?.project_id;
  }, [state.hasContext, state.context]);

  return {
    ...state,
    fetchContext,
    updateContext,
    clearContext,
    setProject,
    setArea,
    setSite,
    getContextDisplay,
    getContextLevel,
    getContextSummary,
    isContextValid
  };
}; 