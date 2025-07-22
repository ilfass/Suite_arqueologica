import { Request, Response, NextFunction } from 'express';
import { ResearcherService, CreateResearcherData, UpdateResearcherData } from '../services/researcherService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export class ResearcherController {
  /**
   * Obtener todos los investigadores
   */
  static getAllResearchers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const researchers = await ResearcherService.getAllResearchers();
    
    res.status(200).json({
      success: true,
      data: researchers,
      message: 'Investigadores obtenidos exitosamente'
    });
  });

  /**
   * Obtener un investigador por ID
   */
  static getResearcherById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!id) {
      return next(new AppError('ID de investigador es requerido', 400));
    }

    const researcher = await ResearcherService.getResearcherById(id);
    
    res.status(200).json({
      success: true,
      data: researcher,
      message: 'Investigador obtenido exitosamente'
    });
  });

  /**
   * Crear un nuevo investigador
   */
  static createResearcher = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const researcherData: CreateResearcherData = req.body;
    const createdBy = req.user?.id;

    if (!createdBy) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    // Validar campos requeridos
    if (!researcherData.first_name || !researcherData.last_name || !researcherData.email || !researcherData.institution || !researcherData.specialization) {
      return next(new AppError('Nombre, apellido, email, institución y especialización son campos requeridos', 400));
    }

    // Agregar el user_id al researcherData
    const researcherDataWithUserId = {
      ...researcherData,
      user_id: createdBy
    };

    const researcher = await ResearcherService.createResearcher(researcherDataWithUserId);
    
    res.status(201).json({
      success: true,
      data: researcher,
      message: 'Investigador creado exitosamente'
    });
  });

  /**
   * Actualizar un investigador
   */
  static updateResearcher = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData: UpdateResearcherData = req.body;

    if (!id) {
      return next(new AppError('ID de investigador es requerido', 400));
    }

    const researcher = await ResearcherService.updateResearcher(id, updateData);
    
    res.status(200).json({
      success: true,
      data: researcher,
      message: 'Investigador actualizado exitosamente'
    });
  });

  /**
   * Eliminar un investigador
   */
  static deleteResearcher = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('ID de investigador es requerido', 400));
    }

    await ResearcherService.deleteResearcher(id);
    
    res.status(200).json({
      success: true,
      message: 'Investigador eliminado exitosamente'
    });
  });

  /**
   * Buscar investigadores por especialización
   */
  static searchResearchersBySpecialization = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { specialization } = req.query;

    if (!specialization || typeof specialization !== 'string') {
      return next(new AppError('Especialización es requerida', 400));
    }

    const researchers = await ResearcherService.searchResearchersBySpecialization(specialization);
    
    res.status(200).json({
      success: true,
      data: researchers,
      message: `Investigadores encontrados para especialización: ${specialization}`
    });
  });

  /**
   * Obtener investigadores por institución
   */
  static getResearchersByInstitution = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { institution } = req.query;

    if (!institution || typeof institution !== 'string') {
      return next(new AppError('Institución es requerida', 400));
    }

    const researchers = await ResearcherService.getResearchersByInstitution(institution);
    
    res.status(200).json({
      success: true,
      data: researchers,
      message: `Investigadores encontrados para institución: ${institution}`
    });
  });
} 