const http = require('http');

console.log('🧪 Iniciando prueba simple de contexto...');

// Función para hacer peticiones HTTP
function makeRequest(url, callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: url,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback(null, data, res.statusCode);
    });
  });

  req.on('error', (err) => {
    callback(err);
  });

  req.end();
}

// Prueba 1: Página principal
console.log('\n1️⃣ Probando página principal...');
makeRequest('/', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log(`✅ Página principal (${statusCode}): ${data.includes('Suite Arqueológica') ? 'OK' : 'ERROR'}`);
  }
});

// Prueba 2: Página de login
console.log('\n2️⃣ Probando página de login...');
makeRequest('/login', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log(`✅ Página de login (${statusCode}): ${data.includes('Iniciar sesión') ? 'OK' : 'ERROR'}`);
  }
});

// Prueba 3: Página de prueba visual
console.log('\n3️⃣ Probando página de prueba visual...');
makeRequest('/test-context-visual', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log(`✅ Página de prueba visual (${statusCode}): ${data.includes('Test Visual de Contexto') ? 'OK' : 'ERROR'}`);
    
    // Verificar si tiene los botones de prueba
    const hasTestButtons = data.includes('🧪 Contexto Completo') && data.includes('🧪 Contexto Parcial');
    console.log(`   📋 Botones de prueba: ${hasTestButtons ? '✅ Presentes' : '❌ Faltantes'}`);
  }
});

// Prueba 4: Página de hallazgos (debería requerir auth)
console.log('\n4️⃣ Probando página de hallazgos...');
makeRequest('/dashboard/researcher/findings', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    if (statusCode === 200) {
      console.log(`✅ Página de hallazgos (${statusCode}): Acceso directo`);
    } else if (statusCode === 302 || statusCode === 401) {
      console.log(`✅ Página de hallazgos (${statusCode}): Requiere autenticación (correcto)`);
    } else {
      console.log(`❓ Página de hallazgos (${statusCode}): Estado inesperado`);
    }
  }
});

// Prueba 5: Verificar backend
console.log('\n5️⃣ Probando backend...');
const backendReq = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/health',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`✅ Backend (${res.statusCode}): ${data.includes('Suite Arqueológica API') ? 'OK' : 'ERROR'}`);
  });
});

backendReq.on('error', (err) => {
  console.log('❌ Backend error:', err.message);
});

backendReq.end();

console.log('\n🎯 Resumen de la prueba:');
console.log('   - Frontend: http://localhost:3001');
console.log('   - Backend: http://localhost:4000');
console.log('   - Página de prueba: http://localhost:3001/test-context-visual');
console.log('   - Login: http://localhost:3001/login');
console.log('\n📋 Para probar manualmente:');
console.log('   1. Abre http://localhost:3001/test-context-visual');
console.log('   2. Verifica que el contexto se carga automáticamente');
console.log('   3. Usa los botones de prueba para establecer contexto');
console.log('   4. Navega a hallazgos y verifica que el contexto aparece'); 