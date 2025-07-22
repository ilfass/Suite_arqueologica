import { Request, Response, NextFunction } from 'express';
import { ObjectService } from '../services/objectService';
import { catchAsync } from '../utils/catchAsync';

export class ObjectController {
  static createObject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      const object = await ObjectService.createObject(req.body, userId);

      res.status(201).json({
        success: true,
        data: object,
      });
    }
  );

  static getObjectById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const object = await ObjectService.getObjectById(req.params.id);

      res.status(200).json({
        success: true,
        data: object,
      });
    }
  );

  static getObjectByCatalogNumber = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const object = await ObjectService.getObjectByCatalogNumber(req.params.catalogNumber);

      res.status(200).json({
        success: true,
        data: object,
      });
    }
  );

  static getAllObjects = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const filters = {
        site_id: req.query.site_id as string,
        object_type: req.query.object_type as any,
        condition: req.query.condition as any,
        material: req.query.material as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await ObjectService.getAllObjects(filters);

      res.status(200).json({
        success: true,
        data: result.objects,
        pagination: {
          total: result.total,
          limit: filters.limit || 10,
          offset: filters.offset || 0,
        },
      });
    }
  );

  static updateObject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      const object = await ObjectService.updateObject(req.params.id, req.body, userId);

      res.status(200).json({
        success: true,
        data: object,
      });
    }
  );

  static deleteObject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      await ObjectService.deleteObject(req.params.id, userId);

      res.status(204).json({
        success: true,
        data: null,
      });
    }
  );

  static searchObjectsByText = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required',
        });
      }

      const objects = await ObjectService.searchObjectsByText(q as string);

      res.status(200).json({
        success: true,
        data: objects,
      });
    }
  );

  static getObjectsBySite = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const objects = await ObjectService.getObjectsBySite(req.params.siteId);

      res.status(200).json({
        success: true,
        data: objects,
      });
    }
  );

  static getObjectStatistics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const statistics = await ObjectService.getObjectStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );

  static exportObjects = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { format = 'json' } = req.query;
      
      if (!['csv', 'json'].includes(format as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid export format. Supported formats: csv, json',
        });
      }

      const data = await ObjectService.exportObjects(format as 'csv' | 'json');

      res.status(200).json({
        success: true,
        data,
        format,
      });
    }
  );

  // Método para obtener hallazgos para mapping
  static getFindings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const findings = await ObjectService.getFindings();

      res.status(200).json({
        success: true,
        data: findings,
      });
    }
  );

  // =====================================================
  // CRUD para Findings
  // =====================================================

  static createFinding = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const findingData = req.body;
      const userId = (req as any).user?.id;

      const finding = await ObjectService.createFinding(findingData, userId);

      res.status(201).json({
        success: true,
        data: finding,
      });
    }
  );

  static updateFinding = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      const finding = await ObjectService.updateFinding(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: finding,
      });
    }
  );

  static deleteFinding = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      await ObjectService.deleteFinding(id, userId);

      res.status(204).send();
    }
  );

  static createPampeanExamples = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Usar el ID del usuario real que existe en la base de datos
      const userId = '8063c1e6-aec5-448e-b210-c5cdf9470bd2';

      const result = await ObjectService.createPampeanHunterGathererObjectExamples(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: `Se crearon ${result.created} objetos de ejemplo de cazadores recolectores pampeanos`
      });
    }
  );
} 