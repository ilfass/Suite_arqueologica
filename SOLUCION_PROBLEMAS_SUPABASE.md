# 🔧 SOLUCIÓN A PROBLEMAS DE SUPABASE

## 📋 **PROBLEMAS IDENTIFICADOS**

### 1. **Restricción Temporal de Envío de Emails**
- **Causa**: Alta tasa de emails rebotados
- **Impacto**: No se pueden enviar emails transaccionales
- **Solución**: Configurar proveedor SMTP personalizado

### 2. **Tabla `spatial_ref_sys` sin RLS**
- **Causa**: Tabla de PostGIS sin Row Level Security habilitado
- **Impacto**: Problema de seguridad detectado por Supabase
- **Solución**: Habilitar RLS y crear políticas de seguridad

---

## 🚀 **SOLUCIÓN PASO A PASO**

### **Opción 1: Script SQL Directo (Recomendado)**

1. **Ve a Supabase Dashboard**
   - Accede a tu proyecto: `avpaiyyjixtdopbciedr`
   - Navega a **SQL Editor**

2. **Ejecuta el Script SQL**
   - Copia y pega el contenido de `scripts/utilities/fix_supabase_issues.sql`
   - Haz clic en **Run**

3. **Verifica la Ejecución**
   - Revisa los mensajes de notificación
   - Confirma que no hay errores

### **Opción 2: Script Node.js**

```bash
# Desde la raíz del proyecto
cd scripts/utilities
node fix_supabase_issues.js
```

---

## 📧 **CONFIGURACIÓN DE EMAIL SMTP**

### **Paso 1: Configurar Proveedor SMTP**

#### **Opción A: Gmail**
1. Ve a tu cuenta de Google
2. Activa la verificación en dos pasos
3. Genera una "Contraseña de aplicación"
4. Usa estos datos:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   Usuario: tu-email@gmail.com
   Contraseña: [contraseña de aplicación]
   ```

#### **Opción B: SendGrid (Recomendado para Producción)**
1. Crea cuenta en SendGrid
2. Verifica tu dominio
3. Usa estos datos:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   Usuario: apikey
   Contraseña: [tu API key]
   ```

#### **Opción C: Mailgun**
1. Crea cuenta en Mailgun
2. Verifica tu dominio
3. Usa estos datos:
   ```
   SMTP Host: smtp.mailgun.org
   SMTP Port: 587
   Usuario: [tu usuario]
   Contraseña: [tu contraseña]
   ```

### **Paso 2: Actualizar Configuración en Supabase**

#### **Método 1: Dashboard de Supabase**
1. Ve a **Settings > Auth**
2. En **SMTP Settings**, configura:
   - Host, Port, Usuario, Contraseña
   - From Email y From Name

#### **Método 2: Tabla `email_config`**
```sql
-- Actualizar configuración existente
UPDATE public.email_config 
SET 
    smtp_host = 'smtp.gmail.com',
    smtp_port = 587,
    smtp_user = 'tu-email@gmail.com',
    smtp_password = 'tu-password-de-aplicacion',
    from_email = 'tu-email@gmail.com',
    from_name = 'Suite Arqueológica',
    is_active = true
WHERE id = '[ID_DE_LA_CONFIGURACION]';

-- O insertar nueva configuración
INSERT INTO public.email_config (
    smtp_host, smtp_port, smtp_user, smtp_password,
    from_email, from_name, is_active
) VALUES (
    'smtp.gmail.com', 587, 'tu-email@gmail.com', 'tu-password',
    'tu-email@gmail.com', 'Suite Arqueológica', true
);
```

---

## 🔒 **VERIFICACIÓN DE SEGURIDAD RLS**

### **Paso 1: Verificar RLS en Tablas**

```sql
-- Verificar tablas con RLS habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### **Paso 2: Verificar Políticas de Seguridad**

```sql
-- Ver políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### **Paso 3: Verificar Tabla `spatial_ref_sys`**

```sql
-- Verificar si spatial_ref_sys tiene RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'spatial_ref_sys';
```

---

## 🛠️ **FUNCIONES DISPONIBLES**

### **Envío de Emails**
```sql
-- Enviar email usando configuración personalizada
SELECT send_custom_email(
    'destinatario@example.com',
    'Asunto del Email',
    'Contenido del email',
    '<h1>Contenido HTML</h1>'
);
```

### **Logging de Emails**
```sql
-- Registrar envío de email
SELECT log_email_send(
    'destinatario@example.com',
    'Asunto del Email',
    'sent',  -- o 'failed', 'bounced'
    'Mensaje de error si aplica'
);
```

### **Limpieza de Logs**
```sql
-- Limpiar logs antiguos (mantener últimos 30 días)
SELECT cleanup_old_email_logs(30);
```

---

## 📊 **MONITOREO Y MANTENIMIENTO**

### **Verificar Logs de Email**
```sql
-- Ver logs recientes
SELECT 
    to_email,
    subject,
    status,
    sent_at,
    error_message
FROM public.email_logs 
ORDER BY sent_at DESC 
LIMIT 10;
```

### **Estadísticas de Envío**
```sql
-- Estadísticas por estado
SELECT 
    status,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM public.email_logs 
GROUP BY status;
```

### **Configuraciones Activas**
```sql
-- Ver configuraciones de email activas
SELECT 
    smtp_host,
    smtp_port,
    from_email,
    from_name,
    is_active,
    updated_at
FROM public.email_config 
ORDER BY is_active DESC, updated_at DESC;
```

---

## ⚠️ **BEST PRACTICES**

### **Para Emails**
1. **Usa Contraseñas de Aplicación** para Gmail
2. **Verifica tu Dominio** en proveedores profesionales
3. **Monitorea Tasa de Rebote** regularmente
4. **Usa Listas Limpias** de destinatarios
5. **Implementa Double Opt-in** para suscripciones

### **Para Seguridad**
1. **Revisa Políticas RLS** mensualmente
2. **Audita Accesos** regularmente
3. **Mantén Logs** de actividades críticas
4. **Usa Variables de Entorno** para credenciales
5. **Implementa Rate Limiting** en APIs

### **Para Mantenimiento**
1. **Limpia Logs Antiguos** semanalmente
2. **Actualiza Configuraciones** según necesidad
3. **Monitorea Rendimiento** de envío
4. **Respaldar Configuraciones** importantes
5. **Documenta Cambios** realizados

---

## 🔍 **SOLUCIÓN DE PROBLEMAS**

### **Error: "No email configuration found"**
```sql
-- Verificar configuración activa
SELECT * FROM public.email_config WHERE is_active = true;
```

### **Error: "RLS policy violation"**
```sql
-- Verificar políticas en tabla específica
SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
```

### **Error: "SMTP connection failed"**
1. Verifica credenciales SMTP
2. Confirma que el puerto esté abierto
3. Revisa configuración de firewall
4. Prueba con otro proveedor SMTP

### **Error: "Table does not exist"**
```sql
-- Verificar tablas existentes
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 📞 **SOPORTE ADICIONAL**

### **Recursos Útiles**
- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de SMTP de Supabase](https://supabase.com/docs/guides/auth/auth-smtp)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### **Contacto**
- **Supabase Support**: support@supabase.com
- **Documentación del Proyecto**: `/docs/`
- **Issues del Proyecto**: GitHub Issues

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] Script SQL ejecutado sin errores
- [ ] RLS habilitado en `spatial_ref_sys`
- [ ] RLS habilitado en todas las tablas del sistema
- [ ] Configuración SMTP actualizada con credenciales reales
- [ ] Tabla `email_config` con configuración activa
- [ ] Tabla `email_logs` creada y funcional
- [ ] Políticas de seguridad configuradas
- [ ] Función `send_custom_email` probada
- [ ] Logs de email funcionando
- [ ] Restricción de emails levantada por Supabase

---

**🎉 ¡Problemas resueltos! Tu sistema está listo para funcionar correctamente.** 