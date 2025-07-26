const puppeteer = require('puppeteer');
const path = require('path');

async function testContextAutomated() {
  console.log('🧪 Iniciando prueba automatizada de contexto...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Navegar a la página de prueba visual
    console.log('📱 Navegando a la página de prueba...');
    await page.goto('http://localhost:3001/test-context-visual', { waitUntil: 'networkidle0' });
    
    // Esperar a que la página cargue
    await page.waitForTimeout(2000);
    
    // Verificar estado inicial
    console.log('🔍 Verificando estado inicial...');
    const initialContext = await page.evaluate(() => {
      const contextElement = document.querySelector('[data-testid="context-status"]');
      return contextElement ? contextElement.textContent : 'No encontrado';
    });
    console.log('📊 Estado inicial:', initialContext);
    
    // Establecer contexto de prueba
    console.log('🔧 Estableciendo contexto de prueba...');
    await page.click('button:contains("🧪 Contexto Completo")');
    await page.waitForTimeout(1000);
    
    // Verificar que el contexto se estableció
    console.log('✅ Verificando contexto establecido...');
    const testContext = await page.evaluate(() => {
      return localStorage.getItem('investigator-context');
    });
    console.log('📦 Contexto en localStorage:', testContext);
    
    // Navegar a la página de hallazgos
    console.log('🔍 Navegando a hallazgos...');
    await page.click('a:contains("🔍 Ir a Hallazgos")');
    await page.waitForTimeout(2000);
    
    // Verificar que el contexto aparece en hallazgos
    console.log('✅ Verificando contexto en hallazgos...');
    const findingsContext = await page.evaluate(() => {
      const debugPanel = document.querySelector('.bg-yellow-50');
      return debugPanel ? debugPanel.textContent : 'Panel de debug no encontrado';
    });
    console.log('📊 Contexto en hallazgos:', findingsContext);
    
    // Probar modal de nuevo hallazgo
    console.log('🔧 Probando modal de nuevo hallazgo...');
    await page.click('button:contains("➕ Nuevo Hallazgo")');
    await page.waitForTimeout(1000);
    
    // Verificar que el modal se abrió con contexto
    console.log('✅ Verificando modal...');
    const modalContext = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal ? modal.textContent : 'Modal no encontrado';
    });
    console.log('📊 Modal:', modalContext);
    
    console.log('🎉 Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testContextAutomated().catch(console.error); 