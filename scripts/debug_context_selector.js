const puppeteer = require('puppeteer');

async function debugContextSelector() {
  console.log('🔍 Debuggeando selector de contexto...\n');
  
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
      
      // 8. Verificar elementos del modal
      console.log('🔍 Paso 8: Verificando elementos del modal...');
      const modalElements = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const buttons = Array.from(document.querySelectorAll('button'));
        
        return {
          selects: selects.map((select, index) => ({
            index,
            id: select.id,
            name: select.name,
            value: select.value,
            options: Array.from(select.options).map(opt => ({
              value: opt.value,
              text: opt.textContent
            }))
          })),
          buttons: buttons.map(button => button.textContent?.trim())
        };
      });
      console.log('📋 Elementos del modal:', modalElements);
      
      // 9. Seleccionar un proyecto
      console.log('📋 Paso 9: Seleccionando proyecto...');
      await page.select('select', 'proj-001');
      console.log('✅ Proyecto seleccionado');
      
      // 10. Esperar y verificar áreas
      console.log('⏳ Paso 10: Esperando áreas...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const areasAfterProject = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.map((select, index) => ({
          index,
          value: select.value,
          options: Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.textContent
          }))
        }));
      });
      console.log('📋 Selectores después de proyecto:', areasAfterProject);
      
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
      
      // 12. Esperar y verificar sitios
      console.log('⏳ Paso 12: Esperando sitios...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sitesAfterArea = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.map((select, index) => ({
          index,
          value: select.value,
          options: Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.textContent
          }))
        }));
      });
      console.log('📋 Selectores después de área:', sitesAfterArea);
      
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
      
      // 14. Verificar estado final antes de confirmar
      console.log('🔍 Paso 14: Verificando estado antes de confirmar...');
      const finalStateBeforeConfirm = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        return selects.map((select, index) => ({
          index,
          value: select.value,
          selectedOption: select.options[select.selectedIndex]?.textContent
        }));
      });
      console.log('📋 Estado final antes de confirmar:', finalStateBeforeConfirm);
      
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
      const finalContext = await page.evaluate(() => {
        const saved = localStorage.getItem('investigator-context');
        return saved ? JSON.parse(saved) : null;
      });
      console.log('📦 Contexto final:', finalContext);
      
      console.log('\n🎯 RESUMEN DEL DEBUG:');
      console.log('=====================');
      console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
      console.log(`Contexto final: ${finalContext ? 'Presente' : 'Ausente'}`);
      
      if (finalContext) {
        console.log(`Proyecto: ${finalContext.project || 'No establecido'}`);
        console.log(`Área: ${finalContext.area || 'No establecida'}`);
        console.log(`Sitio: ${finalContext.site || 'No establecido'}`);
      }
      
      if (!finalContext?.area) {
        console.log('❌ PROBLEMA: El área no se guardó correctamente');
      }
      if (!finalContext?.site) {
        console.log('❌ PROBLEMA: El sitio no se guardó correctamente');
      }
      
    } else {
      console.log('❌ No se encontró el botón de selector de contexto');
    }
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/debug_context_selector_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Debug del selector completado. Cerrando navegador en 15 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 15000);
  }
}

debugContextSelector().catch(console.error); 