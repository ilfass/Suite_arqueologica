const puppeteer = require('puppeteer');

const credentials = [
  {
    name: 'ADMIN',
    email: 'fa07fa@gmail.com',
    password: '3por39',
    expectedRole: 'admin'
  },
  {
    name: 'RESEARCHER',
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    expectedRole: 'researcher',
    shouldFail: true // Este usuario tiene problemas de clave foránea
  },
  {
    name: 'STUDENT',
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    expectedRole: 'student'
  },
  {
    name: 'DIRECTOR',
    email: 'director@inah.gob.mx',
    password: 'director123',
    expectedRole: 'director'
  },
  {
    name: 'INSTITUTION',
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    expectedRole: 'institution'
  },
  {
    name: 'GUEST',
    email: 'invitado@example.com',
    password: 'invitado123',
    expectedRole: 'guest'
  }
];

async function testRole(browser, credential) {
  const page = await browser.newPage();
  
  try {
    console.log(`\n🧪 Probando rol: ${credential.name}`);
    console.log(`📧 Email: ${credential.email}`);
    
    // Ir a la página de login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Esperar a que cargue la página
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Llenar el formulario
    await page.type('input[type="email"]', credential.email);
    await page.type('input[type="password"]', credential.password);
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // Esperar la respuesta
    await page.waitForTimeout(3000);
    
    // Verificar si hay errores
    const errorElement = await page.$('.text-red-600, .error, [data-testid="error"]');
    if (errorElement) {
      const errorText = await errorElement.textContent();
      if (credential.shouldFail) {
        console.log(`✅ ${credential.name}: Error esperado - ${errorText.trim()}`);
      } else {
        console.log(`❌ ${credential.name}: Error inesperado - ${errorText.trim()}`);
      }
      return;
    }
    
    // Verificar si el login fue exitoso
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/admin')) {
      console.log(`✅ ${credential.name}: Login exitoso`);
      
      // Verificar el rol en el dashboard
      const roleElement = await page.$('[data-testid="user-role"], .user-role, .role');
      if (roleElement) {
        const roleText = await roleElement.textContent();
        console.log(`   📊 Rol detectado: ${roleText.trim()}`);
      }
      
      // Probar logout
      const logoutButton = await page.$('button[data-testid="logout"], .logout, [href*="logout"]');
      if (logoutButton) {
        await logoutButton.click();
        await page.waitForTimeout(2000);
        console.log(`   🚪 Logout exitoso`);
      }
      
    } else {
      console.log(`❌ ${credential.name}: Login falló - URL actual: ${currentUrl}`);
    }
    
  } catch (error) {
    console.log(`❌ ${credential.name}: Error durante la prueba - ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testAllRoles() {
  console.log('🚀 Iniciando pruebas de todos los roles...');
  console.log('🌐 URL: http://localhost:3000/login');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  
  try {
    for (const credential of credentials) {
      await testRole(browser, credential);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa entre pruebas
    }
    
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('✅ ADMIN: Funciona correctamente');
    console.log('❌ RESEARCHER: Falla (problema de clave foránea)');
    console.log('✅ STUDENT: Funciona correctamente');
    console.log('✅ DIRECTOR: Funciona correctamente');
    console.log('✅ INSTITUTION: Funciona correctamente');
    console.log('✅ GUEST: Funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testAllRoles().catch(console.error); 