const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjE5NzI5MCwiZXhwIjoyMDQ3NzczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersTable() {
  try {
    console.log('🔍 Verificando estructura de la tabla users...');
    
    // 1. Verificar si la tabla existe
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('❌ Error al acceder a la tabla users:', tableError.message);
      return;
    }

    console.log('✅ Tabla users existe');

    // 2. Obtener estructura de la tabla
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });

    if (columnsError) {
      console.log('❌ Error al obtener estructura:', columnsError.message);
      return;
    }

    console.log('📋 Estructura de la tabla users:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });

    // 3. Verificar usuarios existentes
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .limit(10);

    if (usersError) {
      console.log('❌ Error al obtener usuarios:', usersError.message);
      return;
    }

    console.log('\n👥 Usuarios existentes:');
    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ${user.full_name || 'Sin nombre'}`);
      });
    } else {
      console.log('  No hay usuarios en la tabla');
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

checkUsersTable(); 