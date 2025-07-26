const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Crear directorio para screenshots si no existe
const screenshotsDir = path.join(__dirname, 'screenshots', 'test_manual_visual');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Función helper para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testManualVisual() {
  console.log('🎨 Iniciando prueba manual y visual de la Suite Arqueológica...');
  console.log('📋 Esta prueba abrirá el navegador para inspección manual');
  console.log('🖱️ Puedes navegar manualmente y verificar todas las funcionalidades');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null, // Usar viewport completo
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // 1. Página principal
    console.log('🏠 1. Abriendo página principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, '01_homepage.png'), fullPage: true });
    console.log('✅ Página principal cargada');
    console.log('📝 Verificar: Título, botones de login/registro, diseño responsive');
    
    await sleep(3000);
    
    // 2. Navegar a login
    console.log('🔐 2. Navegando a página de login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, '02_login_page.png'), fullPage: true });
    console.log('✅ Página de login cargada');
    console.log('📝 Verificar: Formulario de login, campos email/password');
    
    await sleep(3000);
    
    // 3. Hacer login
    console.log('👤 3. Realizando login...');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && submitButton) {
      await emailInput.type('dr.perez@unam.mx');
      await passwordInput.type('password123');
      await submitButton.click();
      await sleep(3000);
      await page.screenshot({ path: path.join(screenshotsDir, '03_after_login.png'), fullPage: true });
      console.log('✅ Login completado');
    }
    
    // 4. Dashboard del investigador
    console.log('📊 4. Navegando al dashboard del investigador...');
    await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
    await sleep(3000);
    await page.screenshot({ path: path.join(screenshotsDir, '04_researcher_dashboard.png'), fullPage: true });
    console.log('✅ Dashboard del investigador cargado');
    console.log('📝 Verificar: Menú de navegación, herramientas disponibles');
    
    // 5. Verificar sistema de contextos
    console.log('🎯 5. Verificando sistema de contextos...');
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '05_context_system.png'), fullPage: true });
    console.log('📝 Verificar: Selector de contexto, cards de proyectos/áreas/sitios');
    
    // 6. Navegar a diferentes secciones
    console.log('🧭 6. Navegando por diferentes secciones...');
    
    // Sitios arqueológicos
    console.log('🏛️ Navegando a sitios arqueológicos...');
    await page.goto('http://localhost:3000/dashboard/researcher/sites', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '06_sites_page.png'), fullPage: true });
    
    // Objetos/Artefactos
    console.log('🏺 Navegando a objetos/artefactos...');
    await page.goto('http://localhost:3000/dashboard/researcher/objects', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '07_objects_page.png'), fullPage: true });
    
    // Excavaciones
    console.log('⛏️ Navegando a excavaciones...');
    await page.goto('http://localhost:3000/dashboard/researcher/excavations', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '08_excavations_page.png'), fullPage: true });
    
    // Hallazgos
    console.log('🔍 Navegando a hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '09_findings_page.png'), fullPage: true });
    
    // Proyectos
    console.log('📋 Navegando a proyectos...');
    await page.goto('http://localhost:3000/dashboard/researcher/projects', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '10_projects_page.png'), fullPage: true });
    
    // 7. Verificar formularios
    console.log('📝 7. Verificando formularios...');
    
    // Ir a página de crear nuevo sitio
    console.log('🏗️ Verificando formulario de crear sitio...');
    await page.goto('http://localhost:3000/sites/new', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '11_create_site_form.png'), fullPage: true });
    
    // Ir a página de crear nuevo objeto
    console.log('🏺 Verificando formulario de crear objeto...');
    await page.goto('http://localhost:3000/objects/new', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '12_create_object_form.png'), fullPage: true });
    
    // 8. Verificar perfil de usuario
    console.log('👤 8. Verificando perfil de usuario...');
    await page.goto('http://localhost:3000/dashboard/researcher/profile', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '13_profile_page.png'), fullPage: true });
    
    // 9. Verificar responsive design
    console.log('📱 9. Verificando diseño responsive...');
    
    // Vista tablet
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '14_tablet_view.png'), fullPage: true });
    
    // Vista móvil
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '15_mobile_view.png'), fullPage: true });
    
    // Restaurar vista desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 10. Volver al dashboard para logout
    console.log('🚪 10. Preparando para logout...');
    await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '16_before_logout.png'), fullPage: true });
    
    console.log('✅ Prueba manual y visual completada!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    console.log('');
    console.log('🎯 INSTRUCCIONES PARA PRUEBA MANUAL:');
    console.log('1. Revisa cada screenshot generado');
    console.log('2. Verifica que el sistema de contextos funcione con cards');
    console.log('3. Prueba la navegación entre secciones');
    console.log('4. Verifica que los formularios se carguen correctamente');
    console.log('5. Prueba el diseño responsive');
    console.log('6. Verifica que el logout funcione');
    console.log('');
    console.log('🖱️ El navegador permanecerá abierto para inspección manual...');
    console.log('Presiona Ctrl+C para cerrar cuando hayas terminado.');
    
    // Mantener el navegador abierto para inspección manual
    await new Promise(() => {}); // Esperar indefinidamente
    
  } catch (error) {
    console.error('❌ Error durante la prueba manual:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error_screenshot.png'), fullPage: true });
  } finally {
    // No cerrar el navegador automáticamente para permitir inspección manual
    // await browser.close();
  }
}

// Ejecutar la prueba
testManualVisual().catch(console.error); 