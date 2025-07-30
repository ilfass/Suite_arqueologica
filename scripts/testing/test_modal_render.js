const puppeteer = require('puppeteer');
const path = require('path');

async function testModalRender() {
  console.log('🧪 Probando renderizado del modal...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Habilitar logs de consola y errores
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    // Navegar directamente a la página de hallazgos
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
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
      console.log('Contexto de prueba establecido');
    });
    
    // Recargar la página
    console.log('🔄 Recargando página...');
    await page.reload();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar si el botón está habilitado
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nuevoHallazgoButton = buttons.find(btn => 
        btn.textContent.includes('Nuevo Hallazgo')
      );
      
      return nuevoHallazgoButton ? {
        text: nuevoHallazgoButton.textContent.trim(),
        disabled: nuevoHallazgoButton.disabled,
        className: nuevoHallazgoButton.className,
        visible: nuevoHallazgoButton.offsetParent !== null
      } : null;
    });
    
    console.log('Información del botón:', buttonInfo);
    
    if (!buttonInfo || buttonInfo.disabled) {
      console.log('❌ Botón no disponible');
      return;
    }
    
    // Hacer clic en el botón
    console.log('🖱️ Haciendo clic en el botón...');
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Nuevo Hallazgo')
      );
      if (button) {
        console.log('Haciendo clic en el botón...');
        button.click();
      }
    });
    
    // Esperar y verificar el modal múltiples veces
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const modalInfo = await page.evaluate(() => {
        // Buscar el modal específico
        const modalContainer = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
        const modalContent = document.querySelector('.bg-white.rounded-lg.shadow-xl');
        
        // Buscar el modal manual
        const manualModal = document.getElementById('manual-finding-modal');
        
        return {
          modalContainer: modalContainer ? {
            visible: modalContainer.offsetParent !== null,
            display: window.getComputedStyle(modalContainer).display,
            opacity: window.getComputedStyle(modalContainer).opacity,
            zIndex: window.getComputedStyle(modalContainer).zIndex
          } : null,
          modalContent: modalContent ? {
            visible: modalContent.offsetParent !== null,
            display: window.getComputedStyle(modalContent).display,
            textContent: modalContent.textContent.substring(0, 100)
          } : null,
          manualModal: manualModal ? {
            visible: manualModal.offsetParent !== null,
            display: window.getComputedStyle(manualModal).display,
            textContent: manualModal.textContent.substring(0, 100),
            id: manualModal.id
          } : null,
          showNewFindingModal: window.showNewFindingModal || false,
          bodyOverflow: document.body.style.overflow
        };
      });
      
      console.log(`Verificación ${i + 1}:`, modalInfo);
      
      // Si el modal está visible, tomar screenshot
      if ((modalInfo.modalContainer && modalInfo.modalContainer.visible) || 
          (modalInfo.manualModal && modalInfo.manualModal.visible)) {
        console.log('✅ Modal encontrado y visible!');
        await page.screenshot({ 
          path: path.join(__dirname, '../screenshots/test_findings/modal_visible.png'),
          fullPage: true 
        });
        break;
      }
    }
    
    // Verificar si hay algún error en la consola
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('❌ Errores en consola:', consoleErrors);
    }
    
    console.log('✅ Prueba completada!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testModalRender().catch(console.error); 