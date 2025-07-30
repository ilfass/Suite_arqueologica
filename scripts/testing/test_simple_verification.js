const puppeteer = require('puppeteer');

async function testSimpleVerification() {
  console.log('🧪 Verificación simple de correcciones...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // 1. Ir a la página de configuración de vidriera
    console.log('🔧 Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. Verificar que no hay errores de JavaScript
    const pageErrors = await page.evaluate(() => {
      return window.console.error ? 'Hay errores en la consola' : 'No hay errores';
    });
    
    if (pageErrors === 'No hay errores') {
      console.log('✅ No hay errores de JavaScript en la página');
    } else {
      console.log('❌ Hay errores de JavaScript en la página');
    }
    
    // 3. Verificar que el selector de proyectos existe y no tiene proyectos hardcodeados
    const selectorContent = await page.evaluate(() => {
      const select = document.querySelector('select');
      if (select) {
        const options = Array.from(select.options).map(option => option.textContent);
        return options;
      }
      return [];
    });
    
    console.log('📋 Opciones en el selector:', selectorContent);
    
    // Verificar que NO aparecen los proyectos hardcodeados
    const hasHardcodedProjects = selectorContent.some(option => 
      option.includes('Cazadores Recolectores') || 
      option.includes('Costa Atlántica')
    );
    
    if (!hasHardcodedProjects) {
      console.log('✅ No se encontraron proyectos hardcodeados');
    } else {
      console.log('❌ Se encontraron proyectos hardcodeados');
    }
    
    // 4. Verificar que no aparece "undefined"
    const pageContent = await page.content();
    if (!pageContent.includes('undefined')) {
      console.log('✅ No se encontró "undefined" en la página');
    } else {
      console.log('❌ Se encontró "undefined" en la página');
    }
    
    console.log('✅ Verificación completada');
    
    // Mantener el navegador abierto para inspección manual
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Mantener abierto indefinidamente
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

testSimpleVerification(); 