import { Router } from 'express';
import areaRoutes from './areas';

const router = Router();

router.use('/areas', areaRoutes);

export default router; 