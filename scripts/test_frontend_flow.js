const axios = require('axios');

async function testFrontendFlow() {
  const baseUrl = 'http://localhost:4000/api/auth';
  
  try {
    console.log('🧪 Probando flujo completo del frontend...');
    
    // 1. Probar login
    console.log('\n1. Probando login...');
    const loginResponse = await axios.post(`${baseUrl}/login`, {
      email: 'lic.fabiande@gmail.com',
      password: 'testpassword'
    });
    
    console.log('✅ Login exitoso:', {
      status: loginResponse.status,
      user: loginResponse.data.data?.user?.email,
      token: loginResponse.data.data?.tokens?.token ? '✅' : '❌'
    });
    
    const token = loginResponse.data.data?.tokens?.token;
    
    if (!token) {
      console.log('❌ No se obtuvo token');
      return;
    }
    
    // 2. Probar obtener perfil con token
    console.log('\n2. Probando obtener perfil...');
    const profileResponse = await axios.get(`${baseUrl}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil obtenido:', {
      status: profileResponse.status,
      user: profileResponse.data.data?.email
    });
    
    // 3. Probar verificar token
    console.log('\n3. Probando verificar token...');
    const verifyResponse = await axios.post(`${baseUrl}/verify-token`, {
      token: token
    });
    
    console.log('✅ Token verificado:', {
      status: verifyResponse.status,
      valid: verifyResponse.data.success
    });
    
    console.log('\n🎉 ¡Flujo completo funcionando!');
    
  } catch (error) {
    console.log('❌ Error en el flujo:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url
    });
  }
}

testFrontendFlow(); 