import { Router } from 'express';
import { ContextController } from '../controllers/contextController';

const router = Router();
const contextController = new ContextController();

// ===== RUTAS DE PROYECTOS =====
router.post('/projects', contextController.createProject.bind(contextController));
router.get('/projects', contextController.getProjects.bind(contextController));
router.get('/projects/:id', contextController.getProjectById.bind(contextController));
router.put('/projects/:id', contextController.updateProject.bind(contextController));

// ===== RUTAS DE ÁREAS =====
router.post('/areas', contextController.createArea.bind(contextController));
router.get('/projects/:projectId/areas', contextController.getAreasByProject.bind(contextController));

// ===== RUTAS DE SITIOS =====
router.post('/sites', contextController.createSite.bind(contextController));
router.get('/areas/:areaId/sites', contextController.getSitesByArea.bind(contextController));

// ===== RUTAS DE DESCUBRIMIENTOS =====
router.post('/discoveries', contextController.createDiscovery.bind(contextController));
router.get('/sites/:siteId/discoveries', contextController.getDiscoveriesBySite.bind(contextController));

export { router as contextRoutes }; 