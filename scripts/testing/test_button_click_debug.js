const puppeteer = require('puppeteer');

async function testButtonClickDebug() {
  console.log('🧪 Debugging button click functionality...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navegar a la página de login
    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hacer login
    console.log('🔐 Iniciando login...');
    await page.type('input[type="email"]', 'lic.fabiande@gmail.com');
    await page.type('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    
    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Navegar a la página de hallazgos
    console.log('📱 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Establecer contexto de prueba
    console.log('🔧 Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      const testContext = {
        project_id: 'proj-test-001',
        project_name: 'Proyecto Cazadores Recolectores - La Laguna',
        area_id: 'area-test-001',
        area_name: 'Laguna La Brava',
        site_id: 'site-test-001',
        site_name: 'Sitio Pampeano La Laguna'
      };
      localStorage.setItem('unified-context', JSON.stringify(testContext));
      console.log('🔧 Contexto de prueba establecido:', testContext);
    });
    
    // Recargar la página para que tome el contexto
    console.log('🔄 Recargando página con contexto...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar si hay errores en la consola
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Buscar el botón "Nuevo Hallazgo"
    console.log('🔍 Buscando el botón "Nuevo Hallazgo"...');
    const nuevoHallazgoButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Nuevo Hallazgo'));
    });
    
    if (nuevoHallazgoButton.asElement()) {
      console.log('✅ Botón "Nuevo Hallazgo" encontrado');
      
      // Verificar si el botón está habilitado
      const buttonInfo = await page.evaluate(button => {
        return {
          disabled: button.disabled,
          className: button.className,
          textContent: button.textContent,
          style: {
            opacity: button.style.opacity,
            pointerEvents: button.style.pointerEvents
          }
        };
      }, nuevoHallazgoButton);
      
      console.log('🔍 Información del botón:', buttonInfo);
      
      if (buttonInfo.disabled) {
        console.log('❌ Botón está deshabilitado');
      } else {
        console.log('✅ Botón está habilitado');
        
        // Intentar hacer clic en el botón
        console.log('🖱️ Intentando hacer clic en el botón...');
        await nuevoHallazgoButton.click();
        
        // Esperar un poco y verificar los mensajes de consola
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📝 Mensajes de consola capturados:');
        consoleMessages.forEach(msg => {
          console.log(`  [${msg.type}] ${msg.text}`);
        });
        
        // Verificar si el modal apareció
        const modal = await page.evaluate(() => {
          return document.querySelector('[role="dialog"]') || 
                 document.querySelector('.modal') ||
                 document.querySelector('[data-modal="true"]') ||
                 document.querySelector('.fixed.inset-0') ||
                 document.querySelector('.fixed');
        });
        
        if (modal) {
          console.log('✅ Modal apareció después del clic');
        } else {
          console.log('❌ Modal no apareció después del clic');
        }
      }
    } else {
      console.log('❌ Botón "Nuevo Hallazgo" no encontrado');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_button_click_debug.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_button_click_debug.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testButtonClickDebug(); 