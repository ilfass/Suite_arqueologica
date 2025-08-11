import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  getSiteStats
} from '../controllers/siteController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.authenticate);

// Site routes
router.get('/', getSites);
router.get('/stats', getSiteStats);
router.get('/:id', getSite);
router.post('/', createSite);
router.put('/:id', updateSite);
router.delete('/:id', deleteSite);

export default router; 