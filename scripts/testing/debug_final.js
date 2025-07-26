const puppeteer = require('puppeteer');

async function debugFinal() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();
  
  try {
    console.log('🚀 Iniciando debug final...');
    
    // Ir al login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    console.log('✅ Página de login cargada');
    
    // Llenar credenciales
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'test123456');
    await page.click('button[type="submit"]');
    console.log('✅ Credenciales ingresadas');
    
    // Esperar a que cargue el dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
    console.log('✅ Dashboard cargado');
    
    // Esperar un poco más
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar la URL actual
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Buscar herramientas usando el mismo enfoque que funcionó en debug
    const tools = await page.evaluate(() => {
      const toolElements = document.querySelectorAll('[data-testid^="tool-"]');
      return Array.from(toolElements).map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        text: el.textContent?.trim() || ''
      }));
    });
    
    console.log(`🔍 Encontradas ${tools.length} herramientas:`, tools.map(t => t.testId));
    
    // Verificar si hay algún problema con el contexto
    const pageInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        readyState: document.readyState,
        bodyChildren: document.body.children.length,
        toolElements: document.querySelectorAll('[data-testid^="tool-"]').length,
        allElements: document.querySelectorAll('*').length
      };
    });
    
    console.log('📄 Información de la página:', pageInfo);
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug_final.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug_final.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugFinal(); 