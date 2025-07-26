-- ========================================
-- CREAR TABLAS FALTANTES
-- ========================================

-- Crear tabla users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'researcher',
    full_name TEXT,
    institution TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla archaeological_sites
CREATE TABLE IF NOT EXISTS public.archaeological_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    coordinates POINT,
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla objects
CREATE TABLE IF NOT EXISTS public.objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    site_id UUID REFERENCES public.archaeological_sites(id),
    category TEXT,
    material TEXT,
    dimensions TEXT,
    condition TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla excavations
CREATE TABLE IF NOT EXISTS public.excavations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    site_id UUID REFERENCES public.archaeological_sites(id),
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'planned',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla researchers
CREATE TABLE IF NOT EXISTS public.researchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    specialization TEXT,
    experience_years INTEGER,
    publications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archaeological_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excavations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researchers ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas para users
CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (true);

-- Crear políticas básicas para archaeological_sites
CREATE POLICY "sites_select_policy" ON public.archaeological_sites FOR SELECT USING (true);
CREATE POLICY "sites_insert_policy" ON public.archaeological_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "sites_update_policy" ON public.archaeological_sites FOR UPDATE USING (true);

-- Crear políticas básicas para objects
CREATE POLICY "objects_select_policy" ON public.objects FOR SELECT USING (true);
CREATE POLICY "objects_insert_policy" ON public.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "objects_update_policy" ON public.objects FOR UPDATE USING (true);

-- Crear políticas básicas para excavations
CREATE POLICY "excavations_select_policy" ON public.excavations FOR SELECT USING (true);
CREATE POLICY "excavations_insert_policy" ON public.excavations FOR INSERT WITH CHECK (true);
CREATE POLICY "excavations_update_policy" ON public.excavations FOR UPDATE USING (true);

-- Crear políticas básicas para projects
CREATE POLICY "projects_select_policy" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_policy" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "projects_update_policy" ON public.projects FOR UPDATE USING (true);

-- Crear políticas básicas para researchers
CREATE POLICY "researchers_select_policy" ON public.researchers FOR SELECT USING (true);
CREATE POLICY "researchers_insert_policy" ON public.researchers FOR INSERT WITH CHECK (true);
CREATE POLICY "researchers_update_policy" ON public.researchers FOR UPDATE USING (true); 