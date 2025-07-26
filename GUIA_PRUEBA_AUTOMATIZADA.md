# 🤖 GUÍA PRUEBA VISUAL AUTOMATIZADA - PUPPETEER

## 🎯 **PRUEBA VISUAL AUTOMATIZADA CON PUPPETEER**

### **✅ REQUISITOS**
- **Node.js**: Versión 18 o superior
- **Puppeteer**: Instalado automáticamente
- **Servicios**: Frontend y Backend funcionando

---

## 🚀 **EJECUTAR PRUEBA AUTOMATIZADA**

### **OPCIÓN 1: Comando NPM (Recomendado)**
```bash
npm run test:visual
```

### **OPCIÓN 2: Comando Directo**
```bash
node scripts/testing/run_visual_test.js
```

### **OPCIÓN 3: Solo Verificar Servicios**
```bash
npm run test:services
```

---

## 📋 **PRUEBAS INCLUIDAS**

### **1. Verificación de Servicios**
- ✅ Frontend (puerto 3000)
- ✅ Backend (puerto 4000)
- ✅ Conexión a base de datos

### **2. Pruebas Visuales**
- ✅ **Carga de página principal**
- ✅ **Botones de navegación**
- ✅ **Navegación a página de login**
- ✅ **Login con credenciales de prueba**
- ✅ **Acceso al dashboard**
- ✅ **Navegación a páginas específicas**
- ✅ **Diseño responsive**
- ✅ **Verificación de errores en consola**

### **3. Screenshots Automáticos**
- 📸 Página principal
- 📸 Botones de navegación
- 📸 Página de login
- 📸 Después del login
- 📸 Dashboard
- 📸 Páginas específicas (Sitios, Objetos, Excavaciones)
- 📸 Diseño responsive (Desktop, Tablet, Mobile)
- 📸 Errores (si ocurren)

---

## 🔧 **CONFIGURACIÓN**

### **Credenciales de Prueba**
```javascript
testUser: {
    email: 'dr.perez@unam.mx',
    password: 'test123456'
}
```

### **URLs Configuradas**
```javascript
baseUrl: 'http://localhost:3000',
backendUrl: 'http://localhost:4000'
```

### **Timeouts**
```javascript
timeout: 10000 // 10 segundos
```

---

## 📊 **RESULTADOS**

### **Formato de Salida**
```
==================================================
📊 RESULTADOS DE LA PRUEBA VISUAL AUTOMATIZADA
==================================================
✅ Pruebas pasadas: 8
❌ Pruebas fallidas: 0
📈 Total: 8

📋 Detalles de las pruebas:
✅ Carga de página principal
✅ Botones de navegación
✅ Navegación a página de login
✅ Login con credenciales de prueba
✅ Acceso al dashboard
✅ Navegación a páginas específicas
✅ Diseño responsive
✅ Verificar errores en consola

📸 Screenshots guardados en: scripts/testing/screenshots/

🎉 ¡TODAS LAS PRUEBAS PASARON!
```

---

## 📁 **ARCHIVOS GENERADOS**

### **Screenshots**
- **Ubicación**: `scripts/testing/screenshots/`
- **Formato**: PNG
- **Contenido**: Capturas de pantalla de cada prueba

### **Logs**
- **Consola**: Resultados detallados
- **Errores**: Capturados y reportados
- **Warnings**: Mostrados en consola

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: Servicios no funcionando**
```bash
# Verificar servicios manualmente
curl http://localhost:3000
curl http://localhost:4000/api/health

# Iniciar servicios
npm run dev:web
npm run dev:backend
```

### **Error: Puppeteer no puede conectarse**
```bash
# Verificar que no hay otros navegadores bloqueando
pkill chrome
pkill chromium

# Reinstalar Puppeteer
npm install puppeteer
```

### **Error: Timeout en pruebas**
```bash
# Aumentar timeout en el script
timeout: 15000 // 15 segundos
```

### **Error: Screenshots no se guardan**
```bash
# Verificar permisos de directorio
chmod 755 scripts/testing/screenshots/

# Crear directorio manualmente
mkdir -p scripts/testing/screenshots/
```

---

## 🔍 **VERIFICACIONES ESPECÍFICAS**

### **Frontend**
- ✅ Página principal carga correctamente
- ✅ Título "Suite Arqueológica" visible
- ✅ Botones de navegación funcionales
- ✅ Diseño responsive en diferentes tamaños

### **Backend**
- ✅ API responde en puerto 4000
- ✅ Endpoint de health check funciona
- ✅ Autenticación disponible

### **Base de Datos**
- ✅ Usuario de prueba existe
- ✅ Tablas creadas correctamente
- ✅ Conexión establecida

---

## 🎯 **CASOS DE USO**

### **Desarrollo**
```bash
# Ejecutar después de cambios importantes
npm run test:visual
```

### **CI/CD**
```bash
# Integrar en pipeline de CI/CD
npm run test:visual
```

### **QA**
```bash
# Verificación antes de release
npm run test:visual
```

---

## 📈 **MÉTRICAS**

### **Tiempo de Ejecución**
- **Total**: ~2-3 minutos
- **Por prueba**: ~10-20 segundos
- **Screenshots**: ~1 segundo cada uno

### **Cobertura**
- **Páginas**: 100% de las páginas principales
- **Funcionalidades**: Login, navegación, responsive
- **Dispositivos**: Desktop, tablet, mobile

---

## 🚀 **COMANDOS ÚTILES**

### **Ejecutar Prueba Completa**
```bash
npm run test:visual
```

### **Solo Verificar Servicios**
```bash
npm run test:services
```

### **Ejecutar Prueba Manual**
```bash
node scripts/testing/visual_test_automated.js
```

### **Verificar Servicios Manual**
```bash
node scripts/testing/check_services_before_test.js
```

---

## 🎉 **RESULTADO ESPERADO**

### **✅ Prueba Exitosa**
- Todas las pruebas pasan
- Screenshots generados correctamente
- Sin errores en consola
- Navegación fluida
- Diseño responsive funcionando

### **📊 Reporte Completo**
- Resumen de resultados
- Detalles de cada prueba
- Ubicación de screenshots
- Recomendaciones si hay fallos

---

## 💡 **RECOMENDACIONES**

1. **Ejecutar regularmente**: Después de cambios importantes
2. **Revisar screenshots**: Para verificar cambios visuales
3. **Monitorear logs**: Para detectar errores temprano
4. **Integrar en CI/CD**: Para automatización completa

**¡Tu Suite Arqueológica está lista para pruebas automatizadas!** 🤖 