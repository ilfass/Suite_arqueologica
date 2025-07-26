const puppeteer = require('puppeteer');

async function debugTools() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // Ir al login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // Llenar credenciales
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'test123456');
    await page.click('button[type="submit"]');
    
    // Esperar a que cargue el dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
    
    // Esperar un poco más para que carguen las herramientas
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar todas las herramientas con data-testid
    const tools = await page.evaluate(() => {
      const toolElements = document.querySelectorAll('[data-testid^="tool-"]');
      return Array.from(toolElements).map(el => ({
        testId: el.getAttribute('data-testid'),
        text: el.textContent?.trim() || '',
        visible: el.offsetParent !== null
      }));
    });
    
    console.log('🔍 Herramientas encontradas:');
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.testId} - "${tool.text}" - Visible: ${tool.visible}`);
    });
    
    // Buscar elementos por texto también
    const toolNames = [
      'Trabajo de Campo',
      'Mapeo SIG Integrado', 
      'Hallazgos',
      'Muestras',
      'Laboratorio',
      'Cronología',
      'Reportes',
      'Exportar Datos'
    ];
    
    console.log('\n🔍 Buscando por texto:');
    for (const name of toolNames) {
      const element = await page.evaluate((text) => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.find(el => el.textContent?.includes(text));
      }, name);
      
      if (element) {
        console.log(`✅ "${name}" encontrado`);
      } else {
        console.log(`❌ "${name}" NO encontrado`);
      }
    }
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug_tools.png', fullPage: true });
    console.log('\n📸 Screenshot guardado como debug_tools.png');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugTools(); 