const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase (usar las credenciales del archivo .env si están disponibles)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseUrl || supabaseKey === 'your-service-role-key') {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configurados');
  console.log('💡 Por favor, configura las variables de entorno o actualiza este script con las credenciales correctas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL de migración
const migrationSQL = `
-- Migración para actualizar la tabla users con campos específicos por rol
-- Ejecutar en Supabase SQL Editor

-- Agregar campos comunes
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;

-- Agregar campos específicos para INSTITUTION
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS institution_name TEXT,
ADD COLUMN IF NOT EXISTS institution_address TEXT,
ADD COLUMN IF NOT EXISTS institution_website TEXT,
ADD COLUMN IF NOT EXISTS institution_department TEXT,
ADD COLUMN IF NOT EXISTS institution_email TEXT,
ADD COLUMN IF NOT EXISTS institution_alternative_email TEXT;

-- Agregar campos específicos para DIRECTOR
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS director_document_id TEXT,
ADD COLUMN IF NOT EXISTS director_highest_degree TEXT,
ADD COLUMN IF NOT EXISTS director_discipline TEXT,
ADD COLUMN IF NOT EXISTS director_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS director_current_institution TEXT,
ADD COLUMN IF NOT EXISTS director_current_position TEXT,
ADD COLUMN IF NOT EXISTS director_cv_link TEXT;

-- Agregar campos específicos para RESEARCHER
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS researcher_document_id TEXT,
ADD COLUMN IF NOT EXISTS researcher_career TEXT,
ADD COLUMN IF NOT EXISTS researcher_year TEXT,
ADD COLUMN IF NOT EXISTS researcher_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS researcher_role TEXT,
ADD COLUMN IF NOT EXISTS researcher_area TEXT,
ADD COLUMN IF NOT EXISTS researcher_director_id UUID REFERENCES public.users(id);

-- Agregar campos específicos para STUDENT
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS student_document_id TEXT,
ADD COLUMN IF NOT EXISTS student_highest_degree TEXT,
ADD COLUMN IF NOT EXISTS student_discipline TEXT,
ADD COLUMN IF NOT EXISTS student_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS student_current_institution TEXT,
ADD COLUMN IF NOT EXISTS student_current_position TEXT,
ADD COLUMN IF NOT EXISTS student_cv_link TEXT;

-- Actualizar la restricción de roles para incluir DIRECTOR
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST'));

-- Migrar datos existentes (si los hay)
UPDATE public.users 
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL THEN split_part(full_name, ' ', 1)
    ELSE email
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN substring(full_name from position(' ' in full_name) + 1)
    ELSE ''
  END,
  country = 'Argentina',
  province = 'Buenos Aires',
  city = 'La Plata'
WHERE first_name IS NULL;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON public.users(country);
CREATE INDEX IF NOT EXISTS idx_users_terms_accepted ON public.users(terms_accepted);
CREATE INDEX IF NOT EXISTS idx_users_researcher_director_id ON public.users(researcher_director_id);
`;

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración del nuevo sistema de registro...\n');
    
    // Ejecutar la migración SQL
    console.log('📝 Ejecutando migración SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Error ejecutando migración:', error);
      return;
    }
    
    console.log('✅ Migración SQL ejecutada exitosamente');
    
    // Verificar que los campos se agregaron correctamente
    console.log('\n🔍 Verificando estructura de la tabla...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error verificando tabla:', tableError);
      return;
    }
    
    console.log('✅ Tabla users verificada correctamente');
    
    // Verificar campos específicos
    const expectedFields = [
      'first_name', 'last_name', 'country', 'province', 'city', 'terms_accepted',
      'institution_name', 'institution_address', 'institution_website', 'institution_department',
      'director_document_id', 'director_highest_degree', 'director_discipline',
      'researcher_document_id', 'researcher_career', 'researcher_year',
      'student_document_id', 'student_highest_degree', 'student_discipline'
    ];
    
    console.log('\n📊 Verificando campos específicos...');
    const sampleUser = tableInfo[0] || {};
    let fieldsFound = 0;
    
    expectedFields.forEach(field => {
      if (field in sampleUser) {
        fieldsFound++;
        console.log(`✅ ${field}`);
      } else {
        console.log(`❌ ${field} - NO ENCONTRADO`);
      }
    });
    
    console.log(`\n📈 Resumen: ${fieldsFound}/${expectedFields.length} campos encontrados`);
    
    if (fieldsFound === expectedFields.length) {
      console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
      console.log('✅ Todos los campos del nuevo sistema de registro están disponibles');
      console.log('✅ La tabla users está lista para el nuevo sistema de registro');
    } else {
      console.log('\n⚠️  Migración parcialmente completada');
      console.log('🔧 Algunos campos pueden necesitar configuración manual');
    }
    
  } catch (error) {
    console.error('❌ Error general en la migración:', error);
  }
}

// Función alternativa usando SQL directo
async function runMigrationAlternative() {
  try {
    console.log('🚀 Ejecutando migración alternativa...\n');
    
    // Ejecutar comandos SQL uno por uno
    const commands = [
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS province TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_name TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_address TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_website TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_department TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_email TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_alternative_email TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_document_id TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_highest_degree TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_discipline TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_formation_institution TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_current_institution TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_current_position TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_cv_link TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_document_id TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_career TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_year TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_formation_institution TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_role TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_area TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_director_id UUID REFERENCES public.users(id)",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_document_id TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_highest_degree TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_discipline TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_formation_institution TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_current_institution TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_current_position TEXT",
      "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_cv_link TEXT"
    ];
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`📝 Ejecutando comando ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        if (error) {
          console.log(`⚠️  Comando ${i + 1} falló (puede que ya exista): ${error.message}`);
        } else {
          console.log(`✅ Comando ${i + 1} ejecutado`);
        }
      } catch (err) {
        console.log(`⚠️  Comando ${i + 1} falló: ${err.message}`);
      }
    }
    
    console.log('\n🎉 Migración alternativa completada');
    console.log('💡 Verifica manualmente en Supabase Dashboard que los campos se agregaron correctamente');
    
  } catch (error) {
    console.error('❌ Error en migración alternativa:', error);
  }
}

// Ejecutar migración
console.log('🔧 MIGRACIÓN DEL NUEVO SISTEMA DE REGISTRO');
console.log('==========================================\n');

// Intentar migración principal
runMigration().catch(() => {
  console.log('\n🔄 Intentando método alternativo...\n');
  runMigrationAlternative();
}); 