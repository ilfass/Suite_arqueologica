import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { AuthMiddleware } from './middleware/authMiddleware';
import authRoutes from './routes/auth';
import siteRoutes from './routes/sites';
import areaRoutes from './routes/areas';
import objectRoutes from './routes/objects';
import excavationRoutes from './routes/excavations';
import projectRoutes from './routes/projects';
import researcherRoutes from './routes/researchers';
import contextRoutes from './routes/context';
import investigatorRoutes from './routes/investigators';
import findingsRoutes from './routes/findings';

const app = express();

// Middleware de seguridad para producción
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://avpaiyyjixtdopbciedr.supabase.co"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
} else {
  app.use(helmet());
}

// CORS configurado para producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN?.split(',') || ['https://tu-dominio.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging configurado para producción
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        console.log(message.trim());
      }
    }
  }));
} else {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting configurado para producción
const rateLimitMax = process.env.NODE_ENV === 'production' 
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  : 5000;
const rateLimitWindow = process.env.NODE_ENV === 'production'
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
  : 60000;

app.use(AuthMiddleware.rateLimit(rateLimitMax, rateLimitWindow));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/artifacts', objectRoutes); // Alias para compatibilidad con frontend
app.use('/api/excavations', excavationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/researchers', researcherRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/investigators', investigatorRoutes);
app.use('/api/findings', findingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Suite Arqueológica API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Suite Arqueológica API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      sites: '/api/sites',
      objects: '/api/objects',
      excavations: '/api/excavations',
      projects: '/api/projects',
      researchers: '/api/researchers',
      context: '/api/context',
      health: '/api/health',
    },
    documentation: 'https://github.com/your-repo/suite-arqueologica/docs',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🏛️ Sites endpoints: http://localhost:${PORT}/api/sites`);
  console.log(`🏺 Objects endpoints: http://localhost:${PORT}/api/objects`);
  console.log(`⛏️ Excavations endpoints: http://localhost:${PORT}/api/excavations`);
  console.log(`📋 Projects endpoints: http://localhost:${PORT}/api/projects`);
  console.log(`👨‍🔬 Researchers endpoints: http://localhost:${PORT}/api/researchers`);
  console.log(`🎯 Context endpoints: http://localhost:${PORT}/api/context`);
  
  // Banner de desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('\n' + '='.repeat(80));
    console.log('⚠️  MODO DESARROLLO ACTIVO');
    console.log('='.repeat(80));
    console.log('📋 RECORDATORIOS PARA PRODUCCIÓN:');
    console.log('   • Configurar servicio de email en Supabase');
    console.log('   • Ajustar límites de rate limiting');
    console.log('   • Verificar configuración de autenticación');
    console.log('   • Revisar configuración de seguridad');
    console.log('   • Configurar variables de entorno de producción');
    console.log('   • Habilitar HTTPS');
    console.log('   • Configurar logs y monitoreo');
    console.log('='.repeat(80) + '\n');
  } else {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 MODO PRODUCCIÓN ACTIVO');
    console.log('='.repeat(80));
    console.log('✅ Configuraciones aplicadas:');
    console.log('   • Rate limiting: ' + rateLimitMax + ' requests per ' + (rateLimitWindow / 1000) + 's');
    console.log('   • CORS: ' + corsOptions.origin);
    console.log('   • Helmet: Habilitado');
    console.log('   • Logging: Combined format');
    console.log('='.repeat(80) + '\n');
  }
}); 