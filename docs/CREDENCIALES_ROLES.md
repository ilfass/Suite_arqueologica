# 🔐 Credenciales de Roles - Suite Arqueológica

## 📋 Roles Disponibles

El sistema Suite Arqueológica tiene los siguientes roles definidos:

- **ADMIN** - Administrador del sistema
- **DIRECTOR** - Director de proyectos arqueológicos
- **RESEARCHER** - Investigador
- **STUDENT** - Estudiante
- **INSTITUTION** - Institución
- **GUEST** - Invitado

## 🎯 Credenciales de Prueba

### 👑 ADMIN (Administrador)
```
Email: fa07fa@gmail.com
Contraseña: 3por39
Rol: ADMIN
Plan: PREMIUM
```
**Permisos:** Control total del sistema, estadísticas, gestión de usuarios, configuración global

---

### 🎯 DIRECTOR (Director)
```
Email: director@inah.gob.mx
Contraseña: director123
Rol: DIRECTOR
Plan: PROFESSIONAL
Institución: Instituto Nacional de Antropología e Historia
Especialidad: Dirección de Proyectos Arqueológicos
```
**Permisos:** Gestión de proyectos, supervisión de investigadores, aprobación de excavaciones, reportes ejecutivos

---

### 🔬 RESEARCHER (Investigador)
```
Email: dr.perez@unam.mx
Contraseña: investigador123
Rol: RESEARCHER
Plan: PROFESSIONAL
Institución: Universidad Nacional Autónoma de México
Especialidad: Arqueología Maya
```
**Permisos:** Acceso completo a herramientas de investigación, creación de sitios, artefactos y excavaciones

---

### 🎓 STUDENT (Estudiante)
```
Email: estudiante@universidad.edu
Contraseña: estudiante123
Rol: STUDENT
Plan: FREE
Institución: Universidad de Guadalajara
Especialidad: Arqueología
```
**Permisos:** Acceso limitado, visualización de datos públicos, participación en excavaciones

---

### 🏛️ INSTITUTION (Institución)
```
Email: admin@inah.gob.mx
Contraseña: institucion123
Rol: INSTITUTION
Plan: INSTITUTIONAL
Institución: Instituto Nacional de Antropología e Historia
```
**Permisos:** Gestión de investigadores de la institución, proyectos institucionales, reportes

---

### 👤 GUEST (Invitado)
```
Email: invitado@example.com
Contraseña: invitado123
Rol: GUEST
Plan: FREE
```
**Permisos:** Acceso básico, visualización de información pública, registro limitado

## 🚀 Cómo Probar

### 1. Acceso al Sistema
1. Ve a `http://localhost:3000` (o el puerto que esté usando)
2. Haz clic en "Iniciar Sesión"
3. Usa cualquiera de las credenciales anteriores

### 2. Navegación por Roles

#### ADMIN
- Dashboard administrativo con estadísticas
- Gestión de usuarios y instituciones
- Configuración del sistema
- Botón de cerrar sesión en el header

#### RESEARCHER
- Dashboard de investigador
- Crear y gestionar sitios arqueológicos
- Catalogar artefactos
- Gestionar excavaciones

#### STUDENT
- Dashboard de estudiante
- Acceso limitado a funcionalidades
- Participación en proyectos

#### INSTITUTION
- Dashboard institucional
- Gestión de investigadores
- Reportes institucionales

#### GUEST
- Acceso básico
- Visualización de información pública

## 📊 Planes de Suscripción

- **FREE**: Acceso básico, limitaciones en funcionalidades
- **PROFESSIONAL**: Acceso completo para investigadores
- **INSTITUTIONAL**: Acceso para instituciones con múltiples usuarios
- **PREMIUM**: Acceso administrativo completo

## 🔧 Notas Importantes

1. **Backend Demo**: El sistema usa un backend demo para pruebas
2. **Datos Simulados**: Las estadísticas y datos son simulados
3. **Persistencia**: Los datos se mantienen durante la sesión
4. **Navegación**: Cada rol tiene su propio dashboard y permisos

## 🛠️ Desarrollo

Para desarrollo local:
```bash
# Frontend
cd frontend-web && npm run dev

# Backend (si está funcionando)
cd backend && npm run dev
```

## 📝 Funcionalidades por Rol

### ADMIN
- ✅ Panel de administración completo
- ✅ Estadísticas del sistema
- ✅ Gestión de usuarios
- ✅ Configuración global
- ✅ Cerrar sesión

### RESEARCHER
- ✅ Dashboard de investigador
- ✅ Crear sitios arqueológicos
- ✅ Gestionar artefactos
- ✅ Gestionar excavaciones
- ✅ Perfil completo

### STUDENT
- ✅ Dashboard de estudiante
- ✅ Acceso limitado
- ✅ Visualización de datos

### INSTITUTION
- ✅ Dashboard institucional
- ✅ Gestión de investigadores
- ✅ Reportes

### GUEST
- ✅ Acceso básico
- ✅ Información pública 