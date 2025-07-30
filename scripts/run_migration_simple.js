const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración del nuevo sistema de registro...\n');
    
    // Verificar conexión
    console.log('🔍 Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    }
    
    console.log('✅ Conexión a Supabase establecida correctamente');
    
    // Verificar estructura actual
    console.log('\n📊 Verificando estructura actual de la tabla users...');
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
    
    // Lista de campos que necesitamos agregar
    const requiredFields = [
      'first_name', 'last_name', 'country', 'province', 'city', 'terms_accepted', 'terms_accepted_at',
      'institution_name', 'institution_address', 'institution_website', 'institution_department', 'institution_email', 'institution_alternative_email',
      'director_document_id', 'director_highest_degree', 'director_discipline', 'director_formation_institution', 'director_current_institution', 'director_current_position', 'director_cv_link',
      'researcher_document_id', 'researcher_career', 'researcher_year', 'researcher_formation_institution', 'researcher_role', 'researcher_area', 'researcher_director_id',
      'student_document_id', 'student_highest_degree', 'student_discipline', 'student_formation_institution', 'student_current_institution', 'student_current_position', 'student_cv_link'
    ];
    
    // Verificar qué campos faltan
    const missingFields = requiredFields.filter(field => !currentFields.includes(field));
    
    if (missingFields.length === 0) {
      console.log('✅ Todos los campos ya existen en la tabla users');
      console.log('🎉 La migración ya fue aplicada anteriormente');
      return;
    }
    
    console.log(`📝 Campos faltantes: ${missingFields.length}`);
    console.log('📋 Campos a agregar:', missingFields.join(', '));
    
    // Como no podemos ejecutar ALTER TABLE directamente, vamos a verificar si podemos
    // crear un usuario de prueba con los nuevos campos para ver si la estructura ya está lista
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
      researcher_area: 'Test Area'
    };
    
    try {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([testUserData])
        .select()
        .single();
      
      if (createError) {
        console.log('❌ Error creando usuario de prueba:', createError.message);
        console.log('💡 Esto indica que los campos no existen aún en la base de datos');
        console.log('\n🔧 ACCIÓN REQUERIDA:');
        console.log('Debes ejecutar manualmente la migración SQL en el Supabase Dashboard');
        console.log('Archivo: database/migrations/004_update_users_table_new_registration.sql');
        console.log('\n📋 Pasos:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a SQL Editor');
        console.log('4. Copia y pega el contenido del archivo de migración');
        console.log('5. Ejecuta el SQL');
        return;
      }
      
      console.log('✅ Usuario de prueba creado exitosamente');
      console.log('🎉 Los campos ya existen en la base de datos');
      
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
      
    } catch (error) {
      console.log('❌ Error en prueba:', error.message);
      console.log('\n🔧 ACCIÓN REQUERIDA:');
      console.log('Debes ejecutar manualmente la migración SQL en el Supabase Dashboard');
      console.log('Archivo: database/migrations/004_update_users_table_new_registration.sql');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar migración
console.log('🔧 VERIFICACIÓN DE MIGRACIÓN DEL NUEVO SISTEMA DE REGISTRO');
console.log('==========================================================\n');

runMigration(); 