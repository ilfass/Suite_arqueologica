const puppeteer = require('puppeteer');
const path = require('path');

async function simpleFindingsTest() {
  console.log('🧪 Prueba simple de la página de hallazgos...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Navegar directamente a la página de hallazgos (asumiendo que ya estamos logueados)
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tomar screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/simple_test.png'),
      fullPage: true 
    });
    
    // Verificar todos los botones en la página
    console.log('🔍 Verificando todos los botones...');
    const allButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => ({
        text: btn.textContent.trim(),
        disabled: btn.disabled,
        className: btn.className
      }));
    });
    
    console.log('Botones encontrados:');
    allButtons.forEach((btn, index) => {
      console.log(`${index + 1}. "${btn.text}" - Disabled: ${btn.disabled} - Class: ${btn.className}`);
    });
    
    // Verificar todos los elementos con texto relacionado a hallazgos
    console.log('🔍 Verificando elementos de texto...');
    const textElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => el.textContent && (
          el.textContent.includes('hallazgo') || 
          el.textContent.includes('Hallazgo') ||
          el.textContent.includes('contexto') ||
          el.textContent.includes('Contexto')
        ))
        .map(el => ({
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 100),
          className: el.className
        }));
    });
    
    console.log('Elementos de texto encontrados:');
    textElements.forEach((el, index) => {
      console.log(`${index + 1}. <${el.tag}> "${el.text}" - Class: ${el.className}`);
    });
    
    // Verificar el estado del contexto
    console.log('🔍 Verificando estado del contexto...');
    const contextInfo = await page.evaluate(() => {
      // Buscar elementos que contengan información de contexto
      const contextElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && (
          el.textContent.includes('Proyecto:') ||
          el.textContent.includes('Área:') ||
          el.textContent.includes('Sitio:') ||
          el.textContent.includes('Contexto Arqueológico')
        )
      );
      
      return contextElements.map(el => ({
        text: el.textContent.trim(),
        className: el.className
      }));
    });
    
    console.log('Información de contexto encontrada:');
    contextInfo.forEach((info, index) => {
      console.log(`${index + 1}. "${info.text}" - Class: ${info.className}`);
    });
    
    console.log('✅ Prueba simple completada!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
simpleFindingsTest().catch(console.error); 