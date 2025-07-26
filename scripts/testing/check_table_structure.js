require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  try {
    console.log('🔧 Verificando estructura de la tabla users...');

    // Intentar obtener información de la tabla
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error accediendo a la tabla users:', tableError);
      return;
    }

    console.log('✅ Tabla users accesible');
    console.log('📋 Estructura de la tabla:');
    
    if (tableInfo && tableInfo.length > 0) {
      const columns = Object.keys(tableInfo[0]);
      columns.forEach(column => {
        console.log(`  - ${column}: ${typeof tableInfo[0][column]}`);
      });
    } else {
      console.log('  Tabla vacía, no se puede determinar estructura');
    }

    // Intentar insertar un registro de prueba
    console.log('\n🔧 Intentando insertar registro de prueba...');
    
    const testRecord = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      role: 'RESEARCHER',
      subscription_plan: 'FREE'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.error('❌ Error insertando registro de prueba:', insertError);
    } else {
      console.log('✅ Registro de prueba insertado exitosamente');
      
      // Limpiar el registro de prueba
      await supabase
        .from('users')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('🧹 Registro de prueba eliminado');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTableStructure(); 