const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
  {
    email: 'researcher@arqueologia.com',
    password: 'researcher123',
    role: 'RESEARCHER',
    name: 'Dr. María González',
    institution: 'Universidad Nacional',
    specialization: 'Arqueología Prehispánica'
  },
  {
    email: 'student@arqueologia.com',
    password: 'student123',
    role: 'STUDENT',
    name: 'Carlos Rodríguez',
    institution: 'Universidad Nacional',
    student_id: '2024001'
  },
  {
    email: 'institution@arqueologia.com',
    password: 'institution123',
    role: 'INSTITUTION',
    name: 'Museo Nacional de Arqueología',
    institution_type: 'Museo',
    contact_person: 'Ana Martínez'
  },
  {
    email: 'guest@arqueologia.com',
    password: 'guest123',
    role: 'GUEST',
    name: 'Visitante Público',
    access_level: 'READ_ONLY'
  }
];

async function createUsers() {
  console.log('🚀 Creando usuarios faltantes...\n');

  for (const userData of users) {
    try {
      console.log(`👤 Creando usuario: ${userData.email} (${userData.role})`);
      
      // Crear usuario en auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`❌ Error creando usuario auth: ${authError.message}`);
        continue;
      }

      // Crear perfil en users
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email: userData.email,
          full_name: userData.name,
          role: userData.role,
          institution: userData.institution || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`❌ Error creando perfil: ${profileError.message}`);
        // Intentar eliminar el usuario auth si falla el perfil
        await supabase.auth.admin.deleteUser(authUser.user.id);
        continue;
      }

      console.log(`✅ Usuario creado exitosamente: ${userData.email}`);
      
    } catch (error) {
      console.error(`❌ Error inesperado: ${error.message}`);
    }
  }

  console.log('\n📊 Verificando usuarios creados...');
  
  try {
    const { data: profiles, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`❌ Error verificando usuarios: ${error.message}`);
    } else {
      console.log('\n👥 Usuarios en la base de datos:');
      profiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.role})`);
      });
    }
  } catch (error) {
    console.error(`❌ Error verificando usuarios: ${error.message}`);
  }
}

async function main() {
  try {
    await createUsers();
    console.log('\n🎉 Proceso completado!');
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
  }
}

main(); 