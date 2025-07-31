import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 4000;

// Configuración de servicios
const SERVICES = {
  AUTH: process.env['AUTH_SERVICE_URL'] || 'http://localhost:4001',
  CONTEXT: process.env['CONTEXT_SERVICE_URL'] || 'http://localhost:4002',
  USER_MANAGEMENT: process.env['USER_MANAGEMENT_SERVICE_URL'] || 'http://localhost:4003',
  INSTITUTION: process.env['INSTITUTION_SERVICE_URL'] || 'http://localhost:4004',
  NOTIFICATION: process.env['NOTIFICATION_SERVICE_URL'] || 'http://localhost:4005',
  PUBLIC: process.env['PUBLIC_SERVICE_URL'] || 'http://localhost:4006',
  ADMIN: process.env['ADMIN_SERVICE_URL'] || 'http://localhost:4007'
};

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: Object.keys(SERVICES)
  });
});

// Ruta principal
app.get('/', (_req, res) => {
  res.json({
    message: 'API Gateway - Suite Arqueológica',
    version: '1.0.0',
    services: Object.keys(SERVICES).map(service => ({
      name: service,
      url: SERVICES[service as keyof typeof SERVICES]
    }))
  });
});

// Proxy para Auth Service
app.use('/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/auth'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🔐 Proxying to Auth Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Auth Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Auth Service no disponible'
    });
  }
}));

// Proxy para Auth Service con prefijo /api/ (para el frontend)
app.use('/api/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🔐 Proxying to Auth Service (API)');
  },
  onError: (err, _req, res) => {
    console.error('❌ Auth Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Auth Service no disponible'
    });
  }
}));

// Proxy para Context Service (cuando esté disponible)
app.use('/context', createProxyMiddleware({
  target: SERVICES.CONTEXT,
  changeOrigin: true,
  pathRewrite: {
    '^/context': '/context'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🗺️ Proxying to Context Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Context Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Context Service no disponible'
    });
  }
}));

// Proxy para Context Service con prefijo /api/ (para el frontend)
app.use('/api/context', createProxyMiddleware({
  target: SERVICES.CONTEXT,
  changeOrigin: true,
  pathRewrite: {
    '^/api/context': '/context'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🗺️ Proxying to Context Service (API)');
  },
  onError: (err, _req, res) => {
    console.error('❌ Context Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Context Service no disponible'
    });
  }
}));

// Proxy para User Management Service (cuando esté disponible)
app.use('/users', createProxyMiddleware({
  target: SERVICES.USER_MANAGEMENT,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '/users'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('👥 Proxying to User Management Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ User Management Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'User Management Service no disponible'
    });
  }
}));

// Proxy para User Management Service con prefijo /api/ (para el frontend)
app.use('/api/users', createProxyMiddleware({
  target: SERVICES.USER_MANAGEMENT,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/users'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('👥 Proxying to User Management Service (API)');
  },
  onError: (err, _req, res) => {
    console.error('❌ User Management Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'User Management Service no disponible'
    });
  }
}));

// Proxy para Institution Service (cuando esté disponible)
app.use('/institutions', createProxyMiddleware({
  target: SERVICES.INSTITUTION,
  changeOrigin: true,
  pathRewrite: {
    '^/institutions': '/institutions'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🏛️ Proxying to Institution Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Institution Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Institution Service no disponible'
    });
  }
}));

// Proxy para Notification Service (cuando esté disponible)
app.use('/notifications', createProxyMiddleware({
  target: SERVICES.NOTIFICATION,
  changeOrigin: true,
  pathRewrite: {
    '^/notifications': '/notifications'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('🔔 Proxying to Notification Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Notification Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Notification Service no disponible'
    });
  }
}));

// Proxy para Public Service (cuando esté disponible)
app.use('/public', createProxyMiddleware({
  target: SERVICES.PUBLIC,
  changeOrigin: true,
  pathRewrite: {
    '^/public': '/public'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('📱 Proxying to Public Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Public Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Public Service no disponible'
    });
  }
}));

// Proxy para Admin Service (cuando esté disponible)
app.use('/admin', createProxyMiddleware({
  target: SERVICES.ADMIN,
  changeOrigin: true,
  pathRewrite: {
    '^/admin': '/admin'
  },
  onProxyReq: (_proxyReq, _req, _res) => {
    console.log('⚙️ Proxying to Admin Service');
  },
  onError: (err, _req, res) => {
    console.error('❌ Admin Service Error:', err);
    res.status(503).json({
      success: false,
      message: 'Admin Service no disponible'
    });
  }
}));

// Middleware de manejo de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 API Gateway iniciado en puerto', PORT);
  console.log('📊 Health check: http://localhost:' + PORT + '/health');
  console.log('🔐 Auth Service: ' + SERVICES.AUTH);
  console.log('🗺️ Context Service: ' + SERVICES.CONTEXT);
  console.log('👥 User Management Service: ' + SERVICES.USER_MANAGEMENT);
  console.log('🏛️ Institution Service: ' + SERVICES.INSTITUTION);
  console.log('🔔 Notification Service: ' + SERVICES.NOTIFICATION);
  console.log('📱 Public Service: ' + SERVICES.PUBLIC);
  console.log('⚙️ Admin Service: ' + SERVICES.ADMIN);
}); 