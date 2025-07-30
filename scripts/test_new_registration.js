const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

// Función para limpiar la consola
const clearConsole = () => {
  console.clear();
  console.log('🧪 TESTING NUEVO SISTEMA DE REGISTRO\n');
};

// Función para mostrar resultados
const showResult = (testName, success, message) => {
  const icon = success ? '✅' : '❌';
  const color = success ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${icon} ${color}${testName}${reset}: ${message}`);
};

// Función para mostrar información
const showInfo = (message) => {
  console.log(`ℹ️  ${message}`);
};

// Función para mostrar separador
const showSeparator = () => {
  console.log('\n' + '='.repeat(60) + '\n');
};

// Datos de prueba para diferentes roles
const testUsers = {
  institution: {
    email: `institucion.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Universidad',
    lastName: 'Nacional de La Plata',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    phone: '+54 221 123-4567',
    role: 'INSTITUTION',
    termsAccepted: true,
    institutionName: 'Universidad Nacional de La Plata',
    institutionAddress: 'Calle 7 N° 1226, La Plata',
    institutionWebsite: 'https://www.unlp.edu.ar',
    institutionDepartment: 'Facultad de Ciencias Naturales y Museo',
    institutionEmail: 'institucion@unlp.edu.ar',
    institutionAlternativeEmail: 'contacto@unlp.edu.ar'
  },
  
  director: {
    email: `director.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Dr. María',
    lastName: 'González',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    phone: '+54 221 987-6543',
    role: 'DIRECTOR',
    termsAccepted: true,
    documentId: '12345678',
    highestDegree: 'Doctor en Arqueología',
    discipline: 'Arqueología',
    formationInstitution: 'Universidad Nacional de La Plata',
    currentInstitution: 'CONICET',
    currentPosition: 'Investigador Principal',
    cvLink: 'https://orcid.org/0000-0000-0000-0000'
  },
  
  researcher: {
    email: `researcher.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Juan',
    lastName: 'Pérez',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    phone: '+54 221 555-1234',
    role: 'RESEARCHER',
    termsAccepted: true,
    documentId: '87654321',
    career: 'Licenciatura en Antropología',
    year: '3er año',
    formationInstitution: 'Universidad Nacional de La Plata',
    researcherRole: 'Tesista',
    researchArea: 'Arqueología Maya'
  },
  
  student: {
    email: `student.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Ana',
    lastName: 'López',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    phone: '+54 221 444-5678',
    role: 'STUDENT',
    termsAccepted: true,
    documentId: '11223344',
    highestDegree: 'Bachiller',
    discipline: 'Arqueología',
    formationInstitution: 'Universidad Nacional de La Plata',
    currentInstitution: 'Museo de La Plata',
    currentPosition: 'Estudiante',
    cvLink: 'https://academia.edu/ana-lopez'
  },
  
  guest: {
    email: `guest.test.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    country: 'Argentina',
    province: 'Buenos Aires',
    city: 'La Plata',
    phone: '+54 221 333-9999',
    role: 'GUEST',
    termsAccepted: true
  }
};

// Función para probar registro de un usuario
async function testUserRegistration(userData, roleName) {
  try {
    showInfo(`Probando registro de ${roleName}...`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (response.data.success) {
      showResult(
        `Registro ${roleName}`, 
        true, 
        `Usuario creado exitosamente. ID: ${response.data.data.user.id}`
      );
      
      // Verificar que los campos específicos se guardaron correctamente
      const user = response.data.data.user;
      let fieldsVerified = 0;
      let totalFields = 0;
      
      switch (roleName) {
        case 'INSTITUTION':
          totalFields = 6;
          if (user.institution_name) fieldsVerified++;
          if (user.institution_address) fieldsVerified++;
          if (user.institution_website) fieldsVerified++;
          if (user.institution_department) fieldsVerified++;
          if (user.institution_email) fieldsVerified++;
          if (user.institution_alternative_email) fieldsVerified++;
          break;
          
        case 'DIRECTOR':
          totalFields = 7;
          if (user.director_document_id) fieldsVerified++;
          if (user.director_highest_degree) fieldsVerified++;
          if (user.director_discipline) fieldsVerified++;
          if (user.director_formation_institution) fieldsVerified++;
          if (user.director_current_institution) fieldsVerified++;
          if (user.director_current_position) fieldsVerified++;
          if (user.director_cv_link) fieldsVerified++;
          break;
          
        case 'RESEARCHER':
          totalFields = 6;
          if (user.researcher_document_id) fieldsVerified++;
          if (user.researcher_career) fieldsVerified++;
          if (user.researcher_year) fieldsVerified++;
          if (user.researcher_formation_institution) fieldsVerified++;
          if (user.researcher_role) fieldsVerified++;
          if (user.researcher_area) fieldsVerified++;
          break;
          
        case 'STUDENT':
          totalFields = 7;
          if (user.student_document_id) fieldsVerified++;
          if (user.student_highest_degree) fieldsVerified++;
          if (user.student_discipline) fieldsVerified++;
          if (user.student_formation_institution) fieldsVerified++;
          if (user.student_current_institution) fieldsVerified++;
          if (user.student_current_position) fieldsVerified++;
          if (user.student_cv_link) fieldsVerified++;
          break;
          
        case 'GUEST':
          totalFields = 0; // No hay campos específicos
          fieldsVerified = 0;
          break;
      }
      
      if (totalFields > 0) {
        showResult(
          `Campos específicos ${roleName}`, 
          fieldsVerified === totalFields, 
          `${fieldsVerified}/${totalFields} campos específicos guardados correctamente`
        );
      }
      
      return response.data.data.token;
    } else {
      showResult(`Registro ${roleName}`, false, 'Respuesta no exitosa del servidor');
      return null;
    }
  } catch (error) {
    showResult(
      `Registro ${roleName}`, 
      false, 
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Función para probar login de un usuario
async function testUserLogin(userData, roleName) {
  try {
    showInfo(`Probando login de ${roleName}...`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    
    if (response.data.success) {
      showResult(
        `Login ${roleName}`, 
        true, 
        `Login exitoso. Token recibido: ${response.data.data.token ? 'Sí' : 'No'}`
      );
      return response.data.data.token;
    } else {
      showResult(`Login ${roleName}`, false, 'Respuesta no exitosa del servidor');
      return null;
    }
  } catch (error) {
    showResult(
      `Login ${roleName}`, 
      false, 
      error.response?.data?.message || error.message
    );
    return null;
  }
}

// Función para probar obtención del perfil
async function testGetProfile(token, roleName) {
  try {
    showInfo(`Probando obtención de perfil de ${roleName}...`);
    
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      const user = response.data.data.user;
      showResult(
        `Perfil ${roleName}`, 
        true, 
        `Perfil obtenido. Nombre: ${user.first_name} ${user.last_name}, Rol: ${user.role}`
      );
      return true;
    } else {
      showResult(`Perfil ${roleName}`, false, 'Respuesta no exitosa del servidor');
      return false;
    }
  } catch (error) {
    showResult(
      `Perfil ${roleName}`, 
      false, 
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Función principal de pruebas
async function runTests() {
  clearConsole();
  
  showInfo('Iniciando pruebas del nuevo sistema de registro...');
  showSeparator();
  
  const results = {
    registrations: {},
    logins: {},
    profiles: {}
  };
  
  // Probar registro de todos los roles
  for (const [role, userData] of Object.entries(testUsers)) {
    const token = await testUserRegistration(userData, role.toUpperCase());
    results.registrations[role] = token ? true : false;
    
    if (token) {
      // Probar login
      const loginToken = await testUserLogin(userData, role.toUpperCase());
      results.logins[role] = loginToken ? true : false;
      
      if (loginToken) {
        // Probar obtención de perfil
        const profileSuccess = await testGetProfile(loginToken, role.toUpperCase());
        results.profiles[role] = profileSuccess;
      }
    }
    
    showSeparator();
  }
  
  // Mostrar resumen
  console.log('📊 RESUMEN DE PRUEBAS\n');
  
  const roles = Object.keys(testUsers);
  let totalRegistrations = 0;
  let totalLogins = 0;
  let totalProfiles = 0;
  
  roles.forEach(role => {
    const registration = results.registrations[role] ? '✅' : '❌';
    const login = results.logins[role] ? '✅' : '❌';
    const profile = results.profiles[role] ? '✅' : '❌';
    
    console.log(`${role.toUpperCase().padEnd(12)} | Registro: ${registration} | Login: ${login} | Perfil: ${profile}`);
    
    if (results.registrations[role]) totalRegistrations++;
    if (results.logins[role]) totalLogins++;
    if (results.profiles[role]) totalProfiles++;
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`Total exitosos: ${totalRegistrations}/${roles.length} registros, ${totalLogins}/${roles.length} logins, ${totalProfiles}/${roles.length} perfiles`);
  
  if (totalRegistrations === roles.length && totalLogins === roles.length && totalProfiles === roles.length) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS EXITOSAS! El nuevo sistema de registro funciona correctamente.');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisar los errores anteriores.');
  }
}

// Ejecutar pruebas
runTests().catch(error => {
  console.error('❌ Error general en las pruebas:', error);
}); 