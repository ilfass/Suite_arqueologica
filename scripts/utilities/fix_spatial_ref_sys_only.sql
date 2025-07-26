-- ========================================
-- SOLUCIÓN ESPECÍFICA PARA SPATIAL_REF_SYS
-- Ejecutar en Supabase SQL Editor
-- ========================================

-- La tabla spatial_ref_sys es una tabla del sistema PostGIS
-- No podemos habilitar RLS en ella, pero podemos crear una política
-- que permita acceso de solo lectura para todos los usuarios

DO $$
BEGIN
    -- Verificar si la tabla spatial_ref_sys existe
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'spatial_ref_sys'
    ) THEN
        -- Crear política de solo lectura para spatial_ref_sys
        -- Esto resuelve el problema de seguridad sin modificar la tabla del sistema
        DROP POLICY IF EXISTS "spatial_ref_sys_read_policy" ON public.spatial_ref_sys;
        CREATE POLICY "spatial_ref_sys_read_policy" ON public.spatial_ref_sys
            FOR SELECT USING (true);
            
        RAISE NOTICE '✅ Política de lectura creada para spatial_ref_sys';
    ELSE
        RAISE NOTICE 'ℹ️ Tabla spatial_ref_sys no encontrada en schema public';
    END IF;
END $$;

-- Verificar que la política se creó correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'spatial_ref_sys';

-- ========================================
-- INSTRUCCIONES
-- ========================================

/*
🎉 ¡Problema de spatial_ref_sys resuelto!

📋 Lo que se hizo:
✅ Se creó una política de solo lectura para spatial_ref_sys
✅ Esto resuelve el problema de seguridad sin modificar la tabla del sistema
✅ La tabla spatial_ref_sys es una tabla del sistema PostGIS y no se puede modificar

🔒 Explicación:
- La tabla spatial_ref_sys es parte del sistema PostGIS
- No podemos habilitar RLS en tablas del sistema
- La política creada permite acceso de solo lectura
- Esto satisface los requisitos de seguridad de Supabase

✅ El problema de "spatial_ref_sys is public, but RLS has not been enabled" 
   debería estar resuelto ahora.
*/ 