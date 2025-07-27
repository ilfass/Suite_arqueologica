const puppeteer = require('puppeteer');

async function testContextLoading() {
  console.log('🔍 Probando carga del contexto...\n');
  
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
    
    // 6. Verificar logs de consola
    console.log('📋 Paso 6: Verificando logs de consola...');
    const consoleLogs = await page.evaluate(() => {
      // Simular verificación de logs
      return {
        context: JSON.parse(localStorage.getItem('investigator-context') || '{}'),
        hasMinimal: Boolean(JSON.parse(localStorage.getItem('investigator-context') || '{}').project && 
                           JSON.parse(localStorage.getItem('investigator-context') || '{}').area),
        hasComplete: Boolean(JSON.parse(localStorage.getItem('investigator-context') || '{}').project && 
                            JSON.parse(localStorage.getItem('investigator-context') || '{}').area && 
                            JSON.parse(localStorage.getItem('investigator-context') || '{}').site)
      };
    });
    console.log('📊 Estado del contexto:', consoleLogs);
    
    // 7. Establecer contexto de prueba
    console.log('🧪 Paso 7: Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: 'Proyecto de Prueba',
        area: 'Área de Prueba',
        site: 'Sitio de Prueba'
      }));
      console.log('✅ Contexto de prueba establecido en localStorage');
    });
    console.log('✅ Contexto de prueba establecido');
    
    // 8. Recargar página
    console.log('🔄 Paso 8: Recargando página...');
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 10000 });
    console.log('✅ Página recargada');
    
    // 9. Esperar a que termine de cargar después de recarga
    console.log('⏳ Paso 9: Esperando a que termine de cargar después de recarga...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 10. Verificar contexto después de recarga
    console.log('🔍 Paso 10: Verificando contexto después de recarga...');
    const reloadedContext = await page.evaluate(() => {
      const saved = localStorage.getItem('investigator-context');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📦 Contexto después de recarga:', reloadedContext);
    
    // 11. Verificar estado final
    console.log('📋 Paso 11: Verificando estado final...');
    const finalState = await page.evaluate(() => {
      // Simular verificación de logs
      return {
        context: JSON.parse(localStorage.getItem('investigator-context') || '{}'),
        hasMinimal: Boolean(JSON.parse(localStorage.getItem('investigator-context') || '{}').project && 
                           JSON.parse(localStorage.getItem('investigator-context') || '{}').area),
        hasComplete: Boolean(JSON.parse(localStorage.getItem('investigator-context') || '{}').project && 
                            JSON.parse(localStorage.getItem('investigator-context') || '{}').area && 
                            JSON.parse(localStorage.getItem('investigator-context') || '{}').site)
      };
    });
    console.log('📊 Estado final del contexto:', finalState);
    
    // 12. Verificar herramientas
    console.log('🛠️ Paso 12: Verificando herramientas...');
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
    
    console.log('\n🎯 RESUMEN DE LA PRUEBA DE CARGA:');
    console.log('==================================');
    console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
    console.log(`Contexto después de recarga: ${reloadedContext ? 'Presente' : 'Ausente'}`);
    console.log(`Contexto mínimo: ${finalState.hasMinimal ? '✅ Sí' : '❌ No'}`);
    console.log(`Contexto completo: ${finalState.hasComplete ? '✅ Sí' : '❌ No'}`);
    console.log(`Herramientas encontradas: ${toolsStatus.length}`);
    
    const enabledTools = toolsStatus.filter(tool => tool.isEnabled);
    console.log(`Herramientas habilitadas: ${enabledTools.length}`);
    
    if (enabledTools.length === 0) {
      console.log('❌ PROBLEMA: Las herramientas no se habilitaron después de establecer el contexto');
    } else {
      console.log('✅ SOLUCIÓN: Las herramientas se habilitaron correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_context_loading_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba de carga completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

testContextLoading().catch(console.error); 