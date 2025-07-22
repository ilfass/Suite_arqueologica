const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function fixResearcherUser() {
  try {
    console.log('🔧 Arreglando usuario RESEARCHER...');
    
    // 1. Primero autenticar con Supabase Auth para obtener el ID
    console.log('📡 Autenticando con Supabase Auth...');
    
    const authResponse = await axios.post('https://avpaiyyjixtdopbciedr.supabase.co/auth/v1/token?grant_type=password', {
      email: 'dr.perez@unam.mx',
      password: 'investigador123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxOTcyOTAsImV4cCI6MjA0Nzc3MzI5MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
      }
    });

    if (authResponse.data.user) {
      const userId = authResponse.data.user.id;
      console.log('✅ Usuario encontrado en Supabase Auth:', userId);
      
      // 2. Ahora crear el perfil en la tabla users usando el endpoint del backend
      console.log('📝 Creando perfil en tabla users...');
      
      // Usar el endpoint de login del backend que debería crear el perfil si no existe
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'dr.perez@unam.mx',
        password: 'investigador123'
      });

      if (loginResponse.data.success) {
        console.log('✅ Usuario RESEARCHER arreglado exitosamente');
        console.log('👤 Usuario:', loginResponse.data.data.user);
      } else {
        console.log('❌ Error al arreglar usuario:', loginResponse.data.error);
      }
    } else {
      console.log('❌ Usuario no encontrado en Supabase Auth');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error del servidor:', error.response.data);
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
}

fixResearcherUser(); 