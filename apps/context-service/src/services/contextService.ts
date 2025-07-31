import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import {
  Project,
  Area,
  Site,
  Discovery,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateAreaRequest,
  CreateSiteRequest,
  CreateDiscoveryRequest,
  ContextResponse,
  PaginatedResponse
} from '../types/context';
import { logger } from '../utils/logger';

export class ContextService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ===== PROYECTOS =====
  async createProject(data: CreateProjectRequest): Promise<ContextResponse<Project>> {
    try {
      const projectId = uuidv4();
      const now = new Date().toISOString();

      const project: Project = {
        id: projectId,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        status: data.status,
        directorId: data.directorId,
        institutionId: data.institutionId || undefined,
        location: data.location,
        budget: data.budget || undefined,
        objectives: data.objectives,
        methodology: data.methodology,
        createdAt: now,
        updatedAt: now
      };

      const { error } = await this.supabase
        .from('projects')
        .insert({
          id: projectId,
          name: data.name,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate || null,
          status: data.status,
          director_id: data.directorId,
          institution_id: data.institutionId || null,
          location: data.location,
          budget: data.budget || null,
          objectives: data.objectives,
          methodology: data.methodology
        });

      if (error) {
        logger.error('Error al crear proyecto:', error);
        return {
          success: false,
          message: 'Error al crear proyecto',
          error
        };
      }

      logger.info(`✅ Proyecto creado exitosamente: ${data.name}`);
      return {
        success: true,
        message: 'Proyecto creado exitosamente',
        data: project
      };
    } catch (error) {
      logger.error('Error inesperado al crear proyecto:', error);
      return {
        success: false,
        message: 'Error inesperado al crear proyecto',
        error
      };
    }
  }

  async getProjects(page = 1, limit = 10, directorId?: string): Promise<PaginatedResponse<Project>> {
    try {
      let query = this.supabase
        .from('projects')
        .select('*', { count: 'exact' });

      if (directorId) {
        query = query.eq('director_id', directorId);
      }

      const { data: projects, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error al obtener proyectos:', error);
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        message: 'Proyectos obtenidos exitosamente',
        data: {
          items: projects || [],
          total: count || 0,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      logger.error('Error inesperado al obtener proyectos:', error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<ContextResponse<Project>> {
    try {
      const { data: project, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error al obtener proyecto:', error);
        return {
          success: false,
          message: 'Proyecto no encontrado',
          error
        };
      }

      return {
        success: true,
        message: 'Proyecto obtenido exitosamente',
        data: project
      };
    } catch (error) {
      logger.error('Error inesperado al obtener proyecto:', error);
      return {
        success: false,
        message: 'Error inesperado al obtener proyecto',
        error
      };
    }
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<ContextResponse<Project>> {
    try {
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.startDate) updateData.start_date = data.startDate;
      if (data.endDate) updateData.end_date = data.endDate;
      if (data.status) updateData.status = data.status;
      if (data.location) updateData.location = data.location;
      if (data.budget) updateData.budget = data.budget;
      if (data.objectives) updateData.objectives = data.objectives;
      if (data.methodology) updateData.methodology = data.methodology;

      const { data: project, error } = await this.supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error al actualizar proyecto:', error);
        return {
          success: false,
          message: 'Error al actualizar proyecto',
          error
        };
      }

      logger.info(`✅ Proyecto actualizado exitosamente: ${id}`);
      return {
        success: true,
        message: 'Proyecto actualizado exitosamente',
        data: project
      };
    } catch (error) {
      logger.error('Error inesperado al actualizar proyecto:', error);
      return {
        success: false,
        message: 'Error inesperado al actualizar proyecto',
        error
      };
    }
  }

  // ===== ÁREAS =====
  async createArea(data: CreateAreaRequest): Promise<ContextResponse<Area>> {
    try {
      const areaId = uuidv4();
      const now = new Date().toISOString();

      const area: Area = {
        id: areaId,
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        coordinates: data.coordinates,
        size: data.size,
        type: data.type,
        status: data.status,
        assignedResearchers: data.assignedResearchers,
        createdAt: now,
        updatedAt: now
      };

      const { error } = await this.supabase
        .from('areas')
        .insert({
          id: areaId,
          name: data.name,
          description: data.description,
          project_id: data.projectId,
          coordinates: data.coordinates,
          size: data.size,
          type: data.type,
          status: data.status,
          assigned_researchers: data.assignedResearchers
        });

      if (error) {
        logger.error('Error al crear área:', error);
        return {
          success: false,
          message: 'Error al crear área',
          error
        };
      }

      logger.info(`✅ Área creada exitosamente: ${data.name}`);
      return {
        success: true,
        message: 'Área creada exitosamente',
        data: area
      };
    } catch (error) {
      logger.error('Error inesperado al crear área:', error);
      return {
        success: false,
        message: 'Error inesperado al crear área',
        error
      };
    }
  }

  async getAreasByProject(projectId: string): Promise<ContextResponse<Area[]>> {
    try {
      const { data: areas, error } = await this.supabase
        .from('areas')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error al obtener áreas:', error);
        return {
          success: false,
          message: 'Error al obtener áreas',
          error
        };
      }

      return {
        success: true,
        message: 'Áreas obtenidas exitosamente',
        data: areas || []
      };
    } catch (error) {
      logger.error('Error inesperado al obtener áreas:', error);
      return {
        success: false,
        message: 'Error inesperado al obtener áreas',
        error
      };
    }
  }

  // ===== SITIOS =====
  async createSite(data: CreateSiteRequest): Promise<ContextResponse<Site>> {
    try {
      const siteId = uuidv4();
      const now = new Date().toISOString();

      const site: Site = {
        id: siteId,
        name: data.name,
        description: data.description,
        areaId: data.areaId,
        coordinates: data.coordinates,
        type: data.type,
        period: data.period,
        culturalAffiliation: data.culturalAffiliation,
        preservationStatus: data.preservationStatus,
        discoveries: [],
        images: data.images || [],
        documents: data.documents || [],
        createdAt: now,
        updatedAt: now
      };

      const { error } = await this.supabase
        .from('sites')
        .insert({
          id: siteId,
          name: data.name,
          description: data.description,
          area_id: data.areaId,
          coordinates: data.coordinates,
          type: data.type,
          period: data.period,
          cultural_affiliation: data.culturalAffiliation,
          preservation_status: data.preservationStatus,
          images: data.images || [],
          documents: data.documents || []
        });

      if (error) {
        logger.error('Error al crear sitio:', error);
        return {
          success: false,
          message: 'Error al crear sitio',
          error
        };
      }

      logger.info(`✅ Sitio creado exitosamente: ${data.name}`);
      return {
        success: true,
        message: 'Sitio creado exitosamente',
        data: site
      };
    } catch (error) {
      logger.error('Error inesperado al crear sitio:', error);
      return {
        success: false,
        message: 'Error inesperado al crear sitio',
        error
      };
    }
  }

  async getSitesByArea(areaId: string): Promise<ContextResponse<Site[]>> {
    try {
      const { data: sites, error } = await this.supabase
        .from('sites')
        .select('*')
        .eq('area_id', areaId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error al obtener sitios:', error);
        return {
          success: false,
          message: 'Error al obtener sitios',
          error
        };
      }

      return {
        success: true,
        message: 'Sitios obtenidos exitosamente',
        data: sites || []
      };
    } catch (error) {
      logger.error('Error inesperado al obtener sitios:', error);
      return {
        success: false,
        message: 'Error inesperado al obtener sitios',
        error
      };
    }
  }

  // ===== DESCUBRIMIENTOS =====
  async createDiscovery(data: CreateDiscoveryRequest): Promise<ContextResponse<Discovery>> {
    try {
      const discoveryId = uuidv4();
      const now = new Date().toISOString();

      const discovery: Discovery = {
        id: discoveryId,
        siteId: data.siteId,
        type: data.type,
        description: data.description,
        date: data.date,
        discovererId: data.discovererId,
        coordinates: data.coordinates || undefined,
        images: data.images || [],
        notes: data.notes || '',
        createdAt: now
      };

      const { error } = await this.supabase
        .from('discoveries')
        .insert({
          id: discoveryId,
          site_id: data.siteId,
          type: data.type,
          description: data.description,
          date: data.date,
          discoverer_id: data.discovererId,
          coordinates: data.coordinates || null,
          images: data.images || [],
          notes: data.notes || ''
        });

      if (error) {
        logger.error('Error al crear descubrimiento:', error);
        return {
          success: false,
          message: 'Error al crear descubrimiento',
          error
        };
      }

      logger.info(`✅ Descubrimiento creado exitosamente: ${data.description}`);
      return {
        success: true,
        message: 'Descubrimiento creado exitosamente',
        data: discovery
      };
    } catch (error) {
      logger.error('Error inesperado al crear descubrimiento:', error);
      return {
        success: false,
        message: 'Error inesperado al crear descubrimiento',
        error
      };
    }
  }

  async getDiscoveriesBySite(siteId: string): Promise<ContextResponse<Discovery[]>> {
    try {
      const { data: discoveries, error } = await this.supabase
        .from('discoveries')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error al obtener descubrimientos:', error);
        return {
          success: false,
          message: 'Error al obtener descubrimientos',
          error
        };
      }

      return {
        success: true,
        message: 'Descubrimientos obtenidos exitosamente',
        data: discoveries || []
      };
    } catch (error) {
      logger.error('Error inesperado al obtener descubrimientos:', error);
      return {
        success: false,
        message: 'Error inesperado al obtener descubrimientos',
        error
      };
    }
  }
} 