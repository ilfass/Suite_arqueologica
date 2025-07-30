const puppeteer = require('puppeteer');

async function testVidrieraDebug() {
  console.log('🔍 Debug de vidriera pública...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Capturar errores de consola
    page.on('console', msg => {
      console.log('📋 Console:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });
    
    // Ir a la vidriera pública
    console.log('📄 Navegando a la vidriera pública...');
    await page.goto('http://localhost:3000/public/investigator/test-user-id');
    
    // Esperar un poco
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar el contenido de la página
    const pageContent = await page.content();
    console.log('📋 Tamaño del contenido:', pageContent.length);
    
    // Verificar si hay elementos de carga
    const loadingElements = await page.evaluate(() => {
      const loading = document.querySelector('.animate-spin');
      const loadingText = document.querySelector('p:has-text("Cargando")');
      return {
        loading: !!loading,
        loadingText: loadingText ? loadingText.textContent : null
      };
    });
    
    console.log('⏳ Elementos de carga:', loadingElements);
    
    // Verificar si hay errores de React
    if (pageContent.includes('Error: The default export is not a React Component')) {
      console.log('❌ Error de React detectado');
    } else {
      console.log('✅ No se detectaron errores de React');
    }
    
    // Verificar si hay elementos h1
    const h1Elements = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1');
      return Array.from(h1s).map(h1 => h1.textContent);
    });
    
    console.log('📋 Elementos h1 encontrados:', h1Elements);
    
    // Verificar si hay botones
    const buttons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      return Array.from(btns).map(btn => btn.textContent);
    });
    
    console.log('📋 Botones encontrados:', buttons);
    
    // Verificar el estado de la página
    const pageState = await page.evaluate(() => {
      return {
        readyState: document.readyState,
        title: document.title,
        url: window.location.href
      };
    });
    
    console.log('📋 Estado de la página:', pageState);
    
    console.log('✅ Debug completado');
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Mantener abierto
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  }
}

testVidrieraDebug(); 