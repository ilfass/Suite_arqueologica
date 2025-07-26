const fs = require('fs');
const path = require('path');

// Simular el contexto de prueba
const testContext = {
  project: 'Proyecto Cazadores Recolectores - La Laguna',
  area: 'Laguna La Brava',
  site: 'Sitio Pampeano La Laguna'
};

console.log('🧪 Script de prueba de contexto');
console.log('📦 Contexto de prueba:', testContext);

// Verificar si existe el archivo de localStorage simulado
const localStoragePath = path.join(__dirname, 'localStorage_backup.json');

try {
  // Crear backup del localStorage actual si existe
  if (fs.existsSync(localStoragePath)) {
    const existing = JSON.parse(fs.readFileSync(localStoragePath, 'utf8'));
    console.log('📁 localStorage existente:', existing);
  }
  
  // Guardar el contexto de prueba
  fs.writeFileSync(localStoragePath, JSON.stringify({
    'investigator-context': testContext
  }, null, 2));
  
  console.log('✅ Contexto de prueba guardado en:', localStoragePath);
  console.log('🔧 Para usar en el navegador:');
  console.log('   localStorage.setItem("investigator-context", JSON.stringify(' + JSON.stringify(testContext) + '));');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 