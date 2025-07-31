const axios = require('axios');

async function testUpdate() {
  try {
    // Obtener token
    const loginResponse = await axios.post('http://localhost:4001/auth/login-dev', {
      email: 'lic.fabiande@gmail.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.data.tokens.token;
    console.log('✅ Token obtenido');
    
    // Probar actualización
    const updateData = {
      isPublic: true,
      displayName: 'Dr. Fabian de Haro',
      bio: 'Arqueólogo especializado en arqueología prehispánica',
      specialization: 'Arqueología Prehispánica',
      institution: 'Universidad de Buenos Aires',
      location: 'Buenos Aires, Argentina',
      email: 'lic.fabiande@gmail.com',
      website: 'https://arqueologia.uba.ar',
      customMessage: 'Bienvenidos a mi espacio de investigación arqueológica.'
    };
    
    const updateResponse = await axios.put('http://localhost:4001/auth/public-profile', updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Actualización exitosa:', updateResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testUpdate(); 