import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: (error as any).path,
        message: error.msg,
        value: (error as any).value
      }))
    });
    return;
  }
  
  next();
}; 