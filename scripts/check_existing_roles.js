const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingRoles() {
  try {
    console.log('🔍 VERIFICANDO ROLES EXISTENTES EN LA TABLA USERS');
    console.log('================================================\n');
    
    // Obtener todos los usuarios con sus roles
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, full_name');
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return;
    }
    
    console.log(`📊 Total de usuarios: ${users.length}`);
    
    // Contar roles únicos
    const roleCounts = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    
    console.log('\n📋 Roles existentes:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`  - ${role}: ${count} usuarios`);
    });
    
    // Mostrar usuarios con roles problemáticos
    const validRoles = ['DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST'];
    const invalidUsers = users.filter(user => !validRoles.includes(user.role));
    
    if (invalidUsers.length > 0) {
      console.log('\n⚠️  Usuarios con roles que no están en la nueva restricción:');
      invalidUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
      
      console.log('\n🔧 SOLUCIÓN:');
      console.log('Necesitas actualizar estos usuarios antes de aplicar la migración.');
      console.log('Puedes hacerlo manualmente o crear un script de migración de datos.');
    } else {
      console.log('\n✅ Todos los usuarios tienen roles válidos para la nueva restricción.');
    }
    
    // Mostrar algunos ejemplos de usuarios
    console.log('\n📋 Ejemplos de usuarios:');
    users.slice(0, 5).forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.full_name || 'Sin nombre'}`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
checkExistingRoles(); 