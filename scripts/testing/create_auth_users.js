const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: 'fa07fa@gmail.com',
    password: '3por39',
    first_name: 'Administrador',
    last_name: 'Sistema',
    role: 'ADMIN'
  },
  {
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    first_name: 'Dr. María',
    last_name: 'González',
    role: 'RESEARCHER'
  },
  {
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    first_name: 'Carlos',
    last_name: 'López',
    role: 'STUDENT'
  },
  {
    email: 'director@inah.gob.mx',
    password: 'director123',
    first_name: 'Dr. Juan',
    last_name: 'Martínez',
    role: 'DIRECTOR'
  },
  {
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    first_name: 'Instituto Nacional',
    last_name: 'de Antropología',
    role: 'INSTITUTION'
  },
  {
    email: 'invitado@example.com',
    password: 'invitado123',
    first_name: 'Usuario',
    last_name: 'Invitado',
    role: 'GUEST'
  }
];

async function createAuthUsers() {
  console.log('🔧 Creando usuarios en Supabase Auth...\n');
  
  for (const user of testUsers) {
    console.log(`📝 Creando: ${user.role} - ${user.email}`);
    
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
      
      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️ Usuario ya existe en Auth`);
        } else {
          console.log(`   ❌ Error al crear en Auth: ${authError.message}`);
          continue;
        }
      } else {
        console.log(`   ✅ Usuario creado en Auth`);
        console.log(`      ID: ${authData.user.id}`);
      }
      
      // Verificar si existe en la tabla users
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (dbError) {
        console.log(`   ❌ Error al verificar en DB: ${dbError.message}`);
      } else {
        console.log(`   ✅ Usuario existe en DB`);
        console.log(`      ID: ${dbUser.id}`);
        console.log(`      Rol: ${dbUser.role}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error general: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen de usuarios:');
  testUsers.forEach(user => {
    console.log(`👤 ${user.role}: ${user.email} / ${user.password}`);
  });
}

// Ejecutar creación
createAuthUsers(); 