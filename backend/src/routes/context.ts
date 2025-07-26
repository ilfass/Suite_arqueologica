import express from 'express';
import { ContextController } from '../controllers/contextController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// ============================================================================
// RUTAS DE CONTEXTO
// ============================================================================

// Aplicar middleware de autenticación a todas las rutas
router.use(AuthMiddleware.authenticate);

// GET /api/context/current - Obtener contexto actual
router.get('/current', ContextController.getCurrentContext);

// GET /api/context/details - Obtener contexto con detalles completos
router.get('/details', ContextController.getContextWithDetails);

// POST /api/context/update - Actualizar contexto
router.post('/update', ContextController.updateContext);

// DELETE /api/context/clear - Limpiar contexto
router.delete('/clear', ContextController.clearContext);

// GET /api/context/check - Verificar si hay contexto válido
router.get('/check', ContextController.checkValidContext);

export default router; 