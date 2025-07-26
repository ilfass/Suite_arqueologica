const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Crear directorio para screenshots si no existe
const screenshotsDir = path.join(__dirname, 'screenshots', 'test_context_cards');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Función helper para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testContextCards() {
  console.log('🎯 Iniciando prueba específica del sistema de contextos con cards...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // 1. Ir al dashboard del investigador
    console.log('📊 1. Navegando al dashboard del investigador...');
    await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
    await sleep(3000);
    await page.screenshot({ path: path.join(screenshotsDir, '01_dashboard.png'), fullPage: true });
    
    // 2. Verificar si hay selector de contexto unificado
    console.log('🔍 2. Verificando selector de contexto unificado...');
    const unifiedSelector = await page.$('[data-testid="unified-context-selector"]');
    if (unifiedSelector) {
      console.log('✅ Selector de contexto unificado encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, '02_unified_selector.png'), fullPage: true });
    } else {
      console.log('⚠️ Selector de contexto unificado no encontrado');
    }
    
    // 3. Buscar el navegador de contexto
    console.log('🧭 3. Buscando navegador de contexto...');
    const contextNavigator = await page.$('[data-testid="context-navigator"]');
    if (contextNavigator) {
      console.log('✅ Navegador de contexto encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, '03_context_navigator.png'), fullPage: true });
    } else {
      console.log('⚠️ Navegador de contexto no encontrado');
    }
    
    // 4. Buscar cards de contexto usando diferentes selectores
    console.log('🃏 4. Buscando cards de contexto...');
    
    // Buscar cards usando diferentes selectores basados en la implementación
    const cardSelectors = [
      'div[class*="p-4 rounded-lg border-2"]',
      'div[class*="bg-white rounded-lg shadow-md"]',
      'div[class*="cursor-pointer"]',
      '.card',
      '[data-testid*="context"]'
    ];
    
    let contextCards = [];
    for (const selector of cardSelectors) {
      const cards = await page.$$(selector);
      if (cards.length > 0) {
        console.log(`📋 Encontradas ${cards.length} cards con selector: ${selector}`);
        contextCards = cards;
        break;
      }
    }
    
    if (contextCards.length === 0) {
      console.log('❌ No se encontraron cards de contexto');
      await page.screenshot({ path: path.join(screenshotsDir, '04_no_cards.png'), fullPage: true });
      
      // Buscar cualquier elemento que pueda ser una card
      const allDivs = await page.$$('div');
      console.log(`🔍 Total de divs en la página: ${allDivs.length}`);
      
      // Buscar divs con clases que contengan "card", "border", "rounded"
      for (let i = 0; i < Math.min(allDivs.length, 20); i++) {
        const className = await page.evaluate(el => el.className, allDivs[i]);
        const text = await page.evaluate(el => el.textContent, allDivs[i]);
        if (className && (className.includes('card') || className.includes('border') || className.includes('rounded'))) {
          console.log(`🔍 Div ${i}: className="${className}", text="${text?.substring(0, 50)}..."`);
        }
      }
    } else {
      console.log(`✅ Encontradas ${contextCards.length} cards de contexto`);
      await page.screenshot({ path: path.join(screenshotsDir, '04_context_cards.png'), fullPage: true });
      
      // 5. Probar selección de contexto
      console.log('🖱️ 5. Probando selección de contexto...');
      
      // Hacer clic en la primera card
      await contextCards[0].click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '05_first_card_clicked.png'), fullPage: true });
      
      // Verificar si aparecieron nuevas cards (para área)
      const newCards = await page.$$('div[class*="p-4 rounded-lg border-2"]');
      if (newCards.length > 0) {
        console.log(`✅ Aparecieron ${newCards.length} nuevas cards después de seleccionar proyecto`);
        
        // Hacer clic en la primera nueva card (área)
        await newCards[0].click();
        await sleep(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '06_area_selected.png'), fullPage: true });
        
        // Verificar si aparecieron cards de sitios
        const siteCards = await page.$$('div[class*="p-4 rounded-lg border-2"]');
        if (siteCards.length > 0) {
          console.log(`✅ Aparecieron ${siteCards.length} cards de sitios`);
          
          // Hacer clic en la primera card de sitio
          await siteCards[0].click();
          await sleep(2000);
          await page.screenshot({ path: path.join(screenshotsDir, '07_site_selected.png'), fullPage: true });
          
          // Verificar contexto completo
          const contextComplete = await page.$('div:has-text("Contexto Completo")');
          if (contextComplete) {
            console.log('✅ Contexto completo configurado correctamente');
          } else {
            console.log('⚠️ No se detectó contexto completo');
          }
        }
      }
    }
    
    // 6. Verificar selector de contexto alternativo
    console.log('📍 6. Verificando selector de contexto alternativo...');
    const contextButton = await page.$('button:has-text("Seleccionar Contexto"), button:has-text("Contexto Activo")');
    if (contextButton) {
      console.log('✅ Botón de selector de contexto encontrado');
      await contextButton.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '08_context_selector_modal.png'), fullPage: true });
      
      // Verificar si hay selects en el modal
      const selects = await page.$$('select');
      if (selects.length > 0) {
        console.log(`✅ Encontrados ${selects.length} selects en el modal de contexto`);
        
        // Probar selección con selects
        if (selects.length >= 1) {
          // Seleccionar primer proyecto
          await page.select('select', '1');
          await sleep(1000);
          
          if (selects.length >= 2) {
            // Seleccionar primera área
            await page.select('select:nth-child(2)', '1');
            await sleep(1000);
            
            if (selects.length >= 3) {
              // Seleccionar primer sitio
              await page.select('select:nth-child(3)', '1');
              await sleep(1000);
            }
          }
          
          await page.screenshot({ path: path.join(screenshotsDir, '09_context_selected_via_selects.png'), fullPage: true });
        }
      }
    }
    
    // 7. Verificar breadcrumb de contexto
    console.log('🍞 7. Verificando breadcrumb de contexto...');
    const breadcrumb = await page.$('div:has-text("Contexto:"), div:has-text("→")');
    if (breadcrumb) {
      console.log('✅ Breadcrumb de contexto encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, '10_context_breadcrumb.png'), fullPage: true });
    } else {
      console.log('⚠️ Breadcrumb de contexto no encontrado');
    }
    
    console.log('✅ Prueba de contextos con cards finalizada exitosamente!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Error durante la prueba de contextos:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error_screenshot.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testContextCards().catch(console.error); 