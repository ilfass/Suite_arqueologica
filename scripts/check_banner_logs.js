const puppeteer = require('puppeteer');

async function checkBannerLogs() {
  console.log('🔍 Verificando logs del ContextBanner...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capturar logs de consola
  const logs = [];
  page.on('console', msg => {
    if (msg.text().includes('ContextBanner renderizado')) {
      logs.push(msg.text());
    }
  });
  
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
    
    // 5. Verificar logs iniciales
    console.log('🔍 Paso 5: Verificando logs iniciales...');
    console.log('📋 Logs del ContextBanner:', logs);
    
    // 6. Establecer contexto de prueba
    console.log('🧪 Paso 6: Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: 'Proyecto de Prueba',
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
    
    // 8. Esperar a que termine de cargar después de recarga
    console.log('⏳ Paso 8: Esperando a que termine de cargar después de recarga...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 9. Verificar logs finales
    console.log('🔍 Paso 9: Verificando logs finales...');
    console.log('📋 Logs del ContextBanner después de recarga:', logs);
    
    // 10. Verificar banners
    console.log('🔍 Paso 10: Verificando banners...');
    const banners = await page.evaluate(() => {
      const greenBanners = Array.from(document.querySelectorAll('.bg-green-50.border-green-400'));
      return greenBanners.map(banner => ({
        text: banner.textContent.trim().substring(0, 50) + '...',
        classes: banner.className
      }));
    });
    console.log('📋 Banners verdes encontrados:', banners);
    
    console.log('\n🎯 RESUMEN DE LA VERIFICACIÓN DE LOGS:');
    console.log('=======================================');
    console.log(`Total logs del ContextBanner: ${logs.length}`);
    console.log(`Total banners verdes: ${banners.length}`);
    
    if (logs.length > 1) {
      console.log('❌ PROBLEMA: ContextBanner se está renderizando múltiples veces');
    } else {
      console.log('✅ SOLUCIÓN: ContextBanner se renderiza una sola vez');
    }
    
    if (banners.length > 1) {
      console.log('❌ PROBLEMA: Hay múltiples banners verdes');
    } else {
      console.log('✅ SOLUCIÓN: Solo hay un banner verde');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    console.log('\n🏁 Verificación completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

checkBannerLogs().catch(console.error); 