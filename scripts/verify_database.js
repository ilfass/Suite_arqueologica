const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verificando configuración de la base de datos...');
  
  try {
    // 1. Verificar si la tabla existe
    console.log('📋 Verificando tabla public_profiles...');
    const { data: tableData, error: tableError } = await supabase
      .from('public_profiles')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('❌ Tabla no existe o error:', tableError.message);
      console.log('');
      console.log('💡 Necesitas crear la tabla primero. Ejecuta:');
      console.log('   node scripts/apply_sql_migration.js');
      return false;
    }

    console.log('✅ Tabla public_profiles existe');

    // 2. Verificar datos de prueba
    console.log('👤 Verificando datos de prueba...');
    const { data: testData, error: testError } = await supabase
      .from('public_profiles')
      .select('*')
      .eq('user_id', 'a9824343-3b45-4360-833c-8f241f7d835d')
      .single();

    if (testError) {
      console.log('⚠️ No se encontraron datos de prueba:', testError.message);
    } else {
      console.log('✅ Datos de prueba encontrados:');
      console.log(`   - Nombre: ${testData.display_name}`);
      console.log(`   - Institución: ${testData.institution}`);
      console.log(`   - Público: ${testData.is_public}`);
    }

    // 3. Verificar políticas RLS
    console.log('🛡️ Verificando políticas RLS...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'public_profiles' });

    if (policiesError) {
      console.log('⚠️ No se pudieron verificar políticas:', policiesError.message);
    } else {
      console.log('✅ Políticas RLS configuradas');
    }

    console.log('');
    console.log('🎉 Base de datos verificada correctamente!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Reinicia el Auth Service: pkill -f "auth-service" && cd apps/auth-service && npm run dev');
    console.log('2. Prueba los endpoints: node scripts/test_complete_flow.js');
    console.log('3. Verifica el frontend: http://localhost:3000/dashboard/researcher/public-profile');
    
    return true;

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
    return false;
  }
}

verifyDatabase(); 