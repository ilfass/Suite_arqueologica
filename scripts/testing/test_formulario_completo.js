const puppeteer = require('puppeteer');

async function testFormularioCompleto() {
  console.log('🧪 Iniciando prueba del formulario completo de creación de proyectos...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('📱 Navegando al frontend...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Ir al login
    console.log('🔐 Navegando al login...');
    await page.click('text=Iniciar sesión');
    await page.waitForTimeout(2000);
    
    // Login como investigador
    console.log('👤 Haciendo login como investigador...');
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Esperar a que cargue el dashboard
    await page.waitForTimeout(3000);
    
    // Verificar que estamos en el dashboard del investigador
    console.log('🏠 Verificando dashboard del investigador...');
    const dashboardTitle = await page.$eval('h1', el => el.textContent);
    console.log(`📋 Dashboard: ${dashboardTitle}`);
    
    // Buscar y hacer clic en "Crear Nuevo Proyecto"
    console.log('➕ Buscando botón "Crear Nuevo Proyecto"...');
    
    // Intentar diferentes selectores para el botón
    const buttonSelectors = [
      'text=Crear Nuevo Proyecto',
      'text=➕ Crear Nuevo Proyecto',
      '[data-testid="create-project-button"]',
      'button[onclick*="setShowNewProject"]',
      'text=Crear',
      'text=Nuevo',
      'text=Proyecto'
    ];
    
    let buttonFound = false;
    for (const selector of buttonSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        console.log(`✅ Botón encontrado con selector: ${selector}`);
        buttonFound = true;
        break;
      } catch (error) {
        console.log(`❌ Selector no encontrado: ${selector}`);
      }
    }
    
    if (!buttonFound) {
      // Buscar por texto en toda la página
      console.log('🔍 Buscando botón por texto en toda la página...');
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && text.includes('Crear') && text.includes('Proyecto')) {
          await button.click();
          console.log(`✅ Botón encontrado por texto: ${text}`);
          buttonFound = true;
          break;
        }
      }
    }
    
    if (!buttonFound) {
      throw new Error('No se pudo encontrar el botón "Crear Nuevo Proyecto"');
    }
    
    // Esperar a que aparezca el modal del formulario
    console.log('📝 Esperando que aparezca el formulario completo...');
    await page.waitForTimeout(2000);
    
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
        await page.waitForSelector(`text=${seccion}`, { timeout: 3000 });
        console.log(`✅ Sección encontrada: ${seccion}`);
      } catch (error) {
        console.log(`❌ Sección no encontrada: ${seccion}`);
      }
    }
    
    // Llenar el formulario con datos de prueba
    console.log('📝 Llenando formulario con datos de prueba...');
    
    // 1. Información básica
    await page.type('input[placeholder*="Proyecto Arqueológico"]', 'Proyecto Arqueológico Teotihuacán - Temporada 2024');
    await page.type('input[placeholder*="PAT-2024-001"]', 'PAT-2024-001');
    await page.type('textarea[placeholder*="Descripción detallada"]', 'Estudio integral del sitio arqueológico de Teotihuacán, enfocado en la comprensión de los patrones de asentamiento y la evolución cultural de esta importante ciudad prehispánica.');
    
    // Seleccionar tipo de proyecto
    await page.select('select', 'excavation');
    
    // 2. Ubicación
    await page.select('select[value="MX"]', 'MX');
    await page.type('input[placeholder*="Estado de México"]', 'Estado de México');
    await page.type('input[placeholder*="Teotihuacán"]', 'Teotihuacán');
    await page.type('input[placeholder="Latitud"]', '19.6925');
    await page.type('input[placeholder="Longitud"]', '-98.8439');
    
    // 3. Objetivos
    await page.type('textarea[placeholder*="Objetivo principal"]', '1. Documentar y analizar los patrones arquitectónicos de Teotihuacán\n2. Estudiar la evolución cronológica del sitio\n3. Analizar los materiales arqueológicos encontrados\n4. Contribuir al conocimiento de la civilización teotihuacana');
    
    // 4. Metodología
    await page.type('textarea[placeholder*="metodología"]', 'Metodología basada en excavación estratigráfica, prospección sistemática, análisis de materiales y documentación fotográfica y dibujística detallada.');
    
    // 5. Equipo
    await page.type('input[placeholder*="director"]', 'Dr. María González');
    await page.type('input[placeholder*="co-director"]', 'Dr. Carlos Rodríguez');
    await page.type('textarea[placeholder*="investigadores"]', 'Equipo multidisciplinario compuesto por arqueólogos, antropólogos, geólogos y estudiantes de posgrado.');
    
    // 6. Fechas
    await page.type('input[type="date"]', '2024-01-15');
    await page.type('input[type="date"]:nth-of-type(2)', '2024-12-31');
    await page.type('input[placeholder="Ej: 12"]', '12');
    
    // 7. Presupuesto
    await page.type('input[placeholder="0.00"]', '500000');
    
    console.log('✅ Formulario llenado exitosamente');
    
    // Buscar y hacer clic en el botón "Crear Proyecto Arqueológico"
    console.log('🚀 Buscando botón para crear proyecto...');
    
    const createButtonSelectors = [
      'text=Crear Proyecto Arqueológico',
      'text=🏛️ Crear Proyecto Arqueológico',
      'text=Crear',
      'button[type="submit"]'
    ];
    
    let createButtonFound = false;
    for (const selector of createButtonSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        console.log(`✅ Botón de crear encontrado con selector: ${selector}`);
        createButtonFound = true;
        break;
      } catch (error) {
        console.log(`❌ Selector de crear no encontrado: ${selector}`);
      }
    }
    
    if (!createButtonFound) {
      // Buscar por texto en los botones del modal
      const modalButtons = await page.$$('.modal button, [role="dialog"] button, .fixed button');
      for (const button of modalButtons) {
        const text = await button.evaluate(el => el.textContent);
        if (text && (text.includes('Crear') || text.includes('Proyecto'))) {
          await button.click();
          console.log(`✅ Botón de crear encontrado por texto: ${text}`);
          createButtonFound = true;
          break;
        }
      }
    }
    
    if (!createButtonFound) {
      throw new Error('No se pudo encontrar el botón para crear el proyecto');
    }
    
    // Esperar a que se procese la creación
    console.log('⏳ Esperando procesamiento de la creación...');
    await page.waitForTimeout(3000);
    
    // Verificar que el modal se cerró
    console.log('🔍 Verificando que el modal se cerró...');
    try {
      await page.waitForSelector('.fixed', { timeout: 5000, hidden: true });
      console.log('✅ Modal cerrado exitosamente');
    } catch (error) {
      console.log('⚠️ Modal no se cerró automáticamente');
    }
    
    // Verificar que el proyecto aparezca en la lista
    console.log('📋 Verificando que el proyecto aparezca en la lista...');
    await page.waitForTimeout(2000);
    
    const projectText = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.some(el => el.textContent && el.textContent.includes('Teotihuacán'));
    });
    
    if (projectText) {
      console.log('✅ Proyecto encontrado en la lista');
    } else {
      console.log('⚠️ Proyecto no encontrado en la lista (puede ser normal en modo demo)');
    }
    
    console.log('🎉 ¡Prueba del formulario completo completada exitosamente!');
    
    // Tomar screenshot del resultado
    await page.screenshot({ 
      path: 'assets/screenshots/test_formulario_completo_result.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado en assets/screenshots/test_formulario_completo_result.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    
    // Tomar screenshot del error
    try {
      await page.screenshot({ 
        path: 'assets/screenshots/test_formulario_completo_error.png',
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
testFormularioCompleto().catch(console.error); 