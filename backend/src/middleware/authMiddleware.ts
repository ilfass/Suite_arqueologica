import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { UserRole } from '../types/user';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        fullName: string;
      };
    }
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  iat: number;
  exp: number;
}

export class AuthMiddleware {
  /**
   * Middleware para verificar el token JWT
   */
  static authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Obtener el token del header Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
      }

      const token = authHeader.substring(7); // Remover 'Bearer '

      // Verificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      console.log('🔍 Token decodificado:', { id: decoded.id, email: decoded.email, role: decoded.role });

      // Verificar que el usuario existe en la base de datos
      console.log('🔍 Buscando usuario con ID:', decoded.id);
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role')
        .eq('id', decoded.id)
        .single();
      
      console.log('🔍 Resultado de la consulta:', { user, error });

      if (error || !user) {
        console.log('❌ Usuario no encontrado en la base de datos:', decoded.id);
        console.log('❌ Error de Supabase:', error);
        throw new AppError('Usuario no encontrado', 401);
      }

      console.log('✅ Usuario encontrado en la base de datos:', user.id);

      // Agregar el usuario al request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        fullName: `${user.first_name} ${user.last_name}`.trim(),
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError('Invalid token', 401));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError('Token expired', 401));
      } else {
        next(error);
      }
    }
  };

  /**
   * Middleware para verificar roles específicos
   */
  static authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    };
  };

  /**
   * Middleware para verificar que el usuario es propietario del recurso
   */
  static isOwner = (resourceField: string = 'created_by') => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      // Para recursos que requieren el ID del usuario
      const resourceUserId = req.params[resourceField] || req.body[resourceField];
      
      if (resourceUserId && resourceUserId !== req.user.id) {
        // Permitir acceso si es admin o coordinador
        if (!['COORDINATOR', 'INSTITUTION'].includes(req.user.role)) {
          return next(new AppError('Access denied', 403));
        }
      }

      next();
    };
  };

  /**
   * Middleware opcional de autenticación (no falla si no hay token)
   */
  static optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continuar sin usuario
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('id', decoded.id)
        .single();

      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          fullName: user.full_name,
        };
      }

      next();
    } catch (error) {
      // Si hay error en el token, continuar sin usuario
      next();
    }
  };

  /**
   * Middleware para verificar suscripción activa
   */
  static checkSubscription = (requiredPlan: 'FREE' | 'PROFESSIONAL' | 'INSTITUTIONAL') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_plan')
        .eq('id', req.user.id)
        .single();

      if (error || !user) {
        return next(new AppError('User not found', 401));
      }

      const planHierarchy = {
        'FREE': 0,
        'PROFESSIONAL': 1,
        'INSTITUTIONAL': 2,
      };

      const userPlanLevel = planHierarchy[user.subscription_plan as keyof typeof planHierarchy] || 0;
      const requiredPlanLevel = planHierarchy[requiredPlan];

      if (userPlanLevel < requiredPlanLevel) {
        return next(new AppError('Subscription plan required', 402));
      }

      next();
    };
  };

  /**
   * Middleware para rate limiting básico
   */
  static rateLimit = (maxRequests: number = 100, windowMs: number = 900000) => {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
      const key = req.ip || 'unknown';
      const now = Date.now();

      const userRequests = requests.get(key);
      
      if (!userRequests || now > userRequests.resetTime) {
        requests.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        userRequests.count++;
        
        if (userRequests.count > maxRequests) {
          return next(new AppError('Too many requests', 429));
        }
      }

      next();
    };
  };
} 