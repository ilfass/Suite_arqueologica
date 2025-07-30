# Sistema de Registro Nuevo - Suite Arqueológica

## 📋 Resumen Ejecutivo

El nuevo sistema de registro de la Suite Arqueológica ha sido completamente rediseñado para incluir campos específicos para cada rol de usuario, proporcionando una experiencia de registro más completa y estructurada.

## 🎯 Objetivos del Nuevo Sistema

1. **Campos específicos por rol**: Cada tipo de usuario tiene campos relevantes a su función
2. **Validación robusta**: Validación tanto en frontend como backend
3. **Persistencia completa**: Todos los datos se guardan en la base de datos
4. **Experiencia de usuario mejorada**: Formularios dinámicos y responsivos
5. **Cumplimiento legal**: Términos y condiciones obligatorios

## 👥 Roles de Usuario

### 1. **INSTITUTION** (Institución)
- **Descripción**: Universidades, museos, centros de investigación
- **Campos específicos**:
  - Nombre de la institución
  - Dirección de la institución
  - Sitio web institucional
  - Unidad/Departamento/Área
  - Correo electrónico institucional
  - Correo alternativo (opcional)

### 2. **DIRECTOR** (Director)
- **Descripción**: Investigadores principales, directores de proyectos
- **Campos específicos**:
  - DNI/INE/Cédula/Pasaporte
  - Título máximo alcanzado
  - Disciplina principal
  - Institución de formación
  - Institución actual de pertenencia
  - Cargo actual/Posición
  - CV/Link a ORCID/CONICET/Academia.edu

### 3. **RESEARCHER** (Investigador)
- **Descripción**: Investigadores, tesistas, becarios
- **Campos específicos**:
  - DNI/INE/Cédula/Pasaporte
  - Carrera/Programa académico
  - Año en curso
  - Institución de formación
  - Rol (pasante, tesista, ayudante, becario)
  - Área de investigación (opcional)
  - Director asociado (opcional)

### 4. **STUDENT** (Estudiante)
- **Descripción**: Estudiantes de grado y posgrado
- **Campos específicos**:
  - DNI/INE/Cédula/Pasaporte
  - Título máximo alcanzado
  - Disciplina principal
  - Institución de formación
  - Institución actual de pertenencia
  - Cargo actual/Posición
  - CV/Link a ORCID/CONICET/Academia.edu

### 5. **GUEST** (Invitado)
- **Descripción**: Usuarios con acceso limitado
- **Campos específicos**: Ninguno (solo campos comunes)

## 📝 Campos Comunes

Todos los roles comparten los siguientes campos obligatorios:

- **Nombre** (firstName)
- **Apellido** (lastName)
- **País** (country)
- **Provincia** (province)
- **Ciudad** (city)
- **Correo electrónico** (email)
- **Contraseña** (password)
- **Confirmar contraseña** (confirmPassword)
- **Teléfono de contacto** (phone) - opcional
- **Cargo/Rol académico** (role)
- **Términos y condiciones** (termsAccepted) - obligatorio

## 🏗️ Arquitectura del Sistema

### Frontend (React/Next.js)

#### Componente Principal: `RegisterPage`
- **Ubicación**: `frontend-web/src/app/register/page.tsx`
- **Funcionalidades**:
  - Formulario dinámico según el rol seleccionado
  - Validación en tiempo real
  - Manejo de estados con TypeScript
  - Renderizado condicional de campos

#### Interfaces TypeScript
```typescript
interface BaseFormData {
  firstName: string;
  lastName: string;
  country: string;
  province: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'DIRECTOR' | 'RESEARCHER' | 'STUDENT' | 'INSTITUTION' | 'GUEST';
  termsAccepted: boolean;
}

interface InstitutionFormData extends BaseFormData {
  role: 'INSTITUTION';
  institutionName: string;
  institutionAddress: string;
  institutionWebsite: string;
  institutionDepartment: string;
  institutionEmail: string;
  institutionAlternativeEmail: string;
}

// ... interfaces similares para otros roles
```

### Backend (Node.js/Express)

#### Controlador: `authController.ts`
- **Ubicación**: `backend/src/controllers/authController.ts`
- **Funcionalidades**:
  - Validación de campos requeridos
  - Procesamiento de datos específicos por rol
  - Llamada al servicio de autenticación

#### Servicio: `authService.ts`
- **Ubicación**: `backend/src/services/authService.ts`
- **Funcionalidades**:
  - Registro en Supabase Auth
  - Creación de perfil en base de datos
  - Manejo de campos específicos por rol
  - Generación de token JWT

#### Validaciones: `auth.ts`
- **Ubicación**: `backend/src/routes/auth.ts`
- **Funcionalidades**:
  - Validación de campos obligatorios
  - Validación de formato de email
  - Validación de longitud de contraseña
  - Validación de roles permitidos

### Base de Datos (Supabase/PostgreSQL)

#### Tabla: `users`
- **Campos comunes**:
  - `id` (UUID, PK)
  - `email` (TEXT, UNIQUE)
  - `first_name` (TEXT)
  - `last_name` (TEXT)
  - `country` (TEXT)
  - `province` (TEXT)
  - `city` (TEXT)
  - `phone` (TEXT)
  - `role` (TEXT)
  - `terms_accepted` (BOOLEAN)
  - `terms_accepted_at` (TIMESTAMP)

#### Campos específicos por rol:

**INSTITUTION**:
- `institution_name` (TEXT)
- `institution_address` (TEXT)
- `institution_website` (TEXT)
- `institution_department` (TEXT)
- `institution_email` (TEXT)
- `institution_alternative_email` (TEXT)

**DIRECTOR**:
- `director_document_id` (TEXT)
- `director_highest_degree` (TEXT)
- `director_discipline` (TEXT)
- `director_formation_institution` (TEXT)
- `director_current_institution` (TEXT)
- `director_current_position` (TEXT)
- `director_cv_link` (TEXT)

**RESEARCHER**:
- `researcher_document_id` (TEXT)
- `researcher_career` (TEXT)
- `researcher_year` (TEXT)
- `researcher_formation_institution` (TEXT)
- `researcher_role` (TEXT)
- `researcher_area` (TEXT)
- `researcher_director_id` (UUID, FK)

**STUDENT**:
- `student_document_id` (TEXT)
- `student_highest_degree` (TEXT)
- `student_discipline` (TEXT)
- `student_formation_institution` (TEXT)
- `student_current_institution` (TEXT)
- `student_current_position` (TEXT)
- `student_cv_link` (TEXT)

## 🔄 Flujo de Registro

### 1. **Selección de Rol**
- Usuario selecciona su rol académico/institucional
- El formulario se actualiza dinámicamente

### 2. **Completado de Campos Comunes**
- Usuario completa información personal básica
- Validación en tiempo real

### 3. **Completado de Campos Específicos**
- Se muestran campos relevantes al rol seleccionado
- Validación específica por rol

### 4. **Aceptación de Términos**
- Checkbox obligatorio para términos y condiciones
- No se puede proceder sin aceptar

### 5. **Envío y Validación**
- Validación completa en frontend
- Envío al backend
- Validación adicional en backend

### 6. **Creación de Usuario**
- Registro en Supabase Auth
- Creación de perfil en base de datos
- Generación de token JWT

### 7. **Redirección**
- Usuario es redirigido al dashboard
- Token se almacena en localStorage

## 🧪 Testing

### Script de Pruebas
- **Ubicación**: `scripts/test_new_registration.js`
- **Funcionalidades**:
  - Prueba de registro para todos los roles
  - Verificación de campos específicos
  - Prueba de login
  - Prueba de obtención de perfil
  - Reporte de resultados

### Ejecución
```bash
node scripts/test_new_registration.js
```

## 📊 Migración de Datos

### Script de Migración
- **Ubicación**: `database/migrations/004_update_users_table_new_registration.sql`
- **Funcionalidades**:
  - Agregar nuevos campos a la tabla users
  - Migrar datos existentes
  - Crear índices para rendimiento
  - Agregar comentarios de documentación

### Ejecución
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver archivo: database/migrations/004_update_users_table_new_registration.sql
```

## 🔧 Configuración

### Variables de Entorno
```env
# Backend
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Dependencias
```json
// Frontend
{
  "react": "^18.0.0",
  "next": "^13.0.0",
  "axios": "^1.0.0"
}

// Backend
{
  "express": "^4.18.0",
  "express-validator": "^6.14.0",
  "@supabase/supabase-js": "^2.0.0",
  "jsonwebtoken": "^9.0.0"
}
```

## 🚀 Despliegue

### 1. **Actualizar Base de Datos**
```bash
# Ejecutar migración en Supabase
# Ver archivo: database/migrations/004_update_users_table_new_registration.sql
```

### 2. **Actualizar Backend**
```bash
cd backend
npm install
npm run build
npm start
```

### 3. **Actualizar Frontend**
```bash
cd frontend-web
npm install
npm run build
npm start
```

### 4. **Ejecutar Pruebas**
```bash
node scripts/test_new_registration.js
```

## 🔍 Monitoreo y Logs

### Logs del Backend
- Registro de usuarios exitosos
- Errores de validación
- Errores de base de datos
- Errores de autenticación

### Logs del Frontend
- Errores de validación
- Errores de red
- Estado del formulario

## 🔒 Seguridad

### Validaciones Implementadas
- **Frontend**: Validación en tiempo real
- **Backend**: Validación con express-validator
- **Base de datos**: Restricciones de tipo y longitud

### Medidas de Seguridad
- Contraseñas hasheadas (Supabase Auth)
- Tokens JWT con expiración
- Validación de roles permitidos
- Sanitización de datos de entrada

## 📈 Métricas y Analytics

### Métricas a Monitorear
- Tasa de registro exitoso por rol
- Tiempo de completado del formulario
- Campos con mayor tasa de error
- Distribución de usuarios por rol

## 🔄 Mantenimiento

### Tareas Regulares
- Revisar logs de errores
- Monitorear rendimiento de consultas
- Actualizar validaciones según necesidades
- Backup de base de datos

### Actualizaciones Futuras
- Nuevos roles de usuario
- Campos adicionales por rol
- Integración con sistemas externos
- Mejoras en UX/UI

## 📞 Soporte

### Contacto
- **Desarrollador**: Equipo de desarrollo
- **Documentación**: Este archivo
- **Issues**: Repositorio de GitHub

### Recursos Adicionales
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Express](https://expressjs.com/)

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Autor**: Equipo de desarrollo Suite Arqueológica 