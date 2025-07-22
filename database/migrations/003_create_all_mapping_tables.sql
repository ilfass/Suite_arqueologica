-- Migration: 003_create_all_mapping_tables
-- Description: Crear todas las tablas de mapping en el orden correcto
-- Created: 2025-07-16

-- =====================================================
-- CREAR TODAS LAS TABLAS DE MAPPING
-- =====================================================

-- 1. CREAR TABLA: grid_units (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grid_units') THEN
        CREATE TABLE public.grid_units (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            coordinates JSONB NOT NULL, -- {lat: number, lng: number, bounds: [[lat1,lng1], [lat2,lng2]]}
            size_width DECIMAL(10,2),
            size_height DECIMAL(10,2),
            depth DECIMAL(10,2),
            soil_type VARCHAR(100),
            stratigraphy TEXT,
            notes TEXT,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
        );
        
        -- Crear índices
        CREATE INDEX idx_grid_units_excavation_id ON public.grid_units(excavation_id);
        CREATE INDEX idx_grid_units_created_by ON public.grid_units(created_by);
        CREATE INDEX idx_grid_units_status ON public.grid_units(status);
        
        RAISE NOTICE 'Tabla grid_units creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla grid_units ya existe';
    END IF;
END $$;

-- 2. CREAR TABLA: measurements (si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'measurements') THEN
        CREATE TABLE public.measurements (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE,
            finding_id UUID, -- Referencia opcional a findings
            measurement_type VARCHAR(50) NOT NULL, -- 'distance', 'area', 'depth', 'angle'
            value DECIMAL(10,4) NOT NULL,
            unit VARCHAR(20) NOT NULL, -- 'cm', 'm', 'degrees', etc.
            coordinates JSONB, -- {lat: number, lng: number} para mediciones en el mapa
            description TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
        );
        
        -- Crear índices
        CREATE INDEX idx_measurements_grid_unit_id ON public.measurements(grid_unit_id);
        CREATE INDEX idx_measurements_finding_id ON public.measurements(finding_id);
        CREATE INDEX idx_measurements_type ON public.measurements(measurement_type);
        CREATE INDEX idx_measurements_created_by ON public.measurements(created_by);
        
        RAISE NOTICE 'Tabla measurements creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla measurements ya existe';
    END IF;
END $$;

-- 3. CORREGIR TABLA: findings (agregar columnas faltantes)
DO $$
BEGIN
    -- Verificar si la tabla findings existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'findings') THEN
        -- Agregar columna grid_unit_id si no existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'findings' 
            AND column_name = 'grid_unit_id'
        ) THEN
            ALTER TABLE public.findings 
            ADD COLUMN grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE;
            
            CREATE INDEX idx_findings_grid_unit_id ON public.findings(grid_unit_id);
            RAISE NOTICE 'Columna grid_unit_id agregada a la tabla findings';
        ELSE
            RAISE NOTICE 'Columna grid_unit_id ya existe en findings';
        END IF;
        
        -- Agregar columna coordinates si no existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'findings' 
            AND column_name = 'coordinates'
        ) THEN
            ALTER TABLE public.findings 
            ADD COLUMN coordinates JSONB;
            
            CREATE INDEX idx_findings_coordinates ON public.findings USING GIN(coordinates);
            RAISE NOTICE 'Columna coordinates agregada a la tabla findings';
        ELSE
            RAISE NOTICE 'Columna coordinates ya existe en findings';
        END IF;
        
        -- Agregar columna depth si no existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'findings' 
            AND column_name = 'depth'
        ) THEN
            ALTER TABLE public.findings 
            ADD COLUMN depth DECIMAL(10,2);
            
            RAISE NOTICE 'Columna depth agregada a la tabla findings';
        ELSE
            RAISE NOTICE 'Columna depth ya existe en findings';
        END IF;
        
        -- Agregar columna soil_context si no existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'findings' 
            AND column_name = 'soil_context'
        ) THEN
            ALTER TABLE public.findings 
            ADD COLUMN soil_context TEXT;
            
            RAISE NOTICE 'Columna soil_context agregada a la tabla findings';
        ELSE
            RAISE NOTICE 'Columna soil_context ya existe en findings';
        END IF;
        
        -- Agregar columna created_by si no existe
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'findings' 
            AND column_name = 'created_by'
        ) THEN
            ALTER TABLE public.findings 
            ADD COLUMN created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;
            
            CREATE INDEX idx_findings_created_by ON public.findings(created_by);
            RAISE NOTICE 'Columna created_by agregada a la tabla findings';
        ELSE
            RAISE NOTICE 'Columna created_by ya existe en findings';
        END IF;
        
    ELSE
        -- Crear tabla findings completa si no existe
        CREATE TABLE public.findings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            grid_unit_id UUID REFERENCES public.grid_units(id) ON DELETE CASCADE,
            name VARCHAR(200) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            material VARCHAR(100),
            period VARCHAR(100),
            coordinates JSONB, -- {lat: number, lng: number}
            depth DECIMAL(10,2),
            soil_context TEXT,
            condition VARCHAR(100),
            dimensions JSONB, -- {length: number, width: number, height: number, unit: string}
            weight DECIMAL(10,2),
            weight_unit VARCHAR(10) DEFAULT 'g',
            photos TEXT[], -- URLs de las fotos
            notes TEXT,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
        );
        
        -- Crear índices
        CREATE INDEX idx_findings_grid_unit_id ON public.findings(grid_unit_id);
        CREATE INDEX idx_findings_category ON public.findings(category);
        CREATE INDEX idx_findings_material ON public.findings(material);
        CREATE INDEX idx_findings_period ON public.findings(period);
        CREATE INDEX idx_findings_status ON public.findings(status);
        CREATE INDEX idx_findings_created_by ON public.findings(created_by);
        CREATE INDEX idx_findings_coordinates ON public.findings USING GIN(coordinates);
        
        RAISE NOTICE 'Tabla findings creada exitosamente';
    END IF;
END $$;

-- 4. ACTUALIZAR REFERENCIA EN measurements PARA findings
DO $$
BEGIN
    -- Agregar foreign key constraint si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'measurements_finding_id_fkey'
    ) THEN
        ALTER TABLE public.measurements 
        ADD CONSTRAINT measurements_finding_id_fkey 
        FOREIGN KEY (finding_id) REFERENCES public.findings(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint agregado a measurements.finding_id';
    ELSE
        RAISE NOTICE 'Foreign key constraint ya existe en measurements.finding_id';
    END IF;
END $$;

-- =====================================================
-- VERIFICAR ESTRUCTURA FINAL
-- =====================================================

-- Mostrar estructura de las tablas creadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('grid_units', 'findings', 'measurements')
ORDER BY table_name, ordinal_position;

-- Mostrar índices creados
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('grid_units', 'findings', 'measurements')
ORDER BY tablename, indexname;

-- Mensaje final de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Migración completada exitosamente';
    RAISE NOTICE '📊 Tablas de mapping creadas/actualizadas: grid_units, findings, measurements';
END $$; 