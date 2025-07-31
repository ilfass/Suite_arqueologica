const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testVidriera() {
  console.log('🧪 Iniciando pruebas de vidriera pública...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 1. Ir al frontend
    console.log('📱 Navegando al frontend...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_vidriera_01_homepage.png' });
    
    // 2. Ir a la página de login
    console.log('🔐 Navegando a login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_vidriera_02_login_page.png' });
    
    // 3. Hacer login
    console.log('👤 Haciendo login...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test_vidriera_03_after_login.png' });
    
    // 4. Ir a la página de configuración de vidriera
    console.log('🌐 Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_vidriera_04_public_profile_page.png' });
    
    // 5. Probar la funcionalidad de la página
    console.log('🔧 Probando funcionalidad...');
    
    // Esperar a que carguen los datos
    await page.waitForTimeout(2000);
    
    // Probar el toggle de visibilidad pública
    console.log('🔄 Probando toggle de visibilidad...');
    const toggleButton = await page.$('button:has-text("Hacer Público")');
    if (toggleButton) {
      await toggleButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test_vidriera_05_toggle_public.png' });
    }
    
    // Probar llenar campos
    console.log('✏️ Llenando campos...');
    await page.type('input[placeholder="Dr. Juan Pérez"]', 'Dr. Fabian de Haro');
    await page.type('input[placeholder="Universidad Nacional"]', 'Universidad de Buenos Aires');
    await page.type('input[placeholder="Arqueología, Antropología, Historia"]', 'Arqueología Prehispánica');
    await page.type('input[placeholder="Buenos Aires, Argentina"]', 'Buenos Aires, Argentina');
    await page.type('textarea[placeholder="Describe tu experiencia..."]', 'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia.');
    await page.type('input[placeholder="tu.email@institucion.edu.ar"]', 'lic.fabiande@gmail.com');
    
    await page.screenshot({ path: 'test_vidriera_06_fields_filled.png' });
    
    // Probar botón de guardar
    console.log('💾 Probando botón guardar...');
    const saveButton = await page.$('button:has-text("Guardar Cambios")');
    if (saveButton) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_vidriera_07_after_save.png' });
    }
    
    // Probar botón de vista previa
    console.log('👁️ Probando vista previa...');
    const previewButton = await page.$('button:has-text("Vista Previa")');
    if (previewButton) {
      await previewButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_vidriera_08_preview_clicked.png' });
    }
    
    // 6. Probar el botón volver
    console.log('⬅️ Probando botón volver...');
    const backButton = await page.$('button:has-text("← Volver")');
    if (backButton) {
      await backButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_vidriera_09_after_back.png' });
    }
    
    // 7. Probar la página pública
    console.log('🌍 Probando página pública...');
    await page.goto('http://localhost:3000/public/investigator/a9824343-3b45-4360-833c-8f241f7d835d', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_vidriera_10_public_page.png' });
    
    // 8. Probar navegación desde la página pública
    console.log('🔙 Probando navegación desde página pública...');
    const publicBackButton = await page.$('button:has-text("← Volver")');
    if (publicBackButton) {
      await publicBackButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test_vidriera_11_public_back.png' });
    }
    
    console.log('✅ Pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: 'test_vidriera_error.png' });
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testVidriera().catch(console.error); 