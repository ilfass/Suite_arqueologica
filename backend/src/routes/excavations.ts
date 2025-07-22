import express from 'express';
import { ExcavationController } from '../controllers/excavationController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { body, validationResult } from 'express-validator';
import { UserRole } from '../types/user';

const router = express.Router();

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
const createExcavationValidation = [
  body('excavation_code').notEmpty().withMessage('Código de excavación requerido'),
  body('site_id').isUUID().withMessage('Site ID debe ser un UUID válido'),
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('start_date').isISO8601().withMessage('Fecha de inicio válida requerida'),
  body('status').optional().isIn(['planned', 'in_progress', 'completed', 'suspended', 'cancelled']).withMessage('Estado válido requerido'),
  body('excavation_method').optional().isIn(['open_area', 'trench', 'test_pit', 'step_trench', 'box_grid', 'quadrant', 'arbitrary_levels', 'natural_levels', 'other']).withMessage('Método de excavación válido requerido'),
  validateRequest,
];

const updateExcavationValidation = [
  body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('start_date').optional().isISO8601().withMessage('Fecha de inicio válida requerida'),
  body('end_date').optional().isISO8601().withMessage('Fecha de fin válida requerida'),
  body('status').optional().isIn(['planned', 'in_progress', 'completed', 'suspended', 'cancelled']).withMessage('Estado válido requerido'),
  body('excavation_method').optional().isIn(['open_area', 'trench', 'test_pit', 'step_trench', 'box_grid', 'quadrant', 'arbitrary_levels', 'natural_levels', 'other']).withMessage('Método de excavación válido requerido'),
  validateRequest,
];

const updateStatusValidation = [
  body('status').isIn(['planned', 'in_progress', 'completed', 'suspended']).withMessage('Valid status required'),
  validateRequest,
];

const addTeamMemberValidation = [
  body('memberId').isUUID().withMessage('Valid member ID required'),
  validateRequest,
];

// Rutas de mapping (deben ir antes de las rutas con parámetros)
router.get('/grid-units', ExcavationController.getGridUnits);
router.post('/grid-units', ExcavationController.createGridUnit);
router.put('/grid-units/:id', ExcavationController.updateGridUnit);
router.delete('/grid-units/:id', ExcavationController.deleteGridUnit);

router.get('/measurements', ExcavationController.getMeasurements);
router.post('/measurements', ExcavationController.createMeasurement);
router.put('/measurements/:id', ExcavationController.updateMeasurement);
router.delete('/measurements/:id', ExcavationController.deleteMeasurement);

router.get('/mapping-stats', ExcavationController.getMappingStats);
router.get('/export-mapping', ExcavationController.exportMappingData);

// Rutas públicas (solo lectura)
router.get('/code/:code', ExcavationController.getExcavationByCode);
router.get('/search', ExcavationController.searchExcavationsByText);
router.get('/statistics', ExcavationController.getExcavationStatistics);
router.get('/export', ExcavationController.exportExcavations);
router.get('/active/all', ExcavationController.getActiveExcavations);
router.get('/site/:siteId', ExcavationController.getExcavationsBySite);
router.get('/:id', ExcavationController.getExcavationById);
router.get('/', ExcavationController.getAllExcavations);

// Rutas protegidas
router.post('/', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.RESEARCHER, UserRole.COORDINATOR, UserRole.INSTITUTION),
  createExcavationValidation, 
  ExcavationController.createExcavation
);

router.patch('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.isOwner('created_by'),
  updateExcavationValidation, 
  ExcavationController.updateExcavation
);

router.delete('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.COORDINATOR, UserRole.INSTITUTION),
  ExcavationController.deleteExcavation
);

export default router; 