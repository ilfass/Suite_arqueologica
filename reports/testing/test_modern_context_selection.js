const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Test de selección moderna de contexto...');
  
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
    
    // 2. Limpiar contexto previo
    console.log('🧹 Limpiando contexto previo...');
    await page.evaluate(() => localStorage.removeItem('investigator-context'));
    await new Promise(r => setTimeout(r, 1000));
    
    // 3. Verificar estado inicial
    const hasSelector = await page.evaluate(() => {
      const h2Elements = document.querySelectorAll('h2');
      return Array.from(h2Elements).some(el => el.textContent.includes('Contexto de Trabajo'));
    });
    const hasBanner = await page.$('.sticky.top-0');
    
    console.log('🔍 Estado inicial:');
    console.log('- Selector presente:', hasSelector);
    console.log('- Banner presente:', !!hasBanner);
    
    if (hasSelector) {
      console.log('✅ Selector encontrado, procediendo a seleccionar contexto...');
      
      // 4. Seleccionar proyecto (buscar card que contenga "Proyecto Cazadores Recolectores")
      const projectCards = await page.$$('div[class*="p-4 rounded-lg border-2"]');
      let projectSelected = false;
      
      for (const card of projectCards) {
        const text = await page.evaluate(el => el.textContent, card);
        if (text && text.includes('Proyecto Cazadores Recolectores')) {
          await card.click();
          projectSelected = true;
          console.log('✅ Proyecto seleccionado');
          break;
        }
      }
      
      if (!projectSelected) {
        console.log('❌ No se pudo seleccionar el proyecto');
        return;
      }
      
      await new Promise(r => setTimeout(r, 2000));
      
      // 5. Seleccionar área (buscar card que contenga "Laguna La Brava")
      const areaCards = await page.$$('div[class*="p-4 rounded-lg border-2"]');
      let areaSelected = false;
      
      for (const card of areaCards) {
        const text = await page.evaluate(el => el.textContent, card);
        if (text && text.includes('Laguna La Brava')) {
          await card.click();
          areaSelected = true;
          console.log('✅ Área seleccionada');
          break;
        }
      }
      
      if (!areaSelected) {
        console.log('❌ No se pudo seleccionar el área');
        return;
      }
      
      await new Promise(r => setTimeout(r, 2000));
      
      // 6. Seleccionar sitio (buscar card que contenga "Sitio Laguna La Brava Norte")
      const siteCards = await page.$$('div[class*="p-4 rounded-lg border-2"]');
      let siteSelected = false;
      
      for (const card of siteCards) {
        const text = await page.evaluate(el => el.textContent, card);
        if (text && text.includes('Sitio Laguna La Brava Norte')) {
          await card.click();
          siteSelected = true;
          console.log('✅ Sitio seleccionado');
          break;
        }
      }
      
      if (!siteSelected) {
        console.log('❌ No se pudo seleccionar el sitio');
        return;
      }
      
      await new Promise(r => setTimeout(r, 2000));
      
      // 7. Verificar que el banner apareció
      const bannerAfterSelection = await page.$('.sticky.top-0');
      console.log('🎯 Banner después de selección:', !!bannerAfterSelection);
      
      if (bannerAfterSelection) {
        const bannerText = await page.evaluate(el => el.textContent, bannerAfterSelection);
        console.log('📝 Texto del banner:', bannerText);
      }
      
      // 8. Ir a una herramienta
      console.log('🛠️ Navegando a Mapeo de Superficie...');
      await page.goto('http://localhost:3000/dashboard/researcher/surface-mapping');
      await new Promise(r => setTimeout(r, 3000));
      
      // 9. Verificar banner en la herramienta
      const toolBanner = await page.$('.sticky.top-0');
      console.log('🎯 Banner en herramienta:', !!toolBanner);
      
      if (toolBanner) {
        const toolBannerText = await page.evaluate(el => el.textContent, toolBanner);
        console.log('📝 Texto del banner en herramienta:', toolBannerText);
      }
      
      // 10. Volver al dashboard usando el botón
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
      
      // 11. Verificar estado final
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
      
    } else {
      console.log('❌ No se encontró el selector de contexto');
    }
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
  } finally {
    console.log('🏁 Finalizando test...');
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
  }
})(); 