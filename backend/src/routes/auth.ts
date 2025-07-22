import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validators';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { body, validationResult } from 'express-validator';

const router = Router();

// Middleware para validar resultados de express-validator
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Validaciones
const registerValidation = [
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña debe tener al menos 8 caracteres'),
  body('fullName').notEmpty().withMessage('Nombre completo requerido'),
  body('role').isIn(['ADMIN', 'DIRECTOR', 'RESEARCHER', 'STUDENT', 'COORDINATOR', 'INSTITUTION', 'GUEST']).withMessage('Rol válido requerido'),
  validateRequest,
];

const loginValidation = [
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validateRequest,
];

const updateProfileValidation = [
  body('fullName').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('phone').optional().isMobilePhone('any').withMessage('Teléfono válido requerido'),
  body('website').optional().isURL().withMessage('URL válida requerida'),
  validateRequest,
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
  body('newPassword').isLength({ min: 8 }).withMessage('Nueva contraseña debe tener al menos 8 caracteres'),
  validateRequest,
];

const requestResetValidation = [
  body('email').isEmail().withMessage('Email válido requerido'),
  validateRequest,
];

// Rutas públicas
router.post('/register', registerValidation, authController.register);
router.post('/login', AuthMiddleware.rateLimit(1000, 900000), loginValidation, authController.login);
router.post('/logout', authController.logout);
router.post('/request-reset', requestResetValidation, authController.requestPasswordReset);
router.get('/verify-reset/:token', authController.verifyResetToken);

// Rutas protegidas
router.get('/me', AuthMiddleware.authenticate, authController.getCurrentUser);
router.get('/profile', AuthMiddleware.authenticate, authController.getCurrentUser);
router.put('/profile', AuthMiddleware.authenticate, updateProfileValidation, authController.updateProfile);
router.put('/change-password', AuthMiddleware.authenticate, changePasswordValidation, authController.changePassword);

export default router; 