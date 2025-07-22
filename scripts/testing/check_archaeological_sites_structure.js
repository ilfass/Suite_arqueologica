const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjE5NzI5MCwiZXhwIjoyMDQ3NzczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArchaeologicalSitesStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla archaeological_sites...\n');

    // Obtener información de las columnas
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'archaeological_sites')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error al obtener columnas:', columnsError);
      return;
    }

    console.log('✅ Estructura de la tabla archaeological_sites:');
    console.log('Columnas disponibles:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });

    // Verificar si la tabla existe y tiene datos
    const { data: sites, error: sitesError } = await supabase
      .from('archaeological_sites')
      .select('*')
      .limit(1);

    if (sitesError) {
      console.log('\n❌ Error al consultar tabla:', sitesError.message);
    } else {
      console.log(`\n📊 Tabla existe y tiene ${sites?.length || 0} registros de ejemplo`);
      
      if (sites && sites.length > 0) {
        console.log('\n📋 Ejemplo de registro:');
        console.log(JSON.stringify(sites[0], null, 2));
      }
    }

    // Verificar columnas específicas que necesitamos
    const requiredColumns = [
      'site_code', 'name', 'location', 'site_type', 'cultural_affiliation',
      'preservation_status', 'accessibility', 'status', 'created_by'
    ];

    console.log('\n🔍 Verificando columnas requeridas:');
    const existingColumns = columns.map(col => col.column_name);
    
    requiredColumns.forEach(col => {
      if (existingColumns.includes(col)) {
        console.log(`   ✅ ${col}`);
      } else {
        console.log(`   ❌ ${col} - FALTANTE`);
      }
    });

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkArchaeologicalSitesStructure(); 