import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de microservicios
const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  CONTEXT: process.env.CONTEXT_SERVICE_URL || 'http://localhost:4002',
  USER_MANAGEMENT: process.env.USER_MANAGEMENT_SERVICE_URL || 'http://localhost:4003',
  INSTITUTION: process.env.INSTITUTION_SERVICE_URL || 'http://localhost:4004',
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005',
  PUBLIC: process.env.PUBLIC_SERVICE_URL || 'http://localhost:4006',
  ADMIN: process.env.ADMIN_SERVICE_URL || 'http://localhost:4007'
};

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por ventana
  message: 'Demasiadas requests desde esta IP'
});
app.use(globalLimiter);

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: Object.keys(SERVICES)
  });
});

// Info del gateway
app.get('/', (req, res) => {
  res.json({
    name: 'Suite Arqueológica API Gateway',
    version: '1.0.0',
    description: 'Gateway para microservicios de Suite Arqueológica',
    endpoints: {
      health: '/health',
      auth: '/auth/*',
      contexts: '/contexts/*',
      users: '/users/*',
      institutions: '/institutions/*',
      notifications: '/notifications/*',
      public: '/public/*',
      admin: '/admin/*'
    }
  });
});

// Proxy para Auth Service
app.use('/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/auth'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`🔐 Auth Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Auth Service:', err);
    res.status(503).json({
      success: false,
      message: 'Auth Service no disponible'
    });
  }
}));

// Proxy para Context Service (requiere autenticación)
app.use('/contexts', authMiddleware, createProxyMiddleware({
  target: SERVICES.CONTEXT,
  changeOrigin: true,
  pathRewrite: {
    '^/contexts': '/contexts'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`📊 Context Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Context Service:', err);
    res.status(503).json({
      success: false,
      message: 'Context Service no disponible'
    });
  }
}));

// Proxy para User Management Service (requiere autenticación)
app.use('/users', authMiddleware, createProxyMiddleware({
  target: SERVICES.USER_MANAGEMENT,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '/users'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`👥 User Management Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en User Management Service:', err);
    res.status(503).json({
      success: false,
      message: 'User Management Service no disponible'
    });
  }
}));

// Proxy para Institution Service (requiere autenticación)
app.use('/institutions', authMiddleware, createProxyMiddleware({
  target: SERVICES.INSTITUTION,
  changeOrigin: true,
  pathRewrite: {
    '^/institutions': '/institutions'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`🏛️ Institution Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Institution Service:', err);
    res.status(503).json({
      success: false,
      message: 'Institution Service no disponible'
    });
  }
}));

// Proxy para Notification Service (requiere autenticación)
app.use('/notifications', authMiddleware, createProxyMiddleware({
  target: SERVICES.NOTIFICATION,
  changeOrigin: true,
  pathRewrite: {
    '^/notifications': '/notifications'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`🔔 Notification Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Notification Service:', err);
    res.status(503).json({
      success: false,
      message: 'Notification Service no disponible'
    });
  }
}));

// Proxy para Public Service (público)
app.use('/public', createProxyMiddleware({
  target: SERVICES.PUBLIC,
  changeOrigin: true,
  pathRewrite: {
    '^/public': '/public'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`📱 Public Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Public Service:', err);
    res.status(503).json({
      success: false,
      message: 'Public Service no disponible'
    });
  }
}));

// Proxy para Admin Service (requiere rol admin)
app.use('/admin', authMiddleware, createProxyMiddleware({
  target: SERVICES.ADMIN,
  changeOrigin: true,
  pathRewrite: {
    '^/admin': '/admin'
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`⚙️ Admin Service: ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    logger.error('❌ Error en Admin Service:', err);
    res.status(503).json({
      success: false,
      message: 'Admin Service no disponible'
    });
  }
}));

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    availableEndpoints: [
      '/health',
      '/auth/*',
      '/contexts/*',
      '/users/*',
      '/institutions/*',
      '/notifications/*',
      '/public/*',
      '/admin/*'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway iniciado en puerto ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔐 Auth Service: ${SERVICES.AUTH}`);
  logger.info(`📊 Context Service: ${SERVICES.CONTEXT}`);
  logger.info(`👥 User Management Service: ${SERVICES.USER_MANAGEMENT}`);
  logger.info(`🏛️ Institution Service: ${SERVICES.INSTITUTION}`);
  logger.info(`🔔 Notification Service: ${SERVICES.NOTIFICATION}`);
  logger.info(`📱 Public Service: ${SERVICES.PUBLIC}`);
  logger.info(`⚙️ Admin Service: ${SERVICES.ADMIN}`);
});

export default app; 