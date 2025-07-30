import { Request, Response, NextFunction } from 'express';
import { ArchaeologicalSiteService } from '../services/archaeologicalSiteService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export class ArchaeologicalSiteController {
  static createSite = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user'; // Temporal hasta implementar autenticación completa
      const site = await ArchaeologicalSiteService.createSite(req.body, userId);

      res.status(201).json({
        success: true,
        data: site,
      });
    }
  );

  static getSiteById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const site = await ArchaeologicalSiteService.getSiteById(req.params.id);

      res.status(200).json({
        success: true,
        data: site,
      });
    }
  );

  static getSiteByCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const site = await ArchaeologicalSiteService.getSiteByCode(req.params.code);

      res.status(200).json({
        success: true,
        data: site,
      });
    }
  );

  static getAllSites = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return next(new AppError('Usuario no autenticado', 401));
      }

      const filters = {
        status: req.query.status as any,
        site_type: req.query.site_type as any,
        preservation_status: req.query.preservation_status as any,
        cultural_period: req.query.cultural_period as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await ArchaeologicalSiteService.getAllSites(filters, userId);

      res.status(200).json({
        success: true,
        data: result.sites,
        pagination: {
          total: result.total,
          limit: filters.limit || 10,
          offset: filters.offset || 0,
        },
      });
    }
  );

  static updateSite = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      const site = await ArchaeologicalSiteService.updateSite(req.params.id, req.body, userId);

      res.status(200).json({
        success: true,
        data: site,
      });
    }
  );

  static deleteSite = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      await ArchaeologicalSiteService.deleteSite(req.params.id, userId);

      res.status(204).json({
        success: true,
        data: null,
      });
    }
  );

  static searchSitesByLocation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { latitude, longitude, radius } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required',
        });
      }

      const sites = await ArchaeologicalSiteService.searchSitesByLocation(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        radius ? parseFloat(radius as string) : 10
      );

      res.status(200).json({
        success: true,
        data: sites,
      });
    }
  );

  static searchSitesByText = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required',
        });
      }

      const sites = await ArchaeologicalSiteService.searchSitesByText(q as string);

      res.status(200).json({
        success: true,
        data: sites,
      });
    }
  );

  static getSiteStatistics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const statistics = await ArchaeologicalSiteService.getSiteStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );

  static exportSites = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { format = 'json' } = req.query;
      
      if (!['csv', 'json', 'geojson'].includes(format as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid export format. Supported formats: csv, json, geojson',
        });
      }

      const data = await ArchaeologicalSiteService.exportSites(format as 'csv' | 'json' | 'geojson');

      res.status(200).json({
        success: true,
        data,
        format,
      });
    }
  );

    static createPampeanExamples = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Usar el ID del usuario real que existe en la base de datos
      const userId = '8063c1e6-aec5-448e-b210-c5cdf9470bd2';

      const result = await ArchaeologicalSiteService.createPampeanHunterGathererExamples(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: `Se crearon ${result.created} sitios de ejemplo de cazadores recolectores pampeanos`
      });
    }
  );

  static importSites = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fileContent, format } = req.body;
      const userId = (req as any).user?.id || 'default-user';
      
      if (!fileContent || !format) {
        return res.status(400).json({
          success: false,
          message: 'File content and format are required',
        });
      }

      if (!['csv', 'json'].includes(format)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid import format. Supported formats: csv, json',
        });
      }

      const result = await ArchaeologicalSiteService.importSites(fileContent, format, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
} 