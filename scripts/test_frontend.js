const puppeteer = require('puppeteer');

async function testFrontend() {
  console.log('🧪 Probando funcionalidad del frontend...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 1. Ir al frontend
    console.log('📱 Navegando al frontend...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_frontend_01_homepage.png' });
    
    // 2. Ir a login
    console.log('🔐 Navegando a login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_frontend_02_login.png' });
    
    // 3. Hacer login
    console.log('👤 Haciendo login...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Esperar login
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test_frontend_03_after_login.png' });
    
    // 4. Ir a configuración de vidriera
    console.log('🌐 Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test_frontend_04_public_profile.png' });
    
    // 5. Probar toggle de visibilidad
    console.log('🔄 Probando toggle de visibilidad...');
    const toggleButton = await page.$('button:has-text("Hacer Público")');
    if (toggleButton) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test_frontend_05_toggle_clicked.png' });
    }
    
    // 6. Llenar campos
    console.log('✏️ Llenando campos...');
    const nameInput = await page.$('input[placeholder="Dr. Juan Pérez"]');
    if (nameInput) {
      await nameInput.clear();
      await nameInput.type('Dr. Fabian de Haro');
    }
    
    const institutionInput = await page.$('input[placeholder="Universidad Nacional"]');
    if (institutionInput) {
      await institutionInput.clear();
      await institutionInput.type('Universidad de Buenos Aires');
    }
    
    const specializationInput = await page.$('input[placeholder="Arqueología, Antropología, Historia"]');
    if (specializationInput) {
      await specializationInput.clear();
      await specializationInput.type('Arqueología Prehispánica');
    }
    
    await page.screenshot({ path: 'test_frontend_06_fields_filled.png' });
    
    // 7. Probar botón guardar
    console.log('💾 Probando botón guardar...');
    const saveButton = await page.$('button:has-text("Guardar Cambios")');
    if (saveButton) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_frontend_07_after_save.png' });
    }
    
    // 8. Probar botón volver
    console.log('⬅️ Probando botón volver...');
    const backButton = await page.$('button:has-text("← Volver")');
    if (backButton) {
      await backButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_frontend_08_after_back.png' });
    }
    
    // 9. Probar página pública
    console.log('🌍 Probando página pública...');
    await page.goto('http://localhost:3000/public/investigator/a9824343-3b45-4360-833c-8f241f7d835d', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_frontend_09_public_page.png' });
    
    console.log('✅ Pruebas del frontend completadas!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: 'test_frontend_error.png' });
  } finally {
    await browser.close();
  }
}

testFrontend().catch(console.error); 