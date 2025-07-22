# Configuración de Base de Datos - Suite Arqueológica

## 📋 Requisitos Previos

1. **Cuenta de Supabase**: Crear una cuenta en [supabase.com](https://supabase.com)
2. **Proyecto Supabase**: Crear un nuevo proyecto
3. **Node.js**: Versión 18 o superior

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno

Copiar el archivo de ejemplo y configurar las variables:

```bash
cp env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 2. Ejecutar el Esquema de Base de Datos

1. Ir al **SQL Editor** en tu proyecto de Supabase
2. Copiar y ejecutar el contenido de `database/schema.sql`
3. Esto creará todas las tablas, índices y políticas de seguridad

### 3. Inicializar con Datos de Ejemplo

```bash
npm run init-db
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### `users`
- Extensión de `auth.users` de Supabase
- Perfiles de usuarios con roles y planes de suscripción
- Información profesional y académica

#### `archaeological_sites`
- Sitios arqueológicos con ubicación geográfica
- Información de excavación y preservación
- Relacionado con usuarios creadores

#### `artifacts`
- Hallazgos arqueológicos
- Información detallada de materiales y dimensiones
- Relacionado con sitios arqueológicos

#### `excavations`
- Proyectos de excavación
- Equipos de trabajo y metodologías
- Relacionado con sitios arqueológicos

#### `documents`
- Documentos, fotos, dibujos y mapas
- Relacionado con sitios, excavaciones o artefactos

#### `measurements`
- Mediciones y análisis técnicos
- Diferentes tipos de mediciones (distancia, área, volumen, etc.)

### Relaciones

```
users (1) ←→ (N) archaeological_sites
archaeological_sites (1) ←→ (N) artifacts
archaeological_sites (1) ←→ (N) excavations
archaeological_sites (1) ←→ (N) documents
archaeological_sites (1) ←→ (N) measurements
```

## 🔐 Seguridad (RLS - Row Level Security)

### Políticas Implementadas

- **Usuarios**: Solo pueden ver y editar su propio perfil
- **Sitios Arqueológicos**: 
  - Ver: Propietarios y usuarios con permisos
  - Crear: Usuarios autenticados
  - Editar: Propietarios y administradores
  - Eliminar: Solo propietarios

### Permisos por Sitio

La tabla `site_permissions` permite:
- `view`: Solo lectura
- `edit`: Lectura y escritura
- `admin`: Control total

## 🗺️ Ubicaciones Geográficas

### Formato PostGIS

Las ubicaciones se almacenan en formato PostGIS:
```sql
POINT(longitude latitude)
```

### Ejemplo de Uso

```javascript
// Crear sitio con ubicación
const site = await ArchaeologicalSiteService.createSite({
  name: 'Nuevo Sitio',
  location: {
    latitude: 19.6915,
    longitude: -98.8441,
    address: 'Teotihuacán, México'
  }
});
```

## 📈 Índices de Rendimiento

### Índices Espaciales
- `archaeological_sites.location` (GIST)
- `artifacts.discovery_location` (GIST)
- `measurements.location` (GIST)

### Índices de Consulta
- Estado de sitios y excavaciones
- Tipos de artefactos y documentos
- Usuarios creadores

## 🔄 Triggers Automáticos

### Actualización de Timestamps
- `updated_at` se actualiza automáticamente en todas las tablas principales
- Función: `update_updated_at_column()`

## 🧪 Datos de Prueba

El script de inicialización incluye:

### Usuarios de Ejemplo
- **Administrador**: `admin@suite-arqueologica.com`
- **Investigador**: `investigador@example.com`
- **Estudiante**: `estudiante@example.com`

### Sitios de Ejemplo
- **Teotihuacán**: Ciudad mesoamericana
- **Machu Picchu**: Ciudad inca
- **Chichen Itza**: Centro ceremonial maya

### Artefactos de Ejemplo
- Máscaras de jade
- Vasijas cerámicas
- Instrumentos astronómicos

## 🛠️ Comandos Útiles

```bash
# Inicializar base de datos
npm run init-db

# Ejecutar tests
npm test

# Desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔍 Consultas de Ejemplo

### Sitios por Ubicación
```sql
SELECT * FROM archaeological_sites 
WHERE ST_DWithin(
  location::geography, 
  ST_Point(-98.8441, 19.6915)::geography, 
  10000
);
```

### Artefactos por Sitio
```sql
SELECT a.*, s.name as site_name 
FROM artifacts a 
JOIN archaeological_sites s ON a.site_id = s.id 
WHERE s.name = 'Teotihuacán';
```

### Estadísticas por Usuario
```sql
SELECT 
  u.full_name,
  COUNT(s.id) as sites_created,
  COUNT(a.id) as artifacts_created
FROM users u
LEFT JOIN archaeological_sites s ON u.id = s.created_by
LEFT JOIN artifacts a ON u.id = a.created_by
GROUP BY u.id, u.full_name;
```

## 🚨 Solución de Problemas

### Error de Conexión
- Verificar credenciales de Supabase
- Comprobar que el proyecto esté activo

### Error de Permisos
- Verificar que RLS esté habilitado
- Comprobar políticas de seguridad

### Error de Esquema
- Ejecutar `schema.sql` completo
- Verificar extensiones (uuid-ossp, postgis)

## 📞 Soporte

Para problemas específicos de la base de datos:
1. Revisar logs de Supabase
2. Verificar políticas RLS
3. Comprobar índices y triggers 