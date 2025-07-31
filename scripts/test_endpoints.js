const axios = require('axios');

async function testEndpoints() {
  console.log('🧪 Probando endpoints de vidriera pública...');
  
  try {
    // 1. Obtener token de autenticación
    console.log('🔐 Obteniendo token de autenticación...');
    const loginResponse = await axios.post('http://localhost:4001/auth/login-dev', {
      email: 'lic.fabiande@gmail.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.data.tokens.token;
    console.log('✅ Token obtenido:', token.substring(0, 50) + '...');
    
    // 2. Probar endpoint de perfil público
    console.log('🌐 Probando endpoint de perfil público...');
    try {
      const profileResponse = await axios.get('http://localhost:4001/auth/public-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Perfil público obtenido:', profileResponse.data);
    } catch (error) {
      console.log('❌ Error obteniendo perfil público:', error.response?.data || error.message);
    }
    
    // 3. Probar actualización de perfil público
    console.log('💾 Probando actualización de perfil público...');
    const updateData = {
      isPublic: true,
      displayName: 'Dr. Fabian de Haro',
      bio: 'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia.',
      specialization: 'Arqueología Prehispánica, Cerámica Antigua',
      institution: 'Universidad de Buenos Aires',
      location: 'Buenos Aires, Argentina',
      email: 'lic.fabiande@gmail.com',
      website: 'https://arqueologia.uba.ar',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/fabiandeharo',
        researchGate: 'https://researchgate.net/profile/fabiandeharo'
      },
      customMessage: 'Bienvenidos a mi espacio de investigación arqueológica.',
      publicProjects: ['Proyecto Valle de Tafí', 'Estudio de Cerámica Prehispánica'],
      publicFindings: ['Descubrimiento de alfarería prehispánica'],
      publicReports: ['Informe de Excavación 2022'],
      publicPublications: ['De Haro, F. (2023). "Patrones de Asentamiento"']
    };
    
    try {
      const updateResponse = await axios.put('http://localhost:4001/auth/public-profile', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Perfil público actualizado:', updateResponse.data);
    } catch (error) {
      console.log('❌ Error actualizando perfil público:', error.response?.data || error.message);
    }
    
    // 4. Probar endpoint a través del API Gateway
    console.log('🌐 Probando a través del API Gateway...');
    try {
      const gatewayResponse = await axios.get('http://localhost:4000/api/auth/public-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Respuesta del API Gateway:', gatewayResponse.data);
    } catch (error) {
      console.log('❌ Error en API Gateway:', error.response?.data || error.message);
    }
    
    // 5. Probar endpoints del frontend
    console.log('📱 Probando endpoints del frontend...');
    try {
      const frontendResponse = await axios.get('http://localhost:3000/api/auth/public-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Respuesta del frontend:', frontendResponse.data);
    } catch (error) {
      console.log('❌ Error en frontend:', error.response?.data || error.message);
    }
    
    console.log('✅ Pruebas completadas!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testEndpoints(); 