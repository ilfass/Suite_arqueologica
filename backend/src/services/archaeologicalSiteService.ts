import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { ArchaeologicalSite, CreateSiteRequest, SiteStatus, SiteType, PreservationStatus } from '../types/archaeological';

export class ArchaeologicalSiteService {
  /**
   * Crear un nuevo sitio arqueológico
   */
  static async createSite(siteData: CreateSiteRequest, userId: string): Promise<ArchaeologicalSite> {
    try {
      // Validar que el código del sitio sea único
      const { data: existingSite } = await supabase
        .from('archaeological_sites')
        .select('id')
        .eq('site_code', siteData.site_code)
        .single();

      if (existingSite) {
        throw new AppError('El código del sitio ya existe', 400);
      }

      // Crear el sitio arqueológico
      const { data: site, error } = await supabase
        .from('archaeological_sites')
        .insert([{
          ...siteData,
          created_by: userId,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return site;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating archaeological site', 500);
    }
  }

  /**
   * Obtener todos los sitios arqueológicos
   */
  static async getAllSites(
    filters: {
      status?: SiteStatus;
      site_type?: SiteType;
      preservation_status?: PreservationStatus;
      cultural_period?: string;
      limit?: number;
      offset?: number;
    } = {},
    userId?: string
  ): Promise<{ sites: ArchaeologicalSite[]; total: number }> {
    try {
      let query = supabase
        .from('archaeological_sites')
        .select('*', { count: 'exact' });

      // Filtrar por usuario si se proporciona
      if (userId) {
        query = query.eq('created_by', userId);
      }

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.site_type) {
        query = query.eq('site_type', filters.site_type);
      }
      if (filters.preservation_status) {
        query = query.eq('preservation_status', filters.preservation_status);
      }
      if (filters.cultural_period) {
        query = query.eq('cultural_period', filters.cultural_period);
      }

      // Aplicar paginación
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data: sites, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return {
        sites: sites || [],
        total: count || 0
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching archaeological sites', 500);
    }
  }

  /**
   * Obtener un sitio arqueológico por ID
   */
  static async getSiteById(siteId: string): Promise<ArchaeologicalSite> {
    try {
      const { data: site, error } = await supabase
        .from('archaeological_sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!site) throw new AppError('Archaeological site not found', 404);

      return site;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching archaeological site', 500);
    }
  }

  /**
   * Obtener un sitio arqueológico por código
   */
  static async getSiteByCode(siteCode: string): Promise<ArchaeologicalSite> {
    try {
      const { data: site, error } = await supabase
        .from('archaeological_sites')
        .select('*')
        .eq('site_code', siteCode)
        .single();

      if (error) throw new AppError(error.message, 400);
      if (!site) throw new AppError('Archaeological site not found', 404);

      return site;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching archaeological site', 500);
    }
  }

  /**
   * Actualizar un sitio arqueológico
   */
  static async updateSite(siteId: string, updateData: Partial<ArchaeologicalSite>, userId: string): Promise<ArchaeologicalSite> {
    try {
      // Verificar que el sitio existe
      const { data: existingSite } = await supabase
        .from('archaeological_sites')
        .select('created_by')
        .eq('id', siteId)
        .single();

      if (!existingSite) {
        throw new AppError('Archaeological site not found', 404);
      }

      // Verificar permisos (solo el creador puede actualizar)
      if (existingSite.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Actualizar el sitio
      const { data: site, error } = await supabase
        .from('archaeological_sites')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId)
        .select()
        .single();

      if (error) throw new AppError(error.message, 400);

      return site;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating archaeological site', 500);
    }
  }

  /**
   * Eliminar un sitio arqueológico (marcar como archivado)
   */
  static async deleteSite(siteId: string, userId: string): Promise<void> {
    try {
      // Verificar que el sitio existe
      const { data: existingSite } = await supabase
        .from('archaeological_sites')
        .select('created_by')
        .eq('id', siteId)
        .single();

      if (!existingSite) {
        throw new AppError('Archaeological site not found', 404);
      }

      // Verificar permisos
      if (existingSite.created_by !== userId) {
        throw new AppError('Insufficient permissions', 403);
      }

      // Marcar como archivado en lugar de eliminar
      const { error } = await supabase
        .from('archaeological_sites')
        .update({
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', siteId);

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting archaeological site', 500);
    }
  }

  /**
   * Buscar sitios arqueológicos por ubicación geográfica
   */
  static async searchSitesByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<ArchaeologicalSite[]> {
    try {
      const { data: sites, error } = await supabase
        .rpc('search_sites_by_location', {
          search_lat: latitude,
          search_lng: longitude,
          search_radius: radiusKm * 1000
        });

      if (error) throw new AppError(error.message, 400);

      return sites || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error searching sites by location', 500);
    }
  }

  /**
   * Buscar sitios arqueológicos por texto
   */
  static async searchSitesByText(searchTerm: string): Promise<ArchaeologicalSite[]> {
    try {
      const { data: sites, error } = await supabase
        .from('archaeological_sites')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,site_code.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      return sites || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error searching sites by text', 500);
    }
  }

  /**
   * Obtener estadísticas de sitios arqueológicos
   */
  static async getSiteStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byPreservationStatus: Record<string, number>;
    byCulturalPeriod: Record<string, number>;
  }> {
    try {
      // Obtener total de sitios
      const { count: total } = await supabase
        .from('archaeological_sites')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas por estado
      const { data: statusStats } = await supabase
        .from('archaeological_sites')
        .select('status');

      // Obtener estadísticas por tipo
      const { data: typeStats } = await supabase
        .from('archaeological_sites')
        .select('site_type');

      // Obtener estadísticas por estado de conservación
      const { data: preservationStats } = await supabase
        .from('archaeological_sites')
        .select('preservation_status');

      // Obtener estadísticas por período cultural
      const { data: periodStats } = await supabase
        .from('archaeological_sites')
        .select('cultural_period');

      // Procesar estadísticas
      const byStatus = statusStats?.reduce((acc, site) => {
        acc[site.status] = (acc[site.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byType = typeStats?.reduce((acc, site) => {
        acc[site.site_type] = (acc[site.site_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byPreservationStatus = preservationStats?.reduce((acc, site) => {
        acc[site.preservation_status] = (acc[site.preservation_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const byCulturalPeriod = periodStats?.reduce((acc, site) => {
        if (site.cultural_period) {
          acc[site.cultural_period] = (acc[site.cultural_period] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total: total || 0,
        byStatus,
        byType,
        byPreservationStatus,
        byCulturalPeriod
      };
    } catch (error) {
      throw new AppError('Error fetching site statistics', 500);
    }
  }

  /**
   * Exportar sitios arqueológicos a diferentes formatos
   */
  static async exportSites(format: 'csv' | 'json' | 'geojson'): Promise<string> {
    try {
      const { data: sites, error } = await supabase
        .from('archaeological_sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new AppError(error.message, 400);

      switch (format) {
        case 'json':
          return JSON.stringify(sites, null, 2);
        
        case 'csv':
          if (!sites || sites.length === 0) return '';
          
          const headers = Object.keys(sites[0]).join(',');
          const rows = sites.map(site => 
            Object.values(site).map(value => 
              typeof value === 'string' ? `"${value}"` : value
            ).join(',')
          );
          return [headers, ...rows].join('\n');
        
        case 'geojson':
          const geojson = {
            type: 'FeatureCollection',
            features: sites?.map(site => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [site.location.coordinates[0], site.location.coordinates[1]]
              },
              properties: {
                id: site.id,
                site_code: site.site_code,
                name: site.name,
                site_type: site.site_type,
                cultural_period: site.cultural_period,
                preservation_status: site.preservation_status
              }
            })) || []
          };
          return JSON.stringify(geojson, null, 2);
        
        default:
          throw new AppError('Unsupported export format', 400);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error exporting sites', 500);
    }
  }

  /**
   * Crear sitios de ejemplo de cazadores recolectores pampeanos
   */
  static async createPampeanHunterGathererExamples(userId: string): Promise<{ created: number; sites: ArchaeologicalSite[] }> {
    try {
      const exampleSites = [
        {
          name: 'Sitio Arroyo Seco 2',
          description: 'Sitio arqueológico de cazadores recolectores pampeanos del Holoceno temprano',
          region: 'Pampa Húmeda',
          period: 'Holoceno temprano',
          site_type: 'Asentamiento',
          status: 'active',
          created_by: userId
        },
        {
          name: 'Sitio La Moderna',
          description: 'Abrigo rocoso con ocupaciones de cazadores recolectores pampeanos',
          region: 'Sistema de Tandilia',
          period: 'Holoceno temprano',
          site_type: 'Abrigo rocoso',
          status: 'active',
          created_by: userId
        },
        {
          name: 'Sitio Cerro La China',
          description: 'Taller lítico de cazadores recolectores pampeanos',
          region: 'Pampa Húmeda',
          period: 'Holoceno temprano',
          site_type: 'Taller lítico',
          status: 'active',
          created_by: userId
        }
      ];

      const { data: sites, error } = await supabase
        .from('archaeological_sites')
        .insert(exampleSites)
        .select();

      if (error) throw new AppError(error.message, 400);

      return {
        created: sites?.length || 0,
        sites: sites || []
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating example sites', 500);
    }
  }

  /**
   * Importar sitios arqueológicos desde archivo
   */
  static async importSites(fileContent: string, format: 'csv' | 'json', userId: string): Promise<{ imported: number; errors: string[] }> {
    try {
      let sites: any[] = [];
      const errors: string[] = [];

      // Parsear el archivo según el formato
      switch (format) {
        case 'json':
          sites = JSON.parse(fileContent);
          break;
        
        case 'csv':
          const lines = fileContent.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          sites = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const site: any = {};
            headers.forEach((header, index) => {
              site[header] = values[index];
            });
            return site;
          });
          break;
        
        default:
          throw new AppError('Unsupported import format', 400);
      }

      // Validar y crear sitios
      let imported = 0;
      for (const siteData of sites) {
        try {
          // Validar datos requeridos
          if (!siteData.site_code || !siteData.name || !siteData.site_type) {
            errors.push(`Sitio ${siteData.site_code || 'sin código'}: Datos requeridos faltantes`);
            continue;
          }

          // Verificar que el código no exista
          const { data: existingSite } = await supabase
            .from('archaeological_sites')
            .select('id')
            .eq('site_code', siteData.site_code)
            .single();

          if (existingSite) {
            errors.push(`Sitio ${siteData.site_code}: Código ya existe`);
            continue;
          }

          // Crear el sitio
          await supabase
            .from('archaeological_sites')
            .insert([{
              ...siteData,
              created_by: userId,
              status: 'active'
            }]);

          imported++;
        } catch (error) {
          errors.push(`Sitio ${siteData.site_code || 'sin código'}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }

      return { imported, errors };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error importing sites', 500);
    }
  }
} 