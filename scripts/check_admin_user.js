const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUser() {
  try {
    console.log('🔍 VERIFICANDO USUARIO ADMINISTRADOR');
    console.log('=====================================\n');

    // Buscar el usuario específico
    const { data: adminUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'fa07fa@gmail.com')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Usuario fa07fa@gmail.com NO encontrado en la base de datos');
        console.log('\n🔧 SOLUCIÓN:');
        console.log('El usuario administrador no existe en la tabla users.');
        console.log('Necesitas crear el usuario administrador o verificar las credenciales.');
        return;
      } else {
        console.error('❌ Error buscando usuario:', error);
        return;
      }
    }

    console.log('✅ Usuario encontrado:');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`👤 Nombre: ${adminUser.first_name} ${adminUser.last_name}`);
    console.log(`🎭 Rol: ${adminUser.role}`);
    console.log(`📅 Creado: ${adminUser.created_at}`);
    console.log(`📅 Actualizado: ${adminUser.updated_at}`);

    // Verificar si el rol es correcto
    if (adminUser.role === 'ADMIN') {
      console.log('\n✅ El rol está correctamente configurado como ADMIN');
    } else {
      console.log(`\n⚠️  El rol está configurado como: ${adminUser.role}`);
      console.log('🔧 Necesitas actualizar el rol a ADMIN');
    }

    // Verificar en auth.users también
    console.log('\n🔍 Verificando en auth.users...');
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(adminUser.id);
    
    if (authError) {
      console.log('❌ Error verificando auth.users:', authError.message);
    } else {
      console.log('✅ Usuario existe en auth.users');
      console.log(`📧 Email: ${authUser.user.email}`);
      console.log(`🆔 ID: ${authUser.user.id}`);
      console.log(`📅 Creado: ${authUser.user.created_at}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAdminUser(); 