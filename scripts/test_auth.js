const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('🔧 Probando autenticación...');
    
    // 1. Verificar si el usuario existe
    console.log('\n1. Verificando si el usuario existe...');
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'lic.fabiande@gmail.com')
      .single();
    
    if (userError) {
      console.log('❌ Error al buscar usuario:', userError.message);
    } else if (existingUser) {
      console.log('✅ Usuario encontrado:', existingUser);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
    // 2. Intentar crear el usuario
    console.log('\n2. Intentando crear usuario...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'lic.fabiande@gmail.com',
      password: 'testpassword',
      email_confirm: true
    });
    
    if (authError) {
      console.log('❌ Error al crear usuario en Auth:', authError.message);
    } else {
      console.log('✅ Usuario creado en Auth:', authData.user.id);
      
      // 3. Crear perfil en la tabla users
      console.log('\n3. Creando perfil en tabla users...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: 'lic.fabiande@gmail.com',
          role: 'RESEARCHER',
          first_name: 'Fabian',
          last_name: 'De',
          is_active: true
        })
        .select()
        .single();
      
      if (userError) {
        console.log('❌ Error al crear perfil:', userError.message);
      } else {
        console.log('✅ Perfil creado:', userData);
      }
    }
    
    // 4. Probar login
    console.log('\n4. Probando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'lic.fabiande@gmail.com',
      password: 'testpassword'
    });
    
    if (loginError) {
      console.log('❌ Error en login:', loginError.message);
    } else {
      console.log('✅ Login exitoso:', loginData.user.id);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la prueba
testAuth(); 