import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';

export interface Researcher {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  institution: string;
  specialization: string;
  academic_degree: string;
  research_interests: string[];
  publications: string[];
  experience_years: number;
  certifications: string[];
  contact_info: any;
  profile_image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResearcherData {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  institution: string;
  specialization: string;
  academic_degree: string;
  research_interests: string[];
  publications?: string[];
  experience_years: number;
  certifications?: string[];
  contact_info?: any;
  profile_image?: string;
}

export interface UpdateResearcherData {
  first_name?: string;
  last_name?: string;
  institution?: string;
  specialization?: string;
  academic_degree?: string;
  research_interests?: string[];
  publications?: string[];
  experience_years?: number;
  certifications?: string[];
  contact_info?: any;
  profile_image?: string;
  is_active?: boolean;
}

export class ResearcherService {
  /**
   * Obtener todos los investigadores
   */
  static async getAllResearchers(): Promise<Researcher[]> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .eq('is_active', true)
        .order('first_name');

      if (error) {
        throw new AppError(`Error al obtener investigadores: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Obtener un investigador por ID
   */
  static async getResearcherById(id: string): Promise<Researcher> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Investigador no encontrado', 404);
        }
        throw new AppError(`Error al obtener investigador: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Crear un nuevo investigador
   */
  static async createResearcher(researcherData: CreateResearcherData): Promise<Researcher> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .insert([{
          ...researcherData,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(`Error al crear investigador: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Actualizar un investigador
   */
  static async updateResearcher(id: string, updateData: UpdateResearcherData): Promise<Researcher> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Investigador no encontrado', 404);
        }
        throw new AppError(`Error al actualizar investigador: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Eliminar un investigador (cambiar status a inactive)
   */
  static async deleteResearcher(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('researchers')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new AppError(`Error al eliminar investigador: ${error.message}`, 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Buscar investigadores por especialización
   */
  static async searchResearchersBySpecialization(specialization: string): Promise<Researcher[]> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .ilike('specialization', `%${specialization}%`)
        .eq('is_active', true)
        .order('first_name');

      if (error) {
        throw new AppError(`Error al buscar investigadores: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }

  /**
   * Obtener investigadores por institución
   */
  static async getResearchersByInstitution(institution: string): Promise<Researcher[]> {
    try {
      const { data, error } = await supabase
        .from('researchers')
        .select('*')
        .eq('institution', institution)
        .eq('is_active', true)
        .order('first_name');

      if (error) {
        throw new AppError(`Error al obtener investigadores por institución: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error interno del servidor', 500);
    }
  }
} 