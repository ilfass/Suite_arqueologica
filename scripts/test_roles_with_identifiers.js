const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

// Configuración de usuarios de prueba con nombres identificatorios
const testUsers = {
  INSTITUTION: {
    email: 'prueba.institucion@test.com',
    password: 'Password123!',
    firstName: 'PruebaInstitucion',
    lastName: 'TestInstitution',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    role: 'INSTITUTION',
    termsAccepted: true,
    // Campos específicos para INSTITUTION
    institutionName: 'Universidad Nacional de La Plata - Prueba',
    institutionAddress: 'Calle 50 entre 115 y 116, La Plata',
    institutionWebsite: 'https://www.unlp.edu.ar/prueba',
    institutionDepartment: 'Facultad de Ciencias Naturales y Museo',
    institutionEmail: 'institucion@unlp.edu.ar',
    institutionAlternativeEmail: 'alt.institucion@unlp.edu.ar'
  },
  DIRECTOR: {
    email: 'prueba.director@test.com',
    password: 'Password123!',
    firstName: 'PruebaDirector',
    lastName: 'TestDirector',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    role: 'DIRECTOR',
    termsAccepted: true,
    // Campos específicos para DIRECTOR
    documentId: 'DNI12345678',
    highestDegree: 'Doctorado en Arqueología',
    discipline: 'Arqueología Prehistórica',
    formationInstitution: 'Universidad Nacional de La Plata',
    currentInstitution: 'CONICET - INAPL',
    currentPosition: 'Investigador Principal',
    cvLink: 'https://orcid.org/0000-0000-0000-0001'
  },
  RESEARCHER: {
    email: 'prueba.investigador@test.com',
    password: 'Password123!',
    firstName: 'PruebaInvestigador',
    lastName: 'TestResearcher',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    role: 'RESEARCHER',
    termsAccepted: true,
    // Campos específicos para RESEARCHER
    documentId: 'DNI87654321',
    career: 'Licenciatura en Antropología',
    year: '2023',
    formationInstitution: 'Universidad Nacional de La Plata',
    role: 'Becario Doctoral',
    area: 'Arqueología de Cazadores-Recolectores',
    directorId: null // Se puede establecer después
  },
  STUDENT: {
    email: 'prueba.estudiante@test.com',
    password: 'Password123!',
    firstName: 'PruebaEstudiante',
    lastName: 'TestStudent',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    role: 'STUDENT',
    termsAccepted: true,
    // Campos específicos para STUDENT
    documentId: 'DNI11223344',
    highestDegree: 'Bachiller',
    discipline: 'Antropología',
    formationInstitution: 'Colegio Nacional de La Plata',
    currentInstitution: 'Universidad Nacional de La Plata',
    currentPosition: 'Estudiante de Grado',
    cvLink: 'https://linkedin.com/in/prueba-estudiante'
  },
  GUEST: {
    email: 'prueba.invitado@test.com',
    password: 'Password123!',
    firstName: 'PruebaInvitado',
    lastName: 'TestGuest',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    role: 'GUEST',
    termsAccepted: true
  }
};

async function testUserRegistration(role, userData) {
  try {
    console.log(`\n🧪 Probando registro de ${role}...`);
    console.log(`📧 Email: ${userData.email}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (response.data.success) {
      console.log(`✅ ${role} registrado exitosamente`);
      console.log(`🆔 ID: ${response.data.data.user.id}`);
      return { success: true, user: response.data.data.user, token: response.data.data.token };
    } else {
      console.log(`❌ Error en registro: ${response.data.error?.message}`);
      return { success: false, error: response.data.error?.message };
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📋 Error: ${error.response.data?.error?.message || error.response.data?.message}`);
    }
    return { success: false, error: error.message };
  }
}

async function testUserLogin(role, userData) {
  try {
    console.log(`\n🔐 Probando login de ${role}...`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    
    if (response.data.success) {
      console.log(`✅ ${role} logueado exitosamente`);
      return { success: true, token: response.data.data.token };
    } else {
      console.log(`❌ Error en login: ${response.data.error?.message}`);
      return { success: false, error: response.data.error?.message };
    }
  } catch (error) {
    console.log(`❌ Error de conexión en login: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGetProfile(role, token) {
  try {
    console.log(`\n👤 Probando obtención de perfil de ${role}...`);
    
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log(`✅ Perfil de ${role} obtenido exitosamente`);
      console.log(`📋 Campos del perfil:`, Object.keys(response.data.data));
      
      // Verificar campos específicos del rol
      const user = response.data.data;
      console.log(`\n🔍 Verificación de campos específicos para ${role}:`);
      
      switch (role) {
        case 'INSTITUTION':
          console.log(`  - Nombre institución: ${user.institution_name || 'No encontrado'}`);
          console.log(`  - Dirección: ${user.institution_address || 'No encontrado'}`);
          console.log(`  - Website: ${user.institution_website || 'No encontrado'}`);
          break;
        case 'DIRECTOR':
          console.log(`  - Documento: ${user.director_document_id || 'No encontrado'}`);
          console.log(`  - Título: ${user.director_highest_degree || 'No encontrado'}`);
          console.log(`  - Disciplina: ${user.director_discipline || 'No encontrado'}`);
          break;
        case 'RESEARCHER':
          console.log(`  - Documento: ${user.researcher_document_id || 'No encontrado'}`);
          console.log(`  - Carrera: ${user.researcher_career || 'No encontrado'}`);
          console.log(`  - Año: ${user.researcher_year || 'No encontrado'}`);
          break;
        case 'STUDENT':
          console.log(`  - Documento: ${user.student_document_id || 'No encontrado'}`);
          console.log(`  - Título: ${user.student_highest_degree || 'No encontrado'}`);
          console.log(`  - Disciplina: ${user.student_discipline || 'No encontrado'}`);
          break;
        case 'GUEST':
          console.log(`  - Solo campos básicos verificados`);
          break;
      }
      
      return { success: true, profile: response.data.data };
    } else {
      console.log(`❌ Error obteniendo perfil: ${response.data.error?.message}`);
      return { success: false, error: response.data.error?.message };
    }
  } catch (error) {
    console.log(`❌ Error de conexión obteniendo perfil: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 TESTING NUEVO SISTEMA DE REGISTRO CON IDENTIFICADORES');
  console.log('========================================================');
  console.log('ℹ️  Iniciando pruebas del nuevo sistema de registro...\n');
  
  const results = {
    registrations: {},
    logins: {},
    profiles: {}
  };
  
  // Probar cada rol
  for (const [role, userData] of Object.entries(testUsers)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`ℹ️  Probando registro de ${role}...`);
    console.log(`${'='.repeat(60)}`);
    
    // 1. Registro
    const registrationResult = await testUserRegistration(role, userData);
    results.registrations[role] = registrationResult;
    
    if (registrationResult.success) {
      // 2. Login
      const loginResult = await testUserLogin(role, userData);
      results.logins[role] = loginResult;
      
      if (loginResult.success) {
        // 3. Obtener perfil
        const profileResult = await testGetProfile(role, loginResult.token);
        results.profiles[role] = profileResult;
      }
    }
    
    // Esperar un poco entre pruebas para evitar rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Resumen final
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 RESUMEN DE PRUEBAS');
  console.log(`${'='.repeat(60)}`);
  
  const roles = Object.keys(testUsers);
  console.log('\nROLES         | Registro | Login   | Perfil  ');
  console.log('-------------|----------|---------|---------');
  
  roles.forEach(role => {
    const reg = results.registrations[role]?.success ? '✅' : '❌';
    const login = results.logins[role]?.success ? '✅' : '❌';
    const profile = results.profiles[role]?.success ? '✅' : '❌';
    console.log(`${role.padEnd(12)} | ${reg.padEnd(8)} | ${login.padEnd(7)} | ${profile}`);
  });
  
  console.log('\n' + '='.repeat(60));
  const totalRegistrations = Object.values(results.registrations).filter(r => r.success).length;
  const totalLogins = Object.values(results.logins).filter(r => r.success).length;
  const totalProfiles = Object.values(results.profiles).filter(r => r.success).length;
  
  console.log(`Total exitosos: ${totalRegistrations}/${roles.length} registros, ${totalLogins}/${roles.length} logins, ${totalProfiles}/${roles.length} perfiles`);
  
  if (totalRegistrations === roles.length && totalLogins === roles.length && totalProfiles === roles.length) {
    console.log('\n🎉 ¡Todas las pruebas fueron exitosas!');
    console.log('✅ El nuevo sistema de registro está funcionando correctamente');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisar los errores anteriores.');
  }
  
  console.log('\n📋 Emails de prueba creados:');
  roles.forEach(role => {
    console.log(`  - ${role}: ${testUsers[role].email}`);
  });
}

// Ejecutar pruebas
runTests().catch(console.error); 