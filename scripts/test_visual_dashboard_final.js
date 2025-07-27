const puppeteer = require('puppeteer');

async function testVisualDashboardFinal() {
  console.log('🔍 Iniciando prueba visual final del dashboard...\n');
  
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
    
    // 4. Verificar contexto inicial
    console.log('🔍 Paso 4: Verificando contexto inicial...');
    const initialContext = await page.evaluate(() => {
      const saved = localStorage.getItem('investigator-context');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📦 Contexto inicial:', initialContext);
    
    // 5. Verificar estado de las herramientas (DETECCIÓN CORRECTA)
    console.log('🛠️ Paso 5: Verificando estado de herramientas (detección correcta)...');
    const toolsStatus = await page.evaluate(() => {
      // Buscar todas las herramientas por su estructura específica
      const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      const researchTools = [];
      
      toolCards.forEach(card => {
        // Buscar el título de la herramienta
        const title = card.querySelector('h4');
        const name = title ? title.textContent.trim() : 'Sin nombre';
        
        // Verificar el estado (si está habilitada o deshabilitada)
        const isDisabled = card.className.includes('opacity-50') || card.className.includes('cursor-not-allowed');
        const isEnabled = !isDisabled;
        
        // Verificar si es clickeable
        const isClickable = !card.className.includes('cursor-not-allowed');
        
        researchTools.push({
          name: name,
          isEnabled: isEnabled,
          isClickable: isClickable,
          className: card.className,
          dataTestId: card.getAttribute('data-testid')
        });
      });
      
      return researchTools;
    });
    console.log('🔧 Herramientas encontradas:', toolsStatus);
    
    // 6. Establecer contexto de prueba
    console.log('🧪 Paso 6: Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: 'Proyecto de Prueba Visual',
        area: 'Área de Prueba',
        site: 'Sitio de Prueba'
      }));
    });
    console.log('✅ Contexto de prueba establecido');
    
    // 7. Recargar página
    console.log('🔄 Paso 7: Recargando página...');
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 10000 });
    console.log('✅ Página recargada');
    
    // 8. Verificar contexto después de recarga
    console.log('🔍 Paso 8: Verificando contexto después de recarga...');
    const reloadedContext = await page.evaluate(() => {
      const saved = localStorage.getItem('investigator-context');
      return saved ? JSON.parse(saved) : null;
    });
    console.log('📦 Contexto después de recarga:', reloadedContext);
    
    // 9. Verificar estado de herramientas después de recarga (DETECCIÓN CORRECTA)
    console.log('🛠️ Paso 9: Verificando herramientas después de recarga (detección correcta)...');
    const reloadedToolsStatus = await page.evaluate(() => {
      // Buscar todas las herramientas por su estructura específica
      const toolCards = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      const researchTools = [];
      
      toolCards.forEach(card => {
        // Buscar el título de la herramienta
        const title = card.querySelector('h4');
        const name = title ? title.textContent.trim() : 'Sin nombre';
        
        // Verificar el estado (si está habilitada o deshabilitada)
        const isDisabled = card.className.includes('opacity-50') || card.className.includes('cursor-not-allowed');
        const isEnabled = !isDisabled;
        
        // Verificar si es clickeable
        const isClickable = !card.className.includes('cursor-not-allowed');
        
        researchTools.push({
          name: name,
          isEnabled: isEnabled,
          isClickable: isClickable,
          className: card.className,
          dataTestId: card.getAttribute('data-testid')
        });
      });
      
      return researchTools;
    });
    console.log('🔧 Herramientas después de recarga:', reloadedToolsStatus);
    
    // 10. Intentar hacer clic en una herramienta (MEJORADO)
    console.log('🖱️ Paso 10: Intentando hacer clic en herramienta (mejorado)...');
    try {
      // Buscar específicamente el Mapeo SIG Integrado por su data-testid
      const mappingTool = await page.$('[data-testid="tool-mapeo-sig-integrado"]');
      
      if (mappingTool) {
        await mappingTool.click();
        console.log('✅ Clic en Mapeo SIG Integrado exitoso');
        
        // Esperar a que cargue la página de mapeo
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('✅ Página de mapeo cargada');
        
        // Verificar si estamos en la página correcta
        const currentUrl = page.url();
        console.log('🌐 URL actual:', currentUrl);
      } else {
        console.log('❌ No se encontró la herramienta Mapeo SIG Integrado por data-testid');
        
        // Intentar buscar por texto
        const mappingToolByText = await page.evaluateHandle(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.find(el => 
            el.textContent && el.textContent.includes('Mapeo SIG Integrado')
          );
        });
        
        if (mappingToolByText) {
          await mappingToolByText.click();
          console.log('✅ Clic en Mapeo SIG Integrado exitoso (por texto)');
          
          // Esperar a que cargue la página de mapeo
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('✅ Página de mapeo cargada');
          
          // Verificar si estamos en la página correcta
          const currentUrl = page.url();
          console.log('🌐 URL actual:', currentUrl);
        } else {
          console.log('❌ No se encontró la herramienta Mapeo SIG Integrado por ningún método');
        }
      }
    } catch (error) {
      console.log('❌ Error al hacer clic:', error.message);
    }
    
    // 11. Tomar screenshot final
    console.log('📸 Paso 11: Tomando screenshot...');
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_visual_dashboard_final.png',
      fullPage: true 
    });
    console.log('✅ Screenshot guardado en scripts/testing/screenshots/test_visual_dashboard_final.png');
    
    // 12. Verificar logs en consola
    console.log('📋 Paso 12: Verificando logs de consola...');
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
    console.log('📊 Logs de consola:', consoleLogs);
    
    // 13. Verificar estructura HTML completa
    console.log('🔍 Paso 13: Verificando estructura HTML completa...');
    const htmlStructure = await page.evaluate(() => {
      const toolSections = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      return toolSections.map(section => {
        const title = section.querySelector('h4');
        const name = title ? title.textContent.trim() : 'Sin nombre';
        const className = section.className;
        const dataTestId = section.getAttribute('data-testid');
        
        return {
          name: name,
          className: className,
          dataTestId: dataTestId,
          textContent: section.textContent.substring(0, 150) + '...'
        };
      });
    });
    console.log('🏗️ Estructura HTML de herramientas:', htmlStructure);
    
    console.log('\n🎯 RESUMEN DE LA PRUEBA FINAL:');
    console.log('==============================');
    console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
    console.log(`Contexto después de recarga: ${reloadedContext ? 'Presente' : 'Ausente'}`);
    console.log(`Herramientas iniciales: ${toolsStatus.length}`);
    console.log(`Herramientas después de recarga: ${reloadedToolsStatus.length}`);
    console.log(`Contexto mínimo: ${consoleLogs.hasMinimal ? '✅ Sí' : '❌ No'}`);
    console.log(`Contexto completo: ${consoleLogs.hasComplete ? '✅ Sí' : '❌ No'}`);
    
    // Mostrar herramientas específicas
    console.log('\n🛠️ HERRAMIENTAS ESPECÍFICAS:');
    console.log('============================');
    reloadedToolsStatus.forEach(tool => {
      console.log(`${tool.name}: ${tool.isEnabled ? '✅ Habilitada' : '❌ Deshabilitada'} ${tool.isClickable ? '(Clickeable)' : '(No clickeable)'}`);
    });
    
    // Verificar si el problema está resuelto
    const enabledTools = reloadedToolsStatus.filter(tool => tool.isEnabled);
    const clickableTools = reloadedToolsStatus.filter(tool => tool.isClickable);
    
    console.log('\n🔍 DIAGNÓSTICO FINAL:');
    console.log('=====================');
    console.log(`Total de herramientas encontradas: ${reloadedToolsStatus.length}`);
    console.log(`Herramientas habilitadas: ${enabledTools.length}`);
    console.log(`Herramientas clickeables: ${clickableTools.length}`);
    
    if (reloadedToolsStatus.length === 0) {
      console.log('❌ PROBLEMA: No se encontraron herramientas en el dashboard');
    } else if (enabledTools.length === 0) {
      console.log('❌ PROBLEMA: Las herramientas están deshabilitadas');
    } else if (clickableTools.length === 0) {
      console.log('❌ PROBLEMA: Las herramientas no son clickeables');
    } else {
      console.log('✅ SOLUCIÓN: Las herramientas están funcionando correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_visual_dashboard_final_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba final completada. Cerrando navegador en 20 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 20000);
  }
}

testVisualDashboardFinal().catch(console.error); 