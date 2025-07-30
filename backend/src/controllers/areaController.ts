import { Request, Response, NextFunction } from 'express';
import { AreaService } from '../services/areaService';
import { catchAsync } from '../utils/catchAsync';

export class AreaController {
  static createArea = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const area = await AreaService.createArea(req.body, userId);
    res.status(201).json({ success: true, data: area });
  });

  static getAllAreas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    const areas = await AreaService.getAllAreas(userId);
    res.status(200).json({ success: true, data: areas });
  });

  static getAreaById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const area = await AreaService.getAreaById(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Área no encontrada' });
    res.status(200).json({ success: true, data: area });
  });
} 