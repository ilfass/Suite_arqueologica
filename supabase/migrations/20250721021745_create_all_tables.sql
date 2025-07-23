-- Migración completa para crear todas las tablas del sistema arqueológico
-- Incluye: users, archaeological_sites, excavations, objects, researchers, y tablas relacionadas

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ========================================
-- TABLA USERS (Tabla principal de usuarios)
-- ========================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GUEST' CHECK (role IN ('ADMIN', 'RESEARCHER', 'DIRECTOR', 'STUDENT', 'INSTITUTION', 'GUEST')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    institution VARCHAR(255),
    specialization VARCHAR(255),
    academic_degree VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- ========================================
-- TABLA ARCHAEOLOGICAL_SITES
-- ========================================

CREATE TABLE IF NOT EXISTS public.archaeological_sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location JSONB,
    coordinates POINT,
    region VARCHAR(255),
    period VARCHAR(100),
    site_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archaeological_sites_created_by ON public.archaeological_sites(created_by);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_status ON public.archaeological_sites(status);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_period ON public.archaeological_sites(period);

ALTER TABLE public.archaeological_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sites are viewable by everyone" ON public.archaeological_sites
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert sites" ON public.archaeological_sites
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own sites" ON public.archaeological_sites
    FOR UPDATE USING (auth.uid() = created_by);

-- ========================================
-- TABLA EXCAVATIONS
-- ========================================

CREATE TABLE IF NOT EXISTS public.excavations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_excavations_site_id ON public.excavations(site_id);
CREATE INDEX IF NOT EXISTS idx_excavations_created_by ON public.excavations(created_by);
CREATE INDEX IF NOT EXISTS idx_excavations_status ON public.excavations(status);

ALTER TABLE public.excavations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Excavations are viewable by everyone" ON public.excavations
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert excavations" ON public.excavations
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own excavations" ON public.excavations
    FOR UPDATE USING (auth.uid() = created_by);

-- ========================================
-- TABLA OBJECTS (Artefactos)
-- ========================================

CREATE TABLE IF NOT EXISTS public.objects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    material VARCHAR(100),
    period VARCHAR(100),
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
    dimensions JSONB,
    weight DECIMAL(10,2),
    condition_status VARCHAR(50),
    discovery_date DATE,
    location_details JSONB,
    images TEXT[],
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_objects_site_id ON public.objects(site_id);
CREATE INDEX IF NOT EXISTS idx_objects_excavation_id ON public.objects(excavation_id);
CREATE INDEX IF NOT EXISTS idx_objects_material ON public.objects(material);
CREATE INDEX IF NOT EXISTS idx_objects_period ON public.objects(period);
CREATE INDEX IF NOT EXISTS idx_objects_created_by ON public.objects(created_by);
CREATE INDEX IF NOT EXISTS idx_objects_is_active ON public.objects(is_active);

ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Objects are viewable by everyone" ON public.objects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert objects" ON public.objects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own objects" ON public.objects
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own objects" ON public.objects
    FOR DELETE USING (auth.uid() = created_by);

-- ========================================
-- TABLA RESEARCHERS
-- ========================================

CREATE TABLE IF NOT EXISTS public.researchers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    institution VARCHAR(255),
    specialization VARCHAR(255),
    academic_degree VARCHAR(100),
    research_interests TEXT[],
    publications TEXT[],
    experience_years INTEGER,
    certifications TEXT[],
    contact_info JSONB,
    profile_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_researchers_user_id ON public.researchers(user_id);
CREATE INDEX IF NOT EXISTS idx_researchers_email ON public.researchers(email);
CREATE INDEX IF NOT EXISTS idx_researchers_institution ON public.researchers(institution);
CREATE INDEX IF NOT EXISTS idx_researchers_specialization ON public.researchers(specialization);
CREATE INDEX IF NOT EXISTS idx_researchers_is_active ON public.researchers(is_active);

ALTER TABLE public.researchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Researchers are viewable by everyone" ON public.researchers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert researchers" ON public.researchers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own researcher profile" ON public.researchers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own researcher profile" ON public.researchers
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- TRIGGERS PARA updated_at
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_archaeological_sites_updated_at 
    BEFORE UPDATE ON public.archaeological_sites 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_excavations_updated_at 
    BEFORE UPDATE ON public.excavations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_objects_updated_at 
    BEFORE UPDATE ON public.objects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_researchers_updated_at 
    BEFORE UPDATE ON public.researchers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DATOS DE EJEMPLO
-- ========================================

-- Insertar usuarios de ejemplo
INSERT INTO public.users (email, role, first_name, last_name, institution, specialization) VALUES
('fa07fa@gmail.com', 'ADMIN', 'Admin', 'Sistema', 'CONICET', 'Administración'),
('dr.perez@unam.mx', 'RESEARCHER', 'Dr. Carlos', 'Pérez', 'UNAM', 'Arqueología'),
('estudiante@universidad.edu', 'STUDENT', 'María', 'González', 'UBA', 'Arqueología'),
('director@inah.gob.mx', 'DIRECTOR', 'Dr. Roberto', 'Martínez', 'INAH', 'Dirección'),
('admin@inah.gob.mx', 'INSTITUTION', 'Lic. Ana', 'López', 'INAH', 'Gestión'),
('invitado@example.com', 'GUEST', 'Invitado', 'Público', 'Público', 'Interés general')
ON CONFLICT (email) DO NOTHING;

-- Insertar sitios arqueológicos de ejemplo
INSERT INTO public.archaeological_sites (name, description, region, period, site_type, created_by) VALUES
('Sitio Arroyo Seco', 'Sitio arqueológico del Holoceno temprano en la región pampeana', 'Pampa Húmeda', 'Holoceno temprano', 'Campamento', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Cueva de las Manos', 'Sitio con pinturas rupestres del Holoceno medio', 'Patagonia', 'Holoceno medio', 'Abrigo rocoso', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Monte Hermoso', 'Sitio costero con ocupaciones del Pleistoceno final', 'Costa Atlántica', 'Pleistoceno final', 'Campamento costero', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx'))
ON CONFLICT DO NOTHING;

-- Insertar excavaciones de ejemplo
INSERT INTO public.excavations (site_id, name, description, start_date, end_date, created_by) VALUES
((SELECT id FROM public.archaeological_sites WHERE name = 'Sitio Arroyo Seco'), 'Excavación 2023', 'Excavación sistemática del sector norte', '2023-03-01', '2023-06-30', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
((SELECT id FROM public.archaeological_sites WHERE name = 'Cueva de las Manos'), 'Prospección 2023', 'Prospección y documentación de pinturas', '2023-07-01', '2023-08-31', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx'))
ON CONFLICT DO NOTHING;

-- Insertar objetos arqueológicos de ejemplo
INSERT INTO public.objects (name, description, material, period, condition_status, discovery_date, notes, created_by) VALUES
('Punta de flecha lítica', 'Punta de flecha tallada en cuarzo, típica de cazadores-recolectores', 'Cuarzo', 'Holoceno tardío', 'Excelente', '2023-05-15', 'Hallada en superficie durante prospección', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Vasija cerámica fragmentada', 'Fragmento de vasija con decoración geométrica', 'Cerámica', 'Holoceno tardío', 'Buena', '2023-06-20', 'Fragmento con decoración incisa', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Herramienta de molienda', 'Mano de moler en granito', 'Granito', 'Holoceno medio', 'Regular', '2023-07-10', 'Herramienta para procesamiento de semillas', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Ornamental de concha', 'Cuenta de collar elaborada en concha marina', 'Concha marina', 'Holoceno tardío', 'Excelente', '2023-08-05', 'Ornamental de intercambio', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Fragmento de obsidiana', 'Lasca de obsidiana con retoque', 'Obsidiana', 'Holoceno tardío', 'Buena', '2023-09-12', 'Material de intercambio a larga distancia', (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx'))
ON CONFLICT DO NOTHING;

-- Insertar investigadores de ejemplo
INSERT INTO public.researchers (first_name, last_name, email, institution, specialization, academic_degree, research_interests, experience_years, user_id) VALUES
('Dr. María', 'González', 'maria.gonzalez@conicet.gov.ar', 'CONICET', 'Arqueología de cazadores-recolectores', 'Doctorado', ARRAY['Paleoindio', 'Arqueología de la Patagonia'], 15, (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Dr. Carlos', 'Rodríguez', 'carlos.rodriguez@unam.edu.ar', 'UNAM', 'Arqueología de la Pampa', 'Doctorado', ARRAY['Holoceno tardío', 'Cerámica arqueológica'], 12, (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Dra. Ana', 'Martínez', 'ana.martinez@uba.edu.ar', 'UBA', 'Bioarqueología', 'Doctorado', ARRAY['Antropología física', 'Paleopatología'], 18, (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Dr. Luis', 'Fernández', 'luis.fernandez@unc.edu.ar', 'UNC', 'Arqueología experimental', 'Doctorado', ARRAY['Tecnología lítica', 'Experimentación'], 10, (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx')),
('Dra. Patricia', 'López', 'patricia.lopez@unlp.edu.ar', 'UNLP', 'Arqueología histórica', 'Doctorado', ARRAY['Período colonial', 'Arqueología urbana'], 14, (SELECT id FROM public.users WHERE email = 'dr.perez@unam.mx'))
ON CONFLICT (email) DO NOTHING;







