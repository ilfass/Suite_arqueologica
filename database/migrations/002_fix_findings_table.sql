-- Migration: 002_fix_findings_table
-- Description: Corregir la tabla findings agregando la columna grid_unit_id faltante
-- Created: 2025-07-16

-- =====================================================
-- CORREGIR TABLA: findings
-- =====================================================

-- Verificar si la columna grid_unit_id existe
DO $$
BEGIN
    -- Agregar la columna grid_unit_id si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'findings' 
        AND column_name = 'grid_unit_id'
    ) THEN
        ALTER TABLE public.findings 
        ADD COLUMN grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Columna grid_unit_id agregada a la tabla findings';
    ELSE
        RAISE NOTICE 'La columna grid_unit_id ya existe en la tabla findings';
    END IF;
END $$;

-- Verificar si la columna excavation_id existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'findings' 
        AND column_name = 'excavation_id'
    ) THEN
        ALTER TABLE public.findings 
        ADD COLUMN excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Columna excavation_id agregada a la tabla findings';
    ELSE
        RAISE NOTICE 'La columna excavation_id ya existe en la tabla findings';
    END IF;
END $$;

-- Verificar si la columna site_id existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'findings' 
        AND column_name = 'site_id'
    ) THEN
        ALTER TABLE public.findings 
        ADD COLUMN site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Columna site_id agregada a la tabla findings';
    ELSE
        RAISE NOTICE 'La columna site_id ya existe en la tabla findings';
    END IF;
END $$;

-- Verificar si la columna created_by existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'findings' 
        AND column_name = 'created_by'
    ) THEN
        ALTER TABLE public.findings 
        ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Columna created_by agregada a la tabla findings';
    ELSE
        RAISE NOTICE 'La columna created_by ya existe en la tabla findings';
    END IF;
END $$;

-- =====================================================
-- CREAR TABLAS SI NO EXISTEN
-- =====================================================

-- Crear tabla grid_units si no existe
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
    findings_count INTEGER DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla measurements si no existe
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('distance', 'area', 'point')),
    coordinates JSONB NOT NULL,
    value DECIMAL(10, 2),
    unit VARCHAR(10) DEFAULT 'm',
    label VARCHAR(100),
    description TEXT,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_grid_units_excavation_id ON public.grid_units(excavation_id);
CREATE INDEX IF NOT EXISTS idx_grid_units_site_id ON public.grid_units(site_id);
CREATE INDEX IF NOT EXISTS idx_measurements_excavation_id ON public.measurements(excavation_id);
CREATE INDEX IF NOT EXISTS idx_measurements_site_id ON public.measurements(site_id);
CREATE INDEX IF NOT EXISTS idx_findings_grid_unit_id ON public.findings(grid_unit_id);
CREATE INDEX IF NOT EXISTS idx_findings_excavation_id ON public.findings(excavation_id);
CREATE INDEX IF NOT EXISTS idx_findings_site_id ON public.findings(site_id);

-- =====================================================
-- RLS (Row Level Security) - Opcional
-- =====================================================
ALTER TABLE public.grid_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (puedes ajustarlas según tus necesidades)
DROP POLICY IF EXISTS "Users can view their own grid units" ON public.grid_units;
CREATE POLICY "Users can view their own grid units" ON public.grid_units
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view their own measurements" ON public.measurements;
CREATE POLICY "Users can view their own measurements" ON public.measurements
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can view their own findings" ON public.findings;
CREATE POLICY "Users can view their own findings" ON public.findings
    FOR SELECT USING (auth.uid() = created_by);

-- =====================================================
-- VERIFICAR ESTRUCTURA FINAL
-- =====================================================
SELECT 
    'findings' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'findings' 
ORDER BY ordinal_position;

SELECT 
    'grid_units' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'grid_units' 
ORDER BY ordinal_position;

SELECT 
    'measurements' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'measurements' 
ORDER BY ordinal_position; 