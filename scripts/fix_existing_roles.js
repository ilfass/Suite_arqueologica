const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixExistingRoles() {
  try {
    console.log('🔧 CORRIGIENDO ROLES EXISTENTES EN LA TABLA USERS');
    console.log('================================================\n');
    
    // Obtener todos los usuarios con roles problemáticos
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, full_name')
      .or('role.eq.researcher,role.eq.ADMIN');
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return;
    }
    
    console.log(`📊 Usuarios con roles problemáticos: ${users.length}`);
    
    // Mapeo de roles a corregir
    const roleMapping = {
      'researcher': 'RESEARCHER',
      'ADMIN': 'DIRECTOR' // Cambiamos ADMIN por DIRECTOR como ejemplo
    };
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      const newRole = roleMapping[user.role];
      if (!newRole) continue;
      
      console.log(`🔄 Actualizando ${user.email}: ${user.role} → ${newRole}`);
      
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: newRole })
          .eq('id', user.id);
        
        if (updateError) {
          console.log(`❌ Error actualizando ${user.email}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${user.email} actualizado exitosamente`);
          updatedCount++;
        }
      } catch (error) {
        console.log(`❌ Error en ${user.email}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 RESUMEN DE ACTUALIZACIONES:`);
    console.log(`✅ Usuarios actualizados: ${updatedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 ¡Todos los roles han sido corregidos exitosamente!');
      console.log('✅ Ahora puedes proceder con la migración de la tabla users.');
    } else {
      console.log('\n⚠️  Algunos usuarios no pudieron ser actualizados.');
      console.log('🔧 Revisa los errores y intenta nuevamente.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar corrección
fixExistingRoles(); 