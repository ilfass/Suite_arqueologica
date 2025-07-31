const axios = require('axios');

async function testPublicProfile() {
  console.log('🧪 Probando flujo completo de vidriera pública...');
  
  try {
    // 1. Login para obtener token
    console.log('🔐 Obteniendo token de autenticación...');
    const loginResponse = await axios.post('http://localhost:4000/api/auth/login-dev', {
      email: 'lic.fabiande@gmail.com',
      password: 'test'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Token obtenido');

    // 2. Actualizar perfil público con datos de prueba
    console.log('✏️ Actualizando perfil con datos de prueba...');
    const updateData = {
      isPublic: true,
      displayName: 'Dr. Fabian de Haro - TEST',
      bio: 'Arqueólogo especializado en arqueología prehispánica - DATOS DE PRUEBA',
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
      customMessage: 'Bienvenidos a mi espacio de investigación arqueológica - DATOS DE PRUEBA',
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

    const updateResponse = await axios.put('http://localhost:4000/api/auth/public-profile', updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Perfil actualizado exitosamente');

    // 3. Obtener perfil público por ID (sin autenticación)
    console.log('📖 Obteniendo perfil público por ID...');
    const publicResponse = await axios.get('http://localhost:4000/api/auth/public-profile/a9824343-3b45-4360-833c-8f241f7d835d');
    
    if (publicResponse.data.success && publicResponse.data.data) {
      const profile = publicResponse.data.data;
      console.log('✅ Perfil público obtenido:');
      console.log(`   - Nombre: ${profile.display_name}`);
      console.log(`   - Bio: ${profile.bio.substring(0, 50)}...`);
      console.log(`   - Institución: ${profile.institution}`);
      console.log(`   - Público: ${profile.is_public}`);
      console.log(`   - Proyectos: ${profile.public_projects.length} proyectos`);
      console.log(`   - Hallazgos: ${profile.public_findings.length} hallazgos`);
      console.log(`   - Reportes: ${profile.public_reports.length} reportes`);
      console.log(`   - Publicaciones: ${profile.public_publications.length} publicaciones`);
    } else {
      console.log('❌ Error obteniendo perfil público');
    }

    console.log('');
    console.log('🎉 ¡Flujo completo probado exitosamente!');
    console.log('');
    console.log('📋 URLs para verificar:');
    console.log('   - Configuración: http://localhost:3000/dashboard/researcher/public-profile');
    console.log('   - Vista Pública: http://localhost:3000/public/investigator/a9824343-3b45-4360-833c-8f241f7d835d');
    console.log('');
    console.log('💡 Ahora puedes:');
    console.log('   1. Ir a la página de configuración');
    console.log('   2. Modificar los datos');
    console.log('   3. Guardar los cambios');
    console.log('   4. Verificar que se reflejen en la página pública');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response?.data || error.message);
  }
}

testPublicProfile(); 