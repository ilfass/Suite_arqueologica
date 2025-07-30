const puppeteer = require('puppeteer');

async function testAdminLogin() {
  let browser;
  try {
    console.log('🧪 PROBANDO LOGIN DE ADMINISTRADOR');
    console.log('===================================\n');

    browser = await puppeteer.launch({ 
      headless: false, 
      slowMo: 1000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // Navegar a la página de login
    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Llenar credenciales de administrador
    console.log('🔑 Ingresando credenciales de administrador...');
    await page.type('input[name="email"]', 'fa07fa@gmail.com');
    await page.type('input[name="password"]', '3por39');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hacer clic en el botón de login
    console.log('🚀 Haciendo clic en Iniciar Sesión...');
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verificar la URL después del login
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);

    // Verificar si redirigió al dashboard de admin
    if (currentUrl.includes('/dashboard/admin')) {
      console.log('✅ ¡ÉXITO! El administrador fue redirigido al dashboard correcto');
      console.log('📊 Dashboard de administrador cargado correctamente');
    } else if (currentUrl.includes('/dashboard/director')) {
      console.log('❌ ERROR: El administrador fue redirigido al dashboard de director');
      console.log('🔧 El rol aún no se ha actualizado correctamente');
    } else {
      console.log('❓ Redirigido a:', currentUrl);
      console.log('🔍 Verificando si hay errores...');
    }

    // Tomar screenshot
    const screenshotPath = 'scripts/screenshots/admin_login_test.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot guardado en: ${screenshotPath}`);

    // Verificar elementos del dashboard de admin
    try {
      const adminElements = await page.evaluate(() => {
        const elements = {
          title: document.querySelector('h1')?.textContent,
          hasAdminPanel: !!document.querySelector('[href*="admin"]'),
          hasUserManagement: !!document.querySelector('text*="usuarios"'),
          hasReports: !!document.querySelector('text*="reportes"'),
          hasSettings: !!document.querySelector('text*="configuración"')
        };
        return elements;
      });
      
      console.log('\n🔍 Elementos del dashboard:');
      console.log(`📋 Título: ${adminElements.title}`);
      console.log(`🔧 Panel Admin: ${adminElements.hasAdminPanel ? '✅' : '❌'}`);
      console.log(`👥 Gestión Usuarios: ${adminElements.hasUserManagement ? '✅' : '❌'}`);
      console.log(`📊 Reportes: ${adminElements.hasReports ? '✅' : '❌'}`);
      console.log(`⚙️ Configuración: ${adminElements.hasSettings ? '✅' : '❌'}`);
    } catch (error) {
      console.log('❌ Error verificando elementos del dashboard:', error.message);
    }

    console.log('\n✅ Prueba completada');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    if (browser) {
      console.log('\n🔄 Cerrando navegador...');
      await browser.close();
    }
  }
}

// Crear directorio de screenshots si no existe
const fs = require('fs');
const path = require('path');
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

testAdminLogin().catch(console.error); 