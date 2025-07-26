const puppeteer = require('puppeteer');

async function testFormularioSimple() {
  console.log('🧪 Iniciando prueba simplificada del formulario completo...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📱 Navegando al frontend...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Ir al login
    console.log('🔐 Navegando al login...');
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Buscar botón de login
    const buttons = await page.$$('button');
    let loginButton = null;
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && text.includes('Iniciar sesión')) {
        loginButton = button;
        break;
      }
    }
    
    if (!loginButton) {
      throw new Error('No se encontró el botón de login');
    }
    
    await loginButton.click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Login como investigador
    console.log('👤 Haciendo login como investigador...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'password123');
    
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
    }
    
    // Esperar a que cargue el dashboard
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar que estamos en el dashboard del investigador
    console.log('🏠 Verificando dashboard del investigador...');
    const h1Elements = await page.$$('h1');
    if (h1Elements.length > 0) {
      const title = await h1Elements[0].evaluate(el => el.textContent);
      console.log(`📋 Dashboard: ${title}`);
    }
    
    // Buscar botón "Crear Nuevo Proyecto"
    console.log('➕ Buscando botón "Crear Nuevo Proyecto"...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const allButtons = await page.$$('button');
    let createButton = null;
    for (const button of allButtons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && (text.includes('Crear') && text.includes('Proyecto'))) {
        createButton = button;
        console.log(`✅ Botón encontrado: ${text}`);
        break;
      }
    }
    
    if (!createButton) {
      throw new Error('No se pudo encontrar el botón "Crear Nuevo Proyecto"');
    }
    
    await createButton.click();
    console.log('✅ Clic en botón de crear proyecto');
    
    // Esperar a que aparezca el modal del formulario
    console.log('📝 Esperando que aparezca el formulario completo...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que el formulario completo esté presente
    console.log('🔍 Verificando secciones del formulario...');
    
    const secciones = [
      'Información Básica del Proyecto',
      'Ubicación y Contexto Geográfico',
      'Objetivos y Metodología',
      'Equipo y Responsabilidades',
      'Cronograma y Presupuesto',
      'Permisos y Autorizaciones',
      'Conservación y Gestión',
      'Difusión y Comunicación'
    ];
    
    for (const seccion of secciones) {
      try {
        const elements = await page.$$('h4');
        let found = false;
        for (const element of elements) {
          const text = await element.evaluate(el => el.textContent);
          if (text && text.includes(seccion)) {
            console.log(`✅ Sección encontrada: ${seccion}`);
            found = true;
            break;
          }
        }
        if (!found) {
          console.log(`❌ Sección no encontrada: ${seccion}`);
        }
      } catch (error) {
        console.log(`❌ Error buscando sección: ${seccion}`);
      }
    }
    
    // Llenar algunos campos básicos del formulario
    console.log('📝 Llenando formulario con datos básicos...');
    
    // Buscar y llenar campos
    const inputs = await page.$$('input');
    for (const input of inputs) {
      const placeholder = await input.evaluate(el => el.placeholder);
      if (placeholder && placeholder.includes('Proyecto Arqueológico')) {
        await input.type('Proyecto Arqueológico Teotihuacán - Temporada 2024');
        console.log('✅ Campo nombre del proyecto llenado');
        break;
      }
    }
    
    const textareas = await page.$$('textarea');
    for (const textarea of textareas) {
      const placeholder = await textarea.evaluate(el => el.placeholder);
      if (placeholder && placeholder.includes('Descripción')) {
        await textarea.type('Estudio integral del sitio arqueológico de Teotihuacán');
        console.log('✅ Campo descripción llenado');
        break;
      }
    }
    
    // Buscar botón de crear en el modal
    console.log('🚀 Buscando botón para crear proyecto...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const modalButtons = await page.$$('button');
    let createProjectButton = null;
    for (const button of modalButtons) {
      const text = await button.evaluate(el => el.textContent);
      if (text && (text.includes('Crear Proyecto') || text.includes('🏛️'))) {
        createProjectButton = button;
        console.log(`✅ Botón de crear encontrado: ${text}`);
        break;
      }
    }
    
    if (createProjectButton) {
      await createProjectButton.click();
      console.log('✅ Clic en botón de crear proyecto');
      
      // Esperar a que se procese
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar que el modal se cerró
      console.log('🔍 Verificando que el modal se cerró...');
      const modals = await page.$$('.fixed');
      if (modals.length === 0) {
        console.log('✅ Modal cerrado exitosamente');
      } else {
        console.log('⚠️ Modal aún visible');
      }
    } else {
      console.log('⚠️ No se encontró el botón de crear proyecto');
    }
    
    console.log('🎉 ¡Prueba del formulario completada!');
    
    // Tomar screenshot del resultado
    await page.screenshot({ 
      path: 'assets/screenshots/test_formulario_simple_result.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado en assets/screenshots/test_formulario_simple_result.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    
    // Tomar screenshot del error
    try {
      await page.screenshot({ 
        path: 'assets/screenshots/test_formulario_simple_error.png',
        fullPage: true 
      });
      console.log('📸 Screenshot del error guardado');
    } catch (screenshotError) {
      console.log('⚠️ No se pudo tomar screenshot del error');
    }
  } finally {
    await browser.close();
    console.log('🔚 Navegador cerrado');
  }
}

// Ejecutar la prueba
testFormularioSimple().catch(console.error); 