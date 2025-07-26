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

// Credenciales exactas de la guía del proyecto
const testUsers = [
  {
    email: 'fa07fa@gmail.com',
    password: '3por39',
    full_name: 'Administrador Sistema',
    role: 'ADMIN',
    institution: 'Suite Arqueológica'
  },
  {
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    full_name: 'Dr. Pérez',
    role: 'RESEARCHER',
    institution: 'UNAM'
  },
  {
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    full_name: 'Estudiante Universidad',
    role: 'STUDENT',
    institution: 'Universidad'
  },
  {
    email: 'director@inah.gob.mx',
    password: 'director123',
    full_name: 'Director INAH',
    role: 'DIRECTOR',
    institution: 'INAH'
  },
  {
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    full_name: 'Administrador INAH',
    role: 'INSTITUTION',
    institution: 'INAH'
  },
  {
    email: 'invitado@example.com',
    password: 'invitado123',
    full_name: 'Visitante Público',
    role: 'GUEST',
    institution: 'Público'
  }
];

async function createTestUsers() {
  console.log('🚀 Creando usuarios de prueba con credenciales de la guía...');
  
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

      // Crear perfil en la tabla users (sin subscription_plan)
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            institution: userData.institution,
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

  console.log('\n📋 Resumen de usuarios de prueba (según la guía):');
  console.log('👤 fa07fa@gmail.com / 3por39 (ADMIN)');
  console.log('👤 dr.perez@unam.mx / investigador123 (RESEARCHER)');
  console.log('👤 estudiante@universidad.edu / estudiante123 (STUDENT)');
  console.log('👤 director@inah.gob.mx / director123 (DIRECTOR)');
  console.log('👤 admin@inah.gob.mx / institucion123 (INSTITUTION)');
  console.log('👤 invitado@example.com / invitado123 (GUEST)');
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