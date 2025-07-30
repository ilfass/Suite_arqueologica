const puppeteer = require('puppeteer');

async function testPersonalShowcase() {
  console.log('🧪 Iniciando prueba de vidriera personal...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('🔐 Iniciando sesión...');
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

    // Probar botón "Mi Vidriera"
    console.log('🌐 Probando botón "Mi Vidriera"...');
    const vidrieraButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Mi Vidriera')
      );
    });
    
    if (vidrieraButton) {
      console.log('✅ Botón "Mi Vidriera" encontrado');
      
      // Abrir en nueva pestaña
      await vidrieraButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Cambiar a la nueva pestaña
      const pages = await browser.pages();
      const newPage = pages[pages.length - 1];
      
      if (newPage.url().includes('/public/investigator')) {
        console.log('✅ Vidriera personal abierta correctamente');
        await newPage.screenshot({ path: 'scripts/testing/screenshots/personal_showcase.png' });
        
        // Verificar elementos de la vidriera
        const investigatorName = await newPage.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('h1')).find(h1 => 
            h1.textContent.includes('Dr.')
          );
        });
        if (investigatorName) {
          console.log('✅ Nombre del investigador encontrado en la vidriera');
        }
        
        // Cerrar pestaña de vidriera
        await newPage.close();
      }
    }

    // Probar botón "Configurar Vidriera"
    console.log('⚙️ Probando botón "Configurar Vidriera"...');
    const configButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Configurar Vidriera')
      );
    });
    
    if (configButton) {
      console.log('✅ Botón "Configurar Vidriera" encontrado');
      await configButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que estamos en la página de configuración
      const configTitle = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('h1')).find(h1 => 
          h1.textContent.includes('Configurar Mi Vidriera Pública')
        );
      });
      if (configTitle) {
        console.log('✅ Página de configuración de vidriera cargada');
        await page.screenshot({ path: 'scripts/testing/screenshots/showcase_config.png' });

        // Probar configuración de visibilidad
        const toggleButton = await page.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Hacer Público') || btn.textContent.includes('Hacer Privado')
          );
        });
        if (toggleButton) {
          console.log('✅ Botón de toggle de visibilidad encontrado');
        }

        // Probar edición de campos
        const nameInput = await page.$('input[placeholder*="Dr. Juan Pérez"]');
        if (nameInput) {
          await nameInput.click();
          await page.keyboard.press('Control+a');
          await page.keyboard.type('Dr. Test Investigator');
          console.log('✅ Campo de nombre editado');
        }

        // Probar guardado
        const saveButton = await page.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Guardar Cambios')
          );
        });
        if (saveButton) {
          console.log('✅ Botón de guardar encontrado');
          // No hacer clic para evitar guardar datos de prueba
        }
      }
    }

    console.log('🎉 Prueba de vidriera personal completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

async function testPublicDirectory() {
  console.log('🧪 Iniciando prueba del directorio público...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('📄 Navegando al directorio público...');
    await page.goto('http://localhost:3000/public', { waitUntil: 'networkidle2' });

    // Tomar screenshot del directorio
    await page.screenshot({ path: 'scripts/testing/screenshots/public_directory.png' });
    console.log('✅ Screenshot del directorio público guardado');

    // Verificar título del directorio
    const title = await page.$eval('h1', el => el.textContent);
    console.log('📋 Título del directorio:', title);

    // Verificar que aparezcan investigadores
    const investigators = await page.$$('[data-testid*="investigator"]');
    console.log(`👥 Investigadores encontrados: ${investigators.length}`);

    // Probar búsqueda
    console.log('🔍 Probando búsqueda...');
    await page.type('input[placeholder*="Buscar investigadores"]', 'María');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Probar filtros
    console.log('🔧 Probando filtros...');
    const institutionSelect = await page.$('select');
    if (institutionSelect) {
      await institutionSelect.select('Universidad Nacional de La Plata');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Filtro de institución aplicado');
    }

    // Hacer clic en "Ver Vidriera" del primer investigador
    const vidrieraButtons = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Ver Vidriera')
      );
    });
    
    if (vidrieraButtons) {
      console.log('🔍 Abriendo vidriera de investigador...');
      await vidrieraButtons.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que se abrió la vidriera
      const currentUrl = page.url();
      if (currentUrl.includes('/public/investigator')) {
        console.log('✅ Vidriera de investigador abierta correctamente');
        await page.screenshot({ path: 'scripts/testing/screenshots/investigator_showcase.png' });
      }
    }

    console.log('🎉 Prueba del directorio público completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de vidriera personal...\n');
  
  await testPersonalShowcase();
  console.log('\n' + '='.repeat(50) + '\n');
  await testPublicDirectory();
  
  console.log('\n🎉 Todas las pruebas completadas');
}

runTests().catch(console.error); 