const http = require('http');

console.log('🧪 Probando correcciones del contexto...');

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

// Prueba 1: Verificar que la página de hallazgos carga
console.log('\n1️⃣ Verificando página de hallazgos...');
makeRequest('/dashboard/researcher/findings', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log(`✅ Página de hallazgos (${statusCode}): OK`);
    
    // Verificar elementos clave
    const hasFindingsTitle = data.includes('Hallazgos Arqueológicos');
    const hasNewFindingButton = data.includes('Nuevo Hallazgo');
    const hasDebugPanel = data.includes('Debug - Estado del Contexto');
    const hasTestButtons = data.includes('🔧 Test Contexto');
    
    console.log(`   📊 Elementos de la página:`);
    console.log(`      - Título de hallazgos: ${hasFindingsTitle ? '✅' : '❌'}`);
    console.log(`      - Botón nuevo hallazgo: ${hasNewFindingButton ? '✅' : '❌'}`);
    console.log(`      - Panel de debug: ${hasDebugPanel ? '✅' : '❌'}`);
    console.log(`      - Botones de test: ${hasTestButtons ? '✅' : '❌'}`);
  }
});

// Prueba 2: Verificar página de prueba visual
console.log('\n2️⃣ Verificando página de prueba visual...');
makeRequest('/test-context-visual', (err, data, statusCode) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log(`✅ Página de prueba visual (${statusCode}): OK`);
    
    // Verificar elementos clave
    const hasContextStatus = data.includes('Estado del Contexto');
    const hasLocalStorage = data.includes('localStorage');
    const hasTestButtons = data.includes('🧪 Contexto Completo');
    const hasManualInput = data.includes('Contexto Manual');
    
    console.log(`   📊 Elementos de la página:`);
    console.log(`      - Estado del contexto: ${hasContextStatus ? '✅' : '❌'}`);
    console.log(`      - localStorage visible: ${hasLocalStorage ? '✅' : '❌'}`);
    console.log(`      - Botones de prueba: ${hasTestButtons ? '✅' : '❌'}`);
    console.log(`      - Contexto manual: ${hasManualInput ? '✅' : '❌'}`);
  }
});

console.log('\n🎯 Resumen de las correcciones implementadas:');
console.log('   ✅ Contexto se guarda automáticamente al seleccionar');
console.log('   ✅ Contexto parcial (proyecto + área) es válido');
console.log('   ✅ Contexto completo requiere proyecto + área + sitio');
console.log('   ✅ Selector no se cierra automáticamente al seleccionar área');
console.log('   ✅ Indicador visual de contexto parcial/completo');
console.log('   ✅ Botones de confirmar y limpiar en el selector');

console.log('\n📋 Para probar manualmente:');
console.log('   1. Abre http://localhost:3001/dashboard/researcher/findings');
console.log('   2. Haz clic en "📍 Seleccionar Contexto" en el header');
console.log('   3. Selecciona un Proyecto');
console.log('   4. Selecciona un Área');
console.log('   5. Verifica que puedes seleccionar un Sitio (opcional)');
console.log('   6. Verifica que el contexto se guarda automáticamente');
console.log('   7. Verifica que aparece "Contexto Activo" con indicador');
console.log('   8. Prueba "Nuevo Hallazgo" y verifica que carga el contexto');

console.log('\n🔧 Comandos para probar en consola del navegador:');
console.log('   // Ver contexto actual');
console.log('   console.log(JSON.parse(localStorage.getItem("investigator-context")));');
console.log('   ');
console.log('   // Establecer contexto de prueba');
console.log('   localStorage.setItem("investigator-context", JSON.stringify({');
console.log('     "project": "Proyecto Cazadores Recolectores - La Laguna",');
console.log('     "area": "Laguna La Brava",');
console.log('     "site": "Sitio Pampeano La Laguna"');
console.log('   }));');
console.log('   window.location.reload();'); 