import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Cargar variables de entorno
dotenv.config();
console.log('🔧 Variables de entorno cargadas:');
console.log('SUPABASE_URL:', process.env['SUPABASE_URL']);
console.log('PORT:', process.env['PORT']);

const app = express();
const PORT = process.env['PORT'] || 4001;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP'
});
app.use('/auth', limiter);

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Auth Service iniciado en puerto ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔐 Auth endpoints: http://localhost:${PORT}/auth`);
});

export default app; 