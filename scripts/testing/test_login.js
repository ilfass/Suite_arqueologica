const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

async function testLogin() {
  try {
    console.log('🔧 Probando login con usuario válido...');

    const loginData = {
      email: 'test.researcher@example.com',
      password: 'testpassword123'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);

    console.log('✅ Login exitoso!');
    console.log('📧 Usuario:', response.data.data.user.email);
    console.log('🆔 ID:', response.data.data.user.id);
    console.log('🔑 Token:', response.data.data.token.substring(0, 50) + '...');

    // Probar obtener perfil con el token
    console.log('\n🔧 Probando obtener perfil...');
    
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${response.data.data.token}`
      }
    });

    console.log('✅ Perfil obtenido exitosamente!');
    console.log('📋 Datos del perfil:', {
      id: profileResponse.data.data.user.id,
      email: profileResponse.data.data.user.email,
      role: profileResponse.data.data.user.role,
      first_name: profileResponse.data.data.user.first_name,
      last_name: profileResponse.data.data.user.last_name
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin(); 