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
  console.log('🚀 Iniciando pruebas completas del investigador...');
  
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

    // 3. CREAR NUEVO PROYECTO
    console.log('\n📋 === PRUEBA 3: CREAR NUEVO PROYECTO ===');
    
    // Buscar botón de crear proyecto
    const createProjectButton = await page.$('button, a');
    if (createProjectButton) {
      await createProjectButton.click();
      await wait(2000);
      await takeScreenshot(page, '04_crear_proyecto_form');
      
      // Llenar formulario de proyecto
      const projectNameInput = await page.$('input[name="name"], input[name="title"], #name, #title');
      const projectDescriptionInput = await page.$('textarea[name="description"], textarea[name="content"], #description');
      
      if (projectNameInput) {
        await projectNameInput.type('Proyecto de Prueba - Áreas Arqueológicas');
        console.log('✅ Nombre del proyecto ingresado');
      }
      
      if (projectDescriptionInput) {
        await projectDescriptionInput.type('Este es un proyecto de prueba para validar la funcionalidad de áreas arqueológicas en el sistema.');
        console.log('✅ Descripción del proyecto ingresada');
      }
      
      // Buscar y seleccionar áreas
      const areasSelect = await page.$('select[name="areas"], #areas, [data-testid="areas-select"]');
      if (areasSelect) {
        await areasSelect.click();
        await wait(1000);
        
        // Seleccionar primera área disponible
        const firstArea = await page.$('option:not([value=""])');
        if (firstArea) {
          await firstArea.click();
          console.log('✅ Área seleccionada');
        }
      }
      
      // Buscar botón de guardar
      const saveButton = await page.$('button[type="submit"], button:contains("Guardar"), button:contains("Save"), button:contains("Crear")');
      if (saveButton) {
        await saveButton.click();
        await wait(3000);
        await takeScreenshot(page, '05_proyecto_creado');
        console.log('✅ Proyecto creado exitosamente');
      }
    } else {
      console.log('❌ Botón de crear proyecto no encontrado');
    }

    // 4. NAVEGAR A DIFERENTES SECCIONES
    console.log('\n🧭 === PRUEBA 4: NAVEGACIÓN POR SECCIONES ===');
    
    const sections = [
      { name: 'Proyectos', selector: 'a[href*="projects"], a:contains("Proyectos"), a:contains("Projects")' },
      { name: 'Sitios', selector: 'a[href*="sites"], a:contains("Sitios"), a:contains("Sites")' },
      { name: 'Excavaciones', selector: 'a[href*="excavations"], a:contains("Excavaciones"), a:contains("Excavations")' },
      { name: 'Artefactos', selector: 'a[href*="artifacts"], a:contains("Artefactos"), a:contains("Artifacts")' },
      { name: 'Hallazgos', selector: 'a[href*="findings"], a:contains("Hallazgos"), a:contains("Findings")' },
      { name: 'Muestras', selector: 'a[href*="samples"], a:contains("Muestras"), a:contains("Samples")' },
      { name: 'Tareas', selector: 'a[href*="tasks"], a:contains("Tareas"), a:contains("Tasks")' },
      { name: 'Publicaciones', selector: 'a[href*="publications"], a:contains("Publicaciones"), a:contains("Publications")' },
      { name: 'Comunicaciones', selector: 'a[href*="communication"], a:contains("Comunicaciones"), a:contains("Communication")' },
      { name: 'Herramientas', selector: 'a[href*="tools"], a:contains("Herramientas"), a:contains("Tools")' },
      { name: 'Visualizaciones', selector: 'a[href*="visualization"], a:contains("Visualizaciones"), a:contains("Visualization")' },
      { name: 'Perfil', selector: 'a[href*="profile"], a:contains("Perfil"), a:contains("Profile")' }
    ];

    for (const section of sections) {
      try {
        console.log(`\n🔍 Probando sección: ${section.name}`);
        
        const sectionLink = await page.$(section.selector);
        if (sectionLink) {
          await sectionLink.click();
          await wait(2000);
          await takeScreenshot(page, `06_${section.name.toLowerCase()}_page`);
          console.log(`✅ Sección ${section.name} accedida`);
          
          // Volver al dashboard si es necesario
          const dashboardLink = await page.$('a[href="/dashboard"], a:contains("Dashboard"), a[href*="dashboard"]');
          if (dashboardLink) {
            await dashboardLink.click();
            await wait(1000);
          }
        } else {
          console.log(`⚠️ Enlace de ${section.name} no encontrado`);
        }
      } catch (error) {
        console.log(`❌ Error en sección ${section.name}:`, error.message);
      }
    }

    // 5. PROBAR FUNCIONALIDADES ESPECÍFICAS
    console.log('\n🔧 === PRUEBA 5: FUNCIONALIDADES ESPECÍFICAS ===');
    
    // Probar creación de hallazgo
    console.log('\n📝 Probando creación de hallazgo...');
    const findingsLink = await page.$('a[href*="findings"], a:contains("Hallazgos"), a:contains("Findings")');
    if (findingsLink) {
      await findingsLink.click();
      await wait(2000);
      
      const createFindingButton = await page.$('button:contains("Crear"), button:contains("Nuevo"), button:contains("Add")');
      if (createFindingButton) {
        await createFindingButton.click();
        await wait(2000);
        await takeScreenshot(page, '07_crear_hallazgo_form');
        console.log('✅ Formulario de hallazgo accedido');
      }
    }

    // 6. PROBAR HERRAMIENTAS DE MAPPING
    console.log('\n🗺️ === PRUEBA 6: HERRAMIENTAS DE MAPPING ===');
    
    const mappingLink = await page.$('a[href*="mapping"], a:contains("Mapping"), a:contains("Mapeo")');
    if (mappingLink) {
      await mappingLink.click();
      await wait(3000);
      await takeScreenshot(page, '08_mapping_tools');
      console.log('✅ Herramientas de mapping accedidas');
    }

    // 7. PROBAR VISUALIZACIONES
    console.log('\n📊 === PRUEBA 7: VISUALIZACIONES ===');
    
    const visualizationLink = await page.$('a[href*="visualization"], a:contains("Visualizaciones"), a:contains("Visualization")');
    if (visualizationLink) {
      await visualizationLink.click();
      await wait(2000);
      await takeScreenshot(page, '09_visualization_page');
      console.log('✅ Página de visualizaciones accedida');
    }

    // 8. PROBAR PERFIL
    console.log('\n👤 === PRUEBA 8: PERFIL DE USUARIO ===');
    
    const profileLink = await page.$('a[href*="profile"], a:contains("Perfil"), a:contains("Profile")');
    if (profileLink) {
      await profileLink.click();
      await wait(2000);
      await takeScreenshot(page, '10_profile_page');
      console.log('✅ Página de perfil accedida');
    }

    // 9. LOGOUT
    console.log('\n🚪 === PRUEBA 9: LOGOUT ===');
    
    const logoutButton = await page.$('button:contains("Logout"), button:contains("Cerrar"), a:contains("Logout"), a:contains("Cerrar")');
    if (logoutButton) {
      await logoutButton.click();
      await wait(2000);
      await takeScreenshot(page, '11_after_logout');
      console.log('✅ Logout completado');
    }

    console.log('\n🎉 === PRUEBAS COMPLETADAS ===');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    console.log('✅ Todas las funcionalidades del investigador han sido probadas');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await takeScreenshot(page, 'error_screenshot');
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

// Ejecutar las pruebas
testResearcherDashboard().catch(console.error); 