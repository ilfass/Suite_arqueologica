import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

const validators = {
  register: (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName || !role) {
      throw new AppError('Please provide all required fields', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }
    next();
  },
  login: (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    next();
  },
  createSite: (req: Request, res: Response, next: NextFunction) => {
    const { name, description, location, period, status } = req.body;
    if (!name || !description || !location || !period || !status) {
      throw new AppError('Please provide all required fields', 400);
    }
    if (!location.latitude || !location.longitude || !location.address) {
      throw new AppError('Please provide valid location data', 400);
    }
    next();
  },
  updateSite: (req: Request, res: Response, next: NextFunction) => {
    const { location } = req.body;
    if (location && (!location.latitude || !location.longitude || !location.address)) {
      throw new AppError('Please provide valid location data', 400);
    }
    next();
  },
  getSiteById: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('Please provide a site ID', 400);
    }
    next();
  },
  listSites: (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.query;
    if (status && !['active', 'inactive', 'archived'].includes(status as string)) {
      throw new AppError('Invalid status value', 400);
    }
    next();
  },
  deleteSite: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError('Please provide a site ID', 400);
    }
    next();
  },
};

export const validate = (validator: keyof typeof validators) => {
  return validators[validator];
}; 