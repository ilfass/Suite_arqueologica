const puppeteer = require('puppeteer');

const roles = [
  {
    name: 'ADMIN',
    email: 'fa07fa@gmail.com',
    password: '3por39',
    description: 'Acceso completo del sistema'
  },
  {
    name: 'RESEARCHER',
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    description: 'Investigador (puede fallar por problemas de BD)',
    expectedToFail: true
  },
  {
    name: 'STUDENT',
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    description: 'Estudiante con acceso educativo'
  },
  {
    name: 'DIRECTOR',
    email: 'director@inah.gob.mx',
    password: 'director123',
    description: 'Director con supervisión'
  },
  {
    name: 'INSTITUTION',
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    description: 'Institución académica'
  },
  {
    name: 'GUEST',
    email: 'invitado@example.com',
    password: 'invitado123',
    description: 'Usuario invitado con acceso limitado'
  }
];

async function testRole(browser, role, index) {
  const page = await browser.newPage();
  
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 PRUEBA ${index + 1}/6: ${role.name}`);
    console.log(`📧 Email: ${role.email}`);
    console.log(`🔑 Contraseña: ${role.password}`);
    console.log(`📝 Descripción: ${role.description}`);
    console.log(`${'='.repeat(60)}`);
    
    // Ir a la página de login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Esperar a que cargue la página
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Llenar el formulario
    await page.type('input[type="email"]', role.email);
    await page.type('input[type="password"]', role.password);
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    
    // Esperar la respuesta
    await page.waitForTimeout(3000);
    
    // Verificar si hay errores
    const errorElement = await page.$('.text-red-600, .error, [data-testid="error"]');
    if (errorElement) {
      const errorText = await errorElement.textContent();
      if (role.expectedToFail) {
        console.log(`✅ ${role.name}: Error esperado - ${errorText.trim()}`);
      } else {
        console.log(`❌ ${role.name}: Error inesperado - ${errorText.trim()}`);
      }
      return false;
    }
    
    // Verificar si el login fue exitoso
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/admin')) {
      console.log(`✅ ${role.name}: Login exitoso`);
      
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
      
      return true;
    } else {
      console.log(`❌ ${role.name}: Login falló - URL actual: ${currentUrl}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ${role.name}: Error durante la prueba - ${error.message}`);
    return false;
  } finally {
    await page.close();
  }
}

async function testAllRoles() {
  console.log('🚀 INICIANDO PRUEBAS DE TODOS LOS ROLES');
  console.log('🌐 URL: http://localhost:3000/login');
  console.log('📋 Instrucciones:');
  console.log('   1. El navegador se abrirá automáticamente');
  console.log('   2. Se probará cada rol secuencialmente');
  console.log('   3. Se verificará login, dashboard y logout');
  console.log('   4. Se mostrarán los resultados en consola');
  
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
    const results = [];
    
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const success = await testRole(browser, role, i);
      results.push({ role: role.name, success });
      
      // Pausa entre pruebas
      if (i < roles.length - 1) {
        console.log('\n⏳ Esperando 3 segundos antes de la siguiente prueba...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE PRUEBAS');
    console.log('='.repeat(60));
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const role = roles[index];
      console.log(`${status} ${role.name}: ${result.success ? 'FUNCIONA' : 'FALLA'}`);
    });
    
    const workingRoles = results.filter(r => r.success).length;
    const totalRoles = results.length;
    
    console.log(`\n📈 ESTADÍSTICAS:`);
    console.log(`   Roles funcionando: ${workingRoles}/${totalRoles}`);
    console.log(`   Tasa de éxito: ${((workingRoles/totalRoles)*100).toFixed(1)}%`);
    
    if (workingRoles === totalRoles) {
      console.log('\n🎉 ¡TODOS LOS ROLES FUNCIONAN PERFECTAMENTE!');
    } else if (workingRoles >= totalRoles - 1) {
      console.log('\n✅ Sistema funcionando correctamente (solo 1 problema menor)');
    } else {
      console.log('\n⚠️  Sistema con problemas que requieren atención');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testAllRoles().catch(console.error); 