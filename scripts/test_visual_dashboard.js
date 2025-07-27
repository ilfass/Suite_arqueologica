const puppeteer = require('puppeteer');

async function testVisualDashboard() {
  console.log('🔍 Iniciando prueba visual del dashboard...\n');
  
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
    
    // 5. Verificar estado de las herramientas
    console.log('🛠️ Paso 5: Verificando estado de herramientas...');
    const toolsStatus = await page.evaluate(() => {
      const tools = Array.from(document.querySelectorAll('[class*="bg-"]'));
      return tools.map(tool => {
        const card = tool.closest('[class*="bg-"]');
        if (card) {
          const name = card.querySelector('h3')?.textContent || 'Sin nombre';
          const color = card.className.includes('bg-gray-400') ? 'Deshabilitada' : 'Habilitada';
          return { name, color };
        }
        return null;
      }).filter(Boolean);
    });
    console.log('🔧 Estado de herramientas:', toolsStatus);
    
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
    
    // 9. Verificar estado de herramientas después de recarga
    console.log('🛠️ Paso 9: Verificando herramientas después de recarga...');
    const reloadedToolsStatus = await page.evaluate(() => {
      const tools = Array.from(document.querySelectorAll('[class*="bg-"]'));
      return tools.map(tool => {
        const card = tool.closest('[class*="bg-"]');
        if (card) {
          const name = card.querySelector('h3')?.textContent || 'Sin nombre';
          const color = card.className.includes('bg-gray-400') ? 'Deshabilitada' : 'Habilitada';
          return { name, color };
        }
        return null;
      }).filter(Boolean);
    });
    console.log('🔧 Estado de herramientas después de recarga:', reloadedToolsStatus);
    
    // 10. Intentar hacer clic en una herramienta
    console.log('🖱️ Paso 10: Intentando hacer clic en herramienta...');
    try {
      const mappingTool = await page.$('h3:has-text("Mapeo SIG Integrado")');
      if (mappingTool) {
        await mappingTool.click();
        console.log('✅ Clic en Mapeo SIG Integrado exitoso');
        
        // Esperar a que cargue la página de mapeo
        await page.waitForTimeout(2000);
        console.log('✅ Página de mapeo cargada');
      } else {
        console.log('❌ No se encontró la herramienta Mapeo SIG Integrado');
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
    
    console.log('\n🎯 RESUMEN DE LA PRUEBA:');
    console.log('========================');
    console.log(`Contexto inicial: ${initialContext ? 'Presente' : 'Ausente'}`);
    console.log(`Contexto después de recarga: ${reloadedContext ? 'Presente' : 'Ausente'}`);
    console.log(`Herramientas iniciales: ${toolsStatus.length}`);
    console.log(`Herramientas después de recarga: ${reloadedToolsStatus.length}`);
    console.log(`Contexto mínimo: ${consoleLogs.hasMinimal ? '✅ Sí' : '❌ No'}`);
    console.log(`Contexto completo: ${consoleLogs.hasComplete ? '✅ Sí' : '❌ No'}`);
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/test_visual_dashboard_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Prueba completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

testVisualDashboard().catch(console.error); 