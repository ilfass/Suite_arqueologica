const puppeteer = require('puppeteer');
const path = require('path');

async function testFindingsButton() {
  console.log('🧪 Iniciando prueba del botón "Nuevo Hallazgo"...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Navegar a la página de login
    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Tomar screenshot de la página de login
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/01_login_page.png'),
      fullPage: true 
    });
    
    // Llenar credenciales de desarrollo
    console.log('🔑 Llenando credenciales de desarrollo...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'password123');
    
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/02_credentials_filled.png'),
      fullPage: true 
    });
    
    // Hacer clic en el botón de login
    console.log('🚀 Iniciando sesión...');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login y navegar al dashboard
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Navegar directamente a la página de hallazgos
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tomar screenshot de la página de hallazgos sin contexto
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/03_findings_page_no_context.png'),
      fullPage: true 
    });
    
    // Verificar que el botón esté deshabilitado
    console.log('🔍 Verificando estado del botón sin contexto...');
    const buttonDisabled = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Nuevo Hallazgo')
      );
      return button ? button.disabled : false;
    });
    
    console.log(`Botón deshabilitado: ${buttonDisabled}`);
    
    // Intentar hacer clic en el botón (debería mostrar alerta)
    console.log('🖱️ Intentando hacer clic en el botón sin contexto...');
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Nuevo Hallazgo')
      );
      if (button) button.click();
    });
    
    // Esperar a que aparezca la alerta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Tomar screenshot después del intento de clic
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/04_after_button_click_no_context.png'),
      fullPage: true 
    });
    
    // Verificar el estado del contexto
    console.log('🔍 Verificando indicador de estado del contexto...');
    const contextStatus = await page.evaluate(() => {
      const statusElement = document.querySelector('[class*="bg-red-50"]') || 
                           document.querySelector('[class*="bg-green-50"]') ||
                           document.querySelector('[class*="border-red-200"]') ||
                           document.querySelector('[class*="border-green-200"]');
      return statusElement ? statusElement.textContent : 'No encontrado';
    });
    
    console.log('Estado del contexto:', contextStatus);
    
    // Verificar si hay mensaje de "No hay hallazgos"
    const noFindingsMessage = await page.evaluate(() => {
      const messageElement = Array.from(document.querySelectorAll('h3')).find(h3 => 
        h3.textContent.includes('No hay hallazgos')
      );
      return messageElement ? messageElement.textContent : 'No encontrado';
    });
    
    console.log('Mensaje de hallazgos:', noFindingsMessage);
    
    // Verificar si hay botón "Seleccionar Contexto"
    const selectContextButton = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Seleccionar Contexto')
      );
      return button ? button.textContent : 'No encontrado';
    });
    
    console.log('Botón de seleccionar contexto:', selectContextButton);
    
    console.log('✅ Prueba completada exitosamente!');
    console.log('📸 Screenshots guardados en: scripts/screenshots/test_findings/');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    try {
      await page.screenshot({ 
        path: path.join(__dirname, '../screenshots/test_findings/error.png'),
        fullPage: true 
      });
    } catch (screenshotError) {
      console.error('Error al tomar screenshot:', screenshotError);
    }
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testFindingsButton().catch(console.error); 