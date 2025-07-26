const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no encontradas');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestUser() {
  try {
    console.log('🔧 Insertando usuario de prueba...');
    
    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'investigador@test.com')
      .single();

    if (existingUser) {
      console.log('✅ Usuario ya existe:', existingUser);
      console.log('🎯 Credenciales de prueba:');
      console.log('   Email: investigador@test.com');
      console.log('   Contraseña: password123');
      return;
    }
    
    // Insertar usuario de prueba
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: 'investigador@test.com',
          role: 'RESEARCHER',
          first_name: 'Investigador',
          last_name: 'Prueba',
          institution: 'Universidad de Prueba',
          specialization: 'Arqueología',
          academic_degree: 'Doctorado',
          is_active: true
        }
      ])
      .select();

    if (userError) {
      console.error('❌ Error insertando usuario:', userError);
      return;
    }

    console.log('✅ Usuario insertado:', userData[0]);
    console.log('🎯 Credenciales de prueba:');
    console.log('   Email: investigador@test.com');
    console.log('   Contraseña: password123');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

insertTestUser(); 