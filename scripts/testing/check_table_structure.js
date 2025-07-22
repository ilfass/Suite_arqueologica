const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../../backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla users...\n');
  
  try {
    // Obtener un usuario para ver la estructura
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
      .single();
    
    if (userError) {
      console.log(`❌ Error al obtener usuario: ${userError.message}`);
      return;
    }
    
    console.log('✅ Estructura de la tabla users:');
    console.log('Columnas disponibles:');
    Object.keys(user).forEach(column => {
      console.log(`   - ${column}: ${typeof user[column]} = ${user[column]}`);
    });
    
    console.log('\n📋 Usuario de ejemplo:');
    console.log(JSON.stringify(user, null, 2));
    
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
checkTableStructure(); 