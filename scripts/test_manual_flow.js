const axios = require('axios');

async function testManualFlow() {
  console.log('🧪 Iniciando prueba manual del flujo completo...');
  
  try {
    // 1. Probar login
    console.log('🔐 Probando login...');
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login-dev', {
      email: 'lic.fabiande@gmail.com',
      password: 'testpassword123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login exitoso');
      console.log('📋 Respuesta completa:', JSON.stringify(loginResponse.data, null, 2));
      
      const token = loginResponse.data.data?.tokens?.token;
      if (token) {
        console.log('🔑 Token obtenido:', token.substring(0, 50) + '...');
      } else {
        console.log('❌ No se pudo obtener el token');
        return;
      }
      
      // 2. Probar obtener perfil
      console.log('👤 Probando obtener perfil...');
      const profileResponse = await axios.get('http://localhost:4000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Perfil obtenido exitosamente');
        console.log('📋 Datos del usuario:', profileResponse.data.data.user);
      } else {
        console.log('❌ Error obteniendo perfil');
      }
      
      // 3. Probar página de vista previa
      console.log('🌐 Probando página de vista previa...');
      const previewResponse = await axios.get('http://localhost:3000/public/investigator/demo');
      
      if (previewResponse.status === 200) {
        console.log('✅ Página de vista previa accesible');
      } else {
        console.log('❌ Error accediendo a vista previa');
      }
      
      // 4. Probar página de configuración de vidriera
      console.log('⚙️ Probando página de configuración...');
      const configResponse = await axios.get('http://localhost:3000/dashboard/researcher/public-profile');
      
      if (configResponse.status === 200) {
        console.log('✅ Página de configuración accesible');
      } else {
        console.log('❌ Error accediendo a configuración');
      }
      
    } else {
      console.log('❌ Error en login:', loginResponse.data.message);
    }
    
    console.log('🎉 Prueba manual completada');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
  }
}

testManualFlow(); 