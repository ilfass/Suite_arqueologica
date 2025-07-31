const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUser() {
  const email = 'lic.fabiande@gmail.com';
  
  try {
    console.log(`🔍 Debuggeando usuario: ${email}`);
    
    // 1. Verificar en tabla users
    console.log('\n1. Verificando en tabla users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (userError) {
      console.log('❌ Error al buscar en tabla users:', userError.message);
    } else {
      console.log('✅ Usuario encontrado en tabla users:', {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active
      });
    }
    
    // 2. Verificar en Supabase Auth
    console.log('\n2. Verificando en Supabase Auth...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error al obtener usuarios de Auth:', authError.message);
    } else {
      const authUser = authUsers.users.find(u => u.email === email);
      if (authUser) {
        console.log('✅ Usuario encontrado en Auth:', {
          id: authUser.id,
          email: authUser.email,
          email_confirmed_at: authUser.email_confirmed_at
        });
      } else {
        console.log('❌ Usuario NO encontrado en Auth');
      }
    }
    
    // 3. Intentar login directo
    console.log('\n3. Intentando login directo...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'testpassword'
    });
    
    if (loginError) {
      console.log('❌ Error en login directo:', loginError.message);
    } else {
      console.log('✅ Login directo exitoso:', {
        user_id: loginData.user.id,
        email: loginData.user.email
      });
    }
    
    // 4. Verificar si los IDs coinciden
    if (userData && authUser) {
      console.log('\n4. Comparando IDs...');
      console.log('Tabla users ID:', userData.id);
      console.log('Auth ID:', authUser.id);
      console.log('IDs coinciden:', userData.id === authUser.id);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugUser(); 