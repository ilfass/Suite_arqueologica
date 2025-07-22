const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  console.error('📁 Buscando archivo .env en: ../../backend/.env');
  console.error('🔍 Variables encontradas:');
  console.error('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: 'admin@suite.com',
    password: 'admin123456',
    full_name: 'Administrador Sistema',
    role: 'ADMIN',
    subscription_plan: 'INSTITUTIONAL'
  },
  {
    email: 'researcher@suite.com',
    password: 'researcher123456',
    full_name: 'Dr. María González',
    role: 'RESEARCHER',
    subscription_plan: 'PROFESSIONAL'
  },
  {
    email: 'student@suite.com',
    password: 'student123456',
    full_name: 'Juan Pérez',
    role: 'STUDENT',
    subscription_plan: 'FREE'
  },
  {
    email: 'director@suite.com',
    password: 'director123456',
    full_name: 'Dr. Carlos Rodríguez',
    role: 'DIRECTOR',
    subscription_plan: 'INSTITUTIONAL'
  },
  {
    email: 'institution@suite.com',
    password: 'institution123456',
    full_name: 'Museo Nacional',
    role: 'INSTITUTION',
    subscription_plan: 'INSTITUTIONAL'
  },
  {
    email: 'guest@suite.com',
    password: 'guest123456',
    full_name: 'Visitante Público',
    role: 'GUEST',
    subscription_plan: 'FREE'
  }
];

async function createTestUsers() {
  console.log('🚀 Creando usuarios de prueba...');
  
  for (const userData of testUsers) {
    try {
      console.log(`📝 Creando usuario: ${userData.email}`);
      
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`❌ Error creando usuario ${userData.email}:`, authError.message);
        continue;
      }

      if (!authData.user) {
        console.error(`❌ No se pudo crear usuario ${userData.email}`);
        continue;
      }

      // Crear perfil en la tabla users
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            subscription_plan: userData.subscription_plan,
            is_active: true
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error(`❌ Error creando perfil para ${userData.email}:`, profileError.message);
        continue;
      }

      console.log(`✅ Usuario creado exitosamente: ${userData.email} (${userData.role})`);
      
    } catch (error) {
      console.error(`❌ Error inesperado creando usuario ${userData.email}:`, error.message);
    }
  }

  console.log('\n📋 Resumen de usuarios de prueba:');
  console.log('👤 admin@suite.com / admin123456 (ADMIN)');
  console.log('👤 researcher@suite.com / researcher123456 (RESEARCHER)');
  console.log('👤 student@suite.com / student123456 (STUDENT)');
  console.log('👤 director@suite.com / director123456 (DIRECTOR)');
  console.log('👤 institution@suite.com / institution123456 (INSTITUTION)');
  console.log('👤 guest@suite.com / guest123456 (GUEST)');
  console.log('\n🎯 Puedes usar cualquiera de estas credenciales para probar el login');
}

createTestUsers()
  .then(() => {
    console.log('\n✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 