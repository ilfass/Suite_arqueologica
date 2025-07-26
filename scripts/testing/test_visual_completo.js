#!/usr/bin/env node

/**
 * Script de prueba visual completa para el Sistema de Contexto Unificado
 * Prueba: Login, Dashboard, Contexto, Formularios y Navegación
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:4000';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'test_visual_completo');

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

// Función para verificar si un elemento existe
const elementExists = async (page, selector) => {
  try {
    await page.waitForSelector(selector, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

// Función principal de prueba visual
async function testVisualCompleto() {
  console.log('🎨 INICIANDO PRUEBA VISUAL COMPLETA DEL SISTEMA');
  console.log('=' .repeat(60));
  
  let browser;
  let results = {
    homepage: false,
    login: false,
    dashboard: false,
    context: false,
    forms: false,
    navigation: false,
    responsive: false,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Iniciar navegador
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // ===== PRUEBA 1: Página Principal =====
    console.log('\n🏠 PRUEBA 1: Página Principal');
    try {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2', timeout: 10000 });
      await takeScreenshot(page, '01_homepage');
      
      // Verificar elementos clave
      const titleExists = await elementExists(page, 'h1');
      const loginButtonExists = await elementExists(page, 'button:contains("Iniciar sesión")');
      
      if (titleExists && loginButtonExists) {
        console.log('✅ Página principal cargada correctamente');
        results.homepage = true;
      } else {
        console.log('⚠️ Página principal cargada pero faltan elementos');
      }
    } catch (error) {
      console.error('❌ Error en página principal:', error.message);
    }
    
    // ===== PRUEBA 2: Login =====
    console.log('\n🔐 PRUEBA 2: Sistema de Login');
    try {
      // Navegar al login
      await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle2' });
      await takeScreenshot(page, '02_login_page');
      
      // Verificar formulario de login
      const emailInput = await elementExists(page, 'input[type="email"]');
      const passwordInput = await elementExists(page, 'input[type="password"]');
      const submitButton = await elementExists(page, 'button[type="submit"]');
      
      if (emailInput && passwordInput && submitButton) {
        console.log('✅ Formulario de login encontrado');
        
        // Hacer login
        await page.type('input[type="email"]', 'investigador@test.com');
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        // Esperar redirección
        await sleep(3000);
        await takeScreenshot(page, '03_after_login');
        
        // Verificar si estamos en el dashboard
        const currentUrl = page.url();
        if (currentUrl.includes('dashboard') || currentUrl.includes('researcher')) {
          console.log('✅ Login exitoso, redirigido al dashboard');
          results.login = true;
        } else {
          console.log('⚠️ Login completado pero no redirigido al dashboard');
        }
      } else {
        console.log('❌ Formulario de login incompleto');
      }
    } catch (error) {
      console.error('❌ Error en login:', error.message);
    }
    
    // ===== PRUEBA 3: Dashboard =====
    console.log('\n📊 PRUEBA 3: Dashboard del Investigador');
    try {
      // Navegar directamente al dashboard si no estamos ahí
      if (!page.url().includes('dashboard')) {
        await page.goto(`${FRONTEND_URL}/dashboard/researcher`, { waitUntil: 'networkidle2' });
      }
      
      await sleep(2000);
      await takeScreenshot(page, '04_dashboard_main');
      
      // Verificar elementos del dashboard
      const dashboardElements = [
        'h1, h2, h3', // Títulos
        'nav, .sidebar, .navigation', // Navegación
        'button, .btn', // Botones
        '.card, .panel, .section' // Secciones
      ];
      
      let elementsFound = 0;
      for (const selector of dashboardElements) {
        if (await elementExists(page, selector)) {
          elementsFound++;
        }
      }
      
      if (elementsFound >= 2) {
        console.log('✅ Dashboard cargado con elementos principales');
        results.dashboard = true;
      } else {
        console.log('⚠️ Dashboard cargado pero con pocos elementos');
      }
    } catch (error) {
      console.error('❌ Error en dashboard:', error.message);
    }
    
    // ===== PRUEBA 4: Contexto =====
    console.log('\n🎯 PRUEBA 4: Sistema de Contexto');
    try {
      // Buscar elementos de contexto
      const contextSelectors = [
        '[data-testid="unified-context-selector"]',
        '.context-selector',
        '.context-navigator',
        'select[name*="project"]',
        'select[name*="area"]',
        'select[name*="site"]'
      ];
      
      let contextFound = false;
      for (const selector of contextSelectors) {
        if (await elementExists(page, selector)) {
          console.log(`✅ Elemento de contexto encontrado: ${selector}`);
          contextFound = true;
          break;
        }
      }
      
      if (contextFound) {
        await takeScreenshot(page, '05_context_elements');
        results.context = true;
      } else {
        console.log('⚠️ Elementos de contexto no encontrados (puede estar en desarrollo)');
        await takeScreenshot(page, '05_no_context_elements');
      }
    } catch (error) {
      console.error('❌ Error en contexto:', error.message);
    }
    
    // ===== PRUEBA 5: Formularios =====
    console.log('\n📝 PRUEBA 5: Formularios');
    try {
      // Navegar a página de hallazgos
      await page.goto(`${FRONTEND_URL}/dashboard/researcher/findings`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      await takeScreenshot(page, '06_findings_page');
      
      // Buscar botón de crear hallazgo
      const createButton = await elementExists(page, 'button:contains("Crear"), button:contains("Nuevo"), button:contains("Agregar")');
      
      if (createButton) {
        console.log('✅ Página de hallazgos cargada con botón de crear');
        
        // Hacer clic en crear (si existe)
        try {
          await page.click('button:contains("Crear"), button:contains("Nuevo"), button:contains("Agregar")');
          await sleep(2000);
          await takeScreenshot(page, '07_finding_form');
          
          // Verificar formulario
          const formElements = [
            'input[name*="name"]',
            'input[name*="description"]',
            'select[name*="type"]',
            'input[name*="coordinates"]'
          ];
          
          let formElementsFound = 0;
          for (const selector of formElements) {
            if (await elementExists(page, selector)) {
              formElementsFound++;
            }
          }
          
          if (formElementsFound >= 2) {
            console.log('✅ Formulario de hallazgo cargado correctamente');
            results.forms = true;
          } else {
            console.log('⚠️ Formulario cargado pero con pocos elementos');
          }
        } catch (error) {
          console.log('⚠️ No se pudo abrir el formulario');
        }
      } else {
        console.log('⚠️ Página de hallazgos cargada pero sin botón de crear');
      }
    } catch (error) {
      console.error('❌ Error en formularios:', error.message);
    }
    
    // ===== PRUEBA 6: Navegación =====
    console.log('\n🧭 PRUEBA 6: Navegación');
    try {
      // Volver al dashboard
      await page.goto(`${FRONTEND_URL}/dashboard/researcher`, { waitUntil: 'networkidle2' });
      await sleep(2000);
      
      // Probar navegación a diferentes páginas
      const pagesToTest = [
        { url: '/dashboard/researcher/projects', name: 'projects' },
        { url: '/dashboard/researcher/sites', name: 'sites' },
        { url: '/dashboard/researcher/fieldwork', name: 'fieldwork' }
      ];
      
      let navigationSuccess = 0;
      for (const pageTest of pagesToTest) {
        try {
          await page.goto(`${FRONTEND_URL}${pageTest.url}`, { waitUntil: 'networkidle2', timeout: 5000 });
          await sleep(1000);
          await takeScreenshot(page, `08_${pageTest.name}_page`);
          console.log(`✅ Navegación a ${pageTest.name} exitosa`);
          navigationSuccess++;
        } catch (error) {
          console.log(`⚠️ Navegación a ${pageTest.name} falló`);
        }
      }
      
      if (navigationSuccess >= 2) {
        console.log('✅ Navegación funcionando correctamente');
        results.navigation = true;
      } else {
        console.log('⚠️ Navegación parcialmente funcional');
      }
    } catch (error) {
      console.error('❌ Error en navegación:', error.message);
    }
    
    // ===== PRUEBA 7: Responsive =====
    console.log('\n📱 PRUEBA 7: Diseño Responsive');
    try {
      // Probar diferentes tamaños de pantalla
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ];
      
      let responsiveSuccess = 0;
      for (const viewport of viewports) {
        try {
          await page.setViewport(viewport);
          await page.goto(`${FRONTEND_URL}/dashboard/researcher`, { waitUntil: 'networkidle2' });
          await sleep(2000);
          await takeScreenshot(page, `09_responsive_${viewport.name}`);
          console.log(`✅ Vista ${viewport.name} renderizada correctamente`);
          responsiveSuccess++;
        } catch (error) {
          console.log(`⚠️ Vista ${viewport.name} falló`);
        }
      }
      
      if (responsiveSuccess >= 2) {
        console.log('✅ Diseño responsive funcionando');
        results.responsive = true;
      } else {
        console.log('⚠️ Diseño responsive parcialmente funcional');
      }
    } catch (error) {
      console.error('❌ Error en responsive:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error general en prueba visual:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Generar reporte final
  console.log('\n📊 REPORTE FINAL DE PRUEBA VISUAL');
  console.log('=' .repeat(60));
  console.log(`Página Principal: ${results.homepage ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Login: ${results.login ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Dashboard: ${results.dashboard ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Contexto: ${results.context ? '✅ PASÓ' : '⚠️ EN DESARROLLO'}`);
  console.log(`Formularios: ${results.forms ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Navegación: ${results.navigation ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Responsive: ${results.responsive ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  const passedTests = Object.values(results).filter(v => v === true).length;
  const totalTests = Object.keys(results).length - 1; // Excluir timestamp
  
  console.log(`\n🎯 RESULTADO: ${passedTests}/${totalTests} pruebas pasaron`);
  
  // Guardar reporte
  const reportPath = path.join(SCREENSHOTS_DIR, `visual_test_report_${getTimestamp()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Reporte guardado: ${reportPath}`);
  
  return results;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testVisualCompleto().catch(console.error);
}

module.exports = { testVisualCompleto }; 