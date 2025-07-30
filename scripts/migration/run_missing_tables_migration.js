const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno del backend
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Ejecutando migración para crear tablas faltantes...');
  
  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../../database/migrations/006_create_missing_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Archivo de migración leído');
    
    // Ejecutar la migración
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Error al ejecutar migración:', error);
      return;
    }
    
    console.log('✅ Migración ejecutada exitosamente');
    
    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...');
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.error('❌ Error al verificar tabla projects:', projectsError);
    } else {
      console.log('✅ Tabla projects creada correctamente');
    }
    
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select('*')
      .limit(1);
    
    if (areasError) {
      console.error('❌ Error al verificar tabla areas:', areasError);
    } else {
      console.log('✅ Tabla areas creada correctamente');
    }
    
    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

// Ejecutar la migración
runMigration().catch(console.error); 