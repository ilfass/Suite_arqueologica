import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { Object, CreateObjectRequest, ObjectType, ObjectCondition } from '../types/archaeological';

export class ObjectService {
  /**
   * Crear un nuevo objeto
   */
  static async createObject(objectData: CreateObjectRequest, userId: string): Promise<Object> {
    try {
      // Validar que el número de catálogo sea único
      const { data: existingObject } = await supabase
        .from('objects')
        .select('id')
        .eq('catalog_number', objectData.catalog_number)
        .single();

      if (existingObject) {
        throw new AppError('El número de catálogo ya existe', 400);
      }

      // Verificar que el sitio existe
      const { data: site } = await supabase
        .from('archaeological_sites')
        .select('id')
        .eq('id', objectData.site_id)
        .single();

      if (!site) {
        throw new AppError('El sitio arqueológico no existe', 400);
      }

      // Crear el objeto
      const { data: object, error } = await supabase
        .from('objects')
        .insert([{
          ...objectData,
          created_by: userId
        }])
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return object;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating object', 500);
    }
  }

  /**
   * Obtener todos los objetos
   */
  static async getAllObjects(
    filters: {
      site_id?: string;
      object_type?: ObjectType;
      condition?: ObjectCondition;
      material?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ objects: Object[]; total: number }> {
    try {
      let query = supabase
        .from('objects')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (filters.site_id) {
        query = query.eq('site_id', filters.site_id);
      }
      if (filters.object_type) {
        query = query.eq('object_type', filters.object_type);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.material) {
        query = query.eq('primary_material', filters.material);
      }

      // Aplicar paginación
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data: objects, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return {
        objects: objects || [],
        total: count || 0
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching objects', 500);
    }
  }

  /**
   * Obtener un objeto por ID
   */
  static async getObjectById(objectId: string): Promise<Object> {
    try {
      const { data: object, error } = await supabase
        .from('objects')
        .select('*')
        .eq('id', objectId)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!object) throw new AppError('Object not found', 404);

      return object;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching object', 500);
    }
  }

  /**
   * Obtener un objeto por número de catálogo
   */
  static async getObjectByCatalogNumber(catalogNumber: string): Promise<Object> {
    try {
      const { data: object, error } = await supabase
        .from('objects')
        .select('*')
        .eq('catalog_number', catalogNumber)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!object) throw new AppError('Object not found', 404);

      return object;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching object', 500);
    }
  }

  /**
   * Actualizar un objeto
   */
  static async updateObject(objectId: string, updateData: Partial<Object>, userId: string): Promise<Object> {
    try {
      // Verificar que el objeto existe
      const { data: existingObject } = await supabase
        .from('objects')
        .select('created_by')
        .eq('id', objectId)
        .single();

      if (!existingObject) {
        throw new AppError('Object not found', 404);
      }

      // Verificar permisos (solo el creador puede actualizar)
      if (existingObject.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Actualizar el objeto
      const { data: object, error } = await supabase
        .from('objects')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', objectId)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return object;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating object', 500);
    }
  }

  /**
   * Eliminar un objeto (marcar como eliminado)
   */
  static async deleteObject(objectId: string, userId: string): Promise<void> {
    try {
      // Verificar que el objeto existe
      const { data: existingObject } = await supabase
        .from('objects')
        .select('created_by')
        .eq('id', objectId)
        .single();

      if (!existingObject) {
        throw new AppError('Object not found', 404);
      }

      // Verificar permisos
      if (existingObject.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Eliminar el objeto
      const { error } = await supabase
        .from('objects')
        .delete()
        .eq('id', objectId);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting object', 500);
    }
  }

  /**
   * Buscar objetos por texto
   */
  static async searchObjectsByText(searchTerm: string): Promise<Object[]> {
    try {
      const { data: objects, error } = await supabase
        .from('objects')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,catalog_number.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return objects || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error searching objects by text', 500);
    }
  }

  /**
   * Obtener objetos por sitio
   */
  static async getObjectsBySite(siteId: string): Promise<Object[]> {
    try {
      const { data: objects, error } = await supabase
        .from('objects')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return objects || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching objects by site', 500);
    }
  }

  /**
   * Obtener estadísticas de objetos
   */
  static async getObjectStatistics(): Promise<{
    total: number;
    byType: Record<string, number>;
    byCondition: Record<string, number>;
    byMaterial: Record<string, number>;
    bySite: Record<string, number>;
  }> {
    try {
      // Obtener total de objetos
      const { count: total } = await supabase
        .from('objects')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas por tipo
      const { data: typeStats } = await supabase
        .from('objects')
        .select('object_type');

      // Obtener estadísticas por condición
      const { data: conditionStats } = await supabase
        .from('objects')
        .select('condition');

      // Obtener estadísticas por material
      const { data: materialStats } = await supabase
        .from('objects')
        .select('primary_material');

      // Obtener estadísticas por sitio
      const { data: siteStats } = await supabase
        .from('objects')
        .select('site_id');

      // Procesar estadísticas
      const byType = typeStats?.reduce((acc, object) => {
        acc[object.object_type] = (acc[object.object_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byCondition = conditionStats?.reduce((acc, object) => {
        acc[object.condition] = (acc[object.condition] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byMaterial = materialStats?.reduce((acc, object) => {
        acc[object.primary_material] = (acc[object.primary_material] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const bySite = siteStats?.reduce((acc, object) => {
        acc[object.site_id] = (acc[object.site_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total: total || 0,
        byType,
        byCondition,
        byMaterial,
        bySite
      };
    } catch (error) {
      throw new AppError('Error fetching object statistics', 500);
    }
  }

  /**
   * Exportar objetos a diferentes formatos
   */
  static async exportObjects(format: 'csv' | 'json'): Promise<string> {
    try {
      const { data: objects, error } = await supabase
        .from('objects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      switch (format) {
        case 'json':
          return JSON.stringify(objects, null, 2);
        
        case 'csv':
          if (!objects || objects.length === 0) return '';
          
          const headers = Object.keys(objects[0]).join(',');
          const rows = objects.map(object => 
            Object.values(object).map(value => 
              typeof value === 'string' ? `"${value}"` : value
            ).join(',')
          );
          return [headers, ...rows].join('\n');
        
        default:
          throw new AppError('Unsupported export format', 400);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error exporting objects', 500);
    }
  }

  /**
   * Obtener hallazgos para mapping
   */
  static async getFindings(): Promise<any[]> {
    try {
      const { data: findings, error } = await supabase
        .from('findings')
        .select(`
          id,
          grid_unit_id,
          name,
          description,
          category,
          material,
          period,
          coordinates,
          depth,
          soil_context,
          condition,
          dimensions,
          weight,
          weight_unit,
          photos,
          notes,
          status,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      // Transformar datos para mantener compatibilidad con el frontend
      return (findings || []).map(finding => ({
        id: finding.id,
        code: finding.name, // Usar name como code para compatibilidad
        name: finding.name,
        type: finding.category, // Usar category como type
        coordinates: finding.coordinates,
        depth: finding.depth,
        description: finding.description,
        condition: finding.condition,
        material: finding.material,
        period: finding.period,
        grid_unit_id: finding.grid_unit_id,
        created_at: finding.created_at,
        updated_at: finding.updated_at
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching findings', 500);
    }
  }

  // =====================================================
  // CRUD para Findings
  // =====================================================

  static async createFinding(findingData: any, userId: string): Promise<any> {
    try {
      const { data: finding, error } = await supabase
        .from('findings')
        .insert({
          name: findingData.name || findingData.type || `Hallazgo ${Date.now()}`,
          description: findingData.description || '',
          category: findingData.type || 'other',
          material: findingData.material || '',
          period: findingData.period || '',
          coordinates: findingData.coordinates || null,
          depth: findingData.depth || 0,
          soil_context: findingData.soil_context || '',
          condition: findingData.condition || 'good',
          dimensions: findingData.dimensions || null,
          weight: findingData.weight || null,
          weight_unit: findingData.weight_unit || 'g',
          photos: findingData.photos || [],
          notes: findingData.notes || '',
          status: 'active',
          grid_unit_id: findingData.grid_unit_id || null,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return this.transformFindingForFrontend(finding);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating finding', 500);
    }
  }

  static async updateFinding(id: string, updateData: any, userId: string): Promise<any> {
    try {
      const updatePayload: any = {};
      
      if (updateData.name) updatePayload.name = updateData.name;
      if (updateData.description) updatePayload.description = updateData.description;
      if (updateData.category) updatePayload.category = updateData.category;
      if (updateData.type) updatePayload.category = updateData.type; // Mapear type a category
      if (updateData.material) updatePayload.material = updateData.material;
      if (updateData.period) updatePayload.period = updateData.period;
      if (updateData.coordinates) updatePayload.coordinates = updateData.coordinates;
      if (updateData.depth !== undefined) updatePayload.depth = updateData.depth;
      if (updateData.soil_context) updatePayload.soil_context = updateData.soil_context;
      if (updateData.condition) updatePayload.condition = updateData.condition;
      if (updateData.dimensions) updatePayload.dimensions = updateData.dimensions;
      if (updateData.weight !== undefined) updatePayload.weight = updateData.weight;
      if (updateData.weight_unit) updatePayload.weight_unit = updateData.weight_unit;
      if (updateData.photos) updatePayload.photos = updateData.photos;
      if (updateData.notes) updatePayload.notes = updateData.notes;
      if (updateData.status) updatePayload.status = updateData.status;
      if (updateData.grid_unit_id) updatePayload.grid_unit_id = updateData.grid_unit_id;

      const { data: finding, error } = await supabase
        .from('findings')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return this.transformFindingForFrontend(finding);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating finding', 500);
    }
  }

  static async deleteFinding(id: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('findings')
        .delete()
        .eq('id', id);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting finding', 500);
    }
  }

  /**
   * Crear objetos de ejemplo de cazadores recolectores pampeanos
   */
  static async createPampeanHunterGathererObjectExamples(userId: string): Promise<{ created: number; objects: Object[] }> {
    try {
      // Primero necesitamos obtener un sitio para asociar los objetos
      const { data: sites } = await supabase
        .from('archaeological_sites')
        .select('id, name')
        .limit(1);

      if (!sites || sites.length === 0) {
        throw new AppError('No se encontraron sitios arqueológicos. Cree sitios primero.', 400);
      }

      const siteId = sites[0].id;
      const siteName = sites[0].name;

      const exampleObjects = [
        {
          name: 'Punta de proyectil lanceolada',
          description: 'Punta de proyectil lanceolada de cuarcita, con retoque bifacial y base cóncava. Característica del período Paleoindio.',
          material: 'Cuarcita',
          period: 'Holoceno temprano',
          site_id: siteId,
          condition_status: 'Buena',
          discovery_date: '2024-01-15',
          notes: 'Ejemplar representativo de la tecnología lítica pampeana de cazadores recolectores',
          created_by: userId,
          catalog_number: `${siteName || 'SITE'}-001`
        },
        {
          name: 'Raspador de cuarzo',
          description: 'Raspador circular de cuarzo lechoso, con retoque unifacial en el borde activo. Herramienta de procesamiento.',
          material: 'Cuarzo',
          period: 'Holoceno temprano',
          site_id: siteId,
          condition_status: 'Excelente',
          discovery_date: '2024-01-16',
          notes: 'Herramienta especializada para el procesamiento de recursos animales de cazadores recolectores',
          created_by: userId,
          catalog_number: `${siteName || 'SITE'}-002`
        },
        {
          name: 'Perforador de sílice',
          description: 'Perforador de sílice translúcido, con punta aguda y retoque bifacial. Herramienta para perforación.',
          material: 'Sílice',
          period: 'Holoceno temprano',
          site_id: siteId,
          condition_status: 'Buena',
          discovery_date: '2024-01-17',
          notes: 'Herramienta especializada para la manufactura de adornos de cazadores recolectores',
          created_by: userId,
          catalog_number: `${siteName || 'SITE'}-003`
        }
      ];

      const { data: objects, error } = await supabase
        .from('objects')
        .insert(exampleObjects)
        .select();

      if (error) throw new AppError(error.message, 400);

      return {
        created: objects?.length || 0,
        objects: objects || []
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating example objects', 500);
    }
  }

  // =====================================================
  // Métodos auxiliares
  // =====================================================

  private static transformFindingForFrontend(finding: any): any {
    return {
      id: finding.id,
      code: finding.name, // Usar name como code para compatibilidad
      name: finding.name,
      type: finding.category, // Usar category como type para compatibilidad
      coordinates: finding.coordinates,
      depth: finding.depth,
      description: finding.description,
      condition: finding.condition,
      material: finding.material,
      period: finding.period,
      grid_unit_id: finding.grid_unit_id,
      created_at: finding.created_at,
      updated_at: finding.updated_at
    };
  }
} 