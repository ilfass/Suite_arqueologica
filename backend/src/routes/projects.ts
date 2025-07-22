import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getProjectStats
} from '../controllers/projectController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.authenticate);

// Project routes
router.get('/', getProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Milestone routes
router.post('/milestones', createMilestone);
router.put('/milestones/:id', updateMilestone);
router.delete('/milestones/:id', deleteMilestone);

export default router; 