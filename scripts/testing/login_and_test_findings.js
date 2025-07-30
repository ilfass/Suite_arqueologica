const puppeteer = require('puppeteer');
const path = require('path');

async function loginAndTestFindings() {
  console.log('🧪 Login y prueba de la página de hallazgos...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Navegar a la página de login
    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Llenar credenciales
    console.log('🔑 Llenando credenciales...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'password123');
    
    // Hacer clic en login
    console.log('🚀 Iniciando sesión...');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar si estamos en el dashboard
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Navegar a la página de hallazgos
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tomar screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/login_and_test.png'),
      fullPage: true 
    });
    
    // Verificar la URL actual
    const findingsUrl = page.url();
    console.log('📍 URL de hallazgos:', findingsUrl);
    
    // Verificar si hay error en la página
    const errorElement = await page.evaluate(() => {
      const error = document.querySelector('[class*="error"]') || 
                   document.querySelector('[class*="Error"]') ||
                   Array.from(document.querySelectorAll('h1, h2')).find(el => 
                     el.textContent.includes('Error')
                   );
      return error ? error.textContent : null;
    });
    
    if (errorElement) {
      console.log('❌ Error encontrado en la página:', errorElement);
    }
    
    // Verificar todos los botones
    console.log('🔍 Verificando botones...');
    const buttons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => ({
        text: btn.textContent.trim(),
        disabled: btn.disabled,
        className: btn.className
      }));
    });
    
    console.log('Botones encontrados:');
    buttons.forEach((btn, index) => {
      console.log(`${index + 1}. "${btn.text}" - Disabled: ${btn.disabled}`);
    });
    
    // Buscar específicamente el botón de "Nuevo Hallazgo"
    const nuevoHallazgoButton = buttons.find(btn => 
      btn.text.includes('Nuevo Hallazgo') || btn.text.includes('hallazgo')
    );
    
    if (nuevoHallazgoButton) {
      console.log('✅ Botón "Nuevo Hallazgo" encontrado:', nuevoHallazgoButton);
      
      // Intentar hacer clic en el botón
      console.log('🖱️ Intentando hacer clic en el botón...');
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Nuevo Hallazgo') || btn.textContent.includes('hallazgo')
        );
        if (button) button.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Tomar screenshot después del clic
      await page.screenshot({ 
        path: path.join(__dirname, '../screenshots/test_findings/after_button_click.png'),
        fullPage: true 
      });
      
    } else {
      console.log('❌ Botón "Nuevo Hallazgo" no encontrado');
    }
    
    // Verificar elementos de contexto
    console.log('🔍 Verificando elementos de contexto...');
    const contextElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => el.textContent && (
          el.textContent.includes('Contexto') ||
          el.textContent.includes('Proyecto') ||
          el.textContent.includes('Área') ||
          el.textContent.includes('Sitio')
        ))
        .map(el => ({
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 150),
          className: el.className
        }));
    });
    
    console.log('Elementos de contexto encontrados:');
    contextElements.forEach((el, index) => {
      console.log(`${index + 1}. <${el.tag}> "${el.text}"`);
    });
    
    console.log('✅ Prueba completada!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
loginAndTestFindings().catch(console.error); 