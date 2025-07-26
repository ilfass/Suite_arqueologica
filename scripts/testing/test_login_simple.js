const puppeteer = require('puppeteer');

async function testLogin() {
  console.log('🚀 Probando login con usuario corregido...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Ir a la página de login
    console.log('📱 Navegando a login...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Buscar campos de login
    const emailInput = await page.$('input[type="email"], input[name="email"], #email');
    const passwordInput = await page.$('input[type="password"], input[name="password"], #password');
    
    if (emailInput && passwordInput) {
      console.log('✅ Campos de login encontrados');
      
      // Limpiar campos y escribir credenciales
      await emailInput.click({ clickCount: 3 });
      await emailInput.type('investigador@test.com');
      
      await passwordInput.click({ clickCount: 3 });
      await passwordInput.type('password123');
      
      console.log('✅ Credenciales ingresadas');
      
      // Buscar botón de login
      const loginButton = await page.$('button[type="submit"], button[type="button"]');
      if (loginButton) {
        console.log('✅ Botón de login encontrado, haciendo clic...');
        await loginButton.click();
        
        // Esperar a que se procese el login
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar si estamos en el dashboard
        const currentUrl = page.url();
        console.log('📍 URL actual:', currentUrl);
        
        if (currentUrl.includes('dashboard') || currentUrl.includes('researcher')) {
          console.log('✅ Login exitoso! Estamos en el dashboard');
          
          // Tomar screenshot
          await page.screenshot({ path: 'login_success.png', fullPage: true });
          console.log('📸 Screenshot guardado: login_success.png');
          
          // Buscar botón de crear proyecto
          console.log('🔍 Buscando botón de crear proyecto...');
          const createProjectButton = await page.$('div[onclick*="setShowNewProject"]');
          
          if (createProjectButton) {
            console.log('✅ Botón de crear proyecto encontrado');
            await createProjectButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verificar si el modal se abrió
            const modal = await page.$('.fixed.inset-0.bg-black.bg-opacity-50');
            if (modal) {
              console.log('✅ Modal de crear proyecto abierto correctamente');
              await page.screenshot({ path: 'modal_proyecto.png', fullPage: true });
              console.log('📸 Screenshot del modal guardado: modal_proyecto.png');
            } else {
              console.log('❌ Modal no se abrió');
            }
          } else {
            console.log('❌ Botón de crear proyecto no encontrado');
          }
          
        } else {
          console.log('❌ Login falló, no estamos en el dashboard');
          await page.screenshot({ path: 'login_failed.png', fullPage: true });
        }
      } else {
        console.log('❌ Botón de login no encontrado');
      }
    } else {
      console.log('❌ Campos de login no encontrados');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

testLogin(); 