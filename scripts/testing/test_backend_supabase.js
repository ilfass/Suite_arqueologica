const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔧 Debug - SUPABASE_URL:', supabaseUrl);
console.log('🔧 Debug - SUPABASE_KEY:', supabaseKey ? 'Presente' : 'Ausente');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBackendSupabase() {
  console.log('🔍 Probando conexión de Supabase desde el backend...');
  
  try {
    // Verificar usuario por ID específico
    const userId = 'a9824343-3b45-4360-833c-8f241f7d835d';
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', userId)
      .single();
    
    console.log('🔍 Resultado de la consulta:', { user, error });
    
    if (error) {
      console.log('❌ Error de Supabase:', error);
    } else {
      console.log('✅ Usuario encontrado:', user);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testBackendSupabase(); 