# API Documentation - Suite Arqueológica

## 📋 Información General

- **Base URL**: `http://localhost:4000/api`
- **Versión**: 1.0.0
- **Formato de Respuesta**: JSON
- **Autenticación**: JWT Bearer Token

## 🔐 Autenticación

### Headers Requeridos
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Respuestas de Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Para errores de validación
}
```

## 📚 Endpoints

### 🔐 Autenticación

#### POST `/auth/register`
Registrar un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Contraseña123!",
  "fullName": "Nombre Completo",
  "role": "RESEARCHER"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "full_name": "Nombre Completo",
      "role": "RESEARCHER",
      "subscription_plan": "FREE"
    },
    "token": "jwt-token"
  }
}
```

#### POST `/auth/login`
Iniciar sesión.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Contraseña123!"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt-token"
  }
}
```

#### GET `/auth/me` (Protegido)
Obtener información del usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "usuario@example.com",
    "full_name": "Nombre Completo",
    "role": "RESEARCHER",
    "subscription_plan": "FREE"
  }
}
```

#### PUT `/auth/profile` (Protegido)
Actualizar perfil de usuario.

**Body:**
```json
{
  "fullName": "Nuevo Nombre",
  "phone": "+1234567890",
  "website": "https://example.com"
}
```

#### PUT `/auth/change-password` (Protegido)
Cambiar contraseña.

**Body:**
```json
{
  "currentPassword": "ContraseñaActual123!",
  "newPassword": "NuevaContraseña123!"
}
```

#### POST `/auth/request-reset`
Solicitar restablecimiento de contraseña.

**Body:**
```json
{
  "email": "usuario@example.com"
}
```

#### GET `/auth/verify-reset/:token`
Verificar token de restablecimiento.

### 🏛️ Sitios Arqueológicos

#### GET `/sites`
Listar sitios arqueológicos (público).

**Query Parameters:**
- `status`: active, inactive, archived
- `period`: período histórico
- `created_by`: ID del usuario creador

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Teotihuacán",
      "description": "Antigua ciudad mesoamericana",
      "location": {
        "latitude": 19.6915,
        "longitude": -98.8441,
        "address": "Teotihuacán, México"
      },
      "period": "Clásico",
      "status": "active",
      "created_by": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/sites/:id`
Obtener sitio por ID (público).

#### POST `/sites` (Protegido)
Crear nuevo sitio arqueológico.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

**Body:**
```json
{
  "name": "Nuevo Sitio",
  "description": "Descripción del sitio",
  "location": {
    "latitude": 19.4326,
    "longitude": -99.1332,
    "address": "Ciudad de México, México"
  },
  "period": "Clásico",
  "status": "active",
  "site_type": "Ciudad",
  "excavation_status": "En curso",
  "preservation_status": "Excelente"
}
```

#### PATCH `/sites/:id` (Protegido)
Actualizar sitio arqueológico.

**Permisos:** Propietario o COORDINATOR/INSTITUTION

#### DELETE `/sites/:id` (Protegido)
Eliminar sitio arqueológico.

**Roles permitidos:** COORDINATOR, INSTITUTION

### 🏺 Artefactos

#### GET `/artifacts`
Listar artefactos (público).

**Query Parameters:**
- `site_id`: ID del sitio
- `artifact_type`: tipo de artefacto
- `material`: material del artefacto

#### GET `/artifacts/:id`
Obtener artefacto por ID (público).

#### GET `/artifacts/site/:siteId`
Obtener artefactos por sitio (público).

#### POST `/artifacts` (Protegido)
Crear nuevo artefacto.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

**Body:**
```json
{
  "site_id": "uuid",
  "name": "Máscara de Jade",
  "description": "Máscara ceremonial",
  "artifact_type": "Máscara",
  "material": "Jade",
  "dimensions": {
    "length": 15,
    "width": 12,
    "height": 8
  },
  "condition": "Excelente",
  "discovery_date": "2024-01-01",
  "catalog_number": "TEO-001"
}
```

### ⛏️ Excavaciones

#### GET `/excavations`
Listar excavaciones (público).

**Query Parameters:**
- `site_id`: ID del sitio
- `status`: planned, in_progress, completed, suspended
- `team_leader`: ID del líder del equipo

#### GET `/excavations/:id`
Obtener excavación por ID (público).

#### GET `/excavations/site/:siteId`
Obtener excavaciones por sitio (público).

#### GET `/excavations/active/all`
Obtener excavaciones activas (público).

#### POST `/excavations` (Protegido)
Crear nueva excavación.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

**Body:**
```json
{
  "site_id": "uuid",
  "name": "Excavación Principal",
  "description": "Excavación del área central",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "status": "planned",
  "team_leader": "uuid",
  "team_members": ["uuid1", "uuid2"],
  "objectives": ["Documentar el sitio", "Recuperar artefactos"],
  "methodology": "Excavación estratigráfica"
}
```

#### PATCH `/excavations/:id` (Protegido)
Actualizar excavación.

**Permisos:** Propietario

#### PATCH `/excavations/:id/status` (Protegido)
Actualizar estado de excavación.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

**Body:**
```json
{
  "status": "in_progress"
}
```

#### POST `/excavations/:id/team/add` (Protegido)
Agregar miembro al equipo.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

**Body:**
```json
{
  "memberId": "uuid"
}
```

#### DELETE `/excavations/:id/team/:memberId` (Protegido)
Remover miembro del equipo.

**Roles permitidos:** RESEARCHER, COORDINATOR, INSTITUTION

#### DELETE `/excavations/:id` (Protegido)
Eliminar excavación.

**Roles permitidos:** COORDINATOR, INSTITUTION

### 📊 Utilidades

#### GET `/health`
Health check del servidor.

**Respuesta:**
```json
{
  "success": true,
  "message": "Suite Arqueológica API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

#### GET `/`
Información de la API.

## 🔐 Roles y Permisos

### Roles de Usuario
- **GUEST**: Acceso de solo lectura
- **STUDENT**: Acceso básico, puede crear sitios
- **RESEARCHER**: Acceso completo, puede crear y editar
- **COORDINATOR**: Acceso administrativo, puede eliminar
- **INSTITUTION**: Acceso institucional completo

### Planes de Suscripción
- **FREE**: Funcionalidades básicas
- **PROFESSIONAL**: Funcionalidades avanzadas
- **INSTITUTIONAL**: Funcionalidades completas

## 🚨 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## 📝 Ejemplos de Uso

### Ejemplo Completo: Crear Sitio y Artefacto

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    password: 'Contraseña123!'
  })
});

const { token } = await loginResponse.json();

// 2. Crear sitio
const siteResponse = await fetch('/api/sites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Nuevo Sitio Arqueológico',
    description: 'Descripción del sitio',
    location: {
      latitude: 19.4326,
      longitude: -99.1332,
      address: 'Ciudad de México, México'
    },
    period: 'Clásico',
    status: 'active'
  })
});

const { data: site } = await siteResponse.json();

// 3. Crear artefacto
const artifactResponse = await fetch('/api/artifacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    site_id: site.id,
    name: 'Artefacto de Prueba',
    artifact_type: 'Cerámica',
    material: 'Arcilla'
  })
});
```

## 🛠️ Testing

### Scripts Disponibles

```bash
# Probar base de datos
npm run test-db

# Probar autenticación
npm run test-auth

# Inicializar base de datos
npm run init-db
```

### Variables de Entorno

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

## 📞 Soporte

Para problemas o preguntas sobre la API:
1. Revisar los logs del servidor
2. Verificar la configuración de Supabase
3. Ejecutar los scripts de prueba
4. Consultar la documentación de Supabase 