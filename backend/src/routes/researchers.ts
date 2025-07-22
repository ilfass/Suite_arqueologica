import express from 'express';
import { ResearcherController } from '../controllers/researcherController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/', ResearcherController.getAllResearchers);
router.get('/search', ResearcherController.searchResearchersBySpecialization);
router.get('/institution', ResearcherController.getResearchersByInstitution);
router.get('/:id', ResearcherController.getResearcherById);

// Rutas protegidas (requieren autenticación)
router.post('/', AuthMiddleware.authenticate, ResearcherController.createResearcher);
router.put('/:id', AuthMiddleware.authenticate, ResearcherController.updateResearcher);
router.delete('/:id', AuthMiddleware.authenticate, ResearcherController.deleteResearcher);

export default router; 