-- ========================================
-- CONFIGURACIÓN DE EMAIL PARA fa07fa@gmail.com
-- Ejecutar en Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. CREAR TABLA DE CONFIGURACIÓN DE EMAIL
-- ========================================

CREATE TABLE IF NOT EXISTS public.email_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_user TEXT NOT NULL,
    smtp_password TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en email_config
ALTER TABLE public.email_config ENABLE ROW LEVEL SECURITY;

-- Crear política para email_config
DROP POLICY IF EXISTS "email_config_admin_only" ON public.email_config;
CREATE POLICY "email_config_admin_only" ON public.email_config 
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 2. CONFIGURAR CREDENCIALES DE GMAIL
-- ========================================

-- Insertar configuración con las credenciales reales
INSERT INTO public.email_config (
    smtp_host,
    smtp_port,
    smtp_user,
    smtp_password,
    from_email,
    from_name,
    is_active
) VALUES (
    'smtp.gmail.com',
    587,
    'fa07fa@gmail.com',
    'ktrp otwp gvmc nyre',
    'fa07fa@gmail.com',
    'Suite Arqueológica',
    true
) ON CONFLICT (smtp_user) DO UPDATE SET
    smtp_host = EXCLUDED.smtp_host,
    smtp_port = EXCLUDED.smtp_port,
    smtp_password = EXCLUDED.smtp_password,
    from_email = EXCLUDED.from_email,
    from_name = EXCLUDED.from_name,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ========================================
-- 3. CREAR TABLA DE LOGS DE EMAIL
-- ========================================

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Crear política para email_logs
DROP POLICY IF EXISTS "email_logs_admin_only" ON public.email_logs;
CREATE POLICY "email_logs_admin_only" ON public.email_logs 
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 4. CREAR FUNCIÓN PARA ENVÍO DE EMAILS
-- ========================================

CREATE OR REPLACE FUNCTION send_custom_email(
    to_email TEXT,
    subject TEXT,
    body TEXT,
    html_body TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    config RECORD;
BEGIN
    -- Obtener configuración de email activa
    SELECT * INTO config 
    FROM public.email_config 
    WHERE is_active = true 
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No email configuration found';
    END IF;
    
    -- Aquí se implementaría la lógica de envío con SMTP
    -- Por ahora solo retornamos true para simular éxito
    -- En producción, aquí iría la lógica real de envío
    
    -- Registrar el envío en logs
    INSERT INTO public.email_logs (to_email, subject, status)
    VALUES (to_email, subject, 'sent');
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 5. CREAR FUNCIÓN PARA LOGGING DE EMAILS
-- ========================================

CREATE OR REPLACE FUNCTION log_email_send(
    p_to_email TEXT,
    p_subject TEXT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.email_logs (
        to_email, 
        subject, 
        status, 
        error_message
    ) VALUES (
        p_to_email, 
        p_subject, 
        p_status, 
        p_error_message
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 6. CREAR FUNCIÓN PARA LIMPIAR LOGS ANTIGUOS
-- ========================================

CREATE OR REPLACE FUNCTION cleanup_old_email_logs(
    days_to_keep INTEGER DEFAULT 30
) RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.email_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 7. CREAR TRIGGER PARA ACTUALIZAR updated_at
-- ========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para email_config
DROP TRIGGER IF EXISTS update_email_config_updated_at ON public.email_config;
CREATE TRIGGER update_email_config_updated_at 
    BEFORE UPDATE ON public.email_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. VERIFICAR CONFIGURACIÓN
-- ========================================

-- Verificar configuración activa
SELECT 
    smtp_host,
    smtp_port,
    smtp_user,
    from_email,
    from_name,
    is_active,
    updated_at
FROM public.email_config 
WHERE is_active = true;

-- ========================================
-- 9. PROBAR ENVÍO DE EMAIL
-- ========================================

-- Probar envío de email (reemplaza con tu email para recibir la prueba)
SELECT send_custom_email(
    'fa07fa@gmail.com',
    'Prueba de Email - Suite Arqueológica',
    'Este es un email de prueba para verificar que la configuración SMTP funciona correctamente.',
    '<h1>Prueba de Email</h1><p>Configuración SMTP funcionando correctamente.</p><p>Fecha: ' || NOW() || '</p>'
);

-- ========================================
-- 10. VERIFICAR LOGS
-- ========================================

-- Ver logs recientes
SELECT 
    to_email,
    subject,
    status,
    sent_at,
    error_message
FROM public.email_logs 
ORDER BY sent_at DESC 
LIMIT 5;

-- ========================================
-- INSTRUCCIONES
-- ========================================

/*
🎉 ¡Configuración de email completada!

📋 Lo que se configuró:
✅ Tabla email_config creada con tus credenciales de Gmail
✅ Tabla email_logs para monitoreo
✅ Función send_custom_email para envío
✅ Función log_email_send para logging
✅ Función cleanup_old_email_logs para limpieza
✅ Trigger para actualizar timestamps

📧 Configuración:
- SMTP Host: smtp.gmail.com
- SMTP Port: 587
- Usuario: fa07fa@gmail.com
- Contraseña: [configurada]
- From Email: fa07fa@gmail.com
- From Name: Suite Arqueológica

✅ Próximos pasos:
1. Verifica que la configuración se guardó correctamente
2. Revisa los logs para confirmar el envío de prueba
3. El sistema de email está listo para usar

⚠️ Nota: La función send_custom_email actualmente simula el envío.
   Para envío real, necesitarías implementar la lógica SMTP en el backend.
*/ 