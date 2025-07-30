const axios = require('axios');

const GATEWAY_URL = 'http://localhost:4000';
const AUTH_SERVICE_URL = 'http://localhost:4001';

async function testMicroservices() {
  console.log('🧪 Probando nueva arquitectura de microservicios...\n');

  try {
    // 1. Probar API Gateway
    console.log('1️⃣ Probando API Gateway...');
    const gatewayHealth = await axios.get(`${GATEWAY_URL}/health`);
    console.log('✅ API Gateway funcionando:', gatewayHealth.data);

    const gatewayInfo = await axios.get(`${GATEWAY_URL}/`);
    console.log('✅ Info del Gateway:', gatewayInfo.data);

    // 2. Probar Auth Service directamente
    console.log('\n2️⃣ Probando Auth Service directamente...');
    const authHealth = await axios.get(`${AUTH_SERVICE_URL}/health`);
    console.log('✅ Auth Service funcionando:', authHealth.data);

    // 3. Probar registro de usuario
    console.log('\n3️⃣ Probando registro de usuario...');
    const registerData = {
      email: 'test@microservices.com',
      password: 'test123456',
      role: 'RESEARCHER',
      firstName: 'Test',
      lastName: 'Microservice'
    };

    try {
      const registerResponse = await axios.post(`${GATEWAY_URL}/auth/register`, registerData);
      console.log('✅ Registro exitoso:', registerResponse.data);
    } catch (error) {
      if (error.response?.data?.message?.includes('ya existe')) {
        console.log('ℹ️ Usuario ya existe, continuando con login...');
      } else {
        console.log('❌ Error en registro:', error.response?.data);
      }
    }

    // 4. Probar login
    console.log('\n4️⃣ Probando login...');
    const loginData = {
      email: 'test@microservices.com',
      password: 'test123456'
    };

    const loginResponse = await axios.post(`${GATEWAY_URL}/auth/login`, loginData);
    console.log('✅ Login exitoso:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      user: {
        id: loginResponse.data.data.user.id,
        email: loginResponse.data.data.user.email,
        role: loginResponse.data.data.user.role
      },
      hasToken: !!loginResponse.data.data.tokens.token
    });

    const token = loginResponse.data.data.tokens.token;

    // 5. Probar verificación de token
    console.log('\n5️⃣ Probando verificación de token...');
    const verifyResponse = await axios.post(`${GATEWAY_URL}/auth/verify-token`, { token });
    console.log('✅ Token verificado:', verifyResponse.data);

    // 6. Probar obtención de perfil
    console.log('\n6️⃣ Probando obtención de perfil...');
    const profileResponse = await axios.get(`${GATEWAY_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Perfil obtenido:', {
      id: profileResponse.data.data.id,
      email: profileResponse.data.data.email,
      role: profileResponse.data.data.role,
      firstName: profileResponse.data.data.firstName,
      lastName: profileResponse.data.data.lastName
    });

    // 7. Probar actualización de perfil
    console.log('\n7️⃣ Probando actualización de perfil...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'Microservice'
    };

    const updateResponse = await axios.put(`${GATEWAY_URL}/auth/profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Perfil actualizado:', updateResponse.data);

    // 8. Probar refresh token
    console.log('\n8️⃣ Probando refresh token...');
    const refreshResponse = await axios.post(`${GATEWAY_URL}/auth/refresh`, {
      refreshToken: loginResponse.data.data.tokens.refreshToken
    });
    console.log('✅ Token refrescado:', {
      success: refreshResponse.data.success,
      hasNewToken: !!refreshResponse.data.data.tokens.token
    });

    // 9. Probar logout
    console.log('\n9️⃣ Probando logout...');
    const logoutResponse = await axios.post(`${GATEWAY_URL}/auth/logout`, {
      refreshToken: loginResponse.data.data.tokens.refreshToken
    });
    console.log('✅ Logout exitoso:', logoutResponse.data);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📊 Resumen de la nueva arquitectura:');
    console.log('✅ API Gateway funcionando en puerto 4000');
    console.log('✅ Auth Service funcionando en puerto 4001');
    console.log('✅ Comunicación entre servicios establecida');
    console.log('✅ Autenticación y autorización funcionando');
    console.log('✅ Proxy de requests funcionando');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Asegúrate de que los servicios estén ejecutándose:');
      console.log('1. Auth Service: npm run dev (en apps/auth-service)');
      console.log('2. API Gateway: npm run dev (en gateway)');
    }
  }
}

// Función para verificar si los servicios están ejecutándose
async function checkServices() {
  console.log('🔍 Verificando servicios...\n');

  const services = [
    { name: 'API Gateway', url: `${GATEWAY_URL}/health` },
    { name: 'Auth Service', url: `${AUTH_SERVICE_URL}/health` }
  ];

  for (const service of services) {
    try {
      const response = await axios.get(service.url, { timeout: 5000 });
      console.log(`✅ ${service.name}: Funcionando`);
    } catch (error) {
      console.log(`❌ ${service.name}: No disponible (${error.message})`);
    }
  }
}

// Ejecutar verificaciones
async function main() {
  await checkServices();
  console.log('\n' + '='.repeat(50) + '\n');
  await testMicroservices();
}

main().catch(console.error); 