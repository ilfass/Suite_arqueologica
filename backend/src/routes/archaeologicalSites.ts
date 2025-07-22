import { Router } from 'express';
import { ArchaeologicalSiteController } from '../controllers/archaeologicalSiteController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { body, validationResult } from 'express-validator';
import { UserRole } from '../types/user';

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
const createSiteValidation = [
  body('site_code').notEmpty().withMessage('Código del sitio requerido'),
  body('name').notEmpty().withMessage('Nombre del sitio requerido'),
  body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitud válida requerida'),
  body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitud válida requerida'),
  body('site_type').notEmpty().withMessage('Tipo de sitio requerido'),
  body('preservation_status').optional().isIn(['excellent', 'good', 'fair', 'poor', 'critical']).withMessage('Estado de preservación válido requerido'),
  validateRequest,
];

const updateSiteValidation = [
  body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitud válida requerida'),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitud válida requerida'),
  body('preservation_status').optional().isIn(['excellent', 'good', 'fair', 'poor', 'critical']).withMessage('Estado de preservación válido requerido'),
  validateRequest,
];

// Rutas públicas (solo lectura)
router.get('/code/:code', ArchaeologicalSiteController.getSiteByCode);
router.get('/search/location', ArchaeologicalSiteController.searchSitesByLocation);
router.get('/search/text', ArchaeologicalSiteController.searchSitesByText);
router.get('/statistics', ArchaeologicalSiteController.getSiteStatistics);
router.get('/export', ArchaeologicalSiteController.exportSites);
router.get('/:id', ArchaeologicalSiteController.getSiteById);
router.get('/', ArchaeologicalSiteController.getAllSites);

// Rutas protegidas
router.post('/', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.RESEARCHER, UserRole.COORDINATOR, UserRole.INSTITUTION),
  createSiteValidation, 
  ArchaeologicalSiteController.createSite
);

router.post('/examples/pampean',
  ArchaeologicalSiteController.createPampeanExamples
);

router.post('/import', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.COORDINATOR, UserRole.INSTITUTION),
  ArchaeologicalSiteController.importSites
);

router.patch('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.isOwner('created_by'),
  updateSiteValidation, 
  ArchaeologicalSiteController.updateSite
);

router.delete('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.COORDINATOR, UserRole.INSTITUTION),
  ArchaeologicalSiteController.deleteSite
);

export default router; 