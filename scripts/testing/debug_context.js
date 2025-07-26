const puppeteer = require('puppeteer');

async function debugContext() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();
  
  try {
    console.log('🚀 Iniciando debug de contexto...');
    
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
    
    // Simular las acciones que hace el script de pruebas
    console.log('\n🔄 Simulando acciones del script de pruebas...');
    
    // 1. Probar botón de perfil
    console.log('1. Probando botón de perfil...');
    const profileButton = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const profileElement = elements.find(el => el.textContent?.includes('👤 Perfil'));
      return profileElement ? { found: true, tagName: profileElement.tagName } : { found: false };
    });
    console.log('Resultado botón perfil:', profileButton);
    
    if (profileButton.found) {
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const profileElement = elements.find(el => el.textContent?.includes('👤 Perfil'));
        if (profileElement) profileElement.click();
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar URL después del clic
      const urlAfterProfile = page.url();
      console.log('URL después del clic en perfil:', urlAfterProfile);
      
      // Volver al dashboard
      await page.goBack();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 2. Verificar navegador de contexto
    console.log('2. Verificando navegador de contexto...');
    const contextNavigator = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="context-navigator"]');
      return element ? { found: true, tagName: element.tagName } : { found: false };
    });
    console.log('Resultado navegador contexto:', contextNavigator);
    
    // 3. Verificar estadísticas
    console.log('3. Verificando estadísticas...');
    const statsTitle = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const statsElement = elements.find(el => el.textContent?.includes('📊 Mis Estadísticas'));
      return statsElement ? { found: true, tagName: statsElement.tagName } : { found: false };
    });
    console.log('Resultado estadísticas:', statsTitle);
    
    // 4. Buscar herramientas nuevamente después de las acciones
    console.log('4. Buscando herramientas después de las acciones...');
    const toolsAfterActions = await page.evaluate(() => {
      const toolElements = document.querySelectorAll('[data-testid^="tool-"]');
      return Array.from(toolElements).map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        text: el.textContent?.trim() || ''
      }));
    });
    console.log(`🔍 Encontradas ${toolsAfterActions.length} herramientas después de acciones:`, toolsAfterActions.map(t => t.testId));
    
    // Verificar si hay algún problema con el contexto
    const pageInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        readyState: document.readyState,
        bodyChildren: document.body.children.length,
        toolElements: document.querySelectorAll('[data-testid^="tool-"]').length,
        allElements: document.querySelectorAll('*').length,
        hasReactRoot: !!document.querySelector('#__next'),
        hasNextScripts: !!document.querySelector('script[src*="next"]')
      };
    });
    
    console.log('📄 Información final de la página:', pageInfo);
    
    // Tomar screenshot
    await page.screenshot({ path: 'debug_context.png', fullPage: true });
    console.log('📸 Screenshot guardado como debug_context.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugContext(); 