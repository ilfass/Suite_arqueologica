-- Esquema de base de datos mejorado para Suite Arqueológica
-- Basado en estándares internacionales: ICOMOS, ICANH, CSIC, SAA
-- Ejecutar en Supabase SQL Editor

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ========================================
-- TABLA DE USUARIOS (sin cambios)
-- ========================================
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

-- ========================================
-- FICHA COMPLETA DE SITIOS ARQUEOLÓGICOS
-- Basada en estándares ICOMOS e ICANH
-- ========================================
CREATE TABLE IF NOT EXISTS public.archaeological_sites (
    -- IDENTIFICACIÓN BÁSICA
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_code TEXT UNIQUE NOT NULL, -- Código único del sitio
    name TEXT NOT NULL,
    alternative_names TEXT[], -- Nombres alternativos o históricos
    
    -- UBICACIÓN GEOGRÁFICA
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    administrative_division JSONB, -- {country, state, city, district}
    coordinates_precision TEXT, -- GPS, mapa, estimación
    elevation DECIMAL, -- Altitud en metros
    elevation_reference TEXT, -- Referencia de altitud
    
    -- CLASIFICACIÓN Y TIPOLOGÍA
    site_type TEXT NOT NULL, -- Asentamiento, cementerio, taller, etc.
    site_category TEXT, -- Urbano, rural, ceremonial, doméstico
    cultural_period TEXT, -- Período cultural principal
    cultural_affiliation TEXT, -- Afiliación cultural específica
    chronology JSONB, -- {start_date, end_date, certainty_level}
    
    -- CARACTERÍSTICAS FÍSICAS
    area_size DECIMAL, -- Tamaño en hectáreas
    area_unit TEXT DEFAULT 'hectares',
    site_boundaries TEXT, -- Descripción de límites
    topography TEXT, -- Características topográficas
    geology TEXT, -- Contexto geológico
    vegetation TEXT, -- Vegetación actual
    water_sources TEXT, -- Fuentes de agua cercanas
    
    -- ESTADO DE CONSERVACIÓN
    preservation_status TEXT NOT NULL DEFAULT 'good' CHECK (preservation_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
    threats JSONB, -- Amenazas identificadas
    conservation_measures TEXT, -- Medidas de conservación aplicadas
    accessibility TEXT, -- Accesibilidad al sitio
    
    -- HISTORIA DE INVESTIGACIÓN
    discovery_date DATE,
    discoverer TEXT,
    research_history JSONB, -- Historial de investigaciones
    previous_excavations TEXT, -- Excavaciones previas
    published_references TEXT[], -- Referencias bibliográficas
    
    -- CONTEXTO ARQUEOLÓGICO
    stratigraphy_summary TEXT, -- Resumen estratigráfico
    cultural_layers TEXT, -- Capas culturales identificadas
    associated_sites TEXT[], -- Sitios asociados
    environmental_context TEXT, -- Contexto ambiental
    
    -- DOCUMENTACIÓN
    documentation_status TEXT DEFAULT 'incomplete',
    survey_methods TEXT[], -- Métodos de prospección utilizados
    mapping_status TEXT, -- Estado de cartografía
    photographic_documentation BOOLEAN DEFAULT FALSE,
    
    -- LEGAL Y ADMINISTRATIVO
    legal_protection TEXT, -- Protección legal
    ownership TEXT, -- Propiedad del terreno
    permits_required BOOLEAN DEFAULT FALSE,
    permit_status TEXT,
    
    -- METADATOS
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'destroyed')),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- CAMPOS ADICIONALES
    notes TEXT,
    tags TEXT[]
);

-- ========================================
-- FICHA COMPLETA DE ARTEFACTOS
-- Basada en estándares de catalogación internacional
-- ========================================
CREATE TABLE IF NOT EXISTS public.artifacts (
    -- IDENTIFICACIÓN BÁSICA
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    catalog_number TEXT UNIQUE NOT NULL, -- Número de catálogo único
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE SET NULL,
    
    -- CLASIFICACIÓN
    name TEXT NOT NULL,
    artifact_type TEXT NOT NULL, -- Herramienta, cerámica, lítico, etc.
    artifact_category TEXT, -- Categoría específica
    functional_classification TEXT, -- Clasificación funcional
    typological_classification TEXT, -- Clasificación tipológica
    
    -- MATERIALES Y TECNOLOGÍA
    primary_material TEXT NOT NULL, -- Material principal
    secondary_materials TEXT[], -- Materiales secundarios
    manufacturing_technique TEXT, -- Técnica de manufactura
    surface_treatment TEXT, -- Tratamiento de superficie
    decoration TEXT, -- Decoración presente
    
    -- DIMENSIONES Y PESO
    dimensions JSONB, -- {length, width, height, thickness, diameter}
    weight DECIMAL, -- Peso en gramos
    weight_unit TEXT DEFAULT 'grams',
    volume DECIMAL, -- Volumen en cm³
    volume_unit TEXT DEFAULT 'cm3',
    
    -- ESTADO DE CONSERVACIÓN
    condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'fragmentary')),
    preservation_issues TEXT[], -- Problemas de conservación
    conservation_treatments TEXT, -- Tratamientos aplicados
    storage_location TEXT, -- Ubicación de almacenamiento
    
    -- CONTEXTO DE HALLAZGO
    discovery_date DATE,
    discovery_location GEOGRAPHY(POINT, 4326),
    stratigraphic_unit TEXT, -- Unidad estratigráfica
    depth DECIMAL, -- Profundidad de hallazgo
    depth_unit TEXT DEFAULT 'cm',
    associated_materials TEXT[], -- Materiales asociados
    spatial_context TEXT, -- Contexto espacial
    
    -- ANÁLISIS Y ESTUDIOS
    analysis_status TEXT DEFAULT 'pending',
    laboratory_analysis TEXT[], -- Análisis de laboratorio realizados
    dating_methods TEXT[], -- Métodos de datación
    dating_results JSONB, -- Resultados de datación
    provenance_analysis TEXT, -- Análisis de procedencia
    
    -- DOCUMENTACIÓN FOTOGRÁFICA
    images TEXT[], -- URLs de imágenes
    drawings TEXT[], -- URLs de dibujos
    sketches TEXT[], -- URLs de bocetos
    documentation_quality TEXT, -- Calidad de documentación
    
    -- INTERPRETACIÓN
    function_hypothesis TEXT, -- Hipótesis de función
    cultural_affiliation TEXT, -- Afiliación cultural
    chronological_period TEXT, -- Período cronológico
    trade_evidence BOOLEAN DEFAULT FALSE, -- Evidencia de comercio
    
    -- METADATOS
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- CAMPOS ADICIONALES
    description TEXT,
    notes TEXT,
    tags TEXT[]
);

-- ========================================
-- FICHA COMPLETA DE EXCAVACIONES
-- Basada en estándares de metodología arqueológica
-- ========================================
CREATE TABLE IF NOT EXISTS public.excavations (
    -- IDENTIFICACIÓN BÁSICA
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    excavation_code TEXT UNIQUE NOT NULL, -- Código único de excavación
    site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    -- PLANIFICACIÓN Y OBJETIVOS
    objectives JSONB, -- Objetivos específicos
    research_questions TEXT[], -- Preguntas de investigación
    methodology TEXT, -- Metodología empleada
    excavation_strategy TEXT, -- Estrategia de excavación
    
    -- CRONOLOGÍA
    start_date DATE NOT NULL,
    end_date DATE,
    planned_duration INTEGER, -- Duración planificada en días
    actual_duration INTEGER, -- Duración real en días
    season_number INTEGER, -- Número de temporada
    
    -- EQUIPO Y RESPONSABILIDADES
    team_leader UUID REFERENCES public.users(id) ON DELETE SET NULL,
    team_members JSONB, -- [{user_id, role, start_date, end_date}]
    external_collaborators TEXT[], -- Colaboradores externos
    institutions_involved TEXT[], -- Instituciones participantes
    
    -- ÁREA DE EXCAVACIÓN
    excavation_area DECIMAL, -- Área en m²
    area_unit TEXT DEFAULT 'm2',
    grid_system TEXT, -- Sistema de cuadrícula utilizado
    excavation_units JSONB, -- Unidades de excavación
    depth_excavated DECIMAL, -- Profundidad excavada
    depth_unit TEXT DEFAULT 'cm',
    
    -- METODOLOGÍA DE EXCAVACIÓN
    excavation_method TEXT, -- Método de excavación
    stratigraphic_recording BOOLEAN DEFAULT TRUE,
    three_dimensional_recording BOOLEAN DEFAULT FALSE,
    sampling_strategy TEXT, -- Estrategia de muestreo
    sieving_methods TEXT[], -- Métodos de cribado
    
    -- HALLAZGOS Y RESULTADOS
    findings_summary TEXT,
    artifacts_recovered INTEGER, -- Número de artefactos recuperados
    features_identified TEXT[], -- Rasgos identificados
    structures_discovered TEXT[], -- Estructuras descubiertas
    human_remains BOOLEAN DEFAULT FALSE,
    faunal_remains BOOLEAN DEFAULT FALSE,
    botanical_remains BOOLEAN DEFAULT FALSE,
    
    -- DOCUMENTACIÓN DE CAMPO
    field_notes BOOLEAN DEFAULT TRUE,
    photographic_documentation BOOLEAN DEFAULT TRUE,
    video_documentation BOOLEAN DEFAULT FALSE,
    drawings_created BOOLEAN DEFAULT TRUE,
    mapping_completed BOOLEAN DEFAULT FALSE,
    
    -- ANÁLISIS DE LABORATORIO
    laboratory_analysis_planned TEXT[],
    laboratory_analysis_completed TEXT[],
    dating_samples_collected INTEGER,
    conservation_treatments_applied TEXT[],
    
    -- ESTADO Y PROGRESO
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'suspended', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0,
    completion_date DATE,
    
    -- PRESUPUESTO Y RECURSOS
    budget_allocated DECIMAL, -- Presupuesto asignado
    budget_currency TEXT DEFAULT 'USD',
    budget_spent DECIMAL, -- Presupuesto gastado
    equipment_used TEXT[], -- Equipamiento utilizado
    
    -- PERMISOS Y AUTORIZACIONES
    permits_obtained BOOLEAN DEFAULT FALSE,
    permit_numbers TEXT[],
    permit_expiry_date DATE,
    landowner_permission BOOLEAN DEFAULT FALSE,
    
    -- METADATOS
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- CAMPOS ADICIONALES
    notes TEXT,
    tags TEXT[]
);

-- ========================================
-- TABLA DE UNIDADES ESTRATIGRÁFICAS
-- Basada en metodología de Harris Matrix
-- ========================================
CREATE TABLE IF NOT EXISTS public.stratigraphic_units (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE NOT NULL,
    unit_number TEXT NOT NULL, -- Número de unidad
    unit_type TEXT NOT NULL, -- Contexto, corte, relleno, etc.
    
    -- CARACTERÍSTICAS FÍSICAS
    dimensions JSONB, -- Dimensiones de la unidad
    depth_top DECIMAL, -- Profundidad superior
    depth_bottom DECIMAL, -- Profundidad inferior
    depth_unit TEXT DEFAULT 'cm',
    
    -- DESCRIPCIÓN
    description TEXT,
    color TEXT,
    texture TEXT,
    composition TEXT,
    inclusions TEXT, -- Inclusión de materiales
    
    -- RELACIONES ESTRATIGRÁFICAS
    overlies TEXT[], -- Unidades que yacen sobre esta
    underlies TEXT[], -- Unidades que yacen bajo esta
    cuts TEXT[], -- Unidades que corta
    cut_by TEXT[], -- Unidades que la cortan
    
    -- INTERPRETACIÓN
    formation_process TEXT, -- Proceso de formación
    cultural_period TEXT,
    function_hypothesis TEXT,
    
    -- DOCUMENTACIÓN
    photographs TEXT[],
    drawings TEXT[],
    samples_collected INTEGER,
    
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLA DE RASGOS ARQUEOLÓGICOS
-- ========================================
CREATE TABLE IF NOT EXISTS public.archaeological_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE NOT NULL,
    feature_number TEXT NOT NULL,
    feature_type TEXT NOT NULL, -- Hoyo, muro, fogón, etc.
    
    -- CARACTERÍSTICAS
    description TEXT,
    dimensions JSONB,
    depth DECIMAL,
    depth_unit TEXT DEFAULT 'cm',
    
    -- CONTEXTO
    stratigraphic_unit TEXT,
    associated_artifacts TEXT[],
    function_hypothesis TEXT,
    
    -- DOCUMENTACIÓN
    photographs TEXT[],
    drawings TEXT[],
    plans TEXT[],
    
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLA DE MUESTRAS
-- ========================================
CREATE TABLE IF NOT EXISTS public.samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sample_number TEXT UNIQUE NOT NULL,
    excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE NOT NULL,
    stratigraphic_unit_id UUID REFERENCES public.stratigraphic_units(id) ON DELETE SET NULL,
    
    -- CLASIFICACIÓN
    sample_type TEXT NOT NULL, -- Carbono, cerámica, lítico, etc.
    material TEXT,
    
    -- CONTEXTO
    collection_date DATE,
    collection_method TEXT,
    location GEOGRAPHY(POINT, 4326),
    depth DECIMAL,
    depth_unit TEXT DEFAULT 'cm',
    
    -- ANÁLISIS
    analysis_requested TEXT[],
    analysis_completed TEXT[],
    results JSONB,
    
    -- ALMACENAMIENTO
    storage_location TEXT,
    storage_conditions TEXT,
    
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLAS EXISTENTES (sin cambios)
-- ========================================
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

-- ========================================
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- ========================================
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_location ON public.archaeological_sites USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_status ON public.archaeological_sites (status);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_site_code ON public.archaeological_sites (site_code);
CREATE INDEX IF NOT EXISTS idx_archaeological_sites_created_by ON public.archaeological_sites (created_by);
CREATE INDEX IF NOT EXISTS idx_artifacts_site_id ON public.artifacts (site_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_catalog_number ON public.artifacts (catalog_number);
CREATE INDEX IF NOT EXISTS idx_artifacts_type ON public.artifacts (artifact_type);
CREATE INDEX IF NOT EXISTS idx_excavations_site_id ON public.excavations (site_id);
CREATE INDEX IF NOT EXISTS idx_excavations_excavation_code ON public.excavations (excavation_code);
CREATE INDEX IF NOT EXISTS idx_excavations_status ON public.excavations (status);
CREATE INDEX IF NOT EXISTS idx_stratigraphic_units_excavation_id ON public.stratigraphic_units (excavation_id);
CREATE INDEX IF NOT EXISTS idx_archaeological_features_excavation_id ON public.archaeological_features (excavation_id);
CREATE INDEX IF NOT EXISTS idx_samples_excavation_id ON public.samples (excavation_id);
CREATE INDEX IF NOT EXISTS idx_documents_site_id ON public.documents (site_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents (document_type);
CREATE INDEX IF NOT EXISTS idx_measurements_site_id ON public.measurements (site_id);
CREATE INDEX IF NOT EXISTS idx_site_permissions_site_id ON public.site_permissions (site_id);
CREATE INDEX IF NOT EXISTS idx_site_permissions_user_id ON public.site_permissions (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (read);

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================
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
CREATE TRIGGER update_stratigraphic_units_updated_at BEFORE UPDATE ON public.stratigraphic_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archaeological_features_updated_at BEFORE UPDATE ON public.archaeological_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_samples_updated_at BEFORE UPDATE ON public.samples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- POLÍTICAS DE SEGURIDAD RLS
-- ========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archaeological_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excavations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stratigraphic_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archaeological_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samples ENABLE ROW LEVEL SECURITY;
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

-- Políticas similares para otras tablas...
-- (Se pueden agregar más políticas según sea necesario)

-- ========================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ========================================
COMMENT ON TABLE public.archaeological_sites IS 'Ficha completa de sitios arqueológicos basada en estándares ICOMOS e ICANH';
COMMENT ON TABLE public.artifacts IS 'Ficha completa de artefactos arqueológicos con catalogación detallada';
COMMENT ON TABLE public.excavations IS 'Ficha completa de excavaciones arqueológicas con metodología detallada';
COMMENT ON TABLE public.stratigraphic_units IS 'Unidades estratigráficas con relaciones de Harris Matrix';
COMMENT ON TABLE public.archaeological_features IS 'Rasgos arqueológicos identificados durante excavaciones';
COMMENT ON TABLE public.samples IS 'Muestras recolectadas para análisis de laboratorio'; 