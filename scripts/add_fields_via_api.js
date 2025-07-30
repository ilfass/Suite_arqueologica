const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFieldsViaAPI() {
  try {
    console.log('🚀 AGREGANDO CAMPOS VÍA API DE SUPABASE');
    console.log('=====================================\n');
    
    // Primero, vamos a verificar la estructura actual
    console.log('🔍 Verificando estructura actual...');
    const { data: currentUser, error: currentError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (currentError) {
      console.error('❌ Error obteniendo estructura:', currentError);
      return;
    }
    
    const currentFields = Object.keys(currentUser[0] || {});
    console.log(`📋 Campos actuales: ${currentFields.length}`);
    console.log('📋 Campos existentes:', currentFields.join(', '));
    
    // Intentar crear un usuario de prueba con todos los nuevos campos
    console.log('\n🧪 Probando creación de usuario con nuevos campos...');
    
    const testUserData = {
      email: `test.migration.${Date.now()}@example.com`,
      first_name: 'Test',
      last_name: 'Migration',
      country: 'Argentina',
      province: 'Buenos Aires',
      city: 'La Plata',
      role: 'RESEARCHER',
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      researcher_document_id: '12345678',
      researcher_career: 'Test Career',
      researcher_year: 'Test Year',
      researcher_formation_institution: 'Test Institution',
      researcher_role: 'Test Role',
      researcher_area: 'Test Area',
      institution_name: 'Test Institution',
      institution_address: 'Test Address',
      institution_website: 'https://test.com',
      institution_department: 'Test Department',
      institution_email: 'test@institution.com',
      institution_alternative_email: 'alt@institution.com',
      director_document_id: '87654321',
      director_highest_degree: 'PhD',
      director_discipline: 'Archaeology',
      director_formation_institution: 'Test University',
      director_current_institution: 'Test University',
      director_current_position: 'Professor',
      director_cv_link: 'https://cv.test.com',
      student_document_id: '11223344',
      student_highest_degree: 'Bachelor',
      student_discipline: 'Archaeology',
      student_formation_institution: 'Test University',
      student_current_institution: 'Test University',
      student_current_position: 'Student',
      student_cv_link: 'https://student-cv.test.com'
    };
    
    try {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([testUserData])
        .select()
        .single();
      
      if (createError) {
        console.log('❌ Error creando usuario de prueba:', createError.message);
        console.log('\n💡 Esto indica que los campos no existen aún en la base de datos');
        console.log('\n🔧 SOLUCIÓN:');
        console.log('Debes ejecutar manualmente la migración SQL en el Supabase Dashboard');
        console.log('\n📋 Pasos:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto: avpaiyyjixtdopbciedr');
        console.log('3. Ve a SQL Editor');
        console.log('4. Copia y pega el siguiente SQL:');
        console.log('\n' + '='.repeat(50));
        console.log('-- Migración para actualizar la tabla users');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS province TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;');
        console.log('-- Campos para INSTITUTION');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_name TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_address TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_website TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_department TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_email TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS institution_alternative_email TEXT;');
        console.log('-- Campos para DIRECTOR');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_document_id TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_highest_degree TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_discipline TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_formation_institution TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_current_institution TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_current_position TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS director_cv_link TEXT;');
        console.log('-- Campos para RESEARCHER');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_document_id TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_career TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_year TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_formation_institution TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_role TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_area TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS researcher_director_id UUID REFERENCES public.users(id);');
        console.log('-- Campos para STUDENT');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_document_id TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_highest_degree TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_discipline TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_formation_institution TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_current_institution TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_current_position TEXT;');
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_cv_link TEXT;');
        console.log('-- Actualizar restricción de roles');
        console.log('ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;');
        console.log('ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN (\'DIRECTOR\', \'RESEARCHER\', \'STUDENT\', \'INSTITUTION\', \'GUEST\'));');
        console.log('='.repeat(50));
        console.log('\n5. Haz clic en "Run" para ejecutar');
        return;
      }
      
      console.log('✅ Usuario de prueba creado exitosamente');
      console.log('🎉 Los campos ya existen en la base de datos');
      console.log('\n📋 Campos del usuario creado:', Object.keys(newUser));
      
      // Limpiar usuario de prueba
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', testUserData.email);
      
      if (deleteError) {
        console.log('⚠️  No se pudo eliminar el usuario de prueba:', deleteError.message);
      } else {
        console.log('🧹 Usuario de prueba eliminado');
      }
      
      console.log('\n🎉 ¡Migración completada exitosamente!');
      console.log('✅ Todos los campos están disponibles');
      
    } catch (error) {
      console.log('❌ Error en prueba:', error.message);
      console.log('\n🔧 ACCIÓN REQUERIDA:');
      console.log('Debes ejecutar manualmente la migración SQL en el Supabase Dashboard');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
console.log('🔧 VERIFICACIÓN DE CAMPOS EN TABLA USERS');
console.log('========================================\n');

addFieldsViaAPI(); 