# 🌐 GUÍA PRUEBA VISUAL - SUITE ARQUEOLÓGICA

## 🎯 **INSTRUCCIONES PARA PRUEBA VISUAL**

### **✅ SERVICIOS FUNCIONANDO**
- **Frontend**: http://localhost:3000 ✅ **OPERATIVO**
- **Backend**: http://localhost:4000 ✅ **OPERATIVO**
- **Base de Datos**: Supabase ✅ **CONECTADA**
- **Tablas**: Todas creadas ✅ **COMPLETAS**
- **Usuario de Prueba**: Creado ✅ **LISTO**

---

## 🚀 **PASOS PARA LA PRUEBA VISUAL**

### **PASO 1: Abrir Navegador**
1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ve a la URL: **http://localhost:3000**

### **PASO 2: Verificar Página Principal**
Deberías ver:
- ✅ **Título**: "Suite Arqueológica - Sistema de Gestión Arqueológica Integrada"
- ✅ **Header**: Con botones "Iniciar sesión" y "Registrarse"
- ✅ **Contenido principal**: Plataforma Integral para la Gestión Arqueológica
- ✅ **Características**: Gestión de Sitios, Catálogo de Objetos, Gestión de Excavaciones
- ✅ **Estado del Sistema**: Backend API y Base de Datos conectadas

### **PASO 3: Probar Navegación**
1. **Haz clic en "Iniciar sesión"**
   - Debería llevarte a: http://localhost:3000/login
   - Verifica que la página de login se cargue correctamente

2. **Haz clic en "Registrarse"**
   - Debería llevarte a: http://localhost:3000/register
   - Verifica que la página de registro se cargue

3. **Prueba "Comenzar ahora"**
   - Debería llevarte al dashboard o página principal

### **PASO 4: Verificar Páginas Específicas**
Navega directamente a estas URLs para verificar que funcionan:

- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **Sitios**: http://localhost:3000/sites
- **Objetos**: http://localhost:3000/objects
- **Excavaciones**: http://localhost:3000/excavations

### **PASO 5: Probar Funcionalidad de Login**
1. Ve a http://localhost:3000/login
2. **Usa las credenciales de prueba**:
   - **Email**: `dr.perez@unam.mx`
   - **Password**: `test123456`
3. Haz clic en "Iniciar sesión"
4. Deberías ser redirigido al dashboard sin errores

---

## 📋 **ELEMENTOS A VERIFICAR**

### **✅ Diseño y UI**
- [ ] **Responsive**: La página se adapta a diferentes tamaños de pantalla
- [ ] **Colores**: Gradiente azul a índigo en el fondo
- [ ] **Tipografía**: Texto legible y bien estructurado
- [ ] **Botones**: Funcionales y con efectos hover
- [ ] **Iconos**: SVG icons en las características

### **✅ Funcionalidad**
- [ ] **Navegación**: Los enlaces funcionan correctamente
- [ ] **Formularios**: Los campos de entrada responden
- [ ] **Botones**: Los botones son clickeables
- [ ] **Carga**: Las páginas cargan sin errores
- [ ] **API**: Conexión al backend funciona
- [ ] **Login**: Autenticación funciona correctamente

### **✅ Contenido**
- [ ] **Títulos**: "Suite Arqueológica" visible
- [ ] **Descripción**: Texto sobre gestión arqueológica
- [ ] **Características**: 3 secciones principales
- [ ] **Estado del Sistema**: Indicadores de funcionamiento

---

## 🔍 **VERIFICACIONES TÉCNICAS**

### **✅ Console del Navegador**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. **ANTES**: Había errores de conexión al backend
4. **AHORA**: Debería estar limpio sin errores de conexión
5. Deberías ver logs de Next.js si hay

### **✅ Network**
1. Ve a la pestaña "Network"
2. Recarga la página
3. Verifica que todas las llamadas a `/api/` devuelven 200 OK
4. No debería haber errores 404 o 500
5. Las llamadas a `localhost:4000` deberían funcionar

### **✅ Performance**
1. Ve a la pestaña "Performance"
2. La página debería cargar en menos de 3 segundos
3. No debería haber bloqueos largos

---

## 🐛 **PROBLEMAS RESUELTOS**

### **✅ Error de Conexión al Backend**
- **Problema**: `ERR_CONNECTION_REFUSED` en puerto 4000
- **Causa**: Backend no estaba ejecutándose
- **Solución**: ✅ **RESUELTO** - Backend iniciado en puerto 4000

### **✅ Errores de Autenticación**
- **Problema**: Errores de `AxiosError` en login
- **Causa**: Backend no disponible
- **Solución**: ✅ **RESUELTO** - API funcionando

### **✅ Tablas Faltantes**
- **Problema**: Tablas `users`, `archaeological_sites`, etc. no existían
- **Causa**: Migraciones no aplicadas
- **Solución**: ✅ **RESUELTO** - Todas las tablas creadas

### **✅ Usuario de Prueba**
- **Problema**: No había usuarios para probar login
- **Causa**: Usuario no creado en tabla `users`
- **Solución**: ✅ **RESUELTO** - Usuario de prueba creado

---

## 📱 **PRUEBA EN DIFERENTES DISPOSITIVOS**

### **Desktop (Recomendado)**
- **Resolución**: 1920x1080 o similar
- **Navegador**: Chrome, Firefox, Edge

### **Tablet (Opcional)**
- **Resolución**: 768x1024
- **Verificar**: Diseño responsive

### **Mobile (Opcional)**
- **Resolución**: 375x667
- **Verificar**: Menú hamburguesa si existe

---

## 🐛 **PROBLEMAS COMUNES Y SOLUCIONES**

### **❌ Página no carga**
- **Solución**: Verificar que el frontend esté ejecutándose
- **Comando**: `curl http://localhost:3000`

### **❌ Errores en console**
- **Solución**: Verificar dependencias instaladas
- **Comando**: `cd frontend-web && npm install`

### **❌ Páginas 404**
- **Solución**: Verificar rutas en el código
- **Verificar**: Archivos en `src/app/`

### **❌ Estilos no cargan**
- **Solución**: Verificar Tailwind CSS
- **Comando**: `npm run build`

### **❌ Errores de conexión al backend**
- **Solución**: Iniciar el backend
- **Comando**: `cd backend && npm run dev`
- **Verificar**: `curl http://localhost:4000/api/health`

### **❌ Login no funciona**
- **Solución**: Usar credenciales correctas
- **Email**: `dr.perez@unam.mx`
- **Password**: `test123456`

---

## 📊 **CHECKLIST DE VERIFICACIÓN**

### **✅ Página Principal**
- [ ] Carga correctamente
- [ ] Título visible
- [ ] Botones funcionales
- [ ] Diseño responsive

### **✅ Navegación**
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard accesible
- [ ] Páginas específicas cargan

### **✅ Funcionalidad**
- [ ] Formularios responden
- [ ] Botones clickeables
- [ ] Enlaces funcionan
- [ ] Sin errores en console
- [ ] Conexión al backend funciona
- [ ] Login con credenciales de prueba funciona

### **✅ Rendimiento**
- [ ] Carga rápida (< 3s)
- [ ] Sin errores 404/500
- [ ] Recursos optimizados
- [ ] Responsive design

---

## 🎉 **RESULTADO ESPERADO**

### **✅ Prueba Exitosa**
Si todo funciona correctamente, deberías ver:
- Una página web moderna y profesional
- Navegación fluida entre secciones
- Diseño responsive y atractivo
- Funcionalidad completa sin errores
- **Console limpia sin errores de conexión**
- **Login exitoso con credenciales de prueba**

### **📝 Reporte**
Documenta cualquier problema encontrado:
- Screenshots de errores
- URLs que no funcionan
- Elementos visuales incorrectos
- Problemas de rendimiento

---

## 🚀 **¡LISTO PARA LA PRUEBA VISUAL!**

**URL de Acceso**: http://localhost:3000

**Estado de Servicios**:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:4000
- ✅ Base de Datos: Supabase
- ✅ Tablas: Todas creadas
- ✅ Usuario de Prueba: Creado

**Credenciales de Prueba**:
- **Email**: `dr.perez@unam.mx`
- **Password**: `test123456`

**¡Sigue los pasos anteriores y verifica que todo funcione correctamente!** 