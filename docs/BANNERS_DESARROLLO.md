# 🚨 Banners de Desarrollo - Suite Arqueológica

## 📋 Descripción

Los banners de desarrollo son componentes visuales que aparecen automáticamente en modo desarrollo para recordar tareas importantes que deben realizarse antes de desplegar a producción.

## 🎯 Propósito

- **Recordar configuraciones críticas** que deben ajustarse para producción
- **Prevenir errores comunes** de despliegue
- **Documentar checklist** de tareas pendientes
- **Mejorar la experiencia de desarrollo**

## 📍 Ubicaciones

### Frontend
- **Página principal** (`/`): Banner general del sistema
- **Página de registro** (`/register`): Banner específico para autenticación
- **Componente reutilizable**: `src/components/ui/DevelopmentBanner.tsx`

### Backend
- **Logs del servidor**: Aparece al iniciar el servidor en modo desarrollo
- **Archivo**: `src/index.ts`

## 🎨 Componente DevelopmentBanner

### Uso Básico
```tsx
import DevelopmentBanner from '../components/ui/DevelopmentBanner';

<DevelopmentBanner />
```

### Uso Personalizado
```tsx
<DevelopmentBanner 
  title="⚠️ Título Personalizado"
  className="mb-4"
>
  <p>Contenido personalizado...</p>
</DevelopmentBanner>
```

### Props
- `title?: string` - Título del banner (por defecto: "⚠️ Modo Desarrollo Activo")
- `children?: React.ReactNode` - Contenido personalizado
- `className?: string` - Clases CSS adicionales

## 📝 Recordatorios Incluidos

### 🔧 Configuración de Supabase
- Configurar correctamente el servicio de email
- Ajustar límites de rate limiting
- Verificar configuración de autenticación

### 🔒 Seguridad
- Revisar configuración de seguridad
- Configurar variables de entorno de producción
- Habilitar HTTPS

### 📊 Monitoreo
- Configurar logs y monitoreo
- Implementar métricas de rendimiento

## 🚀 Comportamiento

### Frontend
- **Solo visible en desarrollo**: `process.env.NODE_ENV === 'development'`
- **Automáticamente oculto** en producción
- **Responsive** y accesible

### Backend
- **Solo en logs de desarrollo**
- **Aparece al iniciar el servidor**
- **Formato claro y legible**

## 🛠️ Personalización

### Agregar Nuevos Recordatorios
1. Editar el componente `DevelopmentBanner.tsx`
2. Agregar elementos a la lista por defecto
3. Actualizar la documentación

### Crear Banners Específicos
```tsx
<DevelopmentBanner title="⚠️ Configuración de Base de Datos">
  <ul>
    <li>Configurar conexiones de producción</li>
    <li>Optimizar consultas</li>
    <li>Configurar backups</li>
  </ul>
</DevelopmentBanner>
```

## 📋 Checklist de Producción

### Antes de Desplegar
- [ ] Configurar servicio de email en Supabase
- [ ] Ajustar límites de rate limiting
- [ ] Verificar configuración de autenticación
- [ ] Revisar configuración de seguridad
- [ ] Configurar variables de entorno de producción
- [ ] Habilitar HTTPS
- [ ] Configurar logs y monitoreo
- [ ] Optimizar base de datos
- [ ] Configurar backups
- [ ] Probar funcionalidades críticas

### Después del Despliegue
- [ ] Verificar que los banners no aparezcan
- [ ] Comprobar funcionalidad de registro
- [ ] Verificar envío de emails
- [ ] Monitorear logs de errores
- [ ] Verificar rendimiento

## 🔍 Verificación

### Frontend
```bash
# Verificar que aparece en desarrollo
npm run dev
# Visitar http://localhost:3000

# Verificar que no aparece en producción
npm run build
npm run start
```

### Backend
```bash
# Verificar logs en desarrollo
npm run dev

# Verificar que no aparece en producción
NODE_ENV=production npm run dev
```

## 📚 Referencias

- [Documentación de Supabase](https://supabase.com/docs)
- [Configuración de Email](CONFIGURACION_EMAIL_GUIA.md)
- [Guía de Despliegue](GUIA_DESPLIEGUE.md)

---

**💡 Nota**: Estos banners están diseñados para mejorar la experiencia de desarrollo y prevenir errores comunes. Siempre revisa la lista completa antes de desplegar a producción. 