const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Test de navegación directa con contexto...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Ir al dashboard del investigador
    console.log('📱 Navegando al dashboard...');
    await page.goto('http://localhost:3000/dashboard/researcher');
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. Guardar contexto directamente en localStorage
    console.log('💾 Guardando contexto directamente...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: '1',
        area: '1', 
        site: '1'
      }));
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // 3. Recargar la página para que tome el contexto
    console.log('🔄 Recargando página...');
    await page.reload();
    await new Promise(r => setTimeout(r, 3000));
    
    // 4. Verificar si el banner aparece
    const banner = await page.$('.sticky.top-0');
    console.log('🎯 Banner presente después de recargar:', !!banner);
    
    if (banner) {
      const bannerText = await page.evaluate(el => el.textContent, banner);
      console.log('📝 Texto del banner:', bannerText);
    }
    
    // 5. Ir directamente a la herramienta
    console.log('🛠️ Navegando a Mapeo de Superficie...');
    await page.goto('http://localhost:3000/dashboard/researcher/surface-mapping');
    await new Promise(r => setTimeout(r, 3000));
    
    // 6. Verificar banner en la herramienta
    const toolBanner = await page.$('.sticky.top-0');
    console.log('🎯 Banner en herramienta:', !!toolBanner);
    
    if (toolBanner) {
      const toolBannerText = await page.evaluate(el => el.textContent, toolBanner);
      console.log('📝 Texto del banner en herramienta:', toolBannerText);
    }
    
    // 7. Volver al dashboard usando el botón
    console.log('🏠 Volviendo al dashboard...');
    const backButtons = await page.$$('button');
    let backClicked = false;
    
    for (const button of backButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && text.includes('Volver al Dashboard')) {
        await button.click();
        backClicked = true;
        console.log('✅ Botón volver clickeado');
        break;
      }
    }
    
    if (!backClicked) {
      console.log('❌ No se pudo volver al dashboard');
      return;
    }
    
    await new Promise(r => setTimeout(r, 3000));
    
    // 8. Verificar estado final
    const finalUrl = page.url();
    console.log('🔗 URL final:', finalUrl);
    
    const finalBanner = await page.$('.sticky.top-0');
    const finalSelector = await page.evaluate(() => {
      const h2Elements = document.querySelectorAll('h2');
      return Array.from(h2Elements).some(el => el.textContent.includes('Contexto de Trabajo'));
    });
    
    console.log('🎯 Estado final:');
    console.log('- Banner presente:', !!finalBanner);
    console.log('- Selector presente:', finalSelector);
    
    if (finalBanner) {
      const finalBannerText = await page.evaluate(el => el.textContent, finalBanner);
      console.log('📝 Texto del banner final:', finalBannerText);
      console.log('✅ SUCCESS: El contexto se mantuvo al volver al dashboard');
    } else if (finalSelector) {
      console.log('❌ FAIL: Se perdió el contexto, volvió al selector');
    } else {
      console.log('❓ UNKNOWN: Estado inesperado');
    }
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
  } finally {
    console.log('🏁 Finalizando test...');
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
  }
})(); 