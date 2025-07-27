const puppeteer = require('puppeteer');

async function checkBannerDuplication() {
  console.log('🔍 Verificando duplicación de banners...\n');
  
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
    
    // 5. Verificar banners iniciales
    console.log('🔍 Paso 5: Verificando banners iniciales...');
    const initialBanners = await page.evaluate(() => {
      const yellowBanners = Array.from(document.querySelectorAll('.bg-yellow-50'));
      const greenBanners = Array.from(document.querySelectorAll('.bg-green-50'));
      const blueBanners = Array.from(document.querySelectorAll('.bg-blue-50'));
      
      return {
        yellow: yellowBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        })),
        green: greenBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        })),
        blue: blueBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        }))
      };
    });
    console.log('📋 Banners iniciales:', initialBanners);
    
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
    
    // 9. Verificar banners después de establecer contexto
    console.log('🔍 Paso 9: Verificando banners después de establecer contexto...');
    const finalBanners = await page.evaluate(() => {
      const yellowBanners = Array.from(document.querySelectorAll('.bg-yellow-50'));
      const greenBanners = Array.from(document.querySelectorAll('.bg-green-50'));
      const blueBanners = Array.from(document.querySelectorAll('.bg-blue-50'));
      
      return {
        yellow: yellowBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        })),
        green: greenBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        })),
        blue: blueBanners.map(banner => ({
          text: banner.textContent.trim(),
          classes: banner.className
        }))
      };
    });
    console.log('📋 Banners finales:', finalBanners);
    
    // 10. Verificar todos los elementos con border-l-4
    console.log('🔍 Paso 10: Verificando todos los elementos con border-l-4...');
    const allBorderElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[class*="border-l-4"]'));
      return elements.map(el => ({
        text: el.textContent.trim().substring(0, 100) + '...',
        classes: el.className,
        tagName: el.tagName
      }));
    });
    console.log('📋 Elementos con border-l-4:', allBorderElements);
    
    console.log('\n🎯 RESUMEN DE LA VERIFICACIÓN DE DUPLICACIÓN:');
    console.log('===============================================');
    console.log(`Banners amarillos iniciales: ${initialBanners.yellow.length}`);
    console.log(`Banners verdes iniciales: ${initialBanners.green.length}`);
    console.log(`Banners azules iniciales: ${initialBanners.blue.length}`);
    console.log(`Banners amarillos finales: ${finalBanners.yellow.length}`);
    console.log(`Banners verdes finales: ${finalBanners.green.length}`);
    console.log(`Banners azules finales: ${finalBanners.blue.length}`);
    console.log(`Total elementos con border-l-4: ${allBorderElements.length}`);
    
    if (finalBanners.green.length > 1) {
      console.log('❌ PROBLEMA: Hay múltiples banners verdes');
    } else if (finalBanners.green.length === 1) {
      console.log('✅ SOLUCIÓN: Solo hay un banner verde (correcto)');
    } else {
      console.log('⚠️ ADVERTENCIA: No hay banners verdes');
    }
    
    if (allBorderElements.length > 2) {
      console.log('❌ PROBLEMA: Hay demasiados elementos con border-l-4');
    } else {
      console.log('✅ SOLUCIÓN: Número correcto de elementos con border-l-4');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    await page.screenshot({ 
      path: 'scripts/testing/screenshots/check_banner_duplication_error.png',
      fullPage: true 
    });
  } finally {
    console.log('\n🏁 Verificación completada. Cerrando navegador en 10 segundos...');
    setTimeout(async () => {
      await browser.close();
    }, 10000);
  }
}

checkBannerDuplication().catch(console.error); 