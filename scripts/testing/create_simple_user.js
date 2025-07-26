const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSimpleUser() {
  try {
    console.log('🔧 Creando usuario simple...');
    
    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single();

    if (existingUser) {
      console.log('✅ Usuario ya existe:', existingUser);
      console.log('🎯 Credenciales de prueba:');
      console.log('   Email: test@example.com');
      console.log('   Contraseña: test123');
      return;
    }
    
    // Insertar usuario con la estructura correcta
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: 'test@example.com',
          role: 'researcher',
          full_name: 'Test User',
          institution: 'Test Institution',
          phone: '+1234567890',
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
    console.log('   Email: test@example.com');
    console.log('   Contraseña: test123');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createSimpleUser(); 