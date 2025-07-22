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
    first_name: 'Administrador',
    last_name: 'Sistema',
    role: 'ADMIN'
  },
  {
    email: 'dr.perez@unam.mx',
    first_name: 'Dr. María',
    last_name: 'González',
    role: 'RESEARCHER'
  },
  {
    email: 'estudiante@universidad.edu',
    first_name: 'Carlos',
    last_name: 'López',
    role: 'STUDENT'
  },
  {
    email: 'director@inah.gob.mx',
    first_name: 'Dr. Juan',
    last_name: 'Martínez',
    role: 'DIRECTOR'
  },
  {
    email: 'admin@inah.gob.mx',
    first_name: 'Instituto Nacional',
    last_name: 'de Antropología',
    role: 'INSTITUTION'
  },
  {
    email: 'invitado@example.com',
    first_name: 'Usuario',
    last_name: 'Invitado',
    role: 'GUEST'
  }
];

async function updateUsersNames() {
  console.log('🔧 Actualizando nombres de usuarios...\n');
  
  for (const user of testUsers) {
    console.log(`📝 Actualizando: ${user.role} - ${user.email}`);
    
    try {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          first_name: user.first_name,
          last_name: user.last_name
        })
        .eq('email', user.email)
        .select()
        .single();
      
      if (updateError) {
        console.log(`   ❌ Error al actualizar: ${updateError.message}`);
      } else {
        console.log(`   ✅ Usuario actualizado exitosamente`);
        console.log(`      ID: ${updatedUser.id}`);
        console.log(`      Nombre: ${updatedUser.first_name} ${updatedUser.last_name}`);
        console.log(`      Rol: ${updatedUser.role}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen de usuarios actualizados:');
  testUsers.forEach(user => {
    console.log(`👤 ${user.role}: ${user.email} - ${user.first_name} ${user.last_name}`);
  });
}

// Ejecutar actualización
updateUsersNames(); 