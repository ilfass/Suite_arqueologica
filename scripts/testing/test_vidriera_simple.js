const puppeteer = require('puppeteer');

async function testVidrieraSimple() {
  console.log('🧪 Probando vidriera pública...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Ir directamente a la vidriera pública
    console.log('📄 Navegando a la vidriera pública...');
    await page.goto('http://localhost:3000/public/investigator/test-user-id');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que la página carga correctamente
    const pageTitle = await page.title();
    console.log('📋 Título de la página:', pageTitle);
    
    // Verificar que no hay errores de React
    const pageContent = await page.content();
    if (pageContent.includes('Error: The default export is not a React Component')) {
      console.log('❌ Error de React detectado');
    } else {
      console.log('✅ No se detectaron errores de React');
    }
    
    // Verificar que se muestra el contenido del investigador
    const investigatorName = await page.evaluate(() => {
      const nameElement = document.querySelector('h1');
      return nameElement ? nameElement.textContent : null;
    });
    
    if (investigatorName) {
      console.log('✅ Nombre del investigador encontrado:', investigatorName);
    } else {
      console.log('❌ No se encontró el nombre del investigador');
    }
    
    // Verificar las pestañas
    const tabs = await page.evaluate(() => {
      const tabElements = document.querySelectorAll('button');
      return Array.from(tabElements).map(btn => btn.textContent);
    });
    
    console.log('📋 Pestañas encontradas:', tabs);
    
    console.log('✅ Prueba de vidriera completada');
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Mantener abierto
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testVidrieraSimple(); 