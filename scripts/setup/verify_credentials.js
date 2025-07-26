const axios = require('axios');

const credentials = [
  {
    email: 'fa07fa@gmail.com',
    password: '3por39',
    role: 'ADMIN'
  },
  {
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    role: 'RESEARCHER'
  },
  {
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    role: 'STUDENT'
  },
  {
    email: 'director@inah.gob.mx',
    password: 'director123',
    role: 'DIRECTOR'
  },
  {
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    role: 'INSTITUTION'
  },
  {
    email: 'invitado@example.com',
    password: 'invitado123',
    role: 'GUEST'
  }
];

async function verifyCredentials() {
  console.log('🔍 Verificando credenciales de la guía del proyecto...\n');
  
  let successCount = 0;
  let totalCount = credentials.length;
  
  for (const cred of credentials) {
    try {
      console.log(`📝 Probando: ${cred.email} (${cred.role})`);
      
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: cred.email,
        password: cred.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ ÉXITO: ${cred.email} - Rol: ${response.data.data.user.role}`);
        successCount++;
      } else {
        console.log(`❌ FALLO: ${cred.email} - ${response.data.error?.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${cred.email} - ${error.response?.data?.error?.message || error.message}`);
    }
    
    console.log('---');
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`✅ Credenciales exitosas: ${successCount}/${totalCount}`);
  console.log(`❌ Credenciales fallidas: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log(`\n🎉 ¡TODAS LAS CREDENCIALES FUNCIONAN CORRECTAMENTE!`);
  } else {
    console.log(`\n⚠️  Algunas credenciales necesitan atención.`);
  }
}

// Verificar que el backend esté corriendo
async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:4000/api/health');
    if (response.data.success) {
      console.log('✅ Backend está funcionando correctamente');
      return true;
    }
  } catch (error) {
    console.log('❌ Backend no está disponible');
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de credenciales...\n');
  
  const backendOk = await checkBackendHealth();
  if (!backendOk) {
    console.log('💡 Asegúrate de que el backend esté corriendo: cd backend && npm run dev');
    process.exit(1);
  }
  
  await verifyCredentials();
}

main().catch(console.error); 