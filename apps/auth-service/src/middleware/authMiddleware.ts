import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth';
import { logger } from '../utils/logger';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as TokenPayload;
    
    // Verificar que el token no haya expirado
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    // Agregar información del usuario al request
    req.user = decoded;
    
    logger.info(`🔐 Usuario autenticado: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    logger.error('❌ Error en autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario es el propietario o admin
export const requireOwnership = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const resourceId = req.params[paramName];
    
    // Admin puede acceder a todo
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Usuario puede acceder a sus propios recursos
    if (req.user.userId === resourceId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Acceso denegado'
    });
  };
}; 