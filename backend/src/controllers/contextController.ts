import { Request, Response, NextFunction } from 'express';
import { ContextService, ContextUpdateData } from '../services/contextService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

// ============================================================================
// CONTROLADOR DE CONTEXTO
// ============================================================================

export class ContextController {

  /**
   * Obtener el contexto actual del usuario
   */
  static getCurrentContext = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const context = await ContextService.getUserContext(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        context,
        hasContext: context !== null
      }
    });
  });

  /**
   * Obtener contexto con detalles completos
   */
  static getContextWithDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const contextWithDetails = await ContextService.getContextWithDetails(userId);
    
    res.status(200).json({
      status: 'success',
      data: contextWithDetails
    });
  });

  /**
   * Actualizar el contexto del usuario
   */
  static updateContext = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const contextData: ContextUpdateData = req.body;

    // Validar datos requeridos
    if (!contextData.project_id || !contextData.project_name || 
        !contextData.area_id || !contextData.area_name) {
      return next(new AppError('Proyecto y área son requeridos', 400));
    }

    const updatedContext = await ContextService.updateUserContext(userId, contextData);
    
    res.status(200).json({
      status: 'success',
      data: {
        context: updatedContext,
        message: 'Contexto actualizado correctamente'
      }
    });
  });

  /**
   * Limpiar el contexto del usuario
   */
  static clearContext = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    await ContextService.clearUserContext(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Contexto eliminado correctamente'
      }
    });
  });

  /**
   * Verificar si el usuario tiene contexto válido
   */
  static checkValidContext = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const hasValidContext = await ContextService.hasValidContext(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        hasValidContext
      }
    });
  });
} 