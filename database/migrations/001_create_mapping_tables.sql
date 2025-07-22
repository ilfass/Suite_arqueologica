-- Migration: 001_create_mapping_tables
-- Description: Crear tablas para el sistema de mapping arqueológico
-- Created: 2025-07-16

-- =====================================================
-- TABLA: grid_units (Cuadrículas de excavación)
-- =====================================================
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

-- =====================================================
-- TABLA: measurements (Mediciones del mapa)
-- =====================================================
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

-- =====================================================
-- TABLA: findings (Hallazgos arqueológicos)
-- =====================================================
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
CREATE POLICY "Users can view their own grid units" ON public.grid_units
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view their own measurements" ON public.measurements
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view their own findings" ON public.findings
    FOR SELECT USING (auth.uid() = created_by); 