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
  body('firstName').notEmpty().withMessage('Nombre requerido'),
  body('lastName').notEmpty().withMessage('Apellido requerido'),
  body('country').notEmpty().withMessage('País requerido'),
  body('province').notEmpty().withMessage('Provincia requerida'),
  body('city').notEmpty().withMessage('Ciudad requerida'),
  body('role').isIn(['DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST']).withMessage('Rol válido requerido'),
  body('termsAccepted').isBoolean().withMessage('Debe aceptar los términos y condiciones'),
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

const publicProfileValidation = [
  body('isPublic').optional().isBoolean().withMessage('isPublic debe ser un booleano'),
  body('displayName').optional().notEmpty().withMessage('Nombre para mostrar no puede estar vacío'),
  body('bio').optional().notEmpty().withMessage('Biografía no puede estar vacía'),
  body('specialization').optional().notEmpty().withMessage('Especialización no puede estar vacía'),
  body('institution').optional().notEmpty().withMessage('Institución no puede estar vacía'),
  body('location').optional().notEmpty().withMessage('Ubicación no puede estar vacía'),
  body('email').optional().isEmail().withMessage('Email válido requerido'),
  body('website').optional().isURL().withMessage('URL válida requerida'),
  body('customMessage').optional().notEmpty().withMessage('Mensaje personal no puede estar vacío'),
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
router.post('/register-dev', registerValidation, authController.registerDev);
router.post('/login', AuthMiddleware.rateLimit(1000, 900000), loginValidation, authController.login);
router.post('/login-dev', loginValidation, authController.loginDev);
router.post('/logout', authController.logout);
router.post('/request-reset', requestResetValidation, authController.requestPasswordReset);
router.get('/verify-reset/:token', authController.verifyResetToken);

// Rutas protegidas
router.get('/me', AuthMiddleware.authenticate, authController.getCurrentUser);
router.get('/profile', AuthMiddleware.authenticate, authController.getCurrentUser);
router.put('/profile', AuthMiddleware.authenticate, updateProfileValidation, authController.updateProfile);
router.put('/change-password', AuthMiddleware.authenticate, changePasswordValidation, authController.changePassword);

// Rutas para perfil público
router.get('/public-profile', AuthMiddleware.authenticate, authController.getPublicProfile);
router.put('/public-profile', AuthMiddleware.authenticate, publicProfileValidation, authController.updatePublicProfile);
router.get('/public-profile/:id', authController.getPublicProfileById);

export default router; 