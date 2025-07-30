import { Router } from 'express';
import { AreaController } from '../controllers/areaController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', AuthMiddleware.authenticate, AreaController.getAllAreas);
router.get('/:id', AuthMiddleware.authenticate, AreaController.getAreaById);
router.post('/', AuthMiddleware.authenticate, AreaController.createArea);

export default router; 