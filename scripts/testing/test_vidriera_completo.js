const puppeteer = require('puppeteer');

async function testVidrieraCompleto() {
  console.log('🧪 Probando vidriera pública completa...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Ir directamente a la vidriera pública
    console.log('📄 Navegando a la vidriera pública...');
    await page.goto('http://localhost:3000/public/investigator/test-user-id');
    
    // Esperar a que cargue el contenido
    console.log('⏳ Esperando a que cargue el contenido...');
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Verificar que la página carga correctamente
    const pageTitle = await page.title();
    console.log('📋 Título de la página:', pageTitle);
    
    // Verificar que no hay errores de React
    const pageContent = await page.content();
    if (pageContent.includes('Error: The default export is not a React Component')) {
      console.log('❌ Error de React detectado');
    } else {
      console.log('✅ No se detectaron errores de React');
    }
    
    // Verificar que se muestra el contenido del investigador
    const investigatorName = await page.evaluate(() => {
      const nameElement = document.querySelector('h1');
      return nameElement ? nameElement.textContent : null;
    });
    
    if (investigatorName) {
      console.log('✅ Nombre del investigador encontrado:', investigatorName);
    } else {
      console.log('❌ No se encontró el nombre del investigador');
    }
    
    // Verificar las pestañas
    const tabs = await page.evaluate(() => {
      const tabElements = document.querySelectorAll('button');
      return Array.from(tabElements).map(btn => btn.textContent);
    });
    
    console.log('📋 Pestañas encontradas:', tabs);
    
    // Verificar proyectos
    const projects = await page.evaluate(() => {
      const projectElements = document.querySelectorAll('[class*="grid"] [class*="p-6"]');
      return projectElements.length;
    });
    
    console.log('📋 Proyectos encontrados:', projects);
    
    // Hacer clic en la pestaña de publicaciones
    console.log('📚 Cambiando a pestaña de publicaciones...');
    await page.click('button:has-text("📚 Publicaciones")');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar publicaciones
    const publications = await page.evaluate(() => {
      const pubElements = document.querySelectorAll('[class*="space-y-4"] [class*="p-6"]');
      return pubElements.length;
    });
    
    console.log('📚 Publicaciones encontradas:', publications);
    
    // Hacer clic en la pestaña de acerca de
    console.log('ℹ️ Cambiando a pestaña de acerca de...');
    await page.click('button:has-text("ℹ️ Acerca de")');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar información de contacto
    const contactInfo = await page.evaluate(() => {
      const emailElement = document.querySelector('div:has-text("Email:")');
      return emailElement ? emailElement.textContent : null;
    });
    
    if (contactInfo) {
      console.log('✅ Información de contacto encontrada:', contactInfo);
    } else {
      console.log('❌ No se encontró información de contacto');
    }
    
    console.log('✅ Prueba de vidriera completada exitosamente');
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Mantener abierto
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testVidrieraCompleto(); 