const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminRole() {
  try {
    console.log('🔧 CORRIGIENDO ROL DE ADMINISTRADOR');
    console.log('====================================\n');

    // Buscar el usuario
    const { data: adminUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'fa07fa@gmail.com')
      .single();

    if (findError) {
      console.log('❌ Error buscando usuario:', findError.message);
      return;
    }

    console.log('📋 Usuario encontrado:');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`🎭 Rol actual: ${adminUser.role}`);
    console.log(`👤 Nombre: ${adminUser.first_name} ${adminUser.last_name}`);

    if (adminUser.role === 'ADMIN') {
      console.log('\n✅ El usuario ya tiene el rol ADMIN correcto');
      return;
    }

    console.log(`\n🔄 Cambiando rol de ${adminUser.role} a ADMIN...`);

    // Actualizar el rol a ADMIN
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        role: 'ADMIN',
        updated_at: new Date().toISOString()
      })
      .eq('email', 'fa07fa@gmail.com')
      .select()
      .single();

    if (updateError) {
      console.log('❌ Error actualizando rol:', updateError.message);
      return;
    }

    console.log('✅ Rol actualizado exitosamente');
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`🎭 Nuevo rol: ${updatedUser.role}`);
    console.log(`📅 Actualizado: ${updatedUser.updated_at}`);

    console.log('\n🎉 ¡El usuario administrador ahora tiene el rol correcto!');
    console.log('🔑 Puedes iniciar sesión con: fa07fa@gmail.com / 3por39');
    console.log('📊 Debería redirigir al dashboard de administrador');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixAdminRole(); 