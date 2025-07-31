import { Request, Response } from 'express';
import { ContextService } from '../services/contextService';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Esquemas de validación
const createProjectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED', 'CANCELLED']),
  directorId: z.string().min(1, 'El director es requerido'),
  institutionId: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional()
  }),
  budget: z.number().optional(),
  objectives: z.array(z.string()),
  methodology: z.string().min(1, 'La metodología es requerida')
});

const createAreaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  projectId: z.string().min(1, 'El proyecto es requerido'),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  size: z.number().positive('El tamaño debe ser positivo'),
  type: z.enum(['EXCAVATION', 'SURVEY', 'CONSERVATION', 'DOCUMENTATION']),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED']),
  assignedResearchers: z.array(z.string())
});

const createSiteSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  areaId: z.string().min(1, 'El área es requerida'),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  type: z.enum(['SETTLEMENT', 'CEMETERY', 'TEMPLE', 'FORTIFICATION', 'WORKSHOP', 'OTHER']),
  period: z.string().min(1, 'El período es requerido'),
  culturalAffiliation: z.string().min(1, 'La afiliación cultural es requerida'),
  preservationStatus: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL']),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional()
});

const createDiscoverySchema = z.object({
  siteId: z.string().min(1, 'El sitio es requerido'),
  type: z.enum(['ARTIFACT', 'STRUCTURE', 'BURIAL', 'INSCRIPTION', 'OTHER']),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  discovererId: z.string().min(1, 'El descubridor es requerido'),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  images: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export class ContextController {
  private contextService: ContextService | null = null;

  private getContextService(): ContextService {
    if (!this.contextService) {
      this.contextService = new ContextService();
    }
    return this.contextService;
  }

  // ===== PROYECTOS =====
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      const result = await this.getContextService().createProject(validatedData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.errors
        });
      } else {
        logger.error('Error inesperado al crear proyecto:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error
        });
      }
    }
  }

  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const directorId = req.query.directorId as string;

      const result = await this.getContextService().getProjects(page, limit, directorId);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error inesperado al obtener proyectos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error
      });
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID del proyecto es requerido'
        });
        return;
      }
      const result = await this.getContextService().getProjectById(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error inesperado al obtener proyecto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error
      });
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID del proyecto es requerido'
        });
        return;
      }
      const validatedData = createProjectSchema.partial().parse(req.body);
      const result = await this.getContextService().updateProject(id, validatedData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.errors
        });
      } else {
        logger.error('Error inesperado al actualizar proyecto:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error
        });
      }
    }
  }

  // ===== ÁREAS =====
  async createArea(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createAreaSchema.parse(req.body);
      const result = await this.getContextService().createArea(validatedData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.errors
        });
      } else {
        logger.error('Error inesperado al crear área:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error
        });
      }
    }
  }

  async getAreasByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(400).json({
          success: false,
          message: 'ID del proyecto es requerido'
        });
        return;
      }
      const result = await this.getContextService().getAreasByProject(projectId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error inesperado al obtener áreas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error
      });
    }
  }

  // ===== SITIOS =====
  async createSite(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createSiteSchema.parse(req.body);
      const result = await this.getContextService().createSite(validatedData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.errors
        });
      } else {
        logger.error('Error inesperado al crear sitio:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error
        });
      }
    }
  }

  async getSitesByArea(req: Request, res: Response): Promise<void> {
    try {
      const { areaId } = req.params;
      if (!areaId) {
        res.status(400).json({
          success: false,
          message: 'ID del área es requerido'
        });
        return;
      }
      const result = await this.getContextService().getSitesByArea(areaId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error inesperado al obtener sitios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error
      });
    }
  }

  // ===== DESCUBRIMIENTOS =====
  async createDiscovery(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createDiscoverySchema.parse(req.body);
      const result = await this.getContextService().createDiscovery(validatedData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.errors
        });
      } else {
        logger.error('Error inesperado al crear descubrimiento:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error
        });
      }
    }
  }

  async getDiscoveriesBySite(req: Request, res: Response): Promise<void> {
    try {
      const { siteId } = req.params;
      if (!siteId) {
        res.status(400).json({
          success: false,
          message: 'ID del sitio es requerido'
        });
        return;
      }
      const result = await this.getContextService().getDiscoveriesBySite(siteId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      logger.error('Error inesperado al obtener descubrimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error
      });
    }
  }
} 