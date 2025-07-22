const fetch = require('node-fetch');

const credentials = [
  {
    role: 'ADMIN',
    email: 'fa07fa@gmail.com',
    password: '3por39',
    description: 'Administrador del Sistema'
  },
  {
    role: 'RESEARCHER',
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    description: 'Investigador'
  },
  {
    role: 'STUDENT',
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    description: 'Estudiante'
  },
  {
    role: 'DIRECTOR',
    email: 'director@inah.gob.mx',
    password: 'director123',
    description: 'Director'
  },
  {
    role: 'INSTITUTION',
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    description: 'Institución'
  },
  {
    role: 'GUEST',
    email: 'invitado@example.com',
    password: 'invitado123',
    description: 'Invitado'
  }
];

async function testLoginAPI() {
  console.log('🚀 Probando login con credenciales de la guía...\n');
  
  for (const cred of credentials) {
    console.log(`📝 Probando: ${cred.role} (${cred.description})`);
    console.log(`   Email: ${cred.email}`);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cred.email,
          password: cred.password
        })
      });
      
      const data = await response.json();
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`✅ Login exitoso para ${cred.role}`);
        
        // Acceder a los datos correctos de la respuesta
        const userData = data.data?.user;
        const token = data.data?.token;
        
        console.log(`   Token: ${token ? 'Presente' : 'No encontrado'}`);
        console.log(`   Usuario: ${userData ? userData.email : 'No encontrado'}`);
        console.log(`   Rol: ${userData ? userData.role : 'No encontrado'}`);
        console.log(`   Nombre: ${userData ? `${userData.first_name} ${userData.last_name}` : 'No encontrado'}`);
        
        // Probar obtener perfil con el token
        if (token) {
          try {
            const profileResponse = await fetch('http://localhost:4000/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              console.log(`   ✅ Perfil obtenido correctamente`);
            } else {
              console.log(`   ❌ Error al obtener perfil: ${profileResponse.status}`);
              const profileError = await profileResponse.json();
              console.log(`   Error: ${JSON.stringify(profileError, null, 2)}`);
            }
          } catch (profileError) {
            console.log(`   ❌ Error al obtener perfil: ${profileError.message}`);
          }
        }
        
      } else {
        console.log(`❌ Login falló para ${cred.role}`);
        console.log(`   Error: ${data.error?.message || data.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.log(`❌ Error de red para ${cred.role}: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
  
  console.log('📋 Resumen de credenciales:');
  credentials.forEach(cred => {
    console.log(`👤 ${cred.role}: ${cred.email} / ${cred.password}`);
  });
}

// Verificar que el backend esté corriendo
async function checkBackend() {
  try {
    const response = await fetch('http://localhost:4000/api/health');
    if (response.ok) {
      console.log('✅ Backend corriendo en puerto 4000');
      return true;
    } else {
      console.log('❌ Backend no responde correctamente');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend no está corriendo en puerto 4000');
    return false;
  }
}

// Ejecutar las pruebas
checkBackend().then((isRunning) => {
  if (isRunning) {
    testLoginAPI();
  } else {
    console.log('❌ No se pueden ejecutar las pruebas sin el backend');
  }
}); 