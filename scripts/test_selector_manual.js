const puppeteer = require('puppeteer');

async function testSelectorManual() {
  console.log('🔍 Probando selector manual de contexto...\n');
  
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
    
    // 4. Esperar a que termine de cargar completamente
    console.log('⏳ Paso 4: Esperando a que termine de cargar completamente...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
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
    
    // 7. Buscar y hacer clic en el selector de contexto
    console.log('🖱️ Paso 7: Buscando selector de contexto...');
    const contextButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button => 
        button.textContent && button.textContent.includes('Seleccionar Contexto')
      );
    });
    
    if (contextButton) {
      await contextButton.click();
      console.log('✅ Clic en selector de contexto exitoso');
      
      // 8. Esperar a que aparezca el modal
      console.log('⏳ Paso 8: Esperando modal de contexto...');
      await page.waitForSelector('select', { timeout: 5000 });
      console.log('✅ Modal de contexto apareció');
      
      // 9. Seleccionar un proyecto
      console.log('📋 Paso 9: Seleccionando proyecto...');
      await page.select('select', 'proj-001');
      console.log('✅ Proyecto seleccionado');
      
      // 10. Esperar a que aparezcan las áreas
      console.log('⏳ Paso 10: Esperando áreas...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 11. Seleccionar un área
      console.log('📋 Paso 11: Seleccionando área...');
      const areaSelected = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        if (selects.length >= 2) {
          selects[1].value = 'area-001';
          selects[1].dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      });
      
      if (areaSelected) {
        console.log('✅ Área seleccionada');
      } else {
        console.log('❌ No se encontró el selector de área');
      }
      
      // 12. Esperar a que aparezcan los sitios
      console.log('⏳ Paso 12: Esperando sitios...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 13. Seleccionar un sitio
      console.log('📋 Paso 13: Seleccionando sitio...');
      const siteSelected = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        if (selects.length >= 3) {
          selects[2].value = 'site-001';
          selects[2].dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      });
      
      if (siteSelected) {
        console.log('✅ Sitio seleccionado');
      } else {
        console.log('❌ No se encontró el selector de sitio');
      }
      
      // 14. Verificar estado antes de confirmar
      console.log('🔍 Paso 14: Verificando estado antes de confirmar...');
      const stateBeforeConfirm = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.map((select, index) => ({
          index,
          value: select.value,
          selectedOption: select.options[select.selectedIndex]?.textContent
        }));
      });
      console.log('📋 Estado antes de confirmar:', stateBeforeConfirm);
      
      // 15. Confirmar la selección
      console.log('✅ Paso 15: Confirmando selección...');
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
      
      // 16. Esperar a que se cierre el modal
      console.log('⏳ Paso 16: Esperando a que se cierre el modal...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 17. Verificar contexto después de la selección
      console.log('🔍 Paso 17: Verificando contexto después de la selección...');
      const contextAfterSelection = await page.evaluate(() => {
        const saved = localStorage.getItem('investigator-context');
        return saved ? JSON.parse(saved) : null;
      });
      console.log('📦 Contexto después de selección:', contextAfterSelection);
      
      // 18. Verificar herramientas después de la selección
      console.log('🛠️ Paso 18: Verificando herramientas después de la selección...');
      const toolsAfterSelection = await page.evaluate(() => {
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
      console.log('🔧 Herramientas después de selección:', toolsAfterSelection);
      
      console.log('\n🎯 RESUMEN DE LA PRUEBA MANUAL:');
      console.log('===============================');
      console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
      console.log(`Contexto después de selección: ${contextAfterSelection ? 'Presente' : 'Ausente'}`);
      
      if (contextAfterSelection) {
        console.log(`Proyecto: ${contextAfterSelection.project || 'No establecido'}`);
        console.log(`Área: ${contextAfterSelection.area || 'No establecida'}`);
        console.log(`Sitio: ${contextAfterSelection.site || 'No establecido'}`);
      }
      
      const initialEnabled = initialTools.filter(tool => tool.isEnabled).length;
      const finalEnabled = toolsAfterSelection.filter(tool => tool.isEnabled).length;
      
      console.log(`Herramientas habilitadas inicialmente: ${initialEnabled}`);
      console.log(`Herramientas habilitadas después de selección: ${finalEnabled}`);
      
      if (finalEnabled > initialEnabled) {
        console.log('✅ SOLUCIÓN: Las herramientas se habilitaron correctamente con el selector');
      } else {
        console.log('❌ PROBLEMA: Las herramientas no se habilitaron con el selector');
      }
      
    } else {
      console.log('❌ No se encontró el botón de selector de contexto');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba manual:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_selector_manual_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba manual completada. Cerrando navegador en 15 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 15000);
  }
}

testSelectorManual().catch(console.error); 