-- ===== ESQUEMA PARA CONTEXT SERVICE =====

-- Tabla de proyectos arqueológicos
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'PLANNED', 'CANCELLED')),
    director_id UUID NOT NULL,
    institution_id UUID,
    location JSONB NOT NULL,
    budget DECIMAL(15,2),
    objectives TEXT[] NOT NULL,
    methodology TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de áreas de excavación
CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    coordinates JSONB NOT NULL,
    size DECIMAL(10,2) NOT NULL, -- en metros cuadrados
    type VARCHAR(20) NOT NULL CHECK (type IN ('EXCAVATION', 'SURVEY', 'CONSERVATION', 'DOCUMENTATION')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'PLANNED')),
    assigned_researchers UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sitios arqueológicos
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    coordinates JSONB NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('SETTLEMENT', 'CEMETERY', 'TEMPLE', 'FORTIFICATION', 'WORKSHOP', 'OTHER')),
    period VARCHAR(100) NOT NULL,
    cultural_affiliation VARCHAR(255) NOT NULL,
    preservation_status VARCHAR(20) NOT NULL CHECK (preservation_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL')),
    images TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de descubrimientos
CREATE TABLE IF NOT EXISTS discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ARTIFACT', 'STRUCTURE', 'BURIAL', 'INSCRIPTION', 'OTHER')),
    description TEXT NOT NULL,
    date DATE NOT NULL,
    discoverer_id UUID NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_director_id ON projects(director_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_areas_project_id ON areas(project_id);
CREATE INDEX IF NOT EXISTS idx_sites_area_id ON sites(area_id);
CREATE INDEX IF NOT EXISTS idx_discoveries_site_id ON discoveries(site_id);
CREATE INDEX IF NOT EXISTS idx_discoveries_date ON discoveries(date);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE discoveries ENABLE ROW LEVEL SECURITY;

-- Políticas para projects
CREATE POLICY "Users can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Directors can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = director_id);

CREATE POLICY "Directors can update their projects" ON projects
    FOR UPDATE USING (auth.uid() = director_id);

-- Políticas para areas
CREATE POLICY "Users can view areas" ON areas
    FOR SELECT USING (true);

CREATE POLICY "Project directors can create areas" ON areas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = areas.project_id 
            AND projects.director_id = auth.uid()
        )
    );

CREATE POLICY "Project directors can update areas" ON areas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = areas.project_id 
            AND projects.director_id = auth.uid()
        )
    );

-- Políticas para sites
CREATE POLICY "Users can view sites" ON sites
    FOR SELECT USING (true);

CREATE POLICY "Area directors can create sites" ON sites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM areas 
            JOIN projects ON areas.project_id = projects.id
            WHERE areas.id = sites.area_id 
            AND projects.director_id = auth.uid()
        )
    );

CREATE POLICY "Area directors can update sites" ON sites
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM areas 
            JOIN projects ON areas.project_id = projects.id
            WHERE areas.id = sites.area_id 
            AND projects.director_id = auth.uid()
        )
    );

-- Políticas para discoveries
CREATE POLICY "Users can view discoveries" ON discoveries
    FOR SELECT USING (true);

CREATE POLICY "Researchers can create discoveries" ON discoveries
    FOR INSERT WITH CHECK (auth.uid() = discoverer_id);

CREATE POLICY "Discoverers can update their discoveries" ON discoveries
    FOR UPDATE USING (auth.uid() = discoverer_id); 