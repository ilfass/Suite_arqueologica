-- ========================================
-- SCRIPT FINAL DE VERIFICACIÓN
-- Ejecutar con: supabase db remote psql -f scripts/utilities/final_verification.sql
-- ========================================

-- Verificar configuración de email
SELECT 'EMAIL CONFIG:' as info;
SELECT 
    smtp_host,
    smtp_port,
    smtp_user,
    from_email,
    from_name,
    is_active,
    created_at
FROM public.email_config;

-- Verificar logs de email
SELECT 'EMAIL LOGS:' as info;
SELECT 
    to_email,
    subject,
    status,
    sent_at,
    created_at
FROM public.email_logs
ORDER BY created_at DESC
LIMIT 5;

-- Probar envío de email
SELECT 'ENVIANDO EMAIL DE PRUEBA:' as info;
SELECT send_custom_email(
    'fa07fa@gmail.com',
    'Prueba Final - Suite Arqueológica',
    'Este es un email de prueba final para verificar que todo funciona correctamente.',
    '<h1>Prueba Final</h1><p>Sistema de email funcionando correctamente.</p><p>Fecha: ' || NOW() || '</p>'
) as email_enviado;

-- Verificar RLS en tablas principales
SELECT 'RLS STATUS:' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'archaeological_sites', 'excavations', 'objects', 'researchers', 'email_config', 'email_logs')
ORDER BY tablename;

-- Verificar políticas de seguridad
SELECT 'POLÍTICAS DE SEGURIDAD:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar logs después del envío
SELECT 'LOGS DESPUÉS DEL ENVÍO:' as info;
SELECT 
    to_email,
    subject,
    status,
    sent_at,
    created_at
FROM public.email_logs
ORDER BY created_at DESC
LIMIT 3; 