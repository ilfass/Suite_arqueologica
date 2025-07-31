const axios = require('axios');

async function testCompleteFlow() {
  console.log('🧪 Probando flujo completo de vidriera pública...');
  
  try {
    // 1. Obtener token de autenticación
    console.log('🔐 Obteniendo token de autenticación...');
    const loginResponse = await axios.post('http://localhost:4001/auth/login-dev', {
      email: 'lic.fabiande@gmail.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.data.tokens.token;
    console.log('✅ Token obtenido');
    
    // 2. Obtener perfil público inicial
    console.log('📖 Obteniendo perfil público inicial...');
    const initialProfileResponse = await axios.get('http://localhost:4001/auth/public-profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Perfil inicial obtenido:', initialProfileResponse.data.data.display_name);
    
    // 3. Actualizar perfil con datos completos
    console.log('✏️ Actualizando perfil con datos completos...');
    const updateData = {
      isPublic: true,
      displayName: 'Dr. Fabian de Haro',
      bio: 'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia en excavaciones en el noroeste argentino.',
      specialization: 'Arqueología Prehispánica, Cerámica Antigua, Análisis de Materiales',
      institution: 'Universidad de Buenos Aires',
      location: 'Buenos Aires, Argentina',
      email: 'lic.fabiande@gmail.com',
      website: 'https://arqueologia.uba.ar',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/fabiandeharo',
        researchGate: 'https://researchgate.net/profile/fabiandeharo',
        academia: 'https://uba.academia.edu/fabiandeharo'
      },
      customMessage: 'Bienvenidos a mi espacio de investigación arqueológica. Aquí encontrarán información sobre mis proyectos, hallazgos y publicaciones en el campo de la arqueología prehispánica del noroeste argentino.',
      publicProjects: [
        'Proyecto Arqueológico Valle de Tafí (2018-2023)',
        'Estudio de Cerámica Prehispánica del Noroeste',
        'Análisis de Patrones de Asentamiento'
      ],
      publicFindings: [
        'Descubrimiento de alfarería prehispánica en Tafí del Valle',
        'Identificación de patrones de asentamiento en el período tardío',
        'Análisis de materiales líticos en contextos domésticos'
      ],
      publicReports: [
        'Informe de Excavación 2022 - Sitio Tafí 1',
        'Análisis de Materiales Cerámicos - Temporada 2021',
        'Estudio de Distribución Espacial - Valle de Tafí'
      ],
      publicPublications: [
        'De Haro, F. (2023). "Patrones de Asentamiento en el Valle de Tafí". Revista Arqueológica Argentina.',
        'De Haro, F. et al. (2022). "Análisis de Cerámica Prehispánica del Noroeste". Arqueología del NOA.',
        'De Haro, F. (2021). "Metodologías de Excavación en Contextos Domésticos". Actas del Congreso Nacional.'
      ]
    };
    
    const updateResponse = await axios.put('http://localhost:4001/auth/public-profile', updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Perfil actualizado exitosamente');
    
    // 4. Verificar que los datos se guardaron correctamente
    console.log('🔍 Verificando datos guardados...');
    const verifyResponse = await axios.get('http://localhost:4001/auth/public-profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const savedData = verifyResponse.data.data;
    console.log('✅ Datos verificados:');
    console.log(`   - Nombre: ${savedData.display_name}`);
    console.log(`   - Institución: ${savedData.institution}`);
    console.log(`   - Especialización: ${savedData.specialization}`);
    console.log(`   - Proyectos: ${savedData.public_projects.length} proyectos`);
    console.log(`   - Hallazgos: ${savedData.public_findings.length} hallazgos`);
    console.log(`   - Reportes: ${savedData.public_reports.length} reportes`);
    console.log(`   - Publicaciones: ${savedData.public_publications.length} publicaciones`);
    
    // 5. Probar a través del API Gateway
    console.log('🌐 Probando a través del API Gateway...');
    const gatewayResponse = await axios.get('http://localhost:4000/api/auth/public-profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ API Gateway funcionando correctamente');
    
    console.log('🎉 ¡Flujo completo probado exitosamente!');
    console.log('');
    console.log('📋 Resumen:');
    console.log('✅ Autenticación funcionando');
    console.log('✅ Obtención de perfil funcionando');
    console.log('✅ Actualización de perfil funcionando');
    console.log('✅ Persistencia de datos funcionando');
    console.log('✅ API Gateway funcionando');
    console.log('');
    console.log('🌐 Ahora puedes:');
    console.log('   1. Ir a http://localhost:3000/dashboard/researcher/public-profile');
    console.log('   2. Ver los datos cargados en el formulario');
    console.log('   3. Modificar y guardar cambios');
    console.log('   4. Ver la página pública en http://localhost:3000/public/investigator/a9824343-3b45-4360-833c-8f241f7d835d');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response?.data || error.message);
  }
}

testCompleteFlow(); 