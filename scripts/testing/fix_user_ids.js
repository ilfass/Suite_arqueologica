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

async function fixUserIds() {
  console.log('🔧 Verificando y corrigiendo IDs de usuarios...\n');
  
  for (const user of testUsers) {
    console.log(`📝 Verificando: ${user.role} - ${user.email}`);
    
    try {
      // Obtener usuario de Auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log(`   ❌ Error al obtener usuarios de Auth: ${authError.message}`);
        continue;
      }
      
      const authUser = authUsers.users.find(u => u.email === user.email);
      
      if (!authUser) {
        console.log(`   ❌ Usuario no encontrado en Auth`);
        continue;
      }
      
      console.log(`   ✅ Usuario encontrado en Auth`);
      console.log(`      Auth ID: ${authUser.id}`);
      console.log(`      Email confirmado: ${authUser.email_confirmed_at ? 'Sí' : 'No'}`);
      
      // Obtener usuario de la tabla users
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (dbError) {
        console.log(`   ❌ Error al obtener de DB: ${dbError.message}`);
        continue;
      }
      
      console.log(`   ✅ Usuario encontrado en DB`);
      console.log(`      DB ID: ${dbUser.id}`);
      console.log(`      Rol: ${dbUser.role}`);
      
      // Verificar si los IDs coinciden
      if (authUser.id !== dbUser.id) {
        console.log(`   ⚠️ Los IDs no coinciden!`);
        console.log(`      Auth ID: ${authUser.id}`);
        console.log(`      DB ID: ${dbUser.id}`);
        
        // Actualizar el ID en la tabla users para que coincida con Auth
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ id: authUser.id })
          .eq('email', user.email)
          .select()
          .single();
        
        if (updateError) {
          console.log(`   ❌ Error al actualizar ID: ${updateError.message}`);
        } else {
          console.log(`   ✅ ID actualizado correctamente`);
          console.log(`      Nuevo ID: ${updatedUser.id}`);
        }
      } else {
        console.log(`   ✅ Los IDs coinciden correctamente`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error general: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen de usuarios verificados:');
  testUsers.forEach(user => {
    console.log(`👤 ${user.role}: ${user.email} / ${user.password}`);
  });
}

// Ejecutar verificación
fixUserIds(); 