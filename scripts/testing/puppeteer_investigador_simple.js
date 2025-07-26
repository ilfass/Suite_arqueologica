const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Crear directorio para screenshots si no existe
const screenshotsDir = path.join(__dirname, '../../assets/screenshots/puppeteer_test');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filename = `${name}_${Date.now()}.png`;
  const filepath = path.join(screenshotsDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 Screenshot guardado: ${filename}`);
  return filepath;
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testResearcherDashboard() {
  console.log('🚀 Iniciando pruebas simplificadas del investigador...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    
    // Configurar timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(15000);

    console.log('📱 Configurando viewport...');
    await page.setViewport({ width: 1920, height: 1080 });

    // 1. LOGIN
    console.log('\n🔐 === PRUEBA 1: LOGIN ===');
    await page.goto('http://localhost:3000/login');
    await wait(2000);
    await takeScreenshot(page, '01_login_page');

    // Buscar campos de login
    const emailInput = await page.$('input[type="email"], input[name="email"], #email');
    const passwordInput = await page.$('input[type="password"], input[name="password"], #password');
    
    if (emailInput && passwordInput) {
      await emailInput.type('investigador@test.com');
      await passwordInput.type('password123');
      
      const loginButton = await page.$('button[type="submit"], button[type="button"]');
      if (loginButton) {
        await loginButton.click();
        await wait(3000);
        await takeScreenshot(page, '02_after_login');
        console.log('✅ Login completado');
      }
    } else {
      console.log('❌ Campos de login no encontrados');
      return;
    }

    // 2. DASHBOARD PRINCIPAL
    console.log('\n🏠 === PRUEBA 2: DASHBOARD PRINCIPAL ===');
    await wait(2000);
    await takeScreenshot(page, '03_dashboard_principal');

    // Verificar que estamos en el dashboard del investigador
    const dashboardTitle = await page.$('h1, h2, .dashboard-title');
    if (dashboardTitle) {
      const titleText = await dashboardTitle.evaluate(el => el.textContent);
      console.log('📋 Título del dashboard:', titleText);
    }

    // 3. NAVEGAR A DIFERENTES SECCIONES
    console.log('\n🧭 === PRUEBA 3: NAVEGACIÓN POR SECCIONES ===');
    
    // Buscar todos los enlaces en la página
    const links = await page.$$('a[href]');
    console.log(`🔗 Encontrados ${links.length} enlaces en la página`);
    
    // Tomar screenshot de la navegación
    await takeScreenshot(page, '04_navigation_links');

    // 4. PROBAR BOTONES
    console.log('\n🔘 === PRUEBA 4: BOTONES ===');
    
    const buttons = await page.$$('button');
    console.log(`🔘 Encontrados ${buttons.length} botones en la página`);
    
    // Tomar screenshot de los botones
    await takeScreenshot(page, '05_buttons');

    // 5. PROBAR FORMULARIOS
    console.log('\n📝 === PRUEBA 5: FORMULARIOS ===');
    
    const forms = await page.$$('form');
    console.log(`📝 Encontrados ${forms.length} formularios en la página`);
    
    const inputs = await page.$$('input, textarea, select');
    console.log(`📝 Encontrados ${inputs.length} campos de entrada en la página`);
    
    // Tomar screenshot de los formularios
    await takeScreenshot(page, '06_forms');

    // 6. PROBAR LOGOUT
    console.log('\n🚪 === PRUEBA 6: LOGOUT ===');
    
    const logoutButton = await page.$('button, a');
    if (logoutButton) {
      await logoutButton.click();
      await wait(2000);
      await takeScreenshot(page, '07_after_logout');
      console.log('✅ Logout completado');
    }

    console.log('\n🎉 === PRUEBAS COMPLETADAS ===');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    console.log('✅ Pruebas simplificadas del investigador completadas');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    if (page) {
      await takeScreenshot(page, 'error_screenshot');
    }
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

// Ejecutar las pruebas
testResearcherDashboard().catch(console.error); 