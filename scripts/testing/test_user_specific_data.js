const puppeteer = require('puppeteer');

async function testUserSpecificData() {
  console.log('🧪 Iniciando prueba de datos específicos del usuario...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('🔐 Iniciando sesión con lic.fabiande@gmail.com...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

    // Llenar formulario de login
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'test123');
    
    // Hacer clic en el botón de login
    const loginButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Iniciar sesión')
      );
    });
    if (loginButton) {
      await loginButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Verificar que estamos en el dashboard
    const dashboardTitle = await page.$('h1');
    if (dashboardTitle) {
      const titleText = await dashboardTitle.evaluate(el => el.textContent);
      if (titleText.includes('Dashboard del Investigador')) {
        console.log('✅ Login exitoso, en dashboard del investigador');
      }
    }

    // Obtener el ID del usuario desde el localStorage
    const userId = await page.evaluate(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id;
        } catch (e) {
          return null;
        }
      }
      return null;
    });

    console.log('🆔 ID del usuario:', userId);

    // Navegar directamente a la vidriera personal
    console.log('🌐 Navegando a la vidriera personal...');
    await page.goto(`http://localhost:3000/public/investigator/${userId}`, { waitUntil: 'networkidle2' });

    // Tomar screenshot de la vidriera
    await page.screenshot({ path: 'scripts/testing/screenshots/user_specific_showcase.png' });
    console.log('✅ Screenshot de vidriera personal guardado');

    // Verificar que muestra el nombre correcto del usuario
    const investigatorName = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('h1')).find(h1 => 
        h1.textContent && h1.textContent.length > 0
      );
    });
    
    if (investigatorName) {
      const nameText = await investigatorName.evaluate(el => el.textContent);
      console.log('👤 Nombre mostrado en vidriera:', nameText);
      
      // Verificar que no es "Dr. María González" (datos mock)
      if (nameText.includes('María González')) {
        console.log('❌ ERROR: La vidriera muestra datos mock en lugar de datos del usuario');
      } else {
        console.log('✅ La vidriera muestra datos del usuario correcto');
      }
    }

    // Verificar estadísticas de proyectos
    const projectsCount = await page.evaluate(() => {
      const projectsTab = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Proyectos')
      );
      if (projectsTab) {
        const match = projectsTab.textContent.match(/\((\d+)\)/);
        return match ? parseInt(match[1]) : 0;
      }
      return 0;
    });

    console.log('📋 Número de proyectos mostrados:', projectsCount);
    
    if (projectsCount > 0) {
      console.log('⚠️ ADVERTENCIA: Se muestran proyectos cuando el usuario no debería tener ninguno');
    } else {
      console.log('✅ Correcto: No se muestran proyectos (usuario nuevo)');
    }

    // Navegar a la configuración de vidriera
    console.log('⚙️ Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile', { waitUntil: 'networkidle2' });

    // Tomar screenshot de la configuración
    await page.screenshot({ path: 'scripts/testing/screenshots/user_specific_config.png' });
    console.log('✅ Screenshot de configuración guardado');

    // Verificar estadísticas en la configuración
    const configStats = await page.evaluate(() => {
      const statsElements = Array.from(document.querySelectorAll('.text-2xl.font-bold'));
      return statsElements.map(el => el.textContent);
    });

    console.log('📊 Estadísticas en configuración:', configStats);

    // Verificar que el nombre en configuración es correcto
    const configName = await page.evaluate(() => {
      const nameInput = document.querySelector('input[placeholder*="Dr. Juan Pérez"]');
      return nameInput ? nameInput.value : null;
    });

    console.log('👤 Nombre en configuración:', configName);

    // Verificar que no muestra datos mock
    if (configName && configName.includes('María González')) {
      console.log('❌ ERROR: La configuración muestra datos mock');
    } else {
      console.log('✅ La configuración muestra datos del usuario correcto');
    }

    console.log('🎉 Prueba de datos específicos del usuario completada');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar prueba
testUserSpecificData().catch(console.error); 