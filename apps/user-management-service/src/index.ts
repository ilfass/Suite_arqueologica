import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { userManagementRoutes } from './routes/userManagement';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 4003;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'user-management-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      profiles: '/users/profiles',
      relationships: '/users/relationships',
      teams: '/users/teams',
      connections: '/users/connections'
    }
  });
});

// Ruta principal
app.get('/', (_req, res) => {
  res.json({
    message: 'User Management Service - Suite Arqueológica',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      profiles: '/users/profiles',
      relationships: '/users/relationships',
      teams: '/users/teams',
      connections: '/users/connections'
    }
  });
});

// Rutas del user management
app.use('/users', userManagementRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🔧 Variables de entorno cargadas:');
  console.log(`SUPABASE_URL: ${process.env['SUPABASE_URL']}`);
  console.log(`PORT: ${PORT}`);
  
  logger.info(`🚀 User Management Service iniciado en puerto ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`👥 User Management endpoints: http://localhost:${PORT}/users`);
});

export default app; 