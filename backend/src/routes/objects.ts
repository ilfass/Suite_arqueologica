import express from 'express';
import { ObjectController } from '../controllers/objectController';
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

// Validaciones para crear objetos
const createObjectValidation = [
  body('catalog_number').notEmpty().withMessage('Número de catálogo requerido'),
  body('site_id').isUUID().withMessage('Site ID debe ser un UUID válido'),
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('object_type').notEmpty().withMessage('Tipo de objeto requerido'),
  body('primary_material').notEmpty().withMessage('Material principal requerido'),
  body('condition').optional().isIn(['excellent', 'good', 'fair', 'poor', 'fragmentary']).withMessage('Condición válida requerida'),
  validateRequest,
];

const updateObjectValidation = [
  body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('object_type').optional().notEmpty().withMessage('Tipo de objeto no puede estar vacío'),
  body('primary_material').optional().notEmpty().withMessage('Material principal no puede estar vacío'),
  body('condition').optional().isIn(['excellent', 'good', 'fair', 'poor', 'fragmentary']).withMessage('Condición válida requerida'),
  validateRequest,
];

// Rutas de hallazgos para mapping (deben ir antes de las rutas con parámetros)
router.get('/findings', ObjectController.getFindings);
router.post('/findings', ObjectController.createFinding);
router.put('/findings/:id', ObjectController.updateFinding);
router.delete('/findings/:id', ObjectController.deleteFinding);

// Ruta para crear ejemplos de cazadores recolectores pampeanos
router.post('/examples/pampean', ObjectController.createPampeanExamples);

// Rutas públicas (solo lectura)
router.get('/catalog/:catalogNumber', ObjectController.getObjectByCatalogNumber);
router.get('/search', ObjectController.searchObjectsByText);
router.get('/statistics', ObjectController.getObjectStatistics);
router.get('/export', ObjectController.exportObjects);
router.get('/site/:siteId', ObjectController.getObjectsBySite);
router.get('/:id', ObjectController.getObjectById);
router.get('/', ObjectController.getAllObjects);

// Rutas protegidas
router.post('/', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.RESEARCHER, UserRole.COORDINATOR, UserRole.INSTITUTION),
  createObjectValidation, 
  ObjectController.createObject
);

router.patch('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.isOwner('created_by'),
  updateObjectValidation, 
  ObjectController.updateObject
);

router.delete('/:id', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize(UserRole.COORDINATOR, UserRole.INSTITUTION),
  ObjectController.deleteObject
);

export default router; 