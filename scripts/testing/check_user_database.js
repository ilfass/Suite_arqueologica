const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjAzMjMsImV4cCI6MjA2NDIzNjMyM30.1rreoeSBexWbEKdRtIbSwQcWwD3i53RAqFWt5qe820A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserDatabase() {
  console.log('🔍 Verificando usuario en la base de datos...');
  
  try {
    // Verificar usuario por email
    const { data: userByEmail, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'lic.fabiande@gmail.com')
      .single();
    
    console.log('📧 Usuario por email:', userByEmail);
    console.log('❌ Error por email:', emailError);
    
    // Verificar usuario por ID específico
    const userId = 'a9824343-3b45-4360-833c-8f241f7d835d';
    const { data: userById, error: idError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('🆔 Usuario por ID:', userById);
    console.log('❌ Error por ID:', idError);
    
    // Listar todos los usuarios
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role')
      .limit(5);
    
    console.log('📋 Todos los usuarios:', allUsers);
    console.log('❌ Error todos:', allError);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUserDatabase(); 