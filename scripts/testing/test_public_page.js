const puppeteer = require('puppeteer');

async function testPublicPage() {
  console.log('🧪 Iniciando prueba de la página pública...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('📄 Navegando a la página pública...');
    await page.goto('http://localhost:3000/public', { waitUntil: 'networkidle2' });

    // Tomar screenshot de la página principal
    await page.screenshot({ path: 'scripts/testing/screenshots/public_page_main.png' });
    console.log('✅ Screenshot de página principal guardado');

    // Verificar elementos principales
    const title = await page.$eval('h1', el => el.textContent);
    console.log('📋 Título de la página:', title);

    // Buscar proyectos
    console.log('🔍 Buscando proyectos...');
    await page.type('input[placeholder*="Buscar"]', 'Laguna');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar que aparezcan resultados
    const projects = await page.$$('[data-testid*="project"]');
    console.log(`📊 Proyectos encontrados: ${projects.length}`);

    // Hacer clic en "Ver Detalles" del primer proyecto
    const detailButtons = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Ver Detalles')
      );
    });
    
    if (detailButtons) {
      console.log('🔍 Abriendo detalles del proyecto...');
      await detailButtons.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que aparezca el modal
      const modal = await page.$('.fixed.inset-0');
      if (modal) {
        console.log('✅ Modal de detalles abierto correctamente');
        await page.screenshot({ path: 'scripts/testing/screenshots/public_page_modal.png' });
        
        // Cerrar modal
        const closeButton = await page.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Cerrar')
          );
        });
        if (closeButton) {
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Probar filtros
    console.log('🔧 Probando filtros...');
    const filterSelect = await page.$('select');
    if (filterSelect) {
      await filterSelect.select('active');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Filtro aplicado');
    }

    // Navegar a página de investigador específico
    console.log('👤 Navegando a página de investigador...');
    await page.goto('http://localhost:3000/public/investigator/test-001', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'scripts/testing/screenshots/public_investigator_page.png' });

    // Verificar pestañas
    const tabs = await page.$$('nav button');
    console.log(`📑 Pestañas encontradas: ${tabs.length}`);

    // Cambiar a pestaña de publicaciones
    const publicationsTab = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('nav button')).find(btn => 
        btn.textContent.includes('Publicaciones')
      );
    });
    if (publicationsTab) {
      await publicationsTab.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Cambiado a pestaña de publicaciones');
      await page.screenshot({ path: 'scripts/testing/screenshots/public_investigator_publications.png' });
    }

    // Cambiar a pestaña "Acerca de"
    const aboutTab = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('nav button')).find(btn => 
        btn.textContent.includes('Acerca de')
      );
    });
    if (aboutTab) {
      await aboutTab.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Cambiado a pestaña "Acerca de"');
      await page.screenshot({ path: 'scripts/testing/screenshots/public_investigator_about.png' });
    }

    console.log('🎉 Prueba de página pública completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

async function testNewReportButton() {
  console.log('🧪 Iniciando prueba del botón "Nuevo Informe"...');
  
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

    // Buscar y hacer clic en el botón "Nuevo Informe"
    console.log('📋 Buscando botón "Nuevo Informe"...');
    const newReportButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Nuevo Informe')
      );
    });
    
    if (newReportButton) {
      console.log('✅ Botón "Nuevo Informe" encontrado');
      await newReportButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que aparezca el formulario
      const reportForm = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('h2')).find(h2 => 
          h2.textContent.includes('Nuevo Informe Arqueológico')
        );
      });
      if (reportForm) {
        console.log('✅ Formulario de informe abierto correctamente');
        await page.screenshot({ path: 'scripts/testing/screenshots/new_report_form.png' });

        // Llenar algunos campos del formulario
        await page.type('input[placeholder*="Título"]', 'Informe de Prueba');
        await page.select('select', 'excavation');
        await page.type('input[placeholder*="Autor"]', 'Dr. Test');
        await page.type('textarea[placeholder*="Resumen"]', 'Este es un informe de prueba para verificar la funcionalidad.');

        console.log('✅ Campos del formulario llenados');

        // Cerrar formulario
        const closeButton = await page.evaluateHandle(() => {
          return Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Cancelar')
          );
        });
        if (closeButton) {
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('✅ Formulario cerrado');
        }
      } else {
        console.log('❌ Formulario de informe no apareció');
      }
    } else {
      console.log('❌ Botón "Nuevo Informe" no encontrado');
    }

    // Probar botón "Página Pública"
    console.log('🌐 Probando botón "Página Pública"...');
    const publicPageButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Página Pública')
      );
    });
    
    if (publicPageButton) {
      console.log('✅ Botón "Página Pública" encontrado');
      
      // Abrir en nueva pestaña
      await publicPageButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Cambiar a la nueva pestaña
      const pages = await browser.pages();
      const newPage = pages[pages.length - 1];
      
      if (newPage.url().includes('/public')) {
        console.log('✅ Página pública abierta correctamente');
        await newPage.screenshot({ path: 'scripts/testing/screenshots/public_page_from_dashboard.png' });
      }
    }

    console.log('🎉 Prueba del botón "Nuevo Informe" completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas de nuevas funcionalidades...\n');
  
  await testPublicPage();
  console.log('\n' + '='.repeat(50) + '\n');
  await testNewReportButton();
  
  console.log('\n🎉 Todas las pruebas completadas');
}

runTests().catch(console.error); 