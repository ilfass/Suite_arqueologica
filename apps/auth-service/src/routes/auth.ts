import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Validación de login
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
];

// Validación de registro
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['ADMIN', 'DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST']).withMessage('Rol inválido'),
  body('firstName').optional().isString().withMessage('Nombre debe ser texto'),
  body('lastName').optional().isString().withMessage('Apellido debe ser texto'),
  body('institutionId').optional().isUUID().withMessage('ID de institución inválido')
];

// Rutas públicas
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/verify-token', authController.verifyToken);
router.post('/change-password', authMiddleware, authController.changePassword);

export { router as authRoutes }; 