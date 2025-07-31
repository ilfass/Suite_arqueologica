const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncUsers() {
  try {
    console.log('🔧 Sincronizando usuarios existentes...');
    
    // 1. Obtener usuarios existentes en la tabla users
    console.log('\n1. Obteniendo usuarios de la tabla users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.log('❌ Error al obtener usuarios:', usersError.message);
      return;
    }
    
    console.log(`✅ Encontrados ${users.length} usuarios en la tabla`);
    
    // 2. Obtener usuarios en Supabase Auth
    console.log('\n2. Obteniendo usuarios de Supabase Auth...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error al obtener usuarios de Auth:', authError.message);
      return;
    }
    
    console.log(`✅ Encontrados ${authUsers.users.length} usuarios en Auth`);
    
    // 3. Crear usuarios faltantes en Auth
    console.log('\n3. Creando usuarios faltantes en Auth...');
    
    for (const user of users) {
      const existingAuthUser = authUsers.users.find(authUser => authUser.email === user.email);
      
      if (!existingAuthUser) {
        console.log(`📝 Creando usuario en Auth: ${user.email}`);
        
        try {
          const { data: authData, error: createError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: 'testpassword', // Contraseña temporal
            email_confirm: true
          });
          
          if (createError) {
            console.log(`❌ Error al crear ${user.email}:`, createError.message);
          } else {
            console.log(`✅ Usuario creado en Auth: ${user.email} (ID: ${authData.user.id})`);
            
            // Actualizar el ID en la tabla users si es necesario
            if (authData.user.id !== user.id) {
              const { error: updateError } = await supabase
                .from('users')
                .update({ id: authData.user.id })
                .eq('email', user.email);
              
              if (updateError) {
                console.log(`⚠️ Error al actualizar ID: ${updateError.message}`);
              } else {
                console.log(`✅ ID actualizado para ${user.email}`);
              }
            }
          }
        } catch (error) {
          console.log(`❌ Error general para ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Usuario ya existe en Auth: ${user.email}`);
      }
    }
    
    console.log('\n🎉 Sincronización completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la sincronización
syncUsers(); 