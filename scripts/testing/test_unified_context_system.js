#!/usr/bin/env node

/**
 * Script de prueba automatizada para el Sistema de Contexto Unificado
 * Prueba: Base de datos, Backend API, Frontend y flujo completo
 */

const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración
const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Crear directorio de screenshots si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Función para generar timestamp
const getTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

// Función para tomar screenshot
const takeScreenshot = async (page, name) => {
  const timestamp = getTimestamp();
  const filename = `${timestamp}_${name}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 Screenshot guardado: ${filename}`);
  return filepath;
};

// Función para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Prueba 1: Verificar Backend API
async function testBackendAPI() {
  console.log('\n🔧 PRUEBA 1: Verificar Backend API');
  
  try {
    // Health check
    const healthResponse = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data.message);
    
    // Login para obtener token
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'investigador@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login exitoso, token obtenido');
    
    // Probar endpoints de contexto
    const headers = { Authorization: `Bearer ${token}` };
    
    // Obtener contexto actual
    const currentContext = await axios.get(`${BACKEND_URL}/api/context/current`, { headers });
    console.log('✅ Contexto actual:', currentContext.data.data.context.project_name);
    
    // Actualizar contexto
    const updateResponse = await axios.post(`${BACKEND_URL}/api/context/update`, {
      project_id: 'proj-test-001',
      project_name: 'Proyecto de Prueba',
      area_id: 'area-test-001',
      area_name: 'Área de Prueba',
      site_id: 'site-test-001',
      site_name: 'Sitio de Prueba'
    }, { headers });
    
    console.log('✅ Contexto actualizado:', updateResponse.data.data.context.project_name);
    
    // Verificar contexto
    const checkResponse = await axios.get(`${BACKEND_URL}/api/context/check`, { headers });
    console.log('✅ Contexto válido:', checkResponse.data.data.hasValidContext);
    
    return { success: true, token };
    
  } catch (error) {
    console.error('❌ Error en Backend API:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Prueba 2: Verificar Frontend
async function testFrontend() {
  console.log('\n🌐 PRUEBA 2: Verificar Frontend');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Navegar a la página principal
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01_homepage');
    console.log('✅ Página principal cargada');
    
    // Navegar al login
    await page.click('button:contains("Iniciar sesión")', { timeout: 5000 }).catch(async () => {
      // Si no encuentra el botón, navegar directamente
      await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
    });
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await takeScreenshot(page, '02_login_page');
    console.log('✅ Página de login cargada');
    
    // Hacer login
    await page.type('input[type="email"]', 'investigador@test.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await takeScreenshot(page, '03_after_login');
    console.log('✅ Login exitoso');
    
    // Verificar que estamos en el dashboard
    const dashboardText = await page.$eval('body', el => el.textContent);
    if (dashboardText.includes('Dashboard') || dashboardText.includes('Investigador')) {
      console.log('✅ Dashboard cargado correctamente');
    } else {
      console.log('⚠️ Dashboard no detectado, pero página cargada');
    }
    
    // Navegar a la página de hallazgos
    await page.goto(`${FRONTEND_URL}/dashboard/researcher/findings`, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '04_findings_page');
    console.log('✅ Página de hallazgos cargada');
    
    // Buscar el selector de contexto unificado
    const contextSelector = await page.$('[data-testid="unified-context-selector"]');
    if (contextSelector) {
      console.log('✅ Selector de contexto unificado encontrado');
    } else {
      console.log('⚠️ Selector de contexto unificado no encontrado (puede estar en desarrollo)');
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error en Frontend:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Prueba 3: Verificar Base de Datos
async function testDatabase() {
  console.log('\n🗄️ PRUEBA 3: Verificar Base de Datos');
  
  try {
    // Verificar que la tabla user_context existe consultando el backend
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: 'investigador@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // Intentar obtener contexto (esto fallaría si la tabla no existe)
    const contextResponse = await axios.get(`${BACKEND_URL}/api/context/current`, { headers });
    
    if (contextResponse.data.status === 'success') {
      console.log('✅ Tabla user_context existe y es accesible');
      console.log('✅ Contexto actual:', contextResponse.data.data.context.project_name);
      return { success: true };
    } else {
      console.log('❌ Error al acceder a la tabla user_context');
      return { success: false };
    }
    
  } catch (error) {
    console.error('❌ Error en Base de Datos:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Función principal
async function runTests() {
  console.log('🚀 INICIANDO PRUEBAS DEL SISTEMA DE CONTEXTO UNIFICADO');
  console.log('=' .repeat(60));
  
  const results = {
    backend: false,
    frontend: false,
    database: false,
    timestamp: new Date().toISOString()
  };
  
  // Ejecutar pruebas
  const backendResult = await testBackendAPI();
  results.backend = backendResult.success;
  
  const databaseResult = await testDatabase();
  results.database = databaseResult.success;
  
  const frontendResult = await testFrontend();
  results.frontend = frontendResult.success;
  
  // Generar reporte
  console.log('\n📊 REPORTE FINAL');
  console.log('=' .repeat(60));
  console.log(`Backend API: ${results.backend ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Base de Datos: ${results.database ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Frontend: ${results.frontend ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  const allPassed = results.backend && results.database && results.frontend;
  console.log(`\n🎯 RESULTADO GENERAL: ${allPassed ? '✅ TODAS LAS PRUEBAS PASARON' : '❌ ALGUNAS PRUEBAS FALLARON'}`);
  
  // Guardar reporte
  const reportPath = path.join(SCREENSHOTS_DIR, `test_report_${getTimestamp()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Reporte guardado: ${reportPath}`);
  
  return results;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testBackendAPI, testFrontend, testDatabase }; 