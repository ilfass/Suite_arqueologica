import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export const authController = {
  register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const result = await AuthService.register(email, password, fullName, role);

    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  logout: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await AuthService.logout();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  getCurrentUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: user,
      },
    });
  }),

  updateProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const updateData = req.body;
    const user = await AuthService.updateProfile(req.user.id, updateData);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  changePassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  }),

  requestPasswordReset: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  }),

  verifyResetToken: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const isValid = await AuthService.verifyResetToken(token);

    res.status(200).json({
      success: true,
      data: { isValid },
    });
  }),
}; 