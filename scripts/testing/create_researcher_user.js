const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function createResearcherUser() {
  try {
    console.log('🔧 Creando usuario RESEARCHER...');
    
    const userData = {
      email: 'investigador@suite.com',
      password: 'investigador123',
      fullName: 'Dr. María González - Investigadora Pampeana',
      role: 'RESEARCHER'
    };

    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    
    if (response.data.success) {
      console.log('✅ Usuario RESEARCHER creado exitosamente');
      console.log('📧 Email:', userData.email);
      console.log('🔑 Contraseña:', userData.password);
      console.log('👤 Nombre:', userData.fullName);
      console.log('🎭 Rol:', userData.role);
    } else {
      console.log('❌ Error al crear usuario:', response.data.error);
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Error del servidor:', error.response.data);
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
}

createResearcherUser(); 