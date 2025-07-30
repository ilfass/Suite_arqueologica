const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAreasTable() {
  console.log('🔍 Verificando tabla areas...');
  
  try {
    // Verificar si la tabla existe
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'areas');
    
    if (tablesError) {
      console.error('❌ Error al verificar tablas:', tablesError);
      return;
    }
    
    if (tables.length === 0) {
      console.log('❌ La tabla "areas" no existe');
      return;
    }
    
    console.log('✅ La tabla "areas" existe');
    
    // Verificar estructura de la tabla
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'areas')
      .order('ordinal_position');
    
    if (columnsError) {
      console.error('❌ Error al verificar columnas:', columnsError);
      return;
    }
    
    console.log('📋 Estructura de la tabla areas:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Intentar hacer una consulta simple
    const { data: sampleData, error: queryError } = await supabase
      .from('areas')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.error('❌ Error al consultar la tabla:', queryError);
      return;
    }
    
    console.log('✅ Consulta exitosa a la tabla areas');
    console.log(`📊 Número de registros: ${sampleData.length}`);
    
    if (sampleData.length > 0) {
      console.log('📝 Ejemplo de registro:', sampleData[0]);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
checkAreasTable().catch(console.error); 