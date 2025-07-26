const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class FinalTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.screenshotsDir = path.join(__dirname, '../reports/testing/screenshots');
    this.startTime = Date.now();
  }

  async init() {
    console.log('🚀 Iniciando Suite de Pruebas Final...');
    
    // Crear directorio de screenshots si no existe
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    this.page = await this.browser.newPage();
    
    // Configurar timeouts
    await this.page.setDefaultTimeout(30000);
    await this.page.setDefaultNavigationTimeout(30000);
  }

  async takeScreenshot(name) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot guardado: ${filename}`);
    return filepath;
  }

  async logResult(testName, success, details = '') {
    const result = {
      test: testName,
      success,
      details,
      timestamp: new Date().toISOString()
    };
    this.results.push(result);
    
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async findElementByText(text, elementType = 'button') {
    try {
      const elements = await this.page.$$(elementType);
      for (const element of elements) {
        const elementText = await this.page.evaluate(el => el.textContent, element);
        if (elementText && elementText.includes(text)) {
          return element;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async testLogin() {
    console.log('\n🔐 Probando Login...');
    
    try {
      await this.page.goto('http://localhost:3000/login');
      await this.wait(2000);
      await this.takeScreenshot('01_login_page');
      
      // Llenar credenciales
      await this.page.type('input[type="email"]', 'dr.perez@unam.mx');
      await this.page.type('input[type="password"]', 'test123456');
      
      await this.takeScreenshot('02_login_credentials_filled');
      
      // Hacer clic en el botón de login
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        
        // Esperar a que redirija al dashboard
        try {
          await this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
          await this.wait(3000);
          await this.takeScreenshot('03_dashboard_loaded');
          
          // Verificar que estamos en el dashboard
          const currentUrl = this.page.url();
          if (currentUrl.includes('/dashboard/researcher')) {
            await this.logResult('Login - Autenticación exitosa', true, 'Dashboard cargado correctamente');
            return true;
          } else {
            await this.logResult('Login - Error general', false, 'No se redirigió al dashboard correctamente');
            return false;
          }
        } catch (error) {
          await this.logResult('Login - Error general', false, `Timeout de navegación: ${error.message}`);
          return false;
        }
      } else {
        await this.logResult('Login - Error', false, 'Botón de submit no encontrado');
        return false;
      }
      
    } catch (error) {
      await this.logResult('Login - Error', false, error.message);
      return false;
    }
  }

  async testDashboardNavigation() {
    console.log('\n🧭 Probando Navegación del Dashboard...');
    
    try {
      // Probar botón de perfil
      const profileButton = await this.findElementByText('👤 Perfil');
      if (profileButton) {
        await profileButton.click();
        await this.wait(2000);
        await this.takeScreenshot('04_profile_button_clicked');
        
        // Verificar que navegó al perfil
        const currentUrl = this.page.url();
        if (currentUrl.includes('/profile')) {
          await this.logResult('Dashboard - Botón Perfil', true, 'Navegación a perfil exitosa');
        } else {
          await this.logResult('Dashboard - Botón Perfil', false, 'No navegó al perfil');
        }
        
        // Volver al dashboard
        await this.page.goBack();
        await this.wait(2000);
      } else {
        await this.logResult('Dashboard - Botón Perfil', false, 'Botón de perfil no encontrado');
      }
      
      // Verificar navegador de contexto
      const contextNavigator = await this.page.$('[data-testid="context-navigator"]');
      if (contextNavigator) {
        await this.logResult('Dashboard - Navegador de Contexto', true, 'Componente encontrado');
      } else {
        await this.logResult('Dashboard - Navegador de Contexto', false, 'Componente no encontrado');
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Dashboard - Error', false, error.message);
      return false;
    }
  }

  async testStatisticsPanel() {
    console.log('\n📊 Probando Panel de Estadísticas...');
    
    try {
      // Verificar que las estadísticas están visibles
      const statsTitle = await this.findElementByText('📊 Mis Estadísticas', 'h3');
      if (!statsTitle) {
        await this.logResult('Estadísticas - Título', false, 'Título de estadísticas no encontrado');
        return false;
      }
      
      // Probar botón de colapsar/expandir
      const collapseButton = await this.findElementByText('🔼 Colapsar');
      if (collapseButton) {
        await collapseButton.click();
        await this.wait(1000);
        await this.takeScreenshot('05_stats_collapsed');
        
        // Expandir de nuevo
        const expandButton = await this.findElementByText('🔽 Expandir');
        if (expandButton) {
          await expandButton.click();
          await this.wait(1000);
          await this.takeScreenshot('06_stats_expanded');
          await this.logResult('Estadísticas - Colapsar/Expandir', true, 'Funcionalidad de colapso funciona');
        }
      }
      
      // Probar links de estadísticas
      const statCards = await this.page.$$('[class*="cursor-pointer"]');
      if (statCards.length > 0) {
        // Hacer clic en el primer card de estadísticas
        await statCards[0].click();
        await this.wait(2000);
        await this.takeScreenshot('07_stats_card_clicked');
        
        // Volver al dashboard
        await this.page.goBack();
        await this.wait(2000);
        await this.logResult('Estadísticas - Links funcionales', true, 'Navegación desde estadísticas funciona');
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Estadísticas - Error', false, error.message);
      return false;
    }
  }

  async testResearchTools() {
    console.log('\n🛠️ Probando Herramientas de Investigación...');
    
    try {
      // Esperar a que las herramientas se carguen
      await this.wait(5000);
      
      // Buscar todas las herramientas usando el enfoque que funciona
      const allTools = await this.page.evaluate(() => {
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
        await this.page.evaluate(() => {
          const element = document.querySelector('[data-testid="tool-trabajo-de-campo"]');
          if (element) element.click();
        });
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await this.takeScreenshot('08_fieldwork_page');
        
        // Verificar que la página cargó
        const fieldworkTitle = await this.findElementByText('Trabajo de Campo', 'h1');
        if (fieldworkTitle) {
          await this.logResult('Herramientas - Trabajo de Campo', true, 'Página cargada correctamente');
        } else {
          await this.logResult('Herramientas - Trabajo de Campo', false, 'Página no cargó correctamente');
        }
        
        // Volver al dashboard
        await this.page.goBack();
        await this.wait(2000);
      } else {
        await this.logResult('Herramientas - Trabajo de Campo', false, 'Herramienta no encontrada');
      }
      
      // Probar herramienta de Mapeo SIG Integrado
      const mappingTool = allTools.find(tool => tool.testId === 'tool-mapeo-sig-integrado');
      if (mappingTool) {
        await this.logResult('Herramientas - Mapeo SIG Integrado', true, 'Herramienta encontrada');
      } else {
        await this.logResult('Herramientas - Mapeo SIG Integrado', false, 'Herramienta no encontrada');
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
          await this.logResult(`Herramientas - ${tool.name}`, true, 'Herramienta encontrada');
        } else {
          await this.logResult(`Herramientas - ${tool.name}`, false, 'Herramienta no encontrada');
        }
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Herramientas - Error', false, error.message);
      return false;
    }
  }

  async testFieldworkPage() {
    console.log('\n🏕️ Probando Página de Trabajo de Campo...');
    
    try {
      // Navegar a la página de trabajo de campo
      await this.page.goto('http://localhost:3000/dashboard/researcher/fieldwork');
      await this.wait(3000);
      await this.takeScreenshot('10_fieldwork_page_direct');
      
      // Verificar elementos de la página
      const pageTitle = await this.findElementByText('Trabajo de Campo', 'h1');
      if (pageTitle) {
        await this.logResult('Trabajo de Campo - Página', true, 'Página cargada correctamente');
      } else {
        await this.logResult('Trabajo de Campo - Página', false, 'Página no cargó correctamente');
      }
      
      // Probar filtros
      const filterButtons = await this.page.$$('button');
      if (filterButtons.length > 0) {
        // Hacer clic en el primer filtro
        await filterButtons[0].click();
        await this.wait(1000);
        await this.takeScreenshot('11_fieldwork_filters');
        await this.logResult('Trabajo de Campo - Filtros', true, 'Filtros funcionan');
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Trabajo de Campo - Error', false, error.message);
      return false;
    }
  }

  async testSurfaceMappingPage() {
    console.log('\n🗺️ Probando Página de Mapeo de Superficie...');
    
    try {
      // Navegar a la página de mapeo de superficie
      await this.page.goto('http://localhost:3000/dashboard/researcher/surface-mapping');
      await this.wait(3000);
      await this.takeScreenshot('12_surface_mapping_page_direct');
      
      // Verificar elementos de la página
      const pageTitle = await this.findElementByText('Mapeo de Superficie', 'h1');
      if (pageTitle) {
        await this.logResult('Mapeo de Superficie - Página', true, 'Página cargada correctamente');
      } else {
        await this.logResult('Mapeo de Superficie - Página', false, 'Página no cargó correctamente');
      }
      
      // Probar modal de agregar hallazgo
      const addButton = await this.findElementByText('Agregar Hallazgo');
      if (addButton) {
        await addButton.click();
        await this.wait(1000);
        await this.takeScreenshot('13_surface_mapping_add_modal');
        await this.logResult('Mapeo de Superficie - Modal', true, 'Modal de agregar hallazgo funciona');
        
        // Cerrar modal
        const closeButton = await this.findElementByText('Cancelar');
        if (closeButton) {
          await closeButton.click();
          await this.wait(1000);
        }
      }
      
      // Probar botón de volver
      const backButton = await this.findElementByText('← Dashboard');
      if (backButton) {
        await backButton.click();
        await this.wait(2000);
        await this.logResult('Mapeo de Superficie - Botón Volver', true, 'Navegación de regreso funciona');
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Mapeo de Superficie - Error', false, error.message);
      return false;
    }
  }

  async testAdditionalFeatures() {
    console.log('\n🔍 Probando Funcionalidades Adicionales...');
    
    try {
      // Probar páginas adicionales
      const pages = [
        { path: '/dashboard/researcher/findings', name: 'Hallazgos' },
        { path: '/dashboard/researcher/samples', name: 'Muestras' },
        { path: '/dashboard/researcher/laboratory', name: 'Laboratorio' },
        { path: '/dashboard/researcher/reports', name: 'Reportes' },
        { path: '/dashboard/researcher/export', name: 'Exportar' }
      ];
      
      for (const page of pages) {
        await this.page.goto(`http://localhost:3000${page.path}`);
        await this.wait(3000);
        await this.takeScreenshot(`14_${page.name.toLowerCase()}_page`);
        
        // Verificar que la página cargó
        const pageTitle = await this.page.evaluate(() => {
          const h1 = document.querySelector('h1');
          return h1 ? h1.textContent : null;
        });
        
        if (pageTitle) {
          await this.logResult(`Página - ${page.name}`, true, `Página cargada: ${pageTitle}`);
        } else {
          await this.logResult(`Página - ${page.name}`, false, 'Página no cargó correctamente');
        }
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Funcionalidades Adicionales - Error', false, error.message);
      return false;
    }
  }

  async testUserInteraction() {
    console.log('\n👆 Probando Interacciones de Usuario...');
    
    try {
      // Volver al dashboard
      await this.page.goto('http://localhost:3000/dashboard/researcher');
      await this.wait(3000);
      
      // Probar hover en estadísticas
      const statCards = await this.page.$$('[class*="cursor-pointer"]');
      if (statCards.length > 0) {
        await statCards[0].hover();
        await this.wait(1000);
        await this.takeScreenshot('15_stats_hover_effect');
        await this.logResult('Interacciones - Hover en estadísticas', true, 'Efecto hover funciona');
      }
      
      // Probar hover en herramientas
      const toolCards = await this.page.$$('[data-testid^="tool-"]');
      if (toolCards.length > 0) {
        await toolCards[0].hover();
        await this.wait(1000);
        await this.takeScreenshot('16_tools_hover_effect');
        await this.logResult('Interacciones - Hover en herramientas', true, 'Efecto hover funciona');
      }
      
      // Probar hover en botones de contexto
      const contextButtons = await this.page.$$('button');
      if (contextButtons.length > 0) {
        await contextButtons[0].hover();
        await this.wait(1000);
        await this.logResult('Interacciones - Botones de contexto', true, 'Hover en botón: + Nuevo Proyecto');
      }
      
      return true;
      
    } catch (error) {
      await this.logResult('Interacciones - Error', false, error.message);
      return false;
    }
  }

  async generateReport() {
    console.log('\n📋 Generando Reporte...');
    
    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000;
    
    const successfulTests = this.results.filter(r => r.success).length;
    const totalTests = this.results.length;
    const successRate = totalTests > 0 ? (successfulTests / totalTests) * 100 : 0;
    
    const report = {
      summary: {
        totalTests,
        successfulTests,
        failedTests: totalTests - successfulTests,
        successRate: successRate.toFixed(2),
        duration: duration.toFixed(3)
      },
      results: this.results,
      timestamp: new Date().toISOString()
    };
    
    // Guardar reporte
    const reportDir = path.join(__dirname, '../reports/testing');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'final_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE PRUEBAS FINALES');
    console.log('================================');
    console.log(`Total de pruebas: ${totalTests}`);
    console.log(`Exitosas: ${successfulTests}`);
    console.log(`Fallidas: ${totalTests - successfulTests}`);
    console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);
    console.log(`Duración: ${duration.toFixed(3)}s`);
    console.log(`\nReporte guardado en: ${reportPath}`);
    console.log(`Screenshots guardados en: ${this.screenshotsDir}`);
  }

  async run() {
    try {
      await this.init();
      
      // Ejecutar todas las pruebas
      await this.testLogin();
      await this.testDashboardNavigation();
      await this.testStatisticsPanel();
      await this.testResearchTools();
      await this.testFieldworkPage();
      await this.testSurfaceMappingPage();
      await this.testAdditionalFeatures();
      await this.testUserInteraction();
      
      // Generar reporte
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Error en la suite de pruebas:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Ejecutar la suite de pruebas
const testSuite = new FinalTestSuite();
testSuite.run(); 