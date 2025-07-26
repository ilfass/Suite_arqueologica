-- ============================================================================
-- MIGRACIÓN: Crear tabla user_context para persistencia de contexto
-- ============================================================================

-- Crear tabla para almacenar el contexto activo de cada usuario
CREATE TABLE IF NOT EXISTS user_context (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id VARCHAR(50) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    area_id VARCHAR(50) NOT NULL,
    area_name VARCHAR(255) NOT NULL,
    site_id VARCHAR(50),
    site_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para optimizar consultas
    UNIQUE(user_id)
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_context_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_user_context_updated_at ON user_context;
CREATE TRIGGER trigger_update_user_context_updated_at
    BEFORE UPDATE ON user_context
    FOR EACH ROW
    EXECUTE FUNCTION update_user_context_updated_at();

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_context_user_id ON user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_user_context_project_id ON user_context(project_id);
CREATE INDEX IF NOT EXISTS idx_user_context_area_id ON user_context(area_id);
CREATE INDEX IF NOT EXISTS idx_user_context_site_id ON user_context(site_id);

-- Insertar datos de ejemplo para testing (solo si existe el usuario)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'investigador@test.com') THEN
        INSERT INTO user_context (user_id, project_id, project_name, area_id, area_name, site_id, site_name)
        VALUES 
            (
                (SELECT id FROM auth.users WHERE email = 'investigador@test.com' LIMIT 1),
                'proj-001',
                'Proyecto Cazadores Recolectores - La Laguna',
                'area-001',
                'Laguna La Brava',
                'site-001',
                'Sitio Pampeano La Laguna'
            )
        ON CONFLICT (user_id) DO UPDATE SET
            project_id = EXCLUDED.project_id,
            project_name = EXCLUDED.project_name,
            area_id = EXCLUDED.area_id,
            area_name = EXCLUDED.area_name,
            site_id = EXCLUDED.site_id,
            site_name = EXCLUDED.site_name,
            updated_at = NOW();
    END IF;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE user_context IS 'Almacena el contexto activo de cada usuario (proyecto, área, sitio)';
COMMENT ON COLUMN user_context.user_id IS 'ID del usuario autenticado';
COMMENT ON COLUMN user_context.project_id IS 'ID del proyecto seleccionado';
COMMENT ON COLUMN user_context.project_name IS 'Nombre del proyecto para mostrar en UI';
COMMENT ON COLUMN user_context.area_id IS 'ID del área seleccionada';
COMMENT ON COLUMN user_context.area_name IS 'Nombre del área para mostrar en UI';
COMMENT ON COLUMN user_context.site_id IS 'ID del sitio seleccionado (opcional)';
COMMENT ON COLUMN user_context.site_name IS 'Nombre del sitio para mostrar en UI (opcional)'; 