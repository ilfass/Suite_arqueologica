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
    full_name: 'Administrador Sistema',
    role: 'ADMIN'
  },
  {
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    full_name: 'Dr. María González',
    role: 'RESEARCHER'
  },
  {
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    full_name: 'Carlos López',
    role: 'STUDENT'
  },
  {
    email: 'director@inah.gob.mx',
    password: 'director123',
    full_name: 'Dr. Juan Martínez',
    role: 'DIRECTOR'
  },
  {
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    full_name: 'Instituto Nacional de Antropología',
    role: 'INSTITUTION'
  },
  {
    email: 'invitado@example.com',
    password: 'invitado123',
    full_name: 'Usuario Invitado',
    role: 'GUEST'
  }
];

async function checkUsersInDatabase() {
  console.log('🔍 Verificando usuarios en la base de datos...\n');
  
  for (const user of testUsers) {
    console.log(`📝 Verificando: ${user.role} - ${user.email}`);
    
    try {
      // Verificar en public.users
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (publicError) {
        console.log(`   ❌ No existe en public.users: ${publicError.message}`);
      } else {
        console.log(`   ✅ Existe en public.users`);
        console.log(`      ID: ${publicUser.id}`);
        console.log(`      Nombre: ${publicUser.full_name}`);
        console.log(`      Rol: ${publicUser.role}`);
        console.log(`      Activo: ${publicUser.is_active ? 'Sí' : 'No'}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error al verificar: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen de usuarios a verificar:');
  testUsers.forEach(user => {
    console.log(`👤 ${user.role}: ${user.email} / ${user.password}`);
  });
}

// Verificar estructura de tablas
async function checkTables() {
  console.log('\n🔍 Verificando estructura de tablas...\n');
  
  try {
    // Verificar tabla users
    const { data: usersTable, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log(`❌ Error en tabla users: ${usersError.message}`);
    } else {
      console.log('✅ Tabla users existe y es accesible');
    }
    
    // Verificar tabla archaeological_sites
    const { data: sitesTable, error: sitesError } = await supabase
      .from('archaeological_sites')
      .select('*')
      .limit(1);
    
    if (sitesError) {
      console.log(`❌ Error en tabla archaeological_sites: ${sitesError.message}`);
    } else {
      console.log('✅ Tabla archaeological_sites existe y es accesible');
    }
    
    // Verificar tabla artifacts
    const { data: artifactsTable, error: artifactsError } = await supabase
      .from('artifacts')
      .select('*')
      .limit(1);
    
    if (artifactsError) {
      console.log(`❌ Error en tabla artifacts: ${artifactsError.message}`);
    } else {
      console.log('✅ Tabla artifacts existe y es accesible');
    }
    
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Crear usuarios si no existen
async function createUsersIfNotExist() {
  console.log('\n🔧 Creando usuarios si no existen...\n');
  
  for (const user of testUsers) {
    console.log(`📝 Creando/verificando: ${user.role} - ${user.email}`);
    
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (checkError && checkError.code === 'PGRST116') {
        // Usuario no existe, crearlo
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              is_active: true,
              subscription_plan: getSubscriptionPlan(user.role)
            }
          ])
          .select()
          .single();
        
        if (createError) {
          console.log(`   ❌ Error al crear usuario: ${createError.message}`);
        } else {
          console.log(`   ✅ Usuario creado exitosamente`);
          console.log(`      ID: ${newUser.id}`);
          console.log(`      Email: ${newUser.email}`);
          console.log(`      Rol: ${newUser.role}`);
        }
      } else if (existingUser) {
        console.log(`   ✅ Usuario ya existe`);
        console.log(`      ID: ${existingUser.id}`);
        console.log(`      Rol: ${existingUser.role}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
}

function getSubscriptionPlan(role) {
  switch (role) {
    case 'ADMIN':
      return 'ENTERPRISE';
    case 'RESEARCHER':
      return 'PROFESSIONAL';
    case 'DIRECTOR':
      return 'DIRECTOR';
    case 'INSTITUTION':
      return 'INSTITUTIONAL';
    case 'STUDENT':
      return 'STUDENT';
    case 'GUEST':
      return 'BASIC';
    default:
      return 'BASIC';
  }
}

// Ejecutar verificaciones
checkTables().then(() => {
  setTimeout(() => {
    checkUsersInDatabase();
  }, 1000);
}).then(() => {
  setTimeout(() => {
    createUsersIfNotExist();
  }, 2000);
}); 