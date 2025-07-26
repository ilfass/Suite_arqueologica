require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createValidUser() {
  try {
    console.log('🔧 Creando usuario válido para testing...');

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test.researcher@example.com',
      password: 'testpassword123',
      email_confirm: true,
      user_metadata: {
        fullName: 'Test Researcher',
        role: 'RESEARCHER'
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError);
      return;
    }

    console.log('✅ Usuario creado en Auth:', authData.user.email);

    // Crear perfil en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          full_name: 'Test Researcher',
          role: 'RESEARCHER',
          subscription_plan: 'FREE',
          institution: 'Universidad de Testing',
          academic_degree: 'Doctorado',
          specialties: ['Arqueología'],
          research_interests: ['Arqueología prehispánica']
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creando perfil en users:', userError);
      return;
    }

    console.log('✅ Perfil creado en users:', userData);
    console.log('🎉 Usuario válido creado exitosamente!');
    console.log('📧 Email: test.researcher@example.com');
    console.log('🔑 Password: testpassword123');
    console.log('🆔 User ID:', authData.user.id);

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createValidUser(); 