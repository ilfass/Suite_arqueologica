import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';

// ============================================================================
// TIPOS DE CONTEXTO
// ============================================================================

export interface UserContext {
  id: number;
  user_id: string;
  project_id: string;
  project_name: string;
  area_id: string;
  area_name: string;
  site_id?: string;
  site_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ContextUpdateData {
  project_id: string;
  project_name: string;
  area_id: string;
  area_name: string;
  site_id?: string;
  site_name?: string;
}

// ============================================================================
// SERVICIO DE CONTEXTO
// ============================================================================

export class ContextService {
  
  /**
   * Obtener el contexto activo de un usuario
   */
  static async getUserContext(userId: string): Promise<UserContext | null> {
    try {
      const { data, error } = await supabase
        .from('user_context')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró contexto para el usuario
          return null;
        }
        throw new AppError(`Error al obtener contexto: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error interno al obtener contexto del usuario', 500);
    }
  }

  /**
   * Actualizar o crear el contexto de un usuario
   */
  static async updateUserContext(userId: string, contextData: ContextUpdateData): Promise<UserContext> {
    try {
      const { data, error } = await supabase
        .from('user_context')
        .upsert({
          user_id: userId,
          ...contextData
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        throw new AppError(`Error al actualizar contexto: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error interno al actualizar contexto del usuario', 500);
    }
  }

  /**
   * Eliminar el contexto de un usuario
   */
  static async clearUserContext(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_context')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Error al eliminar contexto: ${error.message}`, 500);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error interno al eliminar contexto del usuario', 500);
    }
  }

  /**
   * Verificar si un usuario tiene contexto válido
   */
  static async hasValidContext(userId: string): Promise<boolean> {
    try {
      const context = await this.getUserContext(userId);
      return context !== null && 
             Boolean(context.project_id) && 
             Boolean(context.area_id);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener contexto con información adicional de proyectos, áreas y sitios
   */
  static async getContextWithDetails(userId: string): Promise<any> {
    try {
      const context = await this.getUserContext(userId);
      if (!context) return null;

      // Obtener datos del proyecto
      const { data: project } = await supabase
        .from('archaeological_projects')
        .select('*')
        .eq('id', context.project_id)
        .single();

      // Obtener datos del área
      const { data: area } = await supabase
        .from('archaeological_areas')
        .select('*')
        .eq('id', context.area_id)
        .single();

      // Obtener datos del sitio (si existe)
      let site = null;
      if (context.site_id) {
        const { data: siteData } = await supabase
          .from('archaeological_sites')
          .select('*')
          .eq('id', context.site_id)
          .single();
        site = siteData;
      }

      return {
        context,
        project,
        area,
        site
      };
    } catch (error) {
      throw new AppError('Error al obtener contexto con detalles', 500);
    }
  }
} 