# 🏛️ Suite Arqueológica

Una plataforma integral para la gestión y colaboración en proyectos arqueológicos, conectando investigadores, instituciones, estudiantes y comunidades locales.

## 🌟 Características Principales

- **🔐 Sistema de Roles Avanzado** - 6 roles diferenciados (ADMIN, RESEARCHER, DIRECTOR, STUDENT, INSTITUTION, GUEST)
- **🗄️ Gestión de Sitios Arqueológicos** - Documentación completa de sitios y hallazgos
- **📊 Dashboards Especializados** - Interfaz personalizada por rol de usuario
- **🔧 APIs RESTful** - Backend robusto con autenticación y autorización
- **🌐 Frontend Moderno** - Interfaz web responsive con Next.js
- **📱 Frontend Móvil** - Aplicación móvil para trabajo de campo
- **🗄️ Base de Datos Supabase** - PostgreSQL con Row Level Security

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd suite_arqueologica
```

2. **Configurar variables de entorno**
```bash
# Backend
cp backend/env.example backend/.env
# Editar backend/.env con tus credenciales de Supabase

# Frontend
cp frontend-web/.env.example frontend-web/.env.local
# Editar frontend-web/.env.local con la URL del backend
```

3. **Instalar dependencias**
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend-web && npm install
```

4. **Configurar base de datos**
```bash
# Ejecutar migraciones
cd ../scripts/migration
node migrate-database.js
```

5. **Iniciar servicios**
```bash
# Backend (puerto 4000)
cd ../../backend && npm run dev

# Frontend (puerto 3000)
cd ../frontend-web && npm run dev
```

## 📁 Estructura del Proyecto

```
suite_arqueologica/
├── 📚 docs/                          # Documentación principal
│   ├── 📖 GUIA_PROYECTO.md           # Guía completa del proyecto
│   ├── 📊 ESTADO_SISTEMA.md          # Estado actual del sistema
│   ├── 🗄️ DATABASE.md               # Documentación de base de datos
│   ├── 🔧 API_DOCUMENTATION.md       # Documentación de APIs
│   ├── 👥 CREDENCIALES_ROLES.md      # Credenciales de prueba
│   └── 📋 PLAN_IMPLEMENTACION_ROLES.md
├── 🖥️ backend/                       # Backend Node.js/Express
│   ├── 📁 src/                       # Código fuente
│   │   ├── 📁 controllers/           # Controladores de API
│   │   ├── 📁 services/              # Lógica de negocio
│   │   ├── 📁 routes/                # Rutas de API
│   │   ├── 📁 middleware/            # Middleware personalizado
│   │   ├── 📁 types/                 # Tipos TypeScript
│   │   └── 📁 utils/                 # Utilidades
│   ├── 📁 scripts/                   # Scripts de backend
│   └── 📄 package.json
├── 🌐 frontend-web/                  # Frontend Next.js
│   ├── 📁 src/                       # Código fuente
│   │   ├── 📁 app/                   # Páginas y componentes
│   │   ├── 📁 components/            # Componentes reutilizables
│   │   ├── 📁 contexts/              # Contextos de React
│   │   ├── 📁 hooks/                 # Hooks personalizados
│   │   ├── 📁 lib/                   # Librerías y utilidades
│   │   ├── 📁 types/                 # Tipos TypeScript
│   │   └── 📁 utils/                 # Utilidades
│   └── 📄 package.json
├── 📱 frontend-mobile/               # Frontend móvil (futuro)
├── 🗄️ database/                     # Migraciones y esquemas
│   └── 📁 migrations/                # Scripts de migración SQL
├── 🔧 scripts/                       # Scripts de utilidad
│   ├── 📁 setup/                     # Scripts de configuración
│   ├── 📁 migration/                 # Scripts de migración
│   └── 📁 testing/                   # Scripts de prueba
├── 📸 assets/                        # Recursos multimedia
│   ├── 📁 screenshots/               # Capturas de pantalla
│   └── 📁 images/                    # Imágenes del proyecto
├── 📊 reports/                       # Reportes y análisis
│   ├── 📁 testing/                   # Reportes de pruebas
│   └── 📁 performance/               # Reportes de rendimiento
└── 📄 README.md                      # Este archivo
```

## 👥 Roles de Usuario

### 🔧 ADMIN
- Gestión completa del sistema
- Administración de usuarios e instituciones
- Reportes y métricas globales
- Configuración de políticas de seguridad

### 🔬 RESEARCHER
- Liderar proyectos de investigación
- Documentar sitios y hallazgos
- Gestionar excavaciones
- Generar reportes de investigación

### 👨‍💼 DIRECTOR
- Aprobar proyectos de investigación
- Supervisar investigadores y equipos
- Gestionar permisos y autorizaciones
- Coordinación institucional

### 🎓 STUDENT
- Participar en excavaciones
- Tomar notas de campo
- Acceder a recursos educativos
- Seguimiento de progreso académico

### 🏛️ INSTITUTION
- Gestionar proyectos institucionales
- Coordinar investigadores
- Generar reportes institucionales
- Cumplimiento normativo

### 👤 GUEST
- Explorar datos públicos
- Información general y educativa
- Sin acceso a funcionalidades privadas

## 🔧 APIs Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil

### Sitios Arqueológicos
- `GET /api/sites` - Listar sitios
- `POST /api/sites` - Crear sitio
- `GET /api/sites/:id` - Obtener sitio
- `PUT /api/sites/:id` - Actualizar sitio
- `DELETE /api/sites/:id` - Eliminar sitio

### Artefactos
- `GET /api/artifacts` - Listar artefactos
- `POST /api/artifacts` - Crear artefacto
- `GET /api/artifacts/:id` - Obtener artefacto
- `PUT /api/artifacts/:id` - Actualizar artefacto
- `DELETE /api/artifacts/:id` - Eliminar artefacto

### Excavaciones
- `GET /api/excavations` - Listar excavaciones
- `POST /api/excavations` - Crear excavación
- `GET /api/excavations/:id` - Obtener excavación
- `PUT /api/excavations/:id` - Actualizar excavación
- `DELETE /api/excavations/:id` - Eliminar excavación

## 🗄️ Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `archaeological_sites` - Sitios arqueológicos
- `artifacts` - Artefactos
- `excavations` - Excavaciones
- `documents` - Documentos
- `measurements` - Mediciones
- `site_permissions` - Permisos de sitio
- `notifications` - Notificaciones

### Características
- **Row Level Security (RLS)** habilitado
- Políticas de acceso por rol configuradas
- Índices de rendimiento optimizados
- Migraciones versionadas

## 🧪 Testing

### Scripts de Prueba
```bash
# Pruebas de migración
cd scripts/testing
node test-migration.sh

# Pruebas de API
cd scripts/testing
node test_projects_api.js

# Pruebas de configuración
cd scripts/setup
node check_mapping_tables.js
```

## 📚 Documentación

- **[📖 Guía del Proyecto](docs/GUIA_PROYECTO.md)** - Documentación completa
- **[📊 Estado del Sistema](docs/ESTADO_SISTEMA.md)** - Estado actual
- **[🗄️ Base de Datos](docs/DATABASE.md)** - Esquemas y migraciones
- **[🔧 APIs](docs/API_DOCUMENTATION.md)** - Documentación de endpoints
- **[👥 Credenciales](docs/CREDENCIALES_ROLES.md)** - Credenciales de prueba

## 🚀 Despliegue

### Desarrollo Local
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend-web && npm run dev
```

### Producción
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend-web && npm run build && npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Documentación:** [docs/GUIA_PROYECTO.md](docs/GUIA_PROYECTO.md)
- **Issues:** Crear un issue en GitHub
- **Email:** [tu-email@ejemplo.com]

## 🙏 Agradecimientos

- **INAH México** - Por su colaboración en el desarrollo
- **Comunidad Arqueológica** - Por sus valiosos aportes
- **Supabase** - Por la infraestructura de base de datos
- **Next.js** - Por el framework frontend

---

**Desarrollado con ❤️ para la comunidad arqueológica global** 