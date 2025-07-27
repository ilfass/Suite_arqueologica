const puppeteer = require('puppeteer');

async function testContextSelector() {
  console.log('🔍 Probando selector de contexto...\n');
  
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
    
    // 6. Buscar y hacer clic en el selector de contexto
    console.log('🖱️ Paso 6: Buscando selector de contexto...');
    const contextButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => 
        button.textContent && button.textContent.includes('Seleccionar Contexto')
      );
    });
    if (contextButton) {
      await contextButton.click();
      console.log('✅ Clic en selector de contexto exitoso');
      
      // 7. Esperar a que aparezca el modal
      console.log('⏳ Paso 7: Esperando modal de contexto...');
      await page.waitForSelector('select', { timeout: 5000 });
      console.log('✅ Modal de contexto apareció');
      
      // 8. Seleccionar un proyecto
      console.log('📋 Paso 8: Seleccionando proyecto...');
      await page.select('select', 'proj-001');
      console.log('✅ Proyecto seleccionado');
      
      // 9. Esperar a que aparezcan las áreas
      console.log('⏳ Paso 9: Esperando áreas...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 10. Seleccionar un área
      console.log('📋 Paso 10: Seleccionando área...');
      const areaSelect = await page.$('select:nth-of-type(2)');
      if (areaSelect) {
        await areaSelect.select('area-001');
        console.log('✅ Área seleccionada');
      }
      
      // 11. Esperar a que aparezcan los sitios
      console.log('⏳ Paso 11: Esperando sitios...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 12. Seleccionar un sitio
      console.log('📋 Paso 12: Seleccionando sitio...');
      const siteSelect = await page.$('select:nth-of-type(3)');
      if (siteSelect) {
        await siteSelect.select('site-001');
        console.log('✅ Sitio seleccionado');
      }
      
      // 13. Confirmar la selección
      console.log('✅ Paso 13: Confirmando selección...');
      const confirmButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(button => 
          button.textContent && button.textContent.includes('Confirmar')
        );
      });
      if (confirmButton) {
        await confirmButton.click();
        console.log('✅ Selección confirmada');
      }
      
      // 14. Esperar a que se cierre el modal
      console.log('⏳ Paso 14: Esperando a que se cierre el modal...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 15. Verificar contexto después de la selección
      console.log('🔍 Paso 15: Verificando contexto después de la selección...');
      const finalContext = await page.evaluate(() => {
        const saved = localStorage.getItem('investigator-context');
        return saved ? JSON.parse(saved) : null;
      });
      console.log('📦 Contexto final:', finalContext);
      
      // 16. Verificar herramientas
      console.log('🛠️ Paso 16: Verificando herramientas...');
      const toolsStatus = await page.evaluate(() => {
        const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
        return toolCards.map(card => {
          const title = card.querySelector('h4');
          const name = title ? title.textContent.trim() : 'Sin nombre';
          const isDisabled = card.className.includes('opacity-50') || card.className.includes('cursor-not-allowed');
          const isEnabled = !isDisabled;
          
          return {
            name: name,
            isEnabled: isEnabled,
            className: card.className
          };
        });
      });
      console.log('🔧 Estado de herramientas:', toolsStatus);
      
      console.log('\n🎯 RESUMEN DE LA PRUEBA DEL SELECTOR:');
      console.log('=====================================');
      console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
      console.log(`Contexto final: ${finalContext ? 'Presente' : 'Ausente'}`);
      
      if (finalContext) {
        console.log(`Proyecto: ${finalContext.project || 'No establecido'}`);
        console.log(`Área: ${finalContext.area || 'No establecida'}`);
        console.log(`Sitio: ${finalContext.site || 'No establecido'}`);
      }
      
      const enabledTools = toolsStatus.filter(tool => tool.isEnabled);
      console.log(`Herramientas habilitadas: ${enabledTools.length}`);
      
      if (enabledTools.length === 0) {
        console.log('❌ PROBLEMA: Las herramientas no se habilitaron después de seleccionar el contexto');
      } else {
        console.log('✅ SOLUCIÓN: Las herramientas se habilitaron correctamente');
      }
      
    } else {
      console.log('❌ No se encontró el botón de selector de contexto');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_context_selector_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba del selector completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

testContextSelector().catch(console.error); 