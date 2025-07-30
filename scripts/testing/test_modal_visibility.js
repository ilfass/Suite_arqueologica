const puppeteer = require('puppeteer');

async function testModalVisibility() {
  console.log('🧪 Verificando visibilidad del modal...');
  
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
    
    // Hacer clic en el botón
    console.log('🖱️ Haciendo clic en el botón...');
    const nuevoHallazgoButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Nuevo Hallazgo'));
    });
    
    if (nuevoHallazgoButton.asElement()) {
      await nuevoHallazgoButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar el modal y intentar hacerlo visible
      console.log('🔍 Verificando modal y aplicando estilos...');
      const modalInfo = await page.evaluate(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (!modal) return { found: false };
        
        const rect = modal.getBoundingClientRect();
        const styles = window.getComputedStyle(modal);
        
        console.log('🔍 Modal encontrado:', {
          rect: rect,
          styles: {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            position: styles.position,
            width: styles.width,
            height: styles.height
          }
        });
        
        // Intentar forzar la visibilidad
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = '9999';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.right = '0';
        modal.style.bottom = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        
        // Verificar el card dentro del modal
        const card = modal.querySelector('.bg-white');
        if (card) {
          card.style.display = 'block';
          card.style.visibility = 'visible';
          card.style.opacity = '1';
          card.style.width = '600px';
          card.style.height = 'auto';
          card.style.maxWidth = '90vw';
          card.style.maxHeight = '90vh';
          card.style.backgroundColor = 'white';
          card.style.borderRadius = '8px';
          card.style.padding = '20px';
          card.style.margin = 'auto';
          card.style.position = 'relative';
          card.style.zIndex = '10000';
        }
        
        // Verificar después de los cambios
        const newRect = modal.getBoundingClientRect();
        const newStyles = window.getComputedStyle(modal);
        
        return {
          found: true,
          before: {
            rect: rect,
            styles: styles
          },
          after: {
            rect: newRect,
            styles: newStyles
          },
          cardFound: !!card
        };
      });
      
      if (modalInfo.found) {
        console.log('✅ Modal encontrado y estilos aplicados');
        console.log('📏 Dimensiones antes:', modalInfo.before.rect);
        console.log('📏 Dimensiones después:', modalInfo.after.rect);
        console.log('🎨 Card encontrado:', modalInfo.cardFound);
        
        // Esperar un poco para que los cambios se apliquen
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar si ahora es visible
        const isVisible = await page.evaluate(() => {
          const modal = document.querySelector('.fixed.inset-0');
          if (!modal) return false;
          
          const rect = modal.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        
        if (isVisible) {
          console.log('✅ Modal ahora es visible');
        } else {
          console.log('❌ Modal sigue sin ser visible');
        }
      } else {
        console.log('❌ Modal no encontrado');
      }
    } else {
      console.log('❌ Botón no encontrado');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_modal_visibility.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_modal_visibility.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testModalVisibility(); 