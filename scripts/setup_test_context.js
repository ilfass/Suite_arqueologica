#!/usr/bin/env node

/**
 * Script para establecer contexto de prueba para el mapeo SIG
 * Este script establece un contexto completo (proyecto, área, sitio) en localStorage
 * para que el mapeo SIG integrado se habilite en el dashboard del investigador
 */

console.log('🔧 Configurando contexto de prueba para mapeo SIG...');

// Contexto de prueba completo para habilitar el mapeo SIG
const testContext = {
  project: 'Proyecto Cazadores Recolectores Pampeanos',
  area: 'Pampa Húmeda',
  site: 'Sitio La Laguna'
};

// Contexto unificado (formato alternativo)
const unifiedTestContext = {
  project_id: 'proj-001',
  project_name: 'Proyecto Cazadores Recolectores Pampeanos',
  area_id: 'area-001',
  area_name: 'Pampa Húmeda',
  site_id: 'site-001',
  site_name: 'Sitio La Laguna'
};

try {
  // Simular localStorage del navegador
  if (typeof localStorage !== 'undefined') {
    // Guardar contexto del investigador
    localStorage.setItem('investigator-context', JSON.stringify(testContext));
    console.log('✅ Contexto del investigador guardado:', testContext);
    
    // Guardar contexto unificado
    localStorage.setItem('unified-context', JSON.stringify(unifiedTestContext));
    console.log('✅ Contexto unificado guardado:', unifiedTestContext);
    
    console.log('\n🎯 Contexto de prueba establecido exitosamente!');
    console.log('📋 Proyecto:', testContext.project);
    console.log('🗺️ Área:', testContext.area);
    console.log('🏛️ Sitio:', testContext.site);
    console.log('\n🔄 Ahora el mapeo SIG integrado debería estar habilitado.');
    console.log('🌐 Ve a http://localhost:3000/dashboard/researcher para verificar.');
  } else {
    console.log('⚠️ localStorage no disponible en este entorno');
    console.log('📝 Para establecer el contexto manualmente:');
    console.log('1. Abre las herramientas de desarrollador (F12)');
    console.log('2. Ve a la pestaña Application/Storage > Local Storage');
    console.log('3. Agrega la clave "investigator-context" con el valor:');
    console.log(JSON.stringify(testContext, null, 2));
  }
} catch (error) {
  console.error('❌ Error al establecer contexto:', error);
  console.log('\n📝 Instrucciones manuales:');
  console.log('1. Abre http://localhost:3000/dashboard/researcher');
  console.log('2. Abre las herramientas de desarrollador (F12)');
  console.log('3. En la consola, ejecuta:');
  console.log(`localStorage.setItem('investigator-context', '${JSON.stringify(testContext)}');`);
  console.log('4. Recarga la página');
}

console.log('\n🔍 Para verificar el contexto actual:');
console.log('1. Ve a http://localhost:3000/dashboard/researcher');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. En la consola, ejecuta:');
console.log("console.log('Contexto actual:', JSON.parse(localStorage.getItem('investigator-context')));");

console.log('\n🎉 ¡Listo! El mapeo SIG integrado debería estar habilitado ahora.'); 