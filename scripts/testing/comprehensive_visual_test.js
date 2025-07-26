const puppeteer = require('puppeteer');

class ComprehensiveVisualTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Configurar timeouts más largos
    await this.page.setDefaultTimeout(30000);
    await this.page.setDefaultNavigationTimeout(30000);
  }

  async log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    this.results.push({ timestamp, type, message });
  }

  async waitForElement(selector, timeout = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      await this.log(`Elemento no encontrado: ${selector}`, 'ERROR');
      return false;
    }
  }

  async findElementByText(text, elementType = 'button') {
    try {
      const elements = await this.page.$$(elementType);
      for (const element of elements) {
        const elementText = await element.evaluate(el => el.textContent);
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
    await this.log('=== INICIANDO PRUEBA DE LOGIN ===');
    
    try {
      await this.page.goto('http://localhost:3000/login');
      await this.log('Página de login cargada');
      
      // Esperar a que cargue el formulario
      await this.waitForElement('input[type="email"]');
      await this.waitForElement('input[type="password"]');
      
      // Ingresar credenciales
      await this.page.type('input[type="email"]', 'dr.perez@unam.mx');
      await this.page.type('input[type="password"]', 'test123456');
      
      // Hacer clic en el botón de login
      const submitButton = await this.findElementByText('Iniciar sesión', 'button');
      if (submitButton) {
        await submitButton.click();
        await this.log('Botón de login clickeado');
      } else {
        await this.log('Botón de login no encontrado', 'ERROR');
        return false;
      }
      
      // Esperar redirección al dashboard
      await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Verificar que estamos en el dashboard del investigador
      const currentUrl = this.page.url();
      if (currentUrl.includes('/dashboard/researcher')) {
        await this.log('Login exitoso - Redirigido al dashboard del investigador', 'SUCCESS');
        return true;
      } else {
        await this.log(`Login falló - URL actual: ${currentUrl}`, 'ERROR');
        return false;
      }
    } catch (error) {
      await this.log(`Error en login: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testDashboardNavigation() {
    await this.log('=== PROBANDO NAVEGACIÓN DEL DASHBOARD ===');
    
    try {
      // Verificar elementos principales del dashboard
      const elements = [
        'data-testid="researcher-dashboard"',
        'data-testid="dashboard-header"',
        'data-testid="context-navigator"',
        'data-testid="stats-section"',
        'data-testid="stats-title"'
      ];
      
      for (const element of elements) {
        const found = await this.waitForElement(`[${element}]`);
        if (found) {
          await this.log(`Elemento encontrado: ${element}`, 'SUCCESS');
        }
      }
      
      // Verificar estadísticas
      const statsElements = [
        'data-testid="stat-projects"',
        'data-testid="stat-areas"',
        'data-testid="stat-sites"',
        'data-testid="stat-fieldwork"',
        'data-testid="stat-findings"',
        'data-testid="stat-samples"',
        'data-testid="stat-analysis"',
        'data-testid="stat-chronologies"'
      ];
      
      for (const stat of statsElements) {
        const found = await this.waitForElement(`[${stat}]`);
        if (found) {
          await this.log(`Estadística encontrada: ${stat}`, 'SUCCESS');
        }
      }
      
      return true;
    } catch (error) {
      await this.log(`Error en navegación del dashboard: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testSidebarNavigation() {
    await this.log('=== PROBANDO NAVEGACIÓN DEL SIDEBAR ===');
    
    try {
      // Verificar sidebar
      await this.waitForElement('data-testid="sidebar"');
      await this.waitForElement('data-testid="sidebar-nav"');
      
      // Probar enlaces del investigador
      const researcherLinks = [
        { testid: 'nav-dashboard-researcher', expected: '/dashboard/researcher' },
        { testid: 'nav-dashboard-researcher-chronology', expected: '/dashboard/researcher/chronology' },
        { testid: 'nav-dashboard-researcher-laboratory', expected: '/dashboard/researcher/laboratory' }
      ];
      
      for (const link of researcherLinks) {
        try {
          await this.page.click(`[data-testid="${link.testid}"]`);
          await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
          
          const currentUrl = this.page.url();
          if (currentUrl.includes(link.expected)) {
            await this.log(`Navegación exitosa a: ${link.expected}`, 'SUCCESS');
          } else {
            await this.log(`Navegación falló - esperado: ${link.expected}, actual: ${currentUrl}`, 'ERROR');
          }
          
          // Volver al dashboard principal
          await this.page.goto('http://localhost:3000/dashboard/researcher');
          await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
          
        } catch (error) {
          await this.log(`Error navegando a ${link.expected}: ${error.message}`, 'ERROR');
        }
      }
      
      return true;
    } catch (error) {
      await this.log(`Error en navegación del sidebar: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async testNewPages() {
    await this.log('=== PROBANDO NUEVAS PÁGINAS ===');
    
    const pages = [
      {
        name: 'Cronologías',
        url: '/dashboard/researcher/chronology',
        elements: ['h1', 'table', 'button']
      },
      {
        name: 'Laboratorio',
        url: '/dashboard/researcher/laboratory',
        elements: ['h1', 'table', 'button']
      },
      {
        name: 'Informes',
        url: '/dashboard/researcher/reports',
        elements: ['h1', 'table', 'button']
      }
    ];
    
    for (const page of pages) {
      try {
        await this.log(`Probando página: ${page.name}`);
        await this.page.goto(`http://localhost:3000${page.url}`);
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        // Verificar elementos básicos
        for (const element of page.elements) {
          const found = await this.page.$(element);
          if (found) {
            await this.log(`Elemento ${element} encontrado en ${page.name}`, 'SUCCESS');
          } else {
            await this.log(`Elemento ${element} no encontrado en ${page.name}`, 'ERROR');
          }
        }
        
        // Probar botón "Nuevo" si existe
        const newButton = await this.findElementByText('Nuevo');
        if (newButton) {
          await this.log(`Botón "Nuevo" encontrado en ${page.name}`, 'SUCCESS');
          await newButton.click();
          
          // Verificar que aparece el modal
          const modal = await this.page.$('.fixed.inset-0');
          if (modal) {
            await this.log(`Modal de formulario aparece en ${page.name}`, 'SUCCESS');
            
            // Cerrar modal
            const closeButton = await this.findElementByText('Cancelar');
            if (closeButton) {
              await closeButton.click();
              await this.log(`Modal cerrado en ${page.name}`, 'SUCCESS');
            }
          }
        }
        
      } catch (error) {
        await this.log(`Error probando ${page.name}: ${error.message}`, 'ERROR');
      }
    }
  }

  async testStatisticsNavigation() {
    await this.log('=== PROBANDO NAVEGACIÓN DESDE ESTADÍSTICAS ===');
    
    try {
      await this.page.goto('http://localhost:3000/dashboard/researcher');
      await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Probar clic en estadísticas
      const statsToTest = [
        { testid: 'stat-chronologies', expectedUrl: '/dashboard/researcher/chronology' },
        { testid: 'stat-analysis', expectedUrl: '/dashboard/researcher/laboratory' }
      ];
      
      for (const stat of statsToTest) {
        try {
          const statElement = await this.page.$(`[data-testid="${stat.testid}"]`);
          if (statElement) {
            await statElement.click();
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            
            const currentUrl = this.page.url();
            if (currentUrl.includes(stat.expectedUrl)) {
              await this.log(`Navegación desde estadística exitosa: ${stat.testid}`, 'SUCCESS');
            } else {
              await this.log(`Navegación desde estadística falló: ${stat.testid}`, 'ERROR');
            }
            
            // Volver al dashboard
            await this.page.goto('http://localhost:3000/dashboard/researcher');
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
          }
        } catch (error) {
          await this.log(`Error probando estadística ${stat.testid}: ${error.message}`, 'ERROR');
        }
      }
      
    } catch (error) {
      await this.log(`Error en navegación de estadísticas: ${error.message}`, 'ERROR');
    }
  }

  async testToolsButtons() {
    await this.log('=== PROBANDO BOTONES DE HERRAMIENTAS ===');
    
    try {
      await this.page.goto('http://localhost:3000/dashboard/researcher');
      await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Probar botones de herramientas
      const buttons = [
        { text: 'Nuevo Hallazgo', shouldOpenModal: true },
        { text: 'Nuevo Informe', shouldOpenModal: true },
        { text: 'Ver Informes', shouldNavigate: true }
      ];
      
      for (const button of buttons) {
        try {
          const buttonElement = await this.findElementByText(button.text);
          if (buttonElement) {
            await this.log(`Botón encontrado: ${button.text}`, 'SUCCESS');
            await buttonElement.click();
            
            if (button.shouldOpenModal) {
              // Verificar modal
              await new Promise(resolve => setTimeout(resolve, 1000));
              const modal = await this.page.$('.fixed.inset-0');
              if (modal) {
                await this.log(`Modal abierto para: ${button.text}`, 'SUCCESS');
                
                // Cerrar modal
                const closeButton = await this.findElementByText('Cancelar');
                if (closeButton) {
                  await closeButton.click();
                  await this.log(`Modal cerrado para: ${button.text}`, 'SUCCESS');
                }
              }
            } else if (button.shouldNavigate) {
              await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
              const currentUrl = this.page.url();
              if (currentUrl.includes('/reports')) {
                await this.log(`Navegación exitosa para: ${button.text}`, 'SUCCESS');
                await this.page.goto('http://localhost:3000/dashboard/researcher');
                await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
              }
            }
          } else {
            await this.log(`Botón no encontrado: ${button.text}`, 'ERROR');
          }
        } catch (error) {
          await this.log(`Error probando botón ${button.text}: ${error.message}`, 'ERROR');
        }
      }
      
    } catch (error) {
      await this.log(`Error en botones de herramientas: ${error.message}`, 'ERROR');
    }
  }

  async runAllTests() {
    await this.log('🚀 INICIANDO PRUEBA VISUAL EXHAUSTIVA');
    
    try {
      await this.init();
      
      const tests = [
        { name: 'Login', test: () => this.testLogin() },
        { name: 'Dashboard Navigation', test: () => this.testDashboardNavigation() },
        { name: 'Sidebar Navigation', test: () => this.testSidebarNavigation() },
        { name: 'New Pages', test: () => this.testNewPages() },
        { name: 'Statistics Navigation', test: () => this.testStatisticsNavigation() },
        { name: 'Tools Buttons', test: () => this.testToolsButtons() }
      ];
      
      for (const test of tests) {
        await this.log(`\n📋 Ejecutando: ${test.name}`);
        await test.test();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa entre tests
      }
      
      await this.log('\n✅ PRUEBA VISUAL COMPLETADA');
      await this.log(`📊 Total de resultados: ${this.results.length}`);
      
      const errors = this.results.filter(r => r.type === 'ERROR').length;
      const successes = this.results.filter(r => r.type === 'SUCCESS').length;
      
      await this.log(`✅ Éxitos: ${successes}`);
      await this.log(`❌ Errores: ${errors}`);
      
    } catch (error) {
      await this.log(`Error fatal en la prueba: ${error.message}`, 'ERROR');
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Ejecutar la prueba
const test = new ComprehensiveVisualTest();
test.runAllTests().catch(console.error); 