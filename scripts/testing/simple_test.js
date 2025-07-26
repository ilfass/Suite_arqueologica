const puppeteer = require('puppeteer');

async function simpleTest() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();
  
  try {
    console.log('🚀 Iniciando prueba simplificada...');
    
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
    
    // Probar hacer clic en la primera herramienta
    if (tools.length > 0) {
      console.log('🖱️ Probando clic en herramienta:', tools[0].testId);
      
      await page.evaluate((testId) => {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        if (element) {
          element.click();
          console.log('Clic ejecutado en:', testId);
        } else {
          console.log('Elemento no encontrado:', testId);
        }
      }, tools[0].testId);
      
      // Esperar a que navegue
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar la nueva URL
      const newUrl = page.url();
      console.log('📍 Nueva URL después del clic:', newUrl);
    }
    
    // Tomar screenshot
    await page.screenshot({ path: 'simple_test.png', fullPage: true });
    console.log('📸 Screenshot guardado como simple_test.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

simpleTest(); 