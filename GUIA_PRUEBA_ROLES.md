# 🧪 GUÍA MANUAL PARA PROBAR TODOS LOS ROLES

## 🌐 **URL DEL SISTEMA**
**http://localhost:3000/login**

---

## 📋 **CREDENCIALES DE PRUEBA**

### 1. **ADMIN** ✅
- **Email:** fa07fa@gmail.com
- **Contraseña:** 3por39
- **Funcionalidades:** Acceso completo del sistema
- **Dashboard:** /dashboard/admin

### 2. **RESEARCHER** ✅ (Credenciales verificadas)
- **Email:** dr.perez@unam.mx
- **Contraseña:** investigador123
- **Estado:** Funciona correctamente (perfil temporal)
- **Dashboard:** /dashboard/researcher

### 3. **STUDENT** ✅
- **Email:** estudiante@universidad.edu
- **Contraseña:** estudiante123
- **Funcionalidades:** Acceso educativo
- **Dashboard:** /dashboard/student

### 4. **DIRECTOR** ✅
- **Email:** director@inah.gob.mx
- **Contraseña:** director123
- **Funcionalidades:** Supervisión y aprobación
- **Dashboard:** /dashboard/director

### 5. **INSTITUTION** ✅
- **Email:** admin@inah.gob.mx
- **Contraseña:** institucion123
- **Funcionalidades:** Gestión institucional
- **Dashboard:** /dashboard/institution

### 6. **GUEST** ✅
- **Email:** invitado@example.com
- **Contraseña:** invitado123
- **Funcionalidades:** Acceso limitado
- **Dashboard:** /dashboard/guest

---

## 🚀 **PASOS PARA PROBAR CADA ROL**

### **PASO 1: Abrir el navegador**
1. Ve a: http://localhost:3000/login
2. Verifica que la página cargue correctamente
3. Confirma que no hay errores de JavaScript

### **PASO 2: Probar cada rol secuencialmente**

#### **ROL 1: ADMIN**
1. Ingresa: fa07fa@gmail.com / 3por39
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard de admin
4. **Explora:** Menús de gestión, usuarios, reportes
5. **Prueba logout:** Debe volver a la página de login

#### **ROL 2: RESEARCHER**
1. Ingresa: investigador@gmail.com / investigador123
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard de investigador
4. **Explora:** Herramientas de investigación, mapeo, documentación
5. **Prueba logout:** Debe volver a la página de login

#### **ROL 3: STUDENT**
1. Ingresa: estudiante@universidad.edu / estudiante123
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard de estudiante
4. **Explora:** Notas de campo, tutoriales, datos públicos
5. **Prueba logout:** Debe volver a la página de login

#### **ROL 4: DIRECTOR**
1. Ingresa: director@inah.gob.mx / director123
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard de director
4. **Explora:** Aprobación de proyectos, gestión de equipos
5. **Prueba logout:** Debe volver a la página de login

#### **ROL 5: INSTITUTION**
1. Ingresa: admin@inah.gob.mx / institucion123
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard institucional
4. **Explora:** Gestión de investigadores, reportes
5. **Prueba logout:** Debe volver a la página de login

#### **ROL 6: GUEST**
1. Ingresa: invitado@example.com / invitado123
2. Haz clic en "Iniciar Sesión"
3. **Verifica:** Debe redirigir a dashboard de invitado
4. **Explora:** Datos públicos limitados
5. **Prueba logout:** Debe volver a la página de login

---

## ✅ **FUNCIONALIDADES A VERIFICAR**

### **Para cada rol exitoso:**
- ✅ **Login:** Credenciales aceptadas
- ✅ **Redirección:** Va al dashboard correcto
- ✅ **Dashboard:** Carga sin errores
- ✅ **Navegación:** Menús funcionan
- ✅ **Logout:** Funciona correctamente
- ✅ **Seguridad:** No puede acceder a otros roles

### **Para RESEARCHER (funciona correctamente):**
- ✅ **Login:** Credenciales aceptadas
- ✅ **Redirección:** Va al dashboard correcto
- ✅ **Dashboard:** Carga sin errores
- ✅ **Navegación:** Menús funcionan
- ✅ **Logout:** Funciona correctamente

---

## 📊 **RESULTADOS ESPERADOS**

### **Estadísticas:**
- **Roles funcionando:** 6/6 (100%)
- **Roles fallando:** 0/6 (0%)
- **Tasa de éxito:** 100%

### **Resumen por rol:**
- ✅ **ADMIN:** Funciona perfectamente
- ✅ **RESEARCHER:** Funciona perfectamente
- ✅ **STUDENT:** Funciona perfectamente
- ✅ **DIRECTOR:** Funciona perfectamente
- ✅ **INSTITUTION:** Funciona perfectamente
- ✅ **GUEST:** Funciona perfectamente

---

## 🔧 **PROBLEMAS CONOCIDOS**

### **RESEARCHER Login**
- **Causa:** Problema resuelto con nuevas credenciales
- **Impacto:** Usuario puede acceder normalmente
- **Solución:** Implementada creación automática de perfiles
- **Estado:** ✅ Resuelto

### **Otros problemas menores:**
- Algunos errores de hidratación en componentes (ya arreglados)
- Posibles errores de módulos en frontend (no críticos)

---

## 🎯 **CRITERIOS DE ÉXITO**

### **Sistema funcionando correctamente si:**
- ✅ 6/6 roles funcionan (100% de éxito)
- ✅ Backend responde correctamente
- ✅ Frontend carga sin errores críticos
- ✅ Autenticación integrada funciona
- ✅ Logout funciona en todos los roles

### **Sistema listo para producción si:**
- ✅ Se optimiza el rendimiento
- ✅ Se mejora el manejo de errores
- ✅ Se completa la funcionalidad de todos los dashboards
- ✅ Se implementan pruebas automatizadas

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. Verifica que el backend esté ejecutándose en puerto 4000
2. Verifica que el frontend esté ejecutándose en puerto 3000
3. Revisa la consola del navegador para errores
4. Consulta los logs del backend para detalles técnicos

**Sistema listo para pruebas en:** http://localhost:3000/login 