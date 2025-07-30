const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

console.log('🔧 Debug - SUPABASE_URL:', supabaseUrl);
console.log('🔧 Debug - SUPABASE_KEY:', supabaseKey ? 'Presente' : 'Ausente');
console.log('🔧 Debug - JWT_SECRET:', jwtSecret ? 'Presente' : 'Ausente');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMiddlewareLogic() {
  console.log('🔍 Probando lógica del middleware...');
  
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5ODI0MzQzLTNiNDUtNDM2MC04MzNjLThmMjQxZjdkODM1ZCIsImVtYWlsIjoibGljLmZhYmlhbmRlQGdtYWlsLmNvbSIsInJvbGUiOiJSRVNFQVJDSEVSIiwiZnVsbE5hbWUiOiJGYWJpYW4gZGUgSGFybyIsImlhdCI6MTc1Mzg0NTgyMCwiZXhwIjoxNzUzOTMyMjIwfQ.Chers3CReEXOvWRHGj_hjoeYhp4QWT1Elj2ycETiSzM';
    
    // Paso 1: Verificar el token JWT
    const decoded = jwt.verify(token, jwtSecret);
    console.log('🔍 Token decodificado:', { id: decoded.id, email: decoded.email, role: decoded.role });
    
    // Paso 2: Verificar que el usuario existe en la base de datos
    console.log('🔍 Buscando usuario con ID:', decoded.id);
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role, subscription_plan')
      .eq('id', decoded.id)
      .single();
    
    console.log('🔍 Resultado de la consulta:', { user, error });
    
    if (error || !user) {
      console.log('❌ Usuario no encontrado en la base de datos:', decoded.id);
      console.log('❌ Error de Supabase:', error);
      return;
    }
    
    console.log('✅ Usuario encontrado en la base de datos:', user.id);
    
    // Paso 3: Crear objeto de usuario
    const userObj = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: `${user.first_name} ${user.last_name}`.trim(),
    };
    
    console.log('✅ Objeto de usuario creado:', userObj);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testMiddlewareLogic(); 