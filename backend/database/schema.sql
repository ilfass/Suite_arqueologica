-- Esquema de base de datos para Suite Arqueológica
-- Ejecutar en Supabase SQL Editor

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabla de usuarios (extensión de auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('RESEARCHER', 'STUDENT', 'COORDINATOR', 'INSTITUTION', 'GUEST')),
    subscription_plan TEXT NOT NULL DEFAULT 'FREE' CHECK (subscription_plan IN ('FREE', 'PROFESSIONAL', 'INSTITUTIONAL')),
    institution TEXT,
    phone TEXT,
    address TEXT,
    website TEXT,
    bio TEXT,
    specialties TEXT[],
    academic_degree TEXT,
    research_interests TEXT[],
    professional_affiliations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sitios arqueológicos
CREATE TABLE IF NOT EXISTS public.archaeological_sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    period TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    site_type TEXT,
    excavation_status TEXT,
    preservation_status TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de hallazgos arqueológicos
CREATE TABLE IF NOT EXISTS public.artifacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    artifact_type TEXT NOT NULL,
    material TEXT,
    dimensions JSONB,
    condition TEXT,
    discovery_date DATE,
    discovery_location GEOGRAPHY(POINT, 4326),
    catalog_number TEXT,
    images TEXT[],
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de excavaciones
CREATE TABLE IF NOT EXISTS public.excavations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'suspended')),
    team_leader UUID REFERENCES public.users(id) ON DELETE SET NULL,
    team_members UUID[],
    objectives TEXT[],
    methodology TEXT,
    findings_summary TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('report', 'photo', 'drawing', 'map', 'analysis', 'other')),
    file_url TEXT,
    file_size INTEGER,
    mime_type TEXT,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mediciones y análisis
CREATE TABLE IF NOT EXISTS public.measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    measurement_type TEXT NOT NULL CHECK (measurement_type IN ('distance', 'area', 'volume', 'angle', 'depth', 'elevation')),
    value DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de permisos y colaboraciones
CREATE TABLE IF NOT EXISTS public.site_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'admin')),
    granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(site_id, user_id)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('info', 'warning', 'error', 'success')),
    read BOOLEAN DEFAULT FALSE,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_location ON public.archaeological_sites USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_status ON public.archaeological_sites (status);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_created_by ON public.archaeological_sites (created_by);
CREATE INDEX IF NOT EXISTS idx_artifacts_site_id ON public.artifacts (site_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON public.artifacts (artifact_type);
CREATE INDEX IF NOT EXISTS idx_excavations_site_id ON public.excavations (site_id);
CREATE INDEX IF NOT EXISTS idx_excavations_status ON public.excavations (status);
CREATE INDEX IF NOT EXISTS idx_documents_site_id ON public.documents (site_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents (document_type);
CREATE INDEX IF NOT EXISTS idx_measurements_site_id ON public.measurements (site_id);
CREATE INDEX IF NOT EXISTS idx_site_permissions_site_id ON public.site_permissions (site_id);
CREATE INDEX IF NOT EXISTS idx_site_permissions_user_id ON public.site_permissions (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (read);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archaeological_sites_updated_at BEFORE UPDATE ON public.archaeological_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artifacts_updated_at BEFORE UPDATE ON public.artifacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_excavations_updated_at BEFORE UPDATE ON public.excavations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archaeological_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excavations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Políticas para sitios arqueológicos
CREATE POLICY "Users can view sites they have permission for" ON public.archaeological_sites FOR SELECT USING (
    created_by = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.site_permissions 
        WHERE site_id = archaeological_sites.id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create sites" ON public.archaeological_sites FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update sites they own or have admin permission" ON public.archaeological_sites FOR UPDATE USING (
    created_by = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.site_permissions 
        WHERE site_id = archaeological_sites.id AND user_id = auth.uid() AND permission_level = 'admin'
    )
);

CREATE POLICY "Users can delete sites they own" ON public.archaeological_sites FOR DELETE USING (created_by = auth.uid());

-- Políticas similares para otras tablas...
-- (Se pueden agregar más políticas según sea necesario)

-- Datos de ejemplo para testing
INSERT INTO public.users (id, email, full_name, role, subscription_plan) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@suite-arqueologica.com', 'Administrador Sistema', 'COORDINATOR', 'INSTITUTIONAL'),
    ('00000000-0000-0000-0000-000000000002', 'investigador@example.com', 'Dr. María González', 'RESEARCHER', 'PROFESSIONAL'),
    ('00000000-0000-0000-0000-000000000003', 'estudiante@example.com', 'Carlos Rodríguez', 'STUDENT', 'FREE')
ON CONFLICT (id) DO NOTHING;

-- Insertar sitios de ejemplo
INSERT INTO public.archaeological_sites (name, description, location, address, period, status, created_by) VALUES
    ('Teotihuacán', 'Antigua ciudad mesoamericana', ST_GeomFromText('POINT(-98.8441 19.6915)', 4326), 'Teotihuacán, México', 'Clásico', 'active', '00000000-0000-0000-0000-000000000001'),
    ('Machu Picchu', 'Ciudad inca en los Andes', ST_GeomFromText('POINT(-72.5449 -13.1631)', 4326), 'Cusco, Perú', 'Inca', 'active', '00000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING; 