import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('❌ Error no manejado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Error de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      error: error.message
    });
  }

  // Error de autenticación
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado',
      error: error.message
    });
  }

  // Error de permisos
  if (error.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado',
      error: error.message
    });
  }

  // Error de recurso no encontrado
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      message: 'Recurso no encontrado',
      error: error.message
    });
  }

  // Error de base de datos
  if (error.name === 'DatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
}; 