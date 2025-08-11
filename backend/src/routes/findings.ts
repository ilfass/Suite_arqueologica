import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import {
  getFindings,
  getFinding,
  createFinding,
  updateFinding,
  deleteFinding,
  getFindingStats
} from '../controllers/findingController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.authenticate);

// Finding routes
router.get('/', getFindings);
router.get('/stats', getFindingStats);
router.get('/:id', getFinding);
router.post('/', createFinding);
router.put('/:id', updateFinding);
router.delete('/:id', deleteFinding);

export default router; 