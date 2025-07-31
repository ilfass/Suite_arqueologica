import { Router } from 'express';

const router = Router();

// Rutas básicas - se implementarán después
router.get('/profiles', (req, res) => {
  res.json({
    success: true,
    message: 'User Management Service - Profiles endpoint',
    data: []
  });
});

router.get('/relationships', (req, res) => {
  res.json({
    success: true,
    message: 'User Management Service - Relationships endpoint',
    data: []
  });
});

router.get('/teams', (req, res) => {
  res.json({
    success: true,
    message: 'User Management Service - Teams endpoint',
    data: []
  });
});

router.get('/connections', (req, res) => {
  res.json({
    success: true,
    message: 'User Management Service - Connections endpoint',
    data: []
  });
});

export { router as userManagementRoutes }; 