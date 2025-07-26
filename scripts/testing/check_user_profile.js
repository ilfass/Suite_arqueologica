require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfile() {
  try {
    console.log('🔧 Verificando perfil de usuario...');

    // Buscar usuario por email
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error obteniendo usuarios:', authError);
      return;
    }

    const testUser = authData.users.find(user => user.email === 'test.researcher@example.com');
    
    if (!testUser) {
      console.log('❌ Usuario test.researcher@example.com no encontrado en Auth');
      return;
    }

    console.log('✅ Usuario encontrado en Auth:', testUser.email);
    console.log('🆔 User ID:', testUser.id);

    // Verificar si existe en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUser.id)
      .single();

    if (userError) {
      console.log('❌ Usuario no encontrado en tabla users:', userError.message);
      
      // Crear perfil en la tabla users
      console.log('🔧 Creando perfil en tabla users...');
      
      const { data: newUserData, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: testUser.id,
            email: testUser.email,
            first_name: 'Test',
            last_name: 'Researcher',
            role: 'RESEARCHER',
            institution: 'Universidad de Testing',
            specialization: 'Arqueología',
            academic_degree: 'Doctorado',
            is_active: true
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creando perfil:', createError);
        return;
      }

      console.log('✅ Perfil creado exitosamente:', newUserData);
    } else {
      console.log('✅ Usuario encontrado en tabla users:', userData);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUserProfile(); 