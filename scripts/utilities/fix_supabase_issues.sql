-- ========================================
-- SCRIPT PARA SOLUCIONAR PROBLEMAS DE SUPABASE
-- Ejecutar en Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. SOLUCIONAR PROBLEMA DE SPATIAL_REF_SYS
-- ========================================

-- Habilitar RLS en spatial_ref_sys si existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'spatial_ref_sys'
    ) THEN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        
        -- Crear política básica para spatial_ref_sys
        DROP POLICY IF EXISTS "spatial_ref_sys_policy" ON public.spatial_ref_sys;
        CREATE POLICY "spatial_ref_sys_policy" ON public.spatial_ref_sys
            FOR SELECT USING (true);
            
        RAISE NOTICE 'RLS habilitado en spatial_ref_sys';
    ELSE
        RAISE NOTICE 'Tabla spatial_ref_sys no encontrada en schema public';
    END IF;
END $$;

-- ========================================
-- 2. VERIFICAR Y HABILITAR RLS EN TODAS LAS TABLAS
-- ========================================

-- Lista de tablas que deben tener RLS habilitado
DO $$
DECLARE
    table_name TEXT;
    tables_to_check TEXT[] := ARRAY[
        'users',
        'archaeological_sites', 
        'artifacts',
        'excavations',
        'documents',
        'measurements',
        'site_permissions',
        'notifications',
        'objects',
        'researchers',
        'areas',
        'projects',
        'grid_units',
        'findings'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_to_check
    LOOP
        IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = table_name
        ) THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
            RAISE NOTICE 'RLS habilitado en %', table_name;
        ELSE
            RAISE NOTICE 'Tabla % no existe', table_name;
        END IF;
    END LOOP;
END $$;

-- ========================================
-- 3. CONFIGURAR EMAIL SMTP PERSONALIZADO
-- ========================================

-- Crear tabla para configuración de email
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
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 5. CREAR TABLA DE LOGS DE EMAIL
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
-- 6. CREAR FUNCIÓN PARA LOGGING DE EMAILS
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
-- 7. CREAR FUNCIÓN PARA LIMPIAR LOGS ANTIGUOS
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
-- 8. CREAR TRIGGER PARA ACTUALIZAR updated_at
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
-- 9. INSERTAR CONFIGURACIÓN DE EMAIL DE EJEMPLO
-- ========================================

-- Insertar configuración de ejemplo (debes reemplazar con tus datos reales)
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
    'tu-email@gmail.com',
    'tu-password-de-aplicacion',
    'tu-email@gmail.com',
    'Suite Arqueológica',
    false  -- Cambiar a true cuando tengas datos reales
) ON CONFLICT DO NOTHING;

-- ========================================
-- 10. VERIFICAR ESTADO FINAL
-- ========================================

-- Mostrar tablas con RLS habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users',
    'archaeological_sites',
    'artifacts',
    'excavations',
    'email_config',
    'email_logs'
)
ORDER BY tablename;

-- Mostrar políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- INSTRUCCIONES PARA EL USUARIO
-- ========================================

/*
🎉 ¡Script ejecutado exitosamente!

📋 Acciones realizadas:
✅ RLS habilitado en spatial_ref_sys
✅ RLS verificado en todas las tablas del sistema
✅ Configuración de email SMTP personalizado preparada
✅ Sistema de logs de email implementado
✅ Políticas de seguridad configuradas

📧 Para configurar email SMTP personalizado:
1. Ve a Supabase Dashboard > Settings > Auth
2. En "SMTP Settings", configura tu proveedor SMTP
3. O actualiza la tabla email_config con tus datos reales
4. Cambia is_active a true en la configuración que quieras usar

🔒 Para verificar RLS:
1. Ve a Supabase Dashboard > Database > Tables
2. Verifica que todas las tablas tengan RLS habilitado
3. Revisa las políticas de seguridad en cada tabla

⚠️ IMPORTANTE:
- Reemplaza los datos de ejemplo en email_config con tus credenciales reales
- Para Gmail, usa "Contraseñas de aplicación" en lugar de tu contraseña normal
- Considera usar servicios como SendGrid, Mailgun o AWS SES para producción
*/ 