const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCompleteUser() {
  try {
    console.log('🔧 Creando usuario completo...');
    
    const email = 'test@example.com';
    const password = 'test123';
    
    // 1. Crear usuario en Supabase Auth
    console.log('📝 Creando usuario en Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.id);
    
    // 2. Actualizar usuario en la tabla users con el ID correcto
    console.log('📝 Actualizando tabla users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        id: authData.user.id,
        role: 'researcher',
        full_name: 'Test User',
        institution: 'Test Institution',
        phone: '+1234567890',
        is_active: true
      })
      .eq('email', email)
      .select();

    if (userError) {
      console.error('❌ Error actualizando tabla users:', userError);
      return;
    }

    console.log('✅ Usuario actualizado en tabla users:', userData[0]);
    console.log('🎯 Credenciales de prueba:');
    console.log('   Email: test@example.com');
    console.log('   Contraseña: test123');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createCompleteUser(); 