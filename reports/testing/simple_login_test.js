const puppeteer = require('puppeteer');

async function testLogin() {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Capturar todos los logs
  page.on('console', msg => console.log('Browser log:', msg.text()));
  page.on('pageerror', error => console.log('Browser error:', error.message));
  page.on('request', request => console.log('Request:', request.method(), request.url()));
  page.on('response', response => console.log('Response:', response.status(), response.url()));
  
  try {
    console.log('Navegando a login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    console.log('Esperando formulario...');
    await page.waitForSelector('form', { timeout: 5000 });
    
    console.log('Ingresando credenciales...');
    await page.type('input[type="email"]', 'fa07fa@gmail.com');
    await page.type('input[type="password"]', '3por39');
    
    console.log('Haciendo click en submit...');
    await page.click('button[type="submit"]');
    
    console.log('Esperando respuesta...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const url = page.url();
    console.log('URL final:', url);
    
    const pageContent = await page.evaluate(() => document.body.innerText);
    console.log('Contenido de la página:', pageContent.substring(0, 500));
    
    // Verificar si hay errores en la consola
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('Errores en consola:', consoleErrors);
    }
    
    // Verificar si hay mensajes de error específicos
    const errorElement = await page.$('.bg-red-50');
    if (errorElement) {
      const errorText = await errorElement.evaluate(el => el.innerText);
      console.log('Error específico en página:', errorText);
    }
    
    // Verificar el estado del localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    console.log('Token en localStorage:', token ? 'Presente' : 'Ausente');
    
  } catch (error) {
    console.error('Error en prueba:', error);
  } finally {
    await browser.close();
  }
}

testLogin(); 