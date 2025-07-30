const puppeteer = require('puppeteer');

async function testLoginSimple() {
  console.log('🧪 Prueba simple de login...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    
    // Ir a la página de login
    console.log('📄 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Tomar screenshot para ver qué hay en la página
    await page.screenshot({ path: 'scripts/testing/login_page.png' });
    console.log('📸 Screenshot guardado en scripts/testing/login_page.png');
    
    // Listar todos los inputs en la página
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(input => ({
        type: input.type,
        placeholder: input.placeholder,
        name: input.name,
        id: input.id
      }));
    });
    
    console.log('📋 Inputs encontrados:', inputs);
    
    console.log('✅ Prueba completada');
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Keep browser open
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testLoginSimple(); 