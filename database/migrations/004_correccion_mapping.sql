-- =====================================================
-- CORRECCIÓN COMPLETA DE TABLAS DE MAPPING
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. Verificar y crear tabla grid_units si no existe
CREATE TABLE IF NOT EXISTS public.grid_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    north_lat DECIMAL(10, 8) NOT NULL,
    south_lat DECIMAL(10, 8) NOT NULL,
    east_lng DECIMAL(11, 8) NOT NULL,
    west_lng DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
    depth DECIMAL(5, 2),
    area DECIMAL(10, 2),
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Verificar y crear tabla measurements si no existe
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('distance', 'area', 'point')),
    coordinates JSONB NOT NULL,
    value DECIMAL(10, 2),
    unit VARCHAR(10) DEFAULT 'm',
    description TEXT,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Verificar y crear tabla findings si no existe
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    coordinates JSONB NOT NULL,
    depth DECIMAL(5, 2),
    condition VARCHAR(50),
    material VARCHAR(100),
    period VARCHAR(100),
    grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Agregar columnas faltantes a grid_units si no existen
DO $$
BEGIN
    -- Agregar created_by si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'grid_units' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.grid_units ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Agregar updated_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'grid_units' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.grid_units ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 5. Agregar columnas faltantes a measurements si no existen
DO $$
BEGIN
    -- Agregar created_by si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'measurements' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.measurements ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Agregar updated_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'measurements' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.measurements ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 6. Agregar columnas faltantes a findings si no existen
DO $$
BEGIN
    -- Agregar grid_unit_id si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'findings' AND column_name = 'grid_unit_id'
    ) THEN
        ALTER TABLE public.findings ADD COLUMN grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE;
    END IF;
    
    -- Agregar created_by si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'findings' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.findings ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Agregar updated_at si no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'findings' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.findings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 7. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_grid_units_excavation_id ON public.grid_units(excavation_id);
CREATE INDEX IF NOT EXISTS idx_grid_units_site_id ON public.grid_units(site_id);
CREATE INDEX IF NOT EXISTS idx_measurements_excavation_id ON public.measurements(excavation_id);
CREATE INDEX IF NOT EXISTS idx_measurements_site_id ON public.measurements(site_id);
CREATE INDEX IF NOT EXISTS idx_findings_grid_unit_id ON public.findings(grid_unit_id);
CREATE INDEX IF NOT EXISTS idx_findings_excavation_id ON public.findings(excavation_id);
CREATE INDEX IF NOT EXISTS idx_findings_site_id ON public.findings(site_id);

-- 8. Mostrar la estructura de todas las tablas
SELECT 'ESTRUCTURA DE LA TABLA GRID_UNITS:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'grid_units' 
ORDER BY ordinal_position;

SELECT 'ESTRUCTURA DE LA TABLA MEASUREMENTS:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'measurements' 
ORDER BY ordinal_position;

SELECT 'ESTRUCTURA DE LA TABLA FINDINGS:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'findings' 
ORDER BY ordinal_position;

-- 9. Mostrar conteo de registros
SELECT 'CONTEO DE REGISTROS:' as info;
SELECT 
    'grid_units' as tabla,
    COUNT(*) as total
FROM public.grid_units
UNION ALL
SELECT 
    'measurements' as tabla,
    COUNT(*) as total
FROM public.measurements
UNION ALL
SELECT 
    'findings' as tabla,
    COUNT(*) as total
FROM public.findings;

-- 10. Mensaje de confirmación
SELECT '✅ CORRECCIÓN COMPLETADA EXITOSAMENTE' as resultado;
SELECT 'Las tablas grid_units, measurements y findings están listas para usar.' as mensaje; 