const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔧 Configurando base de datos...');
  
  try {
    // 1. Crear tabla objects como alias de artifacts
    console.log('📋 Creando tabla objects...');
    const { error: objectsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.objects (
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
      `
    });
    
    if (objectsError) {
      console.log('⚠️  Tabla objects ya existe o error:', objectsError.message);
    } else {
      console.log('✅ Tabla objects creada');
    }

    // 2. Crear tabla findings
    console.log('📋 Creando tabla findings...');
    const { error: findingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.findings (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
          excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          finding_type TEXT NOT NULL,
          location GEOGRAPHY(POINT, 4326),
          depth DECIMAL,
          dimensions JSONB,
          material TEXT,
          condition TEXT,
          discovery_date DATE,
          catalog_number TEXT,
          images TEXT[],
          notes TEXT,
          created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (findingsError) {
      console.log('⚠️  Tabla findings ya existe o error:', findingsError.message);
    } else {
      console.log('✅ Tabla findings creada');
    }

    // 3. Crear tabla projects
    console.log('📋 Creando tabla projects...');
    const { error: projectsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.projects (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'suspended')),
          start_date DATE,
          end_date DATE,
          budget DECIMAL,
          team_leader UUID REFERENCES public.users(id) ON DELETE SET NULL,
          team_members UUID[],
          objectives TEXT[],
          methodology TEXT,
          site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE,
          created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (projectsError) {
      console.log('⚠️  Tabla projects ya existe o error:', projectsError.message);
    } else {
      console.log('✅ Tabla projects creada');
    }

    // 4. Crear tabla grid_units
    console.log('📋 Creando tabla grid_units...');
    const { error: gridUnitsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.grid_units (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          site_id UUID REFERENCES public.archaeological_sites(id) ON DELETE CASCADE NOT NULL,
          excavation_id UUID REFERENCES public.excavations(id) ON DELETE CASCADE,
          unit_number TEXT NOT NULL,
          location GEOGRAPHY(POINT, 4326),
          dimensions JSONB,
          depth DECIMAL,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
          notes TEXT,
          created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (gridUnitsError) {
      console.log('⚠️  Tabla grid_units ya existe o error:', gridUnitsError.message);
    } else {
      console.log('✅ Tabla grid_units creada');
    }

    // 5. Insertar datos de ejemplo
    console.log('📝 Insertando datos de ejemplo...');
    
    // Insertar objetos de ejemplo
    const { error: insertObjectsError } = await supabase
      .from('objects')
      .insert([
        {
          site_id: '00000000-0000-0000-0000-000000000001',
          name: 'Vaso ceremonial',
          description: 'Vaso ceremonial de cerámica con decoración geométrica',
          artifact_type: 'ceramic',
          material: 'ceramic',
          condition: 'good',
          catalog_number: 'OBJ-001',
          created_by: '00000000-0000-0000-0000-000000000001'
        },
        {
          site_id: '00000000-0000-0000-0000-000000000001',
          name: 'Punta de flecha',
          description: 'Punta de flecha de obsidiana',
          artifact_type: 'tool',
          material: 'obsidian',
          condition: 'excellent',
          catalog_number: 'OBJ-002',
          created_by: '00000000-0000-0000-0000-000000000001'
        }
      ])
      .select();

    if (insertObjectsError) {
      console.log('⚠️  Error insertando objetos:', insertObjectsError.message);
    } else {
      console.log('✅ Objetos de ejemplo insertados');
    }

    // Insertar proyectos de ejemplo
    const { error: insertProjectsError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Proyecto Teotihuacán 2024',
          description: 'Investigación arqueológica en la zona norte de Teotihuacán',
          status: 'active',
          start_date: '2024-01-01',
          team_leader: '00000000-0000-0000-0000-000000000002',
          site_id: '00000000-0000-0000-0000-000000000001',
          created_by: '00000000-0000-0000-0000-000000000002'
        }
      ])
      .select();

    if (insertProjectsError) {
      console.log('⚠️  Error insertando proyectos:', insertProjectsError.message);
    } else {
      console.log('✅ Proyectos de ejemplo insertados');
    }

    console.log('✅ Configuración de base de datos completada');

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
  }
}

setupDatabase(); 