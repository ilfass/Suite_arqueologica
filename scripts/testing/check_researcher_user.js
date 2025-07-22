const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzEzNjg4NCwiZXhwIjoyMDY4NzEyODg0fQ.sJQIxTLrCCca6Eb1PuWR9-oG46DJFJBeV9a6HG5BGsQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixResearcher() {
  console.log('🔍 Verificando usuario RESEARCHER...');
  
  try {
    // 1. Verificar si existe en Supabase Auth
    console.log('1. Verificando en Supabase Auth...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error al listar usuarios de Auth:', authError);
      return;
    }
    
    const researcherAuth = authUsers.users.find(user => user.email === 'dr.perez@unam.mx');
    console.log('Usuario en Auth:', researcherAuth ? '✅ Existe' : '❌ No existe');
    
    if (researcherAuth) {
      console.log('ID en Auth:', researcherAuth.id);
      console.log('Email:', researcherAuth.email);
      console.log('Email confirmado:', researcherAuth.email_confirmed_at ? '✅ Sí' : '❌ No');
    }
    
    // 2. Verificar si existe en tabla users
    console.log('\n2. Verificando en tabla users...');
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'dr.perez@unam.mx');
    
    if (dbError) {
      console.error('Error al consultar tabla users:', dbError);
      return;
    }
    
    console.log('Usuarios encontrados en BD:', dbUsers.length);
    if (dbUsers.length > 0) {
      console.log('Usuario en BD:', dbUsers[0]);
    }
    
    // 3. Si existe en Auth pero no en BD, crear en BD
    if (researcherAuth && dbUsers.length === 0) {
      console.log('\n3. 🔧 Creando usuario en tabla users...');
      
      const newUser = {
        id: researcherAuth.id,
        email: researcherAuth.email,
        role: 'RESEARCHER',
        first_name: 'Dr. Pérez',
        last_name: 'Investigador',
        institution: 'UNAM',
        specialization: 'Arqueología',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error al insertar usuario:', insertError);
        return;
      }
      
      console.log('✅ Usuario RESEARCHER creado exitosamente:', insertedUser);
    } else if (!researcherAuth) {
      console.log('\n3. 🔧 Creando usuario en Supabase Auth...');
      
      const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
        email: 'dr.perez@unam.mx',
        password: 'investigador123',
        email_confirm: true,
        user_metadata: {
          role: 'RESEARCHER',
          first_name: 'Dr. Pérez',
          last_name: 'Investigador'
        }
      });
      
      if (createAuthError) {
        console.error('Error al crear usuario en Auth:', createAuthError);
        return;
      }
      
      console.log('✅ Usuario RESEARCHER creado en Auth:', newAuthUser.user.id);
      
      // Crear también en tabla users
      const newUser = {
        id: newAuthUser.user.id,
        email: newAuthUser.user.email,
        role: 'RESEARCHER',
        first_name: 'Dr. Pérez',
        last_name: 'Investigador',
        institution: 'UNAM',
        specialization: 'Arqueología',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error al insertar usuario en BD:', insertError);
        return;
      }
      
      console.log('✅ Usuario RESEARCHER creado en BD:', insertedUser);
    } else {
      console.log('\n✅ Usuario RESEARCHER ya existe en ambos lugares');
    }
    
    // 4. Verificar que ahora funciona
    console.log('\n4. 🧪 Probando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'dr.perez@unam.mx',
      password: 'investigador123'
    });
    
    if (loginError) {
      console.error('❌ Error en login:', loginError);
    } else {
      console.log('✅ Login exitoso:', loginData.user.id);
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

checkAndFixResearcher(); 