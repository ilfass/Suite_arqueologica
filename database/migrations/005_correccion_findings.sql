-- =====================================================
-- CORRECCIÓN: Agregar columna created_by a findings y mostrar estructura
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. Verificar si la tabla findings existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'findings') THEN
        RAISE EXCEPTION 'La tabla findings no existe. Ejecuta primero el script de creación.';
    END IF;
END $$;

-- 2. Agregar columna created_by si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'findings' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.findings 
        ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Mostrar la estructura actual de la tabla findings
SELECT 'ESTRUCTURA ACTUAL DE LA TABLA FINDINGS:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'findings' 
ORDER BY ordinal_position;

-- 4. Mostrar los primeros 5 registros para verificar
SELECT * FROM public.findings LIMIT 5; 