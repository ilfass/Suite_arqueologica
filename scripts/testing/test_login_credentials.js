const puppeteer = require('puppeteer');

const credentials = [
  {
    role: 'ADMIN',
    email: 'fa07fa@gmail.com',
    password: '3por39',
    description: 'Administrador del Sistema'
  },
  {
    role: 'RESEARCHER',
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    description: 'Investigador'
  },
  {
    role: 'STUDENT',
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    description: 'Estudiante'
  },
  {
    role: 'DIRECTOR',
    email: 'director@inah.gob.mx',
    password: 'director123',
    description: 'Director'
  },
  {
    role: 'INSTITUTION',
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    description: 'Institución'
  },
  {
    role: 'GUEST',
    email: 'invitado@example.com',
    password: 'invitado123',
    description: 'Invitado'
  }
];

async function testLogin() {
  console.log('🚀 Iniciando pruebas de login con credenciales de la guía...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
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
    for (const cred of credentials) {
      console.log(`\n📝 Probando login para: ${cred.role} (${cred.description})`);
      console.log(`   Email: ${cred.email}`);
      
      const page = await browser.newPage();
      
      try {
        // Ir a la página de login
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
        
        // Esperar a que cargue el formulario
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        
        // Llenar el formulario
        await page.type('input[type="email"]', cred.email);
        await page.type('input[type="password"]', cred.password);
        
        // Hacer clic en el botón de login
        await page.click('button[type="submit"]');
        
        // Esperar la respuesta
        await page.waitForTimeout(3000);
        
        // Verificar si el login fue exitoso
        const currentUrl = page.url();
        
        if (currentUrl.includes('/dashboard')) {
          console.log(`✅ Login exitoso para ${cred.role}`);
          
          // Verificar el rol en el dashboard
          const roleText = await page.evaluate(() => {
            const roleElement = document.querySelector('[data-testid="user-role"]') || 
                              document.querySelector('.user-role') ||
                              document.querySelector('h1, h2, h3');
            return roleElement ? roleElement.textContent : 'Rol no encontrado';
          });
          
          console.log(`   Rol detectado: ${roleText}`);
          
          // Tomar screenshot
          await page.screenshot({ 
            path: `screenshots/login_${cred.role.toLowerCase()}.png`,
            fullPage: true 
          });
          
          // Probar logout
          try {
            const logoutButton = await page.$('button[data-testid="logout"]') ||
                               await page.$('button:contains("Logout")') ||
                               await page.$('a[href="/logout"]');
            
            if (logoutButton) {
              await logoutButton.click();
              await page.waitForTimeout(2000);
              console.log(`   ✅ Logout exitoso`);
            } else {
              console.log(`   ⚠️ Botón de logout no encontrado`);
            }
          } catch (logoutError) {
            console.log(`   ⚠️ Error en logout: ${logoutError.message}`);
          }
          
        } else {
          console.log(`❌ Login falló para ${cred.role}`);
          
          // Verificar si hay mensaje de error
          const errorMessage = await page.evaluate(() => {
            const errorElement = document.querySelector('.error-message') ||
                               document.querySelector('.alert-error') ||
                               document.querySelector('[data-testid="error-message"]');
            return errorElement ? errorElement.textContent : 'Sin mensaje de error';
          });
          
          console.log(`   Error: ${errorMessage}`);
          
          // Tomar screenshot del error
          await page.screenshot({ 
            path: `screenshots/login_error_${cred.role.toLowerCase()}.png`,
            fullPage: true 
          });
        }
        
      } catch (error) {
        console.log(`❌ Error durante la prueba de ${cred.role}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await browser.close();
  }
  
  console.log('\n📋 Resumen de credenciales probadas:');
  credentials.forEach(cred => {
    console.log(`👤 ${cred.role}: ${cred.email} / ${cred.password}`);
  });
  
  console.log('\n🎯 Verifica las capturas de pantalla en la carpeta screenshots/');
}

// Verificar que los servidores estén corriendo
async function checkServers() {
  console.log('🔍 Verificando servidores...');
  
  try {
    const response = await fetch('http://localhost:4000/api/health');
    if (response.ok) {
      console.log('✅ Backend corriendo en puerto 4000');
    } else {
      console.log('❌ Backend no responde correctamente');
    }
  } catch (error) {
    console.log('❌ Backend no está corriendo en puerto 4000');
  }
  
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Frontend corriendo en puerto 3000');
    } else {
      console.log('❌ Frontend no responde correctamente');
    }
  } catch (error) {
    console.log('❌ Frontend no está corriendo en puerto 3000');
  }
}

// Ejecutar las pruebas
checkServers().then(() => {
  setTimeout(() => {
    testLogin();
  }, 2000);
}); 