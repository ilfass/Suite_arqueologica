const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAuthUser() {
  try {
    console.log('🔧 Creando usuario en Supabase Auth...');
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'investigador@test.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Investigador',
        last_name: 'Prueba',
        role: 'RESEARCHER'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      return;
    }

    console.log('✅ Usuario creado en Supabase Auth:', authData.user.id);
    
    // Verificar si ya existe en la tabla users
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'investigador@test.com')
      .single();

    if (existingUser) {
      console.log('✅ Usuario ya existe en tabla users:', existingUser);
    } else {
      // Insertar en tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
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
        console.error('❌ Error insertando en tabla users:', userError);
        return;
      }

      console.log('✅ Usuario insertado en tabla users:', userData[0]);
    }
    
    console.log('🎯 Credenciales de prueba:');
    console.log('   Email: investigador@test.com');
    console.log('   Contraseña: password123');
    console.log('   ID de Auth:', authData.user.id);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createAuthUser(); 