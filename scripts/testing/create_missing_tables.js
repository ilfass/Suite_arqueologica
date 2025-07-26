require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
    try {
        console.log('🔧 Creando tablas faltantes...');
        
        // SQL para crear la tabla users
        const createUsersTable = `
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
        `;

        // SQL para crear la tabla archaeological_sites
        const createSitesTable = `
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
        `;

        // SQL para crear la tabla objects
        const createObjectsTable = `
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
        `;

        // SQL para crear la tabla excavations
        const createExcavationsTable = `
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
        `;

        // SQL para crear la tabla projects
        const createProjectsTable = `
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
        `;

        // SQL para crear la tabla researchers
        const createResearchersTable = `
            CREATE TABLE IF NOT EXISTS public.researchers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES public.users(id),
                specialization TEXT,
                experience_years INTEGER,
                publications TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        // Ejecutar las creaciones
        const tables = [
            { name: 'users', sql: createUsersTable },
            { name: 'archaeological_sites', sql: createSitesTable },
            { name: 'objects', sql: createObjectsTable },
            { name: 'excavations', sql: createExcavationsTable },
            { name: 'projects', sql: createProjectsTable },
            { name: 'researchers', sql: createResearchersTable }
        ];

        for (const table of tables) {
            try {
                console.log(`🔧 Creando tabla ${table.name}...`);
                
                const { error } = await supabase.rpc('exec_sql', {
                    sql: table.sql
                });

                if (error) {
                    console.error(`❌ Error creando ${table.name}:`, error.message);
                } else {
                    console.log(`✅ Tabla ${table.name} creada exitosamente`);
                }
            } catch (err) {
                console.error(`❌ Error inesperado creando ${table.name}:`, err.message);
            }
        }

        console.log('🎉 Proceso de creación de tablas completado');

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

createMissingTables(); 