const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Test de filtrado por contexto en herramientas...');
  
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
    
    if (!hasSelector) {
      console.log('❌ No se encontró el selector de contexto');
      return;
    }
    
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
    
    // 8. Ir a la herramienta de artifacts
    console.log('🛠️ Navegando a Gestión de Artefactos...');
    await page.goto('http://localhost:3000/dashboard/researcher/artifacts');
    await new Promise(r => setTimeout(r, 3000));
    
    // 9. Verificar banner en la herramienta
    const toolBanner = await page.$('.sticky.top-0');
    console.log('🎯 Banner en herramienta:', !!toolBanner);
    
    if (toolBanner) {
      const toolBannerText = await page.evaluate(el => el.textContent, toolBanner);
      console.log('📝 Texto del banner en herramienta:', toolBannerText);
    }
    
    // 10. Verificar que solo se muestran artifacts del contexto seleccionado
    const artifactElements = await page.$$('[class*="bg-white"]');
    console.log('🔍 Elementos de artifacts encontrados:', artifactElements.length);
    
    // Buscar elementos que contengan información de artifacts
    const artifactInfo = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="bg-white"]');
      const artifacts = [];
      
      elements.forEach(el => {
        const text = el.textContent;
        if (text && (text.includes('Punta de Proyectil') || text.includes('Raspador') || text.includes('Fragmento de Cerámica'))) {
          artifacts.push(text.substring(0, 100)); // Primeros 100 caracteres
        }
      });
      
      return artifacts;
    });
    
    console.log('📋 Artifacts encontrados:');
    artifactInfo.forEach((artifact, index) => {
      console.log(`  ${index + 1}. ${artifact}`);
    });
    
    // 11. Verificar que el título menciona el sitio correcto
    const titleElement = await page.$('h1');
    if (titleElement) {
      const titleText = await page.evaluate(el => el.textContent, titleElement);
      console.log('📝 Título de la página:', titleText);
    }
    
    const subtitleElement = await page.$('p');
    if (subtitleElement) {
      const subtitleText = await page.evaluate(el => el.textContent, subtitleElement);
      console.log('📝 Subtítulo de la página:', subtitleText);
      
      if (subtitleText && subtitleText.includes('Sitio Laguna La Brava Norte')) {
        console.log('✅ SUCCESS: El subtítulo menciona el sitio correcto');
      } else {
        console.log('❌ FAIL: El subtítulo no menciona el sitio correcto');
      }
    }
    
         // 12. Cambiar contexto y verificar que los datos cambian
     console.log('🔄 Cambiando contexto...');
     await page.goto('http://localhost:3000/dashboard/researcher');
     await new Promise(r => setTimeout(r, 2000));
     
     // Limpiar contexto
     await page.evaluate(() => localStorage.removeItem('investigator-context'));
     await new Promise(r => setTimeout(r, 1000));
     
     // Verificar que el selector apareció
     const hasSelector2 = await page.evaluate(() => {
       const h2Elements = document.querySelectorAll('h2');
       return Array.from(h2Elements).some(el => el.textContent.includes('Contexto de Trabajo'));
     });
     console.log('🔍 Selector presente después de limpiar:', hasSelector2);
     
     // Seleccionar otro proyecto
     const projectCards2 = await page.$$('div[class*="p-4 rounded-lg border-2"]');
     let projectSelected2 = false;
     
     for (const card of projectCards2) {
       const text = await page.evaluate(el => el.textContent, card);
       if (text && text.includes('Estudio de Poblamiento Pampeano')) {
         await card.click();
         projectSelected2 = true;
         console.log('✅ Segundo proyecto seleccionado');
         break;
       }
     }
     
     if (projectSelected2) {
       await new Promise(r => setTimeout(r, 2000));
       
       // Verificar que las áreas aparecieron
       const areaCards2 = await page.$$('div[class*="p-4 rounded-lg border-2"]');
       console.log('🔍 Áreas disponibles:', areaCards2.length);
       
       // Seleccionar área
       for (const card of areaCards2) {
         const text = await page.evaluate(el => el.textContent, card);
         if (text && text.includes('Monte Hermoso')) {
           await card.click();
           console.log('✅ Segunda área seleccionada');
           break;
         }
       }
       
       await new Promise(r => setTimeout(r, 2000));
       
       // Verificar que los sitios aparecieron
       const siteCards2 = await page.$$('div[class*="p-4 rounded-lg border-2"]');
       console.log('🔍 Sitios disponibles:', siteCards2.length);
       
       // Seleccionar sitio
       for (const card of siteCards2) {
         const text = await page.evaluate(el => el.textContent, card);
         if (text && text.includes('Sitio Monte Hermoso')) {
           await card.click();
           console.log('✅ Segundo sitio seleccionado');
           break;
         }
       }
       
       await new Promise(r => setTimeout(r, 2000));
       
       // Verificar que el banner apareció
       const bannerAfterSelection2 = await page.$('.sticky.top-0');
       console.log('🎯 Banner después de segunda selección:', !!bannerAfterSelection2);
       
       if (bannerAfterSelection2) {
         const bannerText2 = await page.evaluate(el => el.textContent, bannerAfterSelection2);
         console.log('📝 Texto del segundo banner:', bannerText2);
       }
       
       // Ir a artifacts nuevamente
       console.log('🛠️ Navegando a Gestión de Artefactos con nuevo contexto...');
       await page.goto('http://localhost:3000/dashboard/researcher/artifacts');
       await new Promise(r => setTimeout(r, 3000));
       
       // Verificar que el subtítulo cambió
       const newSubtitleElement = await page.$('p');
       if (newSubtitleElement) {
         const newSubtitleText = await page.evaluate(el => el.textContent, newSubtitleElement);
         console.log('📝 Nuevo subtítulo:', newSubtitleText);
         
         if (newSubtitleText && newSubtitleText.includes('Sitio Monte Hermoso')) {
           console.log('✅ SUCCESS: El subtítulo cambió al nuevo sitio');
         } else {
           console.log('❌ FAIL: El subtítulo no cambió al nuevo sitio');
         }
       }
     }
    
  } catch (error) {
    console.error('❌ Error durante el test:', error);
  } finally {
    console.log('🏁 Finalizando test...');
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
  }
})(); 