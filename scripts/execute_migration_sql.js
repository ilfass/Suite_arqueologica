const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

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

async function executeMigration() {
  try {
    console.log('🚀 EJECUTANDO MIGRACIÓN SQL EN SUPABASE');
    console.log('=====================================\n');
    
    // Dividir el SQL en comandos individuales
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (!command) continue;
      
      try {
        console.log(`🔧 Comando ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
        
        // Usar la API REST de Supabase para ejecutar SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: command
          })
        });
        
        if (response.ok) {
          console.log(`✅ Comando ${i + 1} ejecutado exitosamente`);
          successCount++;
        } else {
          const errorText = await response.text();
          console.log(`❌ Error en comando ${i + 1}: ${errorText}`);
          errorCount++;
        }
        
      } catch (error) {
        console.log(`❌ Error ejecutando comando ${i + 1}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 RESUMEN DE EJECUCIÓN:`);
    console.log(`✅ Comandos exitosos: ${successCount}`);
    console.log(`❌ Comandos con error: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 ¡Migración completada exitosamente!');
    } else {
      console.log('\n⚠️  Algunos comandos fallaron. Revisa los errores arriba.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar migración
executeMigration(); 