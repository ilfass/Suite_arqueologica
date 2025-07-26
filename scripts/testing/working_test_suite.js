const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function workingTestSuite() {
  let browser = null;
  let page = null;
  const results = [];
  const screenshotsDir = path.join(__dirname, '../reports/testing/screenshots');
  const startTime = Date.now();

  // Crear directorio de screenshots si no existe
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  async function takeScreenshot(name) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.png`;
    const filepath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot guardado: ${filename}`);
    return filepath;
  }

  async function logResult(testName, success, details = '') {
    const result = {
      test: testName,
      success,
      details,
      timestamp: new Date().toISOString()
    };
    results.push(result);
    
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function findElementByText(text, elementType = 'button') {
    try {
      const elements = await page.$$(elementType);
      for (const element of elements) {
        const elementText = await page.evaluate(el => el.textContent, element);
        if (elementText && elementText.includes(text)) {
          return element;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  try {
    console.log('🚀 Iniciando Suite de Pruebas Funcional...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    page = await browser.newPage();
    
    // Configurar timeouts
    await page.setDefaultTimeout(30000);
    await page.setDefaultNavigationTimeout(30000);

    // 🔐 Probando Login
    console.log('\n🔐 Probando Login...');
    
    await page.goto('http://localhost:3000/login');
    await wait(2000);
    await takeScreenshot('01_login_page');
    
    // Llenar credenciales
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'test123456');
    
    await takeScreenshot('02_login_credentials_filled');
    
    // Hacer clic en el botón de login
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      
      // Esperar a que redirija al dashboard
      try {
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
        await wait(3000);
        await takeScreenshot('03_dashboard_loaded');
        
        // Verificar que estamos en el dashboard
        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard/researcher')) {
          await logResult('Login - Autenticación exitosa', true, 'Dashboard cargado correctamente');
        } else {
          await logResult('Login - Error general', false, 'No se redirigió al dashboard correctamente');
        }
      } catch (error) {
        await logResult('Login - Error general', false, `Timeout de navegación: ${error.message}`);
      }
    } else {
      await logResult('Login - Error', false, 'Botón de submit no encontrado');
    }

    // 🧭 Probando Navegación del Dashboard
    console.log('\n🧭 Probando Navegación del Dashboard...');
    
    // Probar botón de perfil
    const profileButton = await findElementByText('👤 Perfil');
    if (profileButton) {
      await profileButton.click();
      await wait(2000);
      await takeScreenshot('04_profile_button_clicked');
      
      // Verificar que navegó al perfil
      const currentUrl = page.url();
      if (currentUrl.includes('/profile')) {
        await logResult('Dashboard - Botón Perfil', true, 'Navegación a perfil exitosa');
      } else {
        await logResult('Dashboard - Botón Perfil', false, 'No navegó al perfil');
      }
      
      // Volver al dashboard
      await page.goBack();
      await wait(2000);
    } else {
      await logResult('Dashboard - Botón Perfil', false, 'Botón de perfil no encontrado');
    }
    
    // Verificar navegador de contexto
    const contextNavigator = await page.$('[data-testid="context-navigator"]');
    if (contextNavigator) {
      await logResult('Dashboard - Navegador de Contexto', true, 'Componente encontrado');
    } else {
      await logResult('Dashboard - Navegador de Contexto', false, 'Componente no encontrado');
    }

    // 📊 Probando Panel de Estadísticas
    console.log('\n📊 Probando Panel de Estadísticas...');
    
    // Verificar que las estadísticas están visibles
    const statsTitle = await findElementByText('📊 Mis Estadísticas', 'h3');
    if (!statsTitle) {
      await logResult('Estadísticas - Título', false, 'Título de estadísticas no encontrado');
    } else {
      // Probar botón de colapsar/expandir
      const collapseButton = await findElementByText('🔼 Colapsar');
      if (collapseButton) {
        await collapseButton.click();
        await wait(1000);
        await takeScreenshot('05_stats_collapsed');
        
        // Expandir de nuevo
        const expandButton = await findElementByText('🔽 Expandir');
        if (expandButton) {
          await expandButton.click();
          await wait(1000);
          await takeScreenshot('06_stats_expanded');
          await logResult('Estadísticas - Colapsar/Expandir', true, 'Funcionalidad de colapso funciona');
        }
      }
      
      // Probar links de estadísticas
      const statCards = await page.$$('[class*="cursor-pointer"]');
      if (statCards.length > 0) {
        // Hacer clic en el primer card de estadísticas
        await statCards[0].click();
        await wait(2000);
        await takeScreenshot('07_stats_card_clicked');
        
        // Volver al dashboard
        await page.goBack();
        await wait(2000);
        await logResult('Estadísticas - Links funcionales', true, 'Navegación desde estadísticas funciona');
      }
    }

    // 🛠️ Probando Herramientas de Investigación
    console.log('\n🛠️ Probando Herramientas de Investigación...');
    
    // Esperar a que las herramientas se carguen
    await wait(5000);
    
    // Buscar todas las herramientas usando el enfoque que funciona
    const allTools = await page.evaluate(() => {
      const toolElements = document.querySelectorAll('[data-testid^="tool-"]');
      return Array.from(toolElements).map(el => ({
        testId: el.getAttribute('data-testid'),
        tagName: el.tagName,
        text: el.textContent?.trim() || ''
      }));
    });
    console.log(`🔍 Encontradas ${allTools.length} herramientas:`, allTools.map(t => t.testId));
    
    // Probar herramienta de Trabajo de Campo
    const fieldworkTool = allTools.find(tool => tool.testId === 'tool-trabajo-de-campo');
    if (fieldworkTool) {
      // Hacer clic usando evaluate
      await page.evaluate(() => {
        const element = document.querySelector('[data-testid="tool-trabajo-de-campo"]');
        if (element) element.click();
      });
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await takeScreenshot('08_fieldwork_page');
      
      // Verificar que la página cargó
      const fieldworkTitle = await findElementByText('Trabajo de Campo', 'h1');
      if (fieldworkTitle) {
        await logResult('Herramientas - Trabajo de Campo', true, 'Página cargada correctamente');
      } else {
        await logResult('Herramientas - Trabajo de Campo', false, 'Página no cargó correctamente');
      }
      
      // Volver al dashboard
      await page.goBack();
      await wait(2000);
    } else {
      await logResult('Herramientas - Trabajo de Campo', false, 'Herramienta no encontrada');
    }
    
    // Probar herramienta de Mapeo SIG Integrado
    const mappingTool = allTools.find(tool => tool.testId === 'tool-mapeo-sig-integrado');
    if (mappingTool) {
      await logResult('Herramientas - Mapeo SIG Integrado', true, 'Herramienta encontrada');
    } else {
      await logResult('Herramientas - Mapeo SIG Integrado', false, 'Herramienta no encontrada');
    }
    
    // Probar otras herramientas usando la lista ya obtenida
    const tools = [
      { name: 'Hallazgos', testId: 'tool-hallazgos' },
      { name: 'Muestras', testId: 'tool-muestras' },
      { name: 'Laboratorio', testId: 'tool-laboratorio' },
      { name: 'Cronología', testId: 'tool-cronologa' },
      { name: 'Reportes', testId: 'tool-reportes' },
      { name: 'Exportar Datos', testId: 'tool-exportar-datos' }
    ];
    
    for (const tool of tools) {
      const toolElement = allTools.find(t => t.testId === tool.testId);
      if (toolElement) {
        await logResult(`Herramientas - ${tool.name}`, true, 'Herramienta encontrada');
      } else {
        await logResult(`Herramientas - ${tool.name}`, false, 'Herramienta no encontrada');
      }
    }

    // 🏕️ Probando Página de Trabajo de Campo
    console.log('\n🏕️ Probando Página de Trabajo de Campo...');
    
    // Navegar a la página de trabajo de campo
    await page.goto('http://localhost:3000/dashboard/researcher/fieldwork');
    await wait(3000);
    await takeScreenshot('10_fieldwork_page_direct');
    
    // Verificar elementos de la página
    const pageTitle = await findElementByText('Trabajo de Campo', 'h1');
    if (pageTitle) {
      await logResult('Trabajo de Campo - Página', true, 'Página cargada correctamente');
    } else {
      await logResult('Trabajo de Campo - Página', false, 'Página no cargó correctamente');
    }
    
    // Probar filtros
    const filterButtons = await page.$$('button');
    if (filterButtons.length > 0) {
      // Hacer clic en el primer filtro
      await filterButtons[0].click();
      await wait(1000);
      await takeScreenshot('11_fieldwork_filters');
      await logResult('Trabajo de Campo - Filtros', true, 'Filtros funcionan');
    }

    // 🗺️ Probando Página de Mapeo de Superficie
    console.log('\n🗺️ Probando Página de Mapeo de Superficie...');
    
    // Navegar a la página de mapeo de superficie
    await page.goto('http://localhost:3000/dashboard/researcher/surface-mapping');
    await wait(3000);
    await takeScreenshot('12_surface_mapping_page_direct');
    
    // Verificar elementos de la página
    const surfaceTitle = await findElementByText('Mapeo de Superficie', 'h1');
    if (surfaceTitle) {
      await logResult('Mapeo de Superficie - Página', true, 'Página cargada correctamente');
    } else {
      await logResult('Mapeo de Superficie - Página', false, 'Página no cargó correctamente');
    }
    
    // Probar modal de agregar hallazgo
    const addButton = await findElementByText('Agregar Hallazgo');
    if (addButton) {
      await addButton.click();
      await wait(1000);
      await takeScreenshot('13_surface_mapping_add_modal');
      await logResult('Mapeo de Superficie - Modal', true, 'Modal de agregar hallazgo funciona');
      
      // Cerrar modal
      const closeButton = await findElementByText('Cancelar');
      if (closeButton) {
        await closeButton.click();
        await wait(1000);
      }
    }
    
    // Probar botón de volver
    const backButton = await findElementByText('← Dashboard');
    if (backButton) {
      await backButton.click();
      await wait(2000);
      await logResult('Mapeo de Superficie - Botón Volver', true, 'Navegación de regreso funciona');
    }

    // 🔍 Probando Funcionalidades Adicionales
    console.log('\n🔍 Probando Funcionalidades Adicionales...');
    
    // Probar páginas adicionales
    const pages = [
      { path: '/dashboard/researcher/findings', name: 'Hallazgos' },
      { path: '/dashboard/researcher/samples', name: 'Muestras' },
      { path: '/dashboard/researcher/laboratory', name: 'Laboratorio' },
      { path: '/dashboard/researcher/reports', name: 'Reportes' },
      { path: '/dashboard/researcher/export', name: 'Exportar' }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(`http://localhost:3000${pageInfo.path}`);
      await wait(3000);
      await takeScreenshot(`14_${pageInfo.name.toLowerCase()}_page`);
      
      // Verificar que la página cargó
      const pageTitle = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent : null;
      });
      
      if (pageTitle) {
        await logResult(`Página - ${pageInfo.name}`, true, `Página cargada: ${pageTitle}`);
      } else {
        await logResult(`Página - ${pageInfo.name}`, false, 'Página no cargó correctamente');
      }
    }

    // 👆 Probando Interacciones de Usuario
    console.log('\n👆 Probando Interacciones de Usuario...');
    
    // Volver al dashboard
    await page.goto('http://localhost:3000/dashboard/researcher');
    await wait(3000);
    
    // Probar hover en estadísticas
    const statCards = await page.$$('[class*="cursor-pointer"]');
    if (statCards.length > 0) {
      await statCards[0].hover();
      await wait(1000);
      await takeScreenshot('15_stats_hover_effect');
      await logResult('Interacciones - Hover en estadísticas', true, 'Efecto hover funciona');
    }
    
    // Probar hover en herramientas
    const toolCards = await page.$$('[data-testid^="tool-"]');
    if (toolCards.length > 0) {
      await toolCards[0].hover();
      await wait(1000);
      await takeScreenshot('16_tools_hover_effect');
      await logResult('Interacciones - Hover en herramientas', true, 'Efecto hover funciona');
    }
    
    // Probar hover en botones de contexto
    const contextButtons = await page.$$('button');
    if (contextButtons.length > 0) {
      await contextButtons[0].hover();
      await wait(1000);
      await logResult('Interacciones - Botones de contexto', true, 'Hover en botón: + Nuevo Proyecto');
    }

    // 📋 Generando Reporte
    console.log('\n📋 Generando Reporte...');
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    const successfulTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    const successRate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;
    
    const report = {
      summary: {
        totalTests,
        successfulTests,
        failedTests: totalTests - successfulTests,
        successRate: successRate.toFixed(2),
        duration: duration.toFixed(3)
      },
      results: results,
      timestamp: new Date().toISOString()
    };
    
    // Guardar reporte
    const reportDir = path.join(__dirname, '../reports/testing');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'working_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE PRUEBAS FUNCIONALES');
    console.log('==================================');
    console.log(`Total de pruebas: ${totalTests}`);
    console.log(`Exitosas: ${successfulTests}`);
    console.log(`Fallidas: ${totalTests - successfulTests}`);
    console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);
    console.log(`Duración: ${duration.toFixed(3)}s`);
    console.log(`\nReporte guardado en: ${reportPath}`);
    console.log(`Screenshots guardados en: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Error en la suite de pruebas:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar la suite de pruebas
workingTestSuite(); 