import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import {
  getAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
  getAreaStats
} from '../controllers/areaController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.authenticate);

// Area routes
router.get('/', getAreas);
router.get('/stats', getAreaStats);
router.get('/:id', getArea);
router.post('/', createArea);
router.put('/:id', updateArea);
router.delete('/:id', deleteArea);

export default router; 