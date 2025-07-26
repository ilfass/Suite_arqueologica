const puppeteer = require('puppeteer');

class SimpleVisualTest {
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
    
    await this.page.setDefaultTimeout(15000);
    await this.page.setDefaultNavigationTimeout(15000);
  }

  async log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
    this.results.push({ timestamp, type, message });
  }

  async testBasicPages() {
    await this.log('🚀 INICIANDO PRUEBA VISUAL SIMPLE');
    
    try {
      await this.init();
      
      // Probar página principal
      await this.log('Probando página principal...');
      await this.page.goto('http://localhost:3000');
      await this.page.waitForSelector('h1', { timeout: 10000 });
      await this.log('✅ Página principal cargada correctamente', 'SUCCESS');
      
      // Probar página de login
      await this.log('Probando página de login...');
      await this.page.goto('http://localhost:3000/login');
      await this.page.waitForSelector('form', { timeout: 10000 });
      await this.log('✅ Página de login cargada correctamente', 'SUCCESS');
      
      // Probar login
      await this.log('Probando login...');
      await this.page.type('input[type="email"]', 'dr.perez@unam.mx');
      await this.page.type('input[type="password"]', 'test123456');
      
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        const currentUrl = this.page.url();
        if (currentUrl.includes('/dashboard/researcher')) {
          await this.log('✅ Login exitoso', 'SUCCESS');
        } else {
          await this.log(`❌ Login falló - URL: ${currentUrl}`, 'ERROR');
        }
      } else {
        await this.log('❌ Botón de submit no encontrado', 'ERROR');
      }
      
      // Probar nuevas páginas
      const newPages = [
        { name: 'Cronologías', url: '/dashboard/researcher/chronology' },
        { name: 'Laboratorio', url: '/dashboard/researcher/laboratory' },
        { name: 'Informes', url: '/dashboard/researcher/reports' }
      ];
      
      for (const page of newPages) {
        await this.log(`Probando página: ${page.name}`);
        try {
          await this.page.goto(`http://localhost:3000${page.url}`);
          await this.page.waitForSelector('h1', { timeout: 10000 });
          await this.log(`✅ ${page.name} cargada correctamente`, 'SUCCESS');
        } catch (error) {
          await this.log(`❌ Error cargando ${page.name}: ${error.message}`, 'ERROR');
        }
      }
      
      await this.log('✅ PRUEBA VISUAL SIMPLE COMPLETADA', 'SUCCESS');
      
    } catch (error) {
      await this.log(`❌ Error fatal: ${error.message}`, 'ERROR');
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Ejecutar la prueba
const test = new SimpleVisualTest();
test.testBasicPages().catch(console.error); 