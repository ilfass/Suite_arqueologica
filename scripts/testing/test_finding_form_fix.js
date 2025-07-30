const puppeteer = require('puppeteer');

async function testFindingFormFix() {
  console.log('🧪 Iniciando prueba del formulario de hallazgos...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navegar a la página de hallazgos
    console.log('📱 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Esperar a que la página cargue
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar si hay errores en la consola
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Buscar el botón "Nuevo Hallazgo"
    console.log('🔍 Buscando el botón "Nuevo Hallazgo"...');
    const nuevoHallazgoButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Nuevo Hallazgo'));
    });
    
    if (nuevoHallazgoButton.asElement()) {
      console.log('✅ Botón "Nuevo Hallazgo" encontrado');
      
      // Verificar si el botón está habilitado o deshabilitado
      const isDisabled = await page.evaluate(button => {
        return button.disabled || button.classList.contains('disabled') || 
               button.style.opacity === '0.5' || button.style.pointerEvents === 'none';
      }, nuevoHallazgoButton);
      
      if (isDisabled) {
        console.log('⚠️ Botón está deshabilitado (probablemente falta contexto)');
        
        // Verificar si hay mensaje de contexto requerido
        const contextMessage = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.find(el => 
            el.textContent.includes('Contexto Arqueológico Requerido') ||
            el.textContent.includes('Debe seleccionar un contexto')
          );
        });
        
        if (contextMessage) {
          console.log('✅ Mensaje de contexto requerido encontrado');
        } else {
          console.log('❌ No se encontró mensaje de contexto requerido');
        }
      } else {
        console.log('✅ Botón está habilitado');
        
        // Intentar hacer clic en el botón
        console.log('🖱️ Intentando hacer clic en el botón...');
        await nuevoHallazgoButton.click();
        
        // Esperar a que aparezca el modal
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar si el modal apareció
        const modal = await page.evaluate(() => {
          return document.querySelector('[role="dialog"]') || 
                 document.querySelector('.modal') ||
                 document.querySelector('[data-modal="true"]');
        });
        
        if (modal) {
          console.log('✅ Modal de nuevo hallazgo apareció correctamente');
        } else {
          console.log('❌ Modal no apareció');
        }
      }
    } else {
      console.log('❌ Botón "Nuevo Hallazgo" no encontrado');
    }
    
    // Verificar errores de consola
    if (consoleErrors.length > 0) {
      console.log('❌ Errores encontrados en la consola:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No se encontraron errores en la consola');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_finding_form_fix.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_finding_form_fix.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testFindingFormFix(); 