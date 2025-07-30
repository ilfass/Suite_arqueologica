# 🏗️ PLAN DE REESTRUCTURACIÓN: Arquitectura Modular/Microservicios

## 📋 Objetivo
Transformar la Suite Arqueológica de una arquitectura monolítica a una arquitectura modular basada en microservicios desacoplados, manteniendo la compatibilidad con la guía del proyecto existente.

---

## 🎯 Arquitectura Objetivo

### Estructura Modular Propuesta

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
├── 📱 frontend-mobile/               # Frontend móvil (React Native)
├── 🔧 shared/                        # Código compartido
│   ├── types/                        # Tipos TypeScript compartidos
│   ├── utils/                        # Utilidades compartidas
│   └── constants/                    # Constantes compartidas
├── 🗄️ database/                      # Migraciones y esquemas
├── 🧪 tests/                         # Tests automatizados
├── 📚 docs/                          # Documentación
└── 🐳 docker/                        # Configuración Docker
```

---

## 🔐 Módulo: Auth Service

### Responsabilidades
- Autenticación y autorización
- Gestión de sesiones
- Registro y login con roles
- Validación de tokens JWT
- Integración con Supabase Auth

### Endpoints
```
POST   /auth/register              # Registro con rol
POST   /auth/login                 # Login
POST   /auth/logout                # Logout
POST   /auth/refresh               # Refresh token
GET    /auth/profile               # Perfil del usuario
PUT    /auth/profile               # Actualizar perfil
POST   /auth/verify-token          # Verificar token
```

### Tecnologías
- Node.js + Express
- JWT para tokens
- Supabase Auth
- bcrypt para hashing
- Zod para validación

---

## 🏛️ Módulo: Institution Service

### Responsabilidades
- Gestión de instituciones
- Aprobación de usuarios
- Estadísticas institucionales
- Gestión de planes premium/gratuitos
- Reportes institucionales

### Endpoints
```
GET    /institutions               # Listar instituciones
POST   /institutions               # Crear institución
GET    /institutions/:id           # Obtener institución
PUT    /institutions/:id           # Actualizar institución
GET    /institutions/:id/members   # Miembros de la institución
POST   /institutions/:id/approve   # Aprobar usuario
GET    /institutions/:id/stats     # Estadísticas
```

### Tecnologías
- Node.js + Express
- PostgreSQL (Supabase)
- Prisma ORM
- Zod para validación

---

## 📊 Módulo: Context Service

### Responsabilidades
- Gestión de proyectos
- Gestión de áreas
- Gestión de sitios arqueológicos
- Relaciones jerárquicas
- Contextos de trabajo

### Endpoints
```
# Proyectos
GET    /contexts/projects          # Listar proyectos
POST   /contexts/projects          # Crear proyecto
GET    /contexts/projects/:id      # Obtener proyecto
PUT    /contexts/projects/:id      # Actualizar proyecto

# Áreas
GET    /contexts/areas             # Listar áreas
POST   /contexts/areas             # Crear área
GET    /contexts/areas/:id         # Obtener área
PUT    /contexts/areas/:id         # Actualizar área

# Sitios
GET    /contexts/sites             # Listar sitios
POST   /contexts/sites             # Crear sitio
GET    /contexts/sites/:id         # Obtener sitio
PUT    /contexts/sites/:id         # Actualizar sitio
```

### Tecnologías
- Node.js + Express
- PostgreSQL (Supabase)
- PostGIS para datos geográficos
- Prisma ORM

---

## 👥 Módulo: User Management Service

### Responsabilidades
- Gestión de perfiles de usuario
- Relaciones entre usuarios
- Solicitudes de conexión
- Gestión de equipos
- Seguimiento de usuarios

### Endpoints
```
GET    /users                      # Listar usuarios
GET    /users/:id                  # Obtener usuario
PUT    /users/:id                  # Actualizar usuario
POST   /users/:id/connect          # Solicitar conexión
PUT    /users/:id/connect          # Aceptar/rechazar conexión
GET    /users/:id/team             # Equipo del usuario
GET    /users/:id/followers        # Seguidores
GET    /users/:id/following        # Siguiendo
```

### Tecnologías
- Node.js + Express
- PostgreSQL (Supabase)
- Prisma ORM
- WebSockets para notificaciones en tiempo real

---

## 🔔 Módulo: Notification Service

### Responsabilidades
- Notificaciones en tiempo real
- Solicitudes de conexión
- Alertas del sistema
- Gestión de preferencias
- Historial de notificaciones

### Endpoints
```
GET    /notifications              # Listar notificaciones
POST   /notifications              # Crear notificación
PUT    /notifications/:id/read     # Marcar como leída
DELETE /notifications/:id          # Eliminar notificación
GET    /notifications/preferences  # Preferencias
PUT    /notifications/preferences  # Actualizar preferencias
```

### Tecnologías
- Node.js + Express
- WebSockets (Socket.io)
- Redis para cache
- PostgreSQL (Supabase)

---

## 📱 Módulo: Public Service

### Responsabilidades
- Contenido público
- Perfiles públicos de usuarios
- Mapas con filtros
- Sistema de seguimiento
- Acceso para invitados

### Endpoints
```
GET    /public/profiles            # Perfiles públicos
GET    /public/profiles/:id        # Perfil público específico
GET    /public/maps                # Mapas públicos
GET    /public/sites               # Sitios públicos
GET    /public/artifacts           # Artefactos públicos
POST   /public/follow/:id          # Seguir usuario
DELETE /public/follow/:id          # Dejar de seguir
```

### Tecnologías
- Node.js + Express
- PostgreSQL (Supabase)
- Leaflet para mapas
- Redis para cache

---

## ⚙️ Módulo: Admin Service

### Responsabilidades
- Panel de administración
- Estadísticas globales
- Validación de registros
- Configuración del sistema
- Monitoreo de tráfico

### Endpoints
```
GET    /admin/stats                # Estadísticas globales
GET    /admin/users                # Gestión de usuarios
PUT    /admin/users/:id/validate   # Validar usuario
GET    /admin/system/config        # Configuración del sistema
PUT    /admin/system/config        # Actualizar configuración
GET    /admin/monitoring           # Monitoreo
```

### Tecnologías
- Node.js + Express
- PostgreSQL (Supabase)
- Redis para cache
- Prometheus para métricas

---

## 🌐 API Gateway

### Responsabilidades
- Enrutamiento de requests
- Autenticación centralizada
- Rate limiting
- Logging centralizado
- CORS management
- Load balancing

### Tecnologías
- Node.js + Express
- Redis para rate limiting
- JWT para autenticación
- Morgan para logging

---

## 🔧 Código Compartido (Shared)

### Estructura
```
shared/
├── types/
│   ├── auth.ts                    # Tipos de autenticación
│   ├── user.ts                    # Tipos de usuario
│   ├── context.ts                 # Tipos de contexto
│   ├── institution.ts             # Tipos de institución
│   └── notification.ts            # Tipos de notificación
├── utils/
│   ├── validation.ts              # Validaciones compartidas
│   ├── auth.ts                    # Utilidades de auth
│   ├── database.ts                # Utilidades de BD
│   └── api.ts                     # Utilidades de API
└── constants/
    ├── roles.ts                   # Roles del sistema
    ├── permissions.ts             # Permisos
    └── endpoints.ts               # Endpoints
```

---

## 🗄️ Base de Datos

### Esquemas por Microservicio
- `auth_schema` → Auth Service
- `institution_schema` → Institution Service
- `context_schema` → Context Service
- `user_schema` → User Management Service
- `notification_schema` → Notification Service
- `public_schema` → Public Service
- `admin_schema` → Admin Service

### Tecnologías
- PostgreSQL (Supabase)
- Prisma ORM
- PostGIS para datos geográficos
- Redis para cache

---

## 🐳 Dockerización

### Estructura
```
docker/
├── docker-compose.yml             # Orquestación completa
├── docker-compose.dev.yml         # Desarrollo
├── docker-compose.prod.yml        # Producción
└── services/
    ├── auth-service/
    ├── institution-service/
    ├── context-service/
    ├── user-management-service/
    ├── notification-service/
    ├── public-service/
    ├── admin-service/
    └── gateway/
```

---

## 📋 Plan de Migración

### Fase 1: Preparación (Semana 1)
- [ ] Crear nueva estructura de carpetas
- [ ] Configurar Docker y docker-compose
- [ ] Migrar tipos compartidos
- [ ] Configurar API Gateway básico

### Fase 2: Microservicios Core (Semana 2-3)
- [ ] Implementar Auth Service
- [ ] Implementar Context Service
- [ ] Implementar User Management Service
- [ ] Configurar comunicación entre servicios

### Fase 3: Servicios Adicionales (Semana 4)
- [ ] Implementar Institution Service
- [ ] Implementar Notification Service
- [ ] Implementar Public Service
- [ ] Implementar Admin Service

### Fase 4: Frontend y Testing (Semana 5)
- [ ] Adaptar frontend para nueva arquitectura
- [ ] Implementar tests automatizados
- [ ] Configurar CI/CD
- [ ] Documentación final

### Fase 5: Despliegue (Semana 6)
- [ ] Configurar producción
- [ ] Monitoreo y logging
- [ ] Optimización de performance
- [ ] Rollout gradual

---

## 🔄 Compatibilidad con Guía Existente

### Mantener Compatible
- ✅ Variables de entorno actuales
- ✅ Credenciales de prueba
- ✅ Endpoints principales
- ✅ Roles y permisos
- ✅ Base de datos Supabase
- ✅ Documentación existente

### Mejorar
- 🔄 Estructura modular
- 🔄 Separación de responsabilidades
- 🔄 Escalabilidad
- 🔄 Mantenibilidad
- 🔄 Testing automatizado

---

## 📊 Beneficios de la Nueva Arquitectura

### Escalabilidad
- Servicios independientes pueden escalar por separado
- Load balancing por servicio
- Optimización específica por módulo

### Mantenibilidad
- Código más organizado y modular
- Responsabilidades claras
- Testing más específico

### Flexibilidad
- Desarrollo independiente por equipos
- Tecnologías específicas por servicio
- Despliegue independiente

### Performance
- Cache específico por servicio
- Optimización por caso de uso
- Monitoreo granular

---

## 🚀 Próximos Pasos

1. **Crear estructura base** con Docker
2. **Migrar Auth Service** como primer microservicio
3. **Configurar API Gateway** para enrutamiento
4. **Adaptar frontend** para nueva arquitectura
5. **Implementar tests** automatizados
6. **Documentar** cambios y nuevas funcionalidades

---

**Nota:** Este plan mantiene la compatibilidad con la guía del proyecto existente mientras evoluciona hacia una arquitectura más robusta y escalable. 