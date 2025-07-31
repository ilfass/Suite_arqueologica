const axios = require('axios');

async function testFrontendSimulation() {
  console.log('🧪 Simulando petición del frontend a la vidriera pública...');
  
  try {
    // Simular la petición exacta que hace el frontend
    const userId = 'a9824343-3b45-4360-833c-8f241f7d835d';
    const url = `http://localhost:4000/api/auth/public-profile/${userId}`;
    
    console.log(`📡 Haciendo petición a: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });

    console.log('✅ Respuesta recibida:');
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Success: ${response.data.success}`);
    
    if (response.data.success && response.data.data) {
      const profile = response.data.data;
      console.log('📋 Datos del perfil:');
      console.log(`   - ID: ${profile.id}`);
      console.log(`   - User ID: ${profile.user_id}`);
      console.log(`   - Display Name: ${profile.display_name}`);
      console.log(`   - Bio: ${profile.bio.substring(0, 50)}...`);
      console.log(`   - Is Public: ${profile.is_public}`);
      console.log(`   - Institution: ${profile.institution}`);
      console.log(`   - Specialization: ${profile.specialization}`);
      console.log(`   - Location: ${profile.location}`);
      console.log(`   - Email: ${profile.email}`);
      console.log(`   - Website: ${profile.website}`);
      console.log(`   - Custom Message: ${profile.custom_message.substring(0, 50)}...`);
      console.log(`   - Social Media: ${Object.keys(profile.social_media).length} redes sociales`);
      console.log(`   - Public Projects: ${profile.public_projects.length} proyectos`);
      console.log(`   - Public Findings: ${profile.public_findings.length} hallazgos`);
      console.log(`   - Public Reports: ${profile.public_reports.length} reportes`);
      console.log(`   - Public Publications: ${profile.public_publications.length} publicaciones`);
      console.log(`   - Updated At: ${profile.updated_at}`);
      
      console.log('');
      console.log('🎉 ¡Simulación exitosa!');
      console.log('💡 Los datos están disponibles correctamente.');
      console.log('🌐 Ahora puedes verificar en el navegador:');
      console.log(`   http://localhost:3000/public/investigator/${userId}`);
      
    } else {
      console.log('❌ Error en la respuesta:', response.data);
    }

  } catch (error) {
    console.error('❌ Error durante la simulación:', error.response?.data || error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Headers:', error.response.headers);
    }
  }
}

testFrontendSimulation(); 