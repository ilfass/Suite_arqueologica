const puppeteer = require('puppeteer');

async function testCompleteFindingFlow() {
  console.log('🧪 Iniciando prueba completa del flujo de hallazgos...');
  
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
    
    // Verificar si estamos en el dashboard
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Login exitoso');
      
      // Navegar a la página de hallazgos
      console.log('📱 Navegando a la página de hallazgos...');
      await page.goto('http://localhost:3000/dashboard/researcher/findings', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar si hay errores en la consola
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
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
      
      // Buscar el botón "Nuevo Hallazgo"
      console.log('🔍 Buscando el botón "Nuevo Hallazgo"...');
      const nuevoHallazgoButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent.includes('Nuevo Hallazgo'));
      });
      
      if (nuevoHallazgoButton.asElement()) {
        console.log('✅ Botón "Nuevo Hallazgo" encontrado');
        
        // Verificar si el botón está habilitado
        const isDisabled = await page.evaluate(button => {
          return button.disabled || button.classList.contains('disabled') || 
                 button.style.opacity === '0.5' || button.style.pointerEvents === 'none';
        }, nuevoHallazgoButton);
        
        if (isDisabled) {
          console.log('❌ Botón sigue deshabilitado a pesar del contexto');
        } else {
          console.log('✅ Botón está habilitado con contexto');
          
          // Intentar hacer clic en el botón
          console.log('🖱️ Intentando hacer clic en el botón...');
          await nuevoHallazgoButton.click();
          
          // Esperar a que aparezca el modal
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Verificar si el modal apareció
          const modal = await page.evaluate(() => {
            return document.querySelector('[role="dialog"]') || 
                   document.querySelector('.modal') ||
                   document.querySelector('[data-modal="true"]') ||
                   document.querySelector('.fixed.inset-0') ||
                   document.querySelector('.fixed');
          });
          
          if (modal) {
            console.log('✅ Modal de nuevo hallazgo apareció correctamente');
            
            // Verificar contenido del modal
            const modalContent = await page.evaluate(() => {
              const modal = document.querySelector('[role="dialog"]') || 
                           document.querySelector('.modal') ||
                           document.querySelector('[data-modal="true"]') ||
                           document.querySelector('.fixed.inset-0') ||
                           document.querySelector('.fixed');
              return modal ? modal.textContent : '';
            });
            
            console.log('📄 Contenido del modal:', modalContent.substring(0, 200) + '...');
            
            if (modalContent.includes('Nuevo Hallazgo') || modalContent.includes('Hallazgo')) {
              console.log('✅ Modal contiene contenido de hallazgo');
            } else {
              console.log('⚠️ Modal apareció pero contenido inesperado');
            }
          } else {
            console.log('❌ Modal no apareció');
            
            // Verificar si hay algún elemento con z-index alto
            const highZIndexElements = await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('*'));
              return elements.filter(el => {
                const zIndex = window.getComputedStyle(el).zIndex;
                return zIndex !== 'auto' && parseInt(zIndex) > 1000;
              }).map(el => ({
                tagName: el.tagName,
                className: el.className,
                zIndex: window.getComputedStyle(el).zIndex,
                visible: window.getComputedStyle(el).display !== 'none' && 
                        window.getComputedStyle(el).visibility !== 'hidden'
              }));
            });
            
            console.log('🔍 Elementos con z-index alto:', highZIndexElements);
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
      
    } else {
      console.log('❌ Login falló, no estamos en el dashboard');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_complete_finding_flow.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_complete_finding_flow.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testCompleteFindingFlow(); 