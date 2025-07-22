import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { Excavation, CreateExcavationRequest, ExcavationStatus, ExcavationMethod } from '../types/archaeological';

export class ExcavationService {
  /**
   * Crear una nueva excavación
   */
  static async createExcavation(excavationData: CreateExcavationRequest, userId: string): Promise<Excavation> {
    try {
      // Validar que el código de excavación sea único
      const { data: existingExcavation } = await supabase
        .from('excavations')
        .select('id')
        .eq('excavation_code', excavationData.excavation_code)
        .single();

      if (existingExcavation) {
        throw new AppError('El código de excavación ya existe', 400);
      }

      // Verificar que el sitio existe
      const { data: site } = await supabase
        .from('archaeological_sites')
        .select('id')
        .eq('id', excavationData.site_id)
        .single();

      if (!site) {
        throw new AppError('El sitio arqueológico no existe', 400);
      }

      // Crear la excavación
      const { data: excavation, error } = await supabase
        .from('excavations')
        .insert([{
          ...excavationData,
          created_by: userId
        }])
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return excavation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating excavation', 500);
    }
  }

  /**
   * Obtener todas las excavaciones
   */
  static async getAllExcavations(
    filters: {
      site_id?: string;
      status?: ExcavationStatus;
      excavation_method?: ExcavationMethod;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ excavations: Excavation[]; total: number }> {
    try {
      let query = supabase
        .from('excavations')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (filters.site_id) {
        query = query.eq('site_id', filters.site_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.excavation_method) {
        query = query.eq('excavation_method', filters.excavation_method);
      }
      if (filters.start_date) {
        query = query.gte('start_date', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('end_date', filters.end_date);
      }

      // Aplicar paginación
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data: excavations, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return {
        excavations: excavations || [],
        total: count || 0
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching excavations', 500);
    }
  }

  /**
   * Obtener una excavación por ID
   */
  static async getExcavationById(excavationId: string): Promise<Excavation> {
    try {
      const { data: excavation, error } = await supabase
        .from('excavations')
        .select('*')
        .eq('id', excavationId)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!excavation) throw new AppError('Excavation not found', 404);

      return excavation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching excavation', 500);
    }
  }

  /**
   * Obtener una excavación por código
   */
  static async getExcavationByCode(excavationCode: string): Promise<Excavation> {
    try {
      const { data: excavation, error } = await supabase
        .from('excavations')
        .select('*')
        .eq('excavation_code', excavationCode)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!excavation) throw new AppError('Excavation not found', 404);

      return excavation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching excavation', 500);
    }
  }

  /**
   * Actualizar una excavación
   */
  static async updateExcavation(excavationId: string, updateData: Partial<Excavation>, userId: string): Promise<Excavation> {
    try {
      // Verificar que la excavación existe
      const { data: existingExcavation } = await supabase
        .from('excavations')
        .select('created_by')
        .eq('id', excavationId)
        .single();

      if (!existingExcavation) {
        throw new AppError('Excavation not found', 404);
      }

      // Verificar permisos (solo el creador puede actualizar)
      if (existingExcavation.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Actualizar la excavación
      const { data: excavation, error } = await supabase
        .from('excavations')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', excavationId)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return excavation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating excavation', 500);
    }
  }

  /**
   * Eliminar una excavación (marcar como eliminada)
   */
  static async deleteExcavation(excavationId: string, userId: string): Promise<void> {
    try {
      // Verificar que la excavación existe
      const { data: existingExcavation } = await supabase
        .from('excavations')
        .select('created_by')
        .eq('id', excavationId)
        .single();

      if (!existingExcavation) {
        throw new AppError('Excavation not found', 404);
      }

      // Verificar permisos
      if (existingExcavation.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Eliminar la excavación
      const { error } = await supabase
        .from('excavations')
        .delete()
        .eq('id', excavationId);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting excavation', 500);
    }
  }

  /**
   * Obtener excavaciones activas
   */
  static async getActiveExcavations(): Promise<Excavation[]> {
    try {
      const { data: excavations, error } = await supabase
        .from('excavations')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return excavations || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching active excavations', 500);
    }
  }

  /**
   * Obtener excavaciones por sitio
   */
  static async getExcavationsBySite(siteId: string): Promise<Excavation[]> {
    try {
      const { data: excavations, error } = await supabase
        .from('excavations')
        .select('*')
        .eq('site_id', siteId)
        .order('start_date', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return excavations || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching excavations by site', 500);
    }
  }

  /**
   * Buscar excavaciones por texto
   */
  static async searchExcavationsByText(searchTerm: string): Promise<Excavation[]> {
    try {
      const { data: excavations, error } = await supabase
        .from('excavations')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,excavation_code.ilike.%${searchTerm}%`)
        .order('start_date', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return excavations || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error searching excavations by text', 500);
    }
  }

  /**
   * Obtener estadísticas de excavaciones
   */
  static async getExcavationStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    bySite: Record<string, number>;
    activeCount: number;
    completedCount: number;
  }> {
    try {
      // Obtener total de excavaciones
      const { count: total } = await supabase
        .from('excavations')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas por estado
      const { data: statusStats } = await supabase
        .from('excavations')
        .select('status');

      // Obtener estadísticas por tipo
      const { data: typeStats } = await supabase
        .from('excavations')
        .select('excavation_type');

      // Obtener estadísticas por sitio
      const { data: siteStats } = await supabase
        .from('excavations')
        .select('site_id');

      // Obtener excavaciones activas
      const { count: activeCount } = await supabase
        .from('excavations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Obtener excavaciones completadas
      const { count: completedCount } = await supabase
        .from('excavations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Procesar estadísticas
      const byStatus = statusStats?.reduce((acc, excavation) => {
        acc[excavation.status] = (acc[excavation.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byType = typeStats?.reduce((acc, excavation) => {
        acc[excavation.excavation_type] = (acc[excavation.excavation_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const bySite = siteStats?.reduce((acc, excavation) => {
        acc[excavation.site_id] = (acc[excavation.site_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total: total || 0,
        byStatus,
        byType,
        bySite,
        activeCount: activeCount || 0,
        completedCount: completedCount || 0
      };
    } catch (error) {
      throw new AppError('Error fetching excavation statistics', 500);
    }
  }

  /**
   * Exportar excavaciones a diferentes formatos
   */
  static async exportExcavations(format: 'csv' | 'json'): Promise<string> {
    try {
      const { data: excavations, error } = await supabase
        .from('excavations')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      switch (format) {
        case 'json':
          return JSON.stringify(excavations, null, 2);
        
        case 'csv':
          if (!excavations || excavations.length === 0) return '';
          
          const headers = Object.keys(excavations[0]).join(',');
          const rows = excavations.map(excavation => 
            Object.values(excavation).map(value => 
              typeof value === 'string' ? `"${value}"` : value
            ).join(',')
          );
          return [headers, ...rows].join('\n');
        
        default:
          throw new AppError('Unsupported export format', 400);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error exporting excavations', 500);
    }
  }

  /**
   * Obtener cuadrículas de excavación
   */
  static async getGridUnits(): Promise<any[]> {
    try {
      const { data: gridUnits, error } = await supabase
        .from('grid_units')
        .select(`
          id,
          excavation_id,
          name,
          description,
          coordinates,
          size_width,
          size_height,
          depth,
          soil_type,
          stratigraphy,
          notes,
          status,
          created_at,
          updated_at
        `)
        .order('name', { ascending: true });

      if (error) throw new AppError(error.message, 400);

      // Transformar datos para mantener compatibilidad con el frontend
      return (gridUnits || []).map(unit => ({
        id: unit.id,
        code: unit.name, // Usar name como code para compatibilidad
        coordinates: unit.coordinates,
        status: unit.status,
        findings_count: 0, // Por ahora, calcular después
        depth: unit.depth,
        area: unit.size_width && unit.size_height ? unit.size_width * unit.size_height : 0,
        notes: unit.notes,
        created_at: unit.created_at,
        updated_at: unit.updated_at
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching grid units', 500);
    }
  }

  /**
   * Obtener mediciones
   */
  static async getMeasurements(): Promise<any[]> {
    try {
      const { data: measurements, error } = await supabase
        .from('measurements')
        .select(`
          id,
          grid_unit_id,
          finding_id,
          measurement_type,
          value,
          unit,
          coordinates,
          description,
          notes,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return (measurements || []).map(measurement => ({
        id: measurement.id,
        type: measurement.measurement_type,
        coordinates: measurement.coordinates,
        value: measurement.value,
        unit: measurement.unit,
        label: measurement.description,
        created_at: measurement.created_at,
        updated_at: measurement.updated_at
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching measurements', 500);
    }
  }

  /**
   * Obtener estadísticas de mapping
   */
  static async getMappingStats(): Promise<any> {
    try {
      const gridUnits = await this.getGridUnits();
      const measurements = await this.getMeasurements();

      return {
        totalGridUnits: gridUnits.length,
        totalFindings: gridUnits.reduce((sum, unit) => sum + unit.findings_count, 0),
        totalMeasurements: measurements.length,
        totalArea: gridUnits.reduce((sum, unit) => sum + unit.area, 0),
        activeExcavations: gridUnits.filter(unit => unit.status === 'active').length,
        completedExcavations: gridUnits.filter(unit => unit.status === 'completed').length
      };
    } catch (error) {
      throw new AppError('Error fetching mapping stats', 500);
    }
  }

  /**
   * Exportar datos de mapping
   */
  static async exportMappingData(): Promise<string> {
    try {
      const gridUnits = await this.getGridUnits();
      const measurements = await this.getMeasurements();
      const stats = await this.getMappingStats();

      const data = {
        gridUnits,
        measurements,
        stats,
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new AppError('Error exporting mapping data', 500);
    }
  }

  // =====================================================
  // CRUD para Grid Units
  // =====================================================

  static async createGridUnit(gridUnitData: any, userId: string): Promise<any> {
    try {
      const { data: gridUnit, error } = await supabase
        .from('grid_units')
        .insert({
          name: gridUnitData.code, // Usar code como name
          excavation_id: gridUnitData.excavation_id,
          description: gridUnitData.description,
          coordinates: gridUnitData.coordinates,
          size_width: gridUnitData.size_width,
          size_height: gridUnitData.size_height,
          depth: gridUnitData.depth || 0,
          soil_type: gridUnitData.soil_type,
          stratigraphy: gridUnitData.stratigraphy,
          notes: gridUnitData.notes,
          status: gridUnitData.status || 'active',
          created_by: userId
        })
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return this.transformGridUnitForFrontend(gridUnit);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating grid unit', 500);
    }
  }

  static async updateGridUnit(id: string, updateData: any, userId: string): Promise<any> {
    try {
      const updatePayload: any = {};
      
      if (updateData.code) updatePayload.name = updateData.code; // Usar code como name
      if (updateData.description !== undefined) updatePayload.description = updateData.description;
      if (updateData.coordinates) updatePayload.coordinates = updateData.coordinates;
      if (updateData.size_width !== undefined) updatePayload.size_width = updateData.size_width;
      if (updateData.size_height !== undefined) updatePayload.size_height = updateData.size_height;
      if (updateData.status) updatePayload.status = updateData.status;
      if (updateData.depth !== undefined) updatePayload.depth = updateData.depth;
      if (updateData.soil_type !== undefined) updatePayload.soil_type = updateData.soil_type;
      if (updateData.stratigraphy !== undefined) updatePayload.stratigraphy = updateData.stratigraphy;
      if (updateData.notes !== undefined) updatePayload.notes = updateData.notes;

      const { data: gridUnit, error } = await supabase
        .from('grid_units')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return this.transformGridUnitForFrontend(gridUnit);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating grid unit', 500);
    }
  }

  static async deleteGridUnit(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('grid_units')
        .delete()
        .eq('id', id);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting grid unit', 500);
    }
  }

  // =====================================================
  // CRUD para Measurements
  // =====================================================

  static async createMeasurement(measurementData: any, userId: string): Promise<any> {
    try {
      const { data: measurement, error } = await supabase
        .from('measurements')
        .insert({
          grid_unit_id: measurementData.grid_unit_id,
          finding_id: measurementData.finding_id,
          measurement_type: measurementData.type,
          value: measurementData.value,
          unit: measurementData.unit || 'm',
          coordinates: measurementData.coordinates,
          description: measurementData.label,
          notes: measurementData.notes,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return measurement;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating measurement', 500);
    }
  }

  static async updateMeasurement(id: string, updateData: any, userId: string): Promise<any> {
    try {
      const { data: measurement, error } = await supabase
        .from('measurements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return measurement;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating measurement', 500);
    }
  }

  static async deleteMeasurement(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting measurement', 500);
    }
  }

  // =====================================================
  // Métodos auxiliares
  // =====================================================

  private static transformGridUnitForFrontend(gridUnit: any): any {
    return {
      id: gridUnit.id,
      code: gridUnit.name, // Usar name como code para compatibilidad
      coordinates: gridUnit.coordinates,
      status: gridUnit.status,
      findings_count: 0, // Por ahora, calcular después
      depth: gridUnit.depth,
      area: gridUnit.size_width && gridUnit.size_height ? gridUnit.size_width * gridUnit.size_height : 0,
      notes: gridUnit.notes,
      created_at: gridUnit.created_at,
      updated_at: gridUnit.updated_at
    };
  }
} 