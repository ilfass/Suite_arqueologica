# 📧 GUÍA DE CONFIGURACIÓN DE EMAIL SMTP

## 🚀 **OPCIÓN 1: Gmail (Más Fácil)**

### **Paso 1: Activar Verificación en Dos Pasos**
1. Ve a tu cuenta de Google
2. **Seguridad** > **Verificación en dos pasos** > **Activar**

### **Paso 2: Generar Contraseña de Aplicación**
1. **Seguridad** > **Contraseñas de aplicación**
2. Selecciona **"Otra"** y nombra como "Suite Arqueológica"
3. Copia la contraseña generada (16 caracteres)

### **Paso 3: Configurar en Supabase**
```sql
-- Ejecutar en SQL Editor de Supabase
UPDATE public.email_config 
SET 
    smtp_host = 'smtp.gmail.com',
    smtp_port = 587,
    smtp_user = 'tu-email@gmail.com',
    smtp_password = 'tu-password-de-aplicacion-16-caracteres',
    from_email = 'tu-email@gmail.com',
    from_name = 'Suite Arqueológica',
    is_active = true
WHERE id = (
    SELECT id FROM public.email_config 
    WHERE smtp_host = 'smtp.gmail.com' 
    LIMIT 1
);
```

---

## 🚀 **OPCIÓN 2: SendGrid (Recomendado para Producción)**

### **Paso 1: Crear Cuenta SendGrid**
1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea cuenta gratuita (100 emails/día)
3. Verifica tu email

### **Paso 2: Obtener API Key**
1. **Settings** > **API Keys**
2. **Create API Key** > **Full Access**
3. Copia la API key

### **Paso 3: Configurar en Supabase**
```sql
-- Ejecutar en SQL Editor de Supabase
UPDATE public.email_config 
SET 
    smtp_host = 'smtp.sendgrid.net',
    smtp_port = 587,
    smtp_user = 'apikey',
    smtp_password = 'tu-api-key-de-sendgrid',
    from_email = 'tu-email-verificado@tudominio.com',
    from_name = 'Suite Arqueológica',
    is_active = true
WHERE id = (
    SELECT id FROM public.email_config 
    WHERE smtp_host = 'smtp.sendgrid.net' 
    LIMIT 1
);
```

---

## 🚀 **OPCIÓN 3: Mailgun**

### **Paso 1: Crear Cuenta Mailgun**
1. Ve a [mailgun.com](https://mailgun.com)
2. Crea cuenta gratuita
3. Verifica tu dominio

### **Paso 2: Obtener Credenciales**
1. **Sending** > **Domain Information**
2. Copia SMTP credentials

### **Paso 3: Configurar en Supabase**
```sql
-- Ejecutar en SQL Editor de Supabase
UPDATE public.email_config 
SET 
    smtp_host = 'smtp.mailgun.org',
    smtp_port = 587,
    smtp_user = 'postmaster@tu-dominio.mailgun.org',
    smtp_password = 'tu-password-de-mailgun',
    from_email = 'noreply@tu-dominio.com',
    from_name = 'Suite Arqueológica',
    is_active = true
WHERE id = (
    SELECT id FROM public.email_config 
    WHERE smtp_host = 'smtp.mailgun.org' 
    LIMIT 1
);
```

---

## ✅ **VERIFICAR CONFIGURACIÓN**

### **Paso 1: Verificar Configuración Activa**
```sql
-- Ejecutar en SQL Editor
SELECT 
    smtp_host,
    smtp_port,
    from_email,
    from_name,
    is_active,
    updated_at
FROM public.email_config 
WHERE is_active = true;
```

### **Paso 2: Probar Envío de Email**
```sql
-- Ejecutar en SQL Editor (reemplaza con tu email)
SELECT send_custom_email(
    'tu-email@example.com',
    'Prueba de Email - Suite Arqueológica',
    'Este es un email de prueba para verificar la configuración SMTP.',
    '<h1>Prueba de Email</h1><p>Configuración SMTP funcionando correctamente.</p>'
);
```

### **Paso 3: Verificar Logs**
```sql
-- Ejecutar en SQL Editor
SELECT 
    to_email,
    subject,
    status,
    sent_at,
    error_message
FROM public.email_logs 
ORDER BY sent_at DESC 
LIMIT 5;
```

---

## ⚠️ **PROBLEMAS COMUNES**

### **Error: "Authentication failed"**
- ✅ Verifica que la contraseña de aplicación sea correcta
- ✅ Confirma que la verificación en dos pasos esté activada
- ✅ Revisa que el usuario SMTP sea correcto

### **Error: "Connection timeout"**
- ✅ Verifica que el puerto 587 esté abierto
- ✅ Confirma que no haya firewall bloqueando
- ✅ Prueba con otro proveedor SMTP

### **Error: "Rate limit exceeded"**
- ✅ Gmail: 500 emails/día
- ✅ SendGrid: 100 emails/día (gratuito)
- ✅ Mailgun: 5,000 emails/mes (gratuito)

---

## 🎯 **RECOMENDACIONES**

### **Para Desarrollo**
- ✅ **Gmail** con contraseña de aplicación
- ✅ Fácil de configurar
- ✅ 500 emails/día gratis

### **Para Producción**
- ✅ **SendGrid** o **Mailgun**
- ✅ Mejor deliverability
- ✅ Analytics y logs detallados
- ✅ Soporte profesional

### **Para Alta Escala**
- ✅ **AWS SES** o **Google Workspace**
- ✅ Integración con infraestructura
- ✅ Costos optimizados

---

## 📞 **SOPORTE**

### **Gmail**
- [Configurar contraseñas de aplicación](https://support.google.com/accounts/answer/185833)
- [Límites de envío](https://support.google.com/a/answer/166852)

### **SendGrid**
- [Documentación SMTP](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [Soporte](https://support.sendgrid.com/)

### **Mailgun**
- [Documentación SMTP](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)
- [Soporte](https://help.mailgun.com/)

---

**🎉 ¡Una vez configurado, tu sistema de email estará completamente funcional!** 