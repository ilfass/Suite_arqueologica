const puppeteer = require('puppeteer');

async function debugDashboard() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
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
    
    // Esperar un poco más
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar la URL actual
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Verificar el título de la página
    const title = await page.title();
    console.log('📄 Título de la página:', title);
    
    // Buscar elementos específicos del dashboard
    const dashboardElements = await page.evaluate(() => {
      const elements = {
        dashboardTitle: document.querySelector('h1')?.textContent,
        statsTitle: document.querySelector('h3')?.textContent,
        toolsTitle: null,
        toolsSection: null,
        allH3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent),
        allH2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent),
        allH1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent)
      };
      
      // Buscar sección de herramientas
      const allElements = Array.from(document.querySelectorAll('*'));
      const toolsElement = allElements.find(el => el.textContent?.includes('Herramientas de Investigación'));
      if (toolsElement) {
        elements.toolsTitle = toolsElement.textContent;
        elements.toolsSection = {
          tagName: toolsElement.tagName,
          className: toolsElement.className,
          children: toolsElement.children.length,
          innerHTML: toolsElement.innerHTML.substring(0, 500) + '...'
        };
      }
      
      return elements;
    });
    
    console.log('🔍 Elementos del dashboard:', JSON.stringify(dashboardElements, null, 2));
    
    // Buscar data-testid específicos
    const testIds = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-testid]');
      return Array.from(elements).map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        text: el.textContent?.trim() || ''
      }));
    });
    
    console.log('🔍 Elementos con data-testid:', testIds);
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug_dashboard.png', fullPage: true });
    console.log('\n📸 Screenshot guardado como debug_dashboard.png');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugDashboard(); 