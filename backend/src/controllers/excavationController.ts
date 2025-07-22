import { Request, Response, NextFunction } from 'express';
import { ExcavationService } from '../services/excavationService';
import { catchAsync } from '../utils/catchAsync';

export class ExcavationController {
  static createExcavation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      const excavation = await ExcavationService.createExcavation(req.body, userId);

      res.status(201).json({
        success: true,
        data: excavation,
      });
    }
  );

  static getExcavationById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const excavation = await ExcavationService.getExcavationById(req.params.id);

      res.status(200).json({
        success: true,
        data: excavation,
      });
    }
  );

  static getExcavationByCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const excavation = await ExcavationService.getExcavationByCode(req.params.code);

      res.status(200).json({
        success: true,
        data: excavation,
      });
    }
  );

  static getAllExcavations = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const filters = {
        site_id: req.query.site_id as string,
        status: req.query.status as any,
        excavation_method: req.query.excavation_method as any,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await ExcavationService.getAllExcavations(filters);

      res.status(200).json({
        success: true,
        data: result.excavations,
        pagination: {
          total: result.total,
          limit: filters.limit || 10,
          offset: filters.offset || 0,
        },
      });
    }
  );

  static updateExcavation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      const excavation = await ExcavationService.updateExcavation(req.params.id, req.body, userId);

      res.status(200).json({
        success: true,
        data: excavation,
      });
    }
  );

  static deleteExcavation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || 'default-user';
      await ExcavationService.deleteExcavation(req.params.id, userId);

      res.status(204).json({
        success: true,
        data: null,
      });
    }
  );

  static getActiveExcavations = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const excavations = await ExcavationService.getActiveExcavations();

      res.status(200).json({
        success: true,
        data: excavations,
      });
    }
  );

  static getExcavationsBySite = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const excavations = await ExcavationService.getExcavationsBySite(req.params.siteId);

      res.status(200).json({
        success: true,
        data: excavations,
      });
    }
  );

  static searchExcavationsByText = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required',
        });
      }

      const excavations = await ExcavationService.searchExcavationsByText(q as string);

      res.status(200).json({
        success: true,
        data: excavations,
      });
    }
  );

  static getExcavationStatistics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const statistics = await ExcavationService.getExcavationStatistics();

      res.status(200).json({
        success: true,
        data: statistics,
      });
    }
  );

  static exportExcavations = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { format = 'json' } = req.query;
      
      if (!['csv', 'json'].includes(format as string)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid export format. Supported formats: csv, json',
        });
      }

      const data = await ExcavationService.exportExcavations(format as 'csv' | 'json');

      res.status(200).json({
        success: true,
        data,
        format,
      });
    }
  );

  // Métodos de mapping
  static getGridUnits = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const gridUnits = await ExcavationService.getGridUnits();

      res.status(200).json({
        success: true,
        data: gridUnits,
      });
    }
  );

  static getMeasurements = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const measurements = await ExcavationService.getMeasurements();

      res.status(200).json({
        success: true,
        data: measurements,
      });
    }
  );

  static getMappingStats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await ExcavationService.getMappingStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    }
  );

  static exportMappingData = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await ExcavationService.exportMappingData();

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="mapping-data-${new Date().toISOString().split('T')[0]}.json"`);
      
      res.status(200).send(data);
    }
  );

  // =====================================================
  // CRUD para Grid Units
  // =====================================================

  static createGridUnit = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const gridUnitData = req.body;
      const userId = (req as any).user?.id;

      const gridUnit = await ExcavationService.createGridUnit(gridUnitData, userId);

      res.status(201).json({
        success: true,
        data: gridUnit,
      });
    }
  );

  static updateGridUnit = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      const gridUnit = await ExcavationService.updateGridUnit(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: gridUnit,
      });
    }
  );

  static deleteGridUnit = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      await ExcavationService.deleteGridUnit(id, userId);

      res.status(204).send();
    }
  );

  // =====================================================
  // CRUD para Measurements
  // =====================================================

  static createMeasurement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const measurementData = req.body;
      const userId = (req as any).user?.id;

      const measurement = await ExcavationService.createMeasurement(measurementData, userId);

      res.status(201).json({
        success: true,
        data: measurement,
      });
    }
  );

  static updateMeasurement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      const measurement = await ExcavationService.updateMeasurement(id, updateData, userId);

      res.status(200).json({
        success: true,
        data: measurement,
      });
    }
  );

  static deleteMeasurement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      await ExcavationService.deleteMeasurement(id, userId);

      res.status(204).send();
    }
  );
} 