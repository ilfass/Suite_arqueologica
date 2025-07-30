# 🏗️ Suite Arqueológica - Arquitectura de Microservicios

## 📋 Resumen

La Suite Arqueológica ha sido reestructurada hacia una arquitectura modular basada en microservicios desacoplados, manteniendo la compatibilidad con la guía del proyecto existente.

## 🎯 Nueva Arquitectura

### Estructura de Microservicios

```
suite_arqueologica/
├── 📦 apps/                          # Microservicios principales
│   ├── 🔐 auth-service/              # Autenticación y usuarios
│   ├── 🏛️ institution-service/        # Gestión de instituciones
│   ├── 📊 context-service/           # Gestión de contextos (proyectos, áreas, sitios)
│   ├── 👥 user-management-service/   # Gestión de usuarios y relaciones
│   ├── 🔔 notification-service/      # Notificaciones y solicitudes
│   ├── 📱 public-service/            # Contenido público y visualización
│   └── ⚙️ admin-service/             # Panel de administración
├── 🌐 gateway/                       # API Gateway central
├── 🎨 frontend-web/                  # Frontend unificado (Next.js)
├── 🔧 shared/                        # Código compartido
│   ├── types/                        # Tipos TypeScript compartidos
│   ├── utils/                        # Utilidades compartidas
│   └── constants/                    # Constantes compartidas
└── 📚 docs/                          # Documentación
```

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
# Instalar dependencias del Auth Service
cd apps/auth-service && npm install

# Instalar dependencias del API Gateway
cd ../../gateway && npm install

# Volver al directorio raíz
cd ..
```

### 2. Configurar Variables de Entorno

Copia las variables de entorno necesarias:

```bash
# Auth Service
cp apps/auth-service/.env.example apps/auth-service/.env

# API Gateway
cp gateway/.env.example gateway/.env
```

### 3. Iniciar Servicios

```bash
# Opción 1: Iniciar todos los servicios automáticamente
node scripts/start_microservices.js

# Opción 2: Iniciar servicios manualmente
# Terminal 1: Auth Service
cd apps/auth-service && npm run dev

# Terminal 2: API Gateway
cd gateway && npm run dev

# Terminal 3: Frontend (opcional)
cd frontend-web && npm run dev
```

### 4. Probar la Arquitectura

```bash
# Probar microservicios
node scripts/test_microservices.js
```

## 🔐 Microservicios Implementados

### Auth Service (Puerto 4001)

**Responsabilidades:**
- Autenticación y autorización
- Gestión de sesiones
- Registro y login con roles
- Validación de tokens JWT
- Integración con Supabase Auth

**Endpoints:**
```
POST   /auth/register              # Registro con rol
POST   /auth/login                 # Login
POST   /auth/logout                # Logout
POST   /auth/refresh               # Refresh token
GET    /auth/profile               # Perfil del usuario
PUT    /auth/profile               # Actualizar perfil
POST   /auth/verify-token          # Verificar token
```

### API Gateway (Puerto 4000)

**Responsabilidades:**
- Enrutamiento de requests
- Autenticación centralizada
- Rate limiting
- Logging centralizado
- CORS management
- Load balancing

**Endpoints:**
```
GET    /health                     # Health check
GET    /                           # Info del gateway
/auth/*                           # Proxy a Auth Service
/contexts/*                       # Proxy a Context Service
/users/*                          # Proxy a User Management Service
/institutions/*                   # Proxy a Institution Service
/notifications/*                  # Proxy a Notification Service
/public/*                         # Proxy a Public Service
/admin/*                          # Proxy a Admin Service
```

## 🔧 Configuración

### Variables de Entorno

#### Auth Service (`apps/auth-service/.env`)
```bash
PORT=4001
NODE_ENV=development
SUPABASE_URL=https://avpaiyyjixtdopbciedr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
```

#### API Gateway (`gateway/.env`)
```bash
PORT=4000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:4001
CONTEXT_SERVICE_URL=http://localhost:4002
USER_MANAGEMENT_SERVICE_URL=http://localhost:4003
INSTITUTION_SERVICE_URL=http://localhost:4004
NOTIFICATION_SERVICE_URL=http://localhost:4005
PUBLIC_SERVICE_URL=http://localhost:4006
ADMIN_SERVICE_URL=http://localhost:4007
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## 🧪 Testing

### Scripts de Prueba

```bash
# Probar microservicios
node scripts/test_microservices.js

# Probar login específico
node scripts/testing/test_login_final.js
```

### Health Checks

```bash
# API Gateway
curl http://localhost:4000/health

# Auth Service
curl http://localhost:4001/health
```

## 📊 Monitoreo

### Logs

Los servicios generan logs estructurados con timestamps y niveles:

```bash
# Ver logs del Auth Service
cd apps/auth-service && npm run dev

# Ver logs del API Gateway
cd gateway && npm run dev
```

### Métricas

- **Rate Limiting:** 100 requests por 15 minutos por IP
- **Health Checks:** Disponibles en `/health` de cada servicio
- **Error Handling:** Centralizado en el API Gateway

## 🔄 Compatibilidad

### Mantenido Compatible
- ✅ Variables de entorno actuales
- ✅ Credenciales de prueba
- ✅ Endpoints principales
- ✅ Roles y permisos
- ✅ Base de datos Supabase
- ✅ Documentación existente

### Mejorado
- 🔄 Estructura modular
- 🔄 Separación de responsabilidades
- 🔄 Escalabilidad
- 🔄 Mantenibilidad
- 🔄 Testing automatizado

## 🚀 Próximos Pasos

### Fase 1: Completar Microservicios Core
- [ ] Context Service (proyectos, áreas, sitios)
- [ ] User Management Service (perfiles, relaciones)
- [ ] Institution Service (gestión institucional)

### Fase 2: Servicios Adicionales
- [ ] Notification Service (notificaciones en tiempo real)
- [ ] Public Service (contenido público)
- [ ] Admin Service (panel de administración)

### Fase 3: Frontend y Testing
- [ ] Adaptar frontend para nueva arquitectura
- [ ] Implementar tests automatizados
- [ ] Configurar CI/CD

### Fase 4: Despliegue
- [ ] Configurar producción
- [ ] Monitoreo y logging
- [ ] Optimización de performance

## 🛠️ Comandos Útiles

```bash
# Iniciar todos los servicios
node scripts/start_microservices.js

# Probar microservicios
node scripts/test_microservices.js

# Verificar servicios
curl http://localhost:4000/health
curl http://localhost:4001/health

# Ver logs en tiempo real
tail -f apps/auth-service/logs/app.log
tail -f gateway/logs/app.log
```

## 📚 Documentación

- [Guía del Proyecto](docs/GUIA_PROYECTO.md) - Documentación completa
- [Plan de Reestructuración](docs/PLAN_REESTRUCTURACION.md) - Detalles técnicos
- [Testing](scripts/testing/) - Scripts de prueba

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡La nueva arquitectura de microservicios está lista para ser probada!** 🎉 