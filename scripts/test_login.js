const axios = require('axios');

async function testLogin() {
  const baseUrl = 'http://localhost:4001/auth';
  
  const testUsers = [
    { email: 'lic.fabiande@gmail.com', password: 'testpassword' },
    { email: 'test2@example.com', password: 'testpassword' },
    { email: 'test3@example.com', password: 'testpassword' }
  ];

  for (const user of testUsers) {
    try {
      console.log(`\n🔐 Probando login con: ${user.email}`);
      
      const response = await axios.post(`${baseUrl}/login`, user, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Login exitoso:', {
        status: response.status,
        user: response.data.data?.user?.email,
        token: response.data.data?.tokens?.token ? '✅' : '❌'
      });
      
    } catch (error) {
      console.log('❌ Error en login:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
  }
}

testLogin(); 