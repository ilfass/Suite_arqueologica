#!/usr/bin/env node

/**
 * Script para debuggear el estado del contexto
 */

console.log('🔍 Debug del Contexto - Suite Arqueológica');
console.log('==========================================');

// Simular verificación del contexto
console.log('\n📋 Verificación del Contexto:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Ejecuta los siguientes comandos:');

console.log('\n🔧 Comandos para ejecutar en la consola:');
console.log('----------------------------------------');

console.log('// Verificar contexto actual');
console.log("console.log('Contexto actual:', JSON.parse(localStorage.getItem('investigator-context') || '{}'));");

console.log('\n// Verificar si hay contexto');
console.log("const ctx = JSON.parse(localStorage.getItem('investigator-context') || '{}');");
console.log("console.log('Proyecto:', ctx.project || 'No establecido');");
console.log("console.log('Área:', ctx.area || 'No establecida');");
console.log("console.log('Sitio:', ctx.site || 'No establecido');");

console.log('\n// Verificar lógica de habilitación');
console.log("const hasMinimal = ctx.project && ctx.area;");
console.log("const hasComplete = ctx.project && ctx.area && ctx.site;");
console.log("console.log('Contexto mínimo (herramientas básicas):', hasMinimal);");
console.log("console.log('Contexto completo (mapeo SIG):', hasComplete);");

console.log('\n// Establecer contexto de prueba si es necesario');
console.log("localStorage.setItem('investigator-context', JSON.stringify({");
console.log("  project: 'Proyecto de Prueba',");
console.log("  area: 'Área de Prueba',");
console.log("  site: 'Sitio de Prueba'");
console.log("}));");
console.log("console.log('Contexto de prueba establecido');");

console.log('\n// Recargar página después de establecer contexto');
console.log("window.location.reload();");

console.log('\n🎯 Instrucciones:');
console.log('1. Ve a http://localhost:3000/dashboard/researcher');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ejecuta los comandos de arriba en la consola');
console.log('4. Verifica que las herramientas se habiliten correctamente');

console.log('\n📊 Estados esperados:');
console.log('- Sin contexto: Todas las herramientas en gris');
console.log('- Contexto mínimo: Herramientas básicas habilitadas, mapeo SIG en gris');
console.log('- Contexto completo: Todas las herramientas habilitadas'); 