-- Migración para crear tablas faltantes: areas y projects
-- Ejecutar en Supabase SQL Editor

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'suspended')),
    project_type TEXT,
    funding_source TEXT,
    principal_investigator UUID REFERENCES public.users(id) ON DELETE SET NULL,
    team_members UUID[],
    objectives TEXT[],
    methodology TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de áreas
CREATE TABLE IF NOT EXISTS public.areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    location GEOGRAPHY(POLYGON, 4326),
    area_type TEXT,
    excavation_status TEXT DEFAULT 'not_started' CHECK (excavation_status IN ('not_started', 'in_progress', 'completed', 'suspended')),
    preservation_status TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sitios (modificada para referenciar áreas)
ALTER TABLE public.archaeological_sites 
ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES public.areas(id) ON DELETE CASCADE;

-- Índices para las nuevas tablas
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects (created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_areas_project_id ON public.areas (project_id);
CREATE INDEX IF NOT EXISTS idx_areas_created_by ON public.areas (created_by);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_area_id ON public.archaeological_sites (area_id);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo para testing
INSERT INTO public.projects (id, name, description, status, created_by) VALUES 
(
    'proj-test-001',
    'Proyecto Cazadores Recolectores - La Laguna',
    'Investigación sobre patrones de asentamiento de cazadores recolectores en la región pampeana',
    'active',
    'a9824343-3b45-4360-833c-8f241f7d835d'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.areas (id, project_id, name, description, created_by) VALUES 
(
    'area-test-001',
    'proj-test-001',
    'Laguna La Brava',
    'Área de excavación en la laguna La Brava',
    'a9824343-3b45-4360-833c-8f241f7d835d'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.archaeological_sites (id, area_id, name, description, location, created_by) VALUES 
(
    'site-test-001',
    'area-test-001',
    'Sitio Pampeano La Laguna',
    'Sitio arqueológico en la laguna La Brava',
    ST_GeomFromText('POINT(-58.3816 -34.6037)', 4326),
    'a9824343-3b45-4360-833c-8f241f7d835d'
) ON CONFLICT (id) DO NOTHING; 