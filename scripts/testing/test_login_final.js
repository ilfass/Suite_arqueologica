const puppeteer = require('puppeteer');

async function testLoginFinal() {
  console.log('🧪 Prueba final de login...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Ir a la página de login
    console.log('📄 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Llenar credenciales con los selectores correctos
    console.log('📝 Llenando credenciales...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'test123');
    
    // Hacer click en el botón de login
    console.log('🔐 Haciendo login...');
    await page.click('button[type="submit"]');
    
    // Esperar a que redirija al dashboard
    console.log('⏳ Esperando redirección...');
    await page.waitForNavigation({ timeout: 10000 });
    
    // Verificar que estamos en el dashboard
    const currentUrl = page.url();
    console.log('📋 URL actual:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Login exitoso - Redirigido al dashboard');
      
      // Verificar que no hay errores de acceso restringido
      const pageContent = await page.content();
      if (pageContent.includes('Acceso restringido') || pageContent.includes('Access denied')) {
        console.log('❌ Se encontró mensaje de acceso restringido');
      } else {
        console.log('✅ No se encontraron mensajes de acceso restringido');
      }
      
      // Tomar screenshot del dashboard
      await page.screenshot({ path: 'scripts/testing/dashboard_success.png' });
      console.log('📸 Screenshot del dashboard guardado');
      
    } else {
      console.log('❌ Login falló - No se redirigió al dashboard');
      await page.screenshot({ path: 'scripts/testing/login_failed.png' });
    }
    
    console.log('✅ Prueba completada');
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Keep browser open
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testLoginFinal(); 