const puppeteer = require('puppeteer');

async function testFinalContext() {
  console.log('🎯 Prueba final del contexto completo...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Ir al login
    console.log('📝 Paso 1: Ir al login...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    console.log('✅ Página de login cargada');
    
    // 2. Login como investigador
    console.log('🔐 Paso 2: Hacer login...');
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'investigador123');
    await page.click('button[type="submit"]');
    
    // 3. Esperar a que cargue el dashboard
    console.log('⏳ Paso 3: Esperando dashboard...');
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 15000 });
    console.log('✅ Dashboard cargado');
    
    // 4. Esperar a que termine de cargar
    console.log('⏳ Paso 4: Esperando a que termine de cargar...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 5. Verificar contexto inicial
    console.log('🔍 Paso 5: Verificando contexto inicial...');
    const initialContext = await page.evaluate(() => {
      const saved = localStorage.getItem('investigator-context');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📦 Contexto inicial:', initialContext);
    
    // 6. Verificar herramientas iniciales
    console.log('🛠️ Paso 6: Verificando herramientas iniciales...');
    const initialTools = await page.evaluate(() => {
      const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      return toolCards.map(card => {
        const title = card.querySelector('h4');
        const name = title ? title.textContent.trim() : 'Sin nombre';
        const isDisabled = card.className.includes('opacity-50') || card.className.includes('cursor-not-allowed');
        const isEnabled = !isDisabled;
        
        return {
          name: name,
          isEnabled: isEnabled
        };
      });
    });
    console.log('🔧 Herramientas iniciales:', initialTools);
    
    // 7. Establecer contexto completo
    console.log('🧪 Paso 7: Estableciendo contexto completo...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: 'Proyecto Cazadores Recolectores - La Laguna',
        area: 'Laguna La Brava',
        site: 'Sitio Pampeano La Laguna'
      }));
    });
    console.log('✅ Contexto completo establecido');
    
    // 8. Recargar página
    console.log('🔄 Paso 8: Recargando página...');
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 10000 });
    console.log('✅ Página recargada');
    
    // 9. Esperar a que termine de cargar
    console.log('⏳ Paso 9: Esperando a que termine de cargar...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 10. Verificar contexto después de recarga
    console.log('🔍 Paso 10: Verificando contexto después de recarga...');
    const finalContext = await page.evaluate(() => {
      const saved = localStorage.getItem('investigator-context');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📦 Contexto final:', finalContext);
    
    // 11. Verificar herramientas finales
    console.log('🛠️ Paso 11: Verificando herramientas finales...');
    const finalTools = await page.evaluate(() => {
      const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      return toolCards.map(card => {
        const title = card.querySelector('h4');
        const name = title ? title.textContent.trim() : 'Sin nombre';
        const isDisabled = card.className.includes('opacity-50') || card.className.includes('cursor-not-allowed');
        const isEnabled = !isDisabled;
        
        return {
          name: name,
          isEnabled: isEnabled
        };
      });
    });
    console.log('🔧 Herramientas finales:', finalTools);
    
    // 12. Intentar hacer clic en una herramienta
    console.log('🖱️ Paso 12: Intentando hacer clic en herramienta...');
    const mappingTool = await page.evaluateHandle(() => {
      const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      return toolCards.find(card => {
        const title = card.querySelector('h4');
        return title && title.textContent.includes('Mapeo SIG Integrado');
      });
    });
    
    if (mappingTool) {
      await mappingTool.click();
      console.log('✅ Clic en Mapeo SIG Integrado exitoso');
      
      // Esperar a que cargue la página
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const currentUrl = page.url();
      console.log('🌐 URL actual:', currentUrl);
    }
    
    console.log('\n🎯 RESUMEN FINAL:');
    console.log('==================');
    console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
    console.log(`Contexto final: ${finalContext ? 'Presente' : 'Ausente'}`);
    
    if (finalContext) {
      console.log(`Proyecto: ${finalContext.project || 'No establecido'}`);
      console.log(`Área: ${finalContext.area || 'No establecida'}`);
      console.log(`Sitio: ${finalContext.site || 'No establecido'}`);
    }
    
    const initialEnabled = initialTools.filter(tool => tool.isEnabled).length;
    const finalEnabled = finalTools.filter(tool => tool.isEnabled).length;
    
    console.log(`Herramientas habilitadas inicialmente: ${initialEnabled}`);
    console.log(`Herramientas habilitadas finalmente: ${finalEnabled}`);
    
    if (finalEnabled > initialEnabled) {
      console.log('✅ SOLUCIÓN: Las herramientas se habilitaron correctamente con el contexto');
    } else {
      console.log('❌ PROBLEMA: Las herramientas no se habilitaron');
    }
    
    // Verificar contexto mínimo y completo
    const hasMinimal = finalContext && finalContext.project && finalContext.area;
    const hasComplete = hasMinimal && finalContext.site;
    
    console.log(`Contexto mínimo (proyecto + área): ${hasMinimal ? '✅ Sí' : '❌ No'}`);
    console.log(`Contexto completo (proyecto + área + sitio): ${hasComplete ? '✅ Sí' : '❌ No'}`);
    
  } catch (error) {
    console.error('❌ Error durante la prueba final:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_final_context_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba final completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

testFinalContext().catch(console.error); 