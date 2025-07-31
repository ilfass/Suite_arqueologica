import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  
  logger.error('Error no manejado:', {
    message: err.message,
    stack: err.stack,
    url: _req.url,
    method: _req.method
  });

  // Error de validación
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      error: err.message
    });
    return;
  }

  // Error de Supabase
  if (err.code && err.code.startsWith('PGRST')) {
    res.status(400).json({
      success: false,
      message: 'Error en la base de datos',
      error: isDevelopment ? err.message : 'Error interno'
    });
    return;
  }

  // Error de autenticación
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      message: 'No autorizado',
      error: err.message
    });
    return;
  }

  // Error de permisos
  if (err.name === 'ForbiddenError') {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado',
      error: err.message
    });
    return;
  }

  // Error de recurso no encontrado
  if (err.name === 'NotFoundError') {
    res.status(404).json({
      success: false,
      message: 'Recurso no encontrado',
      error: err.message
    });
    return;
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: isDevelopment ? err.message : 'Error interno'
  });
}; 