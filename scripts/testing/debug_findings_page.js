const puppeteer = require('puppeteer');
const path = require('path');

async function debugFindingsPage() {
  console.log('🔍 Debug de la página de hallazgos...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Habilitar logs de consola
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    // Navegar a la página de login
    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Llenar credenciales
    console.log('🔑 Llenando credenciales...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'password123');
    
    // Hacer clic en login
    console.log('🚀 Iniciando sesión...');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar si estamos en el dashboard
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Navegar a la página de hallazgos
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Tomar screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/debug_findings.png'),
      fullPage: true 
    });
    
    // Verificar la URL actual
    const findingsUrl = page.url();
    console.log('📍 URL de hallazgos:', findingsUrl);
    
    // Verificar si hay errores en la consola del navegador
    console.log('🔍 Verificando errores de consola...');
    
    // Verificar el contenido de la página
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent.substring(0, 500),
        hasError: document.querySelector('[class*="error"]') !== null,
        hasLoading: document.querySelector('[class*="loading"]') !== null,
        hasButton: document.querySelector('button') !== null,
        buttons: Array.from(document.querySelectorAll('button')).map(btn => btn.textContent.trim())
      };
    });
    
    console.log('Contenido de la página:', pageContent);
    
    // Verificar si hay elementos específicos
    const elements = await page.evaluate(() => {
      return {
        hasFindingsTitle: document.querySelector('h1:contains("Hallazgos")') !== null,
        hasContextInfo: document.querySelector('[class*="Contexto"]') !== null,
        hasNewFindingButton: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent.includes('Nuevo Hallazgo')
        ),
        allText: Array.from(document.querySelectorAll('*'))
          .filter(el => el.textContent && el.textContent.trim().length > 0)
          .map(el => el.textContent.trim().substring(0, 100))
          .slice(0, 10)
      };
    });
    
    console.log('Elementos específicos:', elements);
    
    // Verificar el estado del contexto en localStorage
    const contextState = await page.evaluate(() => {
      return {
        unifiedContext: localStorage.getItem('unified-context'),
        authToken: localStorage.getItem('auth_token'),
        allKeys: Object.keys(localStorage)
      };
    });
    
    console.log('Estado del contexto:', contextState);
    
    // Intentar establecer un contexto de prueba
    console.log('🔧 Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      const testContext = {
        project_id: 'proj-test-001',
        project_name: 'Proyecto Cazadores Recolectores - La Laguna',
        area_id: 'area-test-001',
        area_name: 'Laguna La Brava',
        site_id: 'site-test-001',
        site_name: 'Sitio Pampeano La Laguna'
      };
      localStorage.setItem('unified-context', JSON.stringify(testContext));
      console.log('Contexto de prueba establecido');
    });
    
    // Recargar la página
    console.log('🔄 Recargando página...');
    await page.reload();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tomar screenshot después de establecer contexto
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/debug_with_context.png'),
      fullPage: true 
    });
    
    // Verificar botones después del contexto
    const buttonsAfterContext = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(btn => ({
        text: btn.textContent.trim(),
        disabled: btn.disabled,
        className: btn.className
      }));
    });
    
    console.log('Botones después del contexto:', buttonsAfterContext);
    
    console.log('✅ Debug completado!');
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar el debug
debugFindingsPage().catch(console.error); 