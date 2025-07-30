const puppeteer = require('puppeteer');
const path = require('path');

async function testButtonClick() {
  console.log('🧪 Probando clic del botón Nuevo Hallazgo...');
  
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
    
    // Navegar a la página de hallazgos
    console.log('🔍 Navegando a la página de hallazgos...');
    await page.goto('http://localhost:3000/dashboard/researcher/findings', { 
      waitUntil: 'networkidle2' 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Tomar screenshot inicial
    await page.screenshot({ 
      path: path.join(__dirname, '../screenshots/test_findings/before_click.png'),
      fullPage: true 
    });
    
    // Buscar el botón específico
    console.log('🔍 Buscando el botón Nuevo Hallazgo...');
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nuevoHallazgoButton = buttons.find(btn => 
        btn.textContent.includes('Nuevo Hallazgo')
      );
      
      if (nuevoHallazgoButton) {
        return {
          text: nuevoHallazgoButton.textContent.trim(),
          disabled: nuevoHallazgoButton.disabled,
          className: nuevoHallazgoButton.className,
          id: nuevoHallazgoButton.id,
          onclick: nuevoHallazgoButton.onclick ? 'present' : 'none'
        };
      }
      return null;
    });
    
    console.log('Información del botón:', buttonInfo);
    
    if (!buttonInfo) {
      console.log('❌ Botón no encontrado');
      return;
    }
    
    // Verificar si el botón está deshabilitado
    if (buttonInfo.disabled) {
      console.log('⚠️ El botón está deshabilitado');
      
      // Verificar el contexto
      const contextInfo = await page.evaluate(() => {
        return {
          hasContext: window.hasContext || false,
          context: window.context || null,
          localStorage: {
            unifiedContext: localStorage.getItem('unified-context'),
            authToken: localStorage.getItem('auth_token')
          }
        };
      });
      
      console.log('Estado del contexto:', contextInfo);
      
      // Intentar establecer contexto de prueba
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
      
      // Verificar el botón después del contexto
      const buttonAfterContext = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nuevoHallazgoButton = buttons.find(btn => 
          btn.textContent.includes('Nuevo Hallazgo')
        );
        
        return nuevoHallazgoButton ? {
          text: nuevoHallazgoButton.textContent.trim(),
          disabled: nuevoHallazgoButton.disabled,
          className: nuevoHallazgoButton.className
        } : null;
      });
      
      console.log('Botón después del contexto:', buttonAfterContext);
      
      if (buttonAfterContext && !buttonAfterContext.disabled) {
        console.log('✅ Botón habilitado, intentando hacer clic...');
        
        // Intentar hacer clic
        try {
          await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button')).find(btn => 
              btn.textContent.includes('Nuevo Hallazgo')
            );
            if (button) {
              console.log('Haciendo clic en el botón...');
              button.click();
            }
          });
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Tomar screenshot después del clic
          await page.screenshot({ 
            path: path.join(__dirname, '../screenshots/test_findings/after_click.png'),
            fullPage: true 
          });
          
          // Verificar si apareció algún modal o alerta
          const modalInfo = await page.evaluate(() => {
            const modals = document.querySelectorAll('[class*="modal"], [class*="Modal"], [class*="popup"], [class*="dialog"]');
            const alerts = document.querySelectorAll('[class*="alert"], [class*="Alert"]');
            
            return {
              modals: modals.length,
              alerts: alerts.length,
              bodyText: document.body.textContent.substring(0, 500)
            };
          });
          
          console.log('Información después del clic:', modalInfo);
          
        } catch (clickError) {
          console.error('❌ Error al hacer clic:', clickError);
        }
      }
      
    } else {
      console.log('✅ Botón habilitado, intentando hacer clic...');
      
      // Hacer clic directamente
      try {
        await page.evaluate(() => {
          const button = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.includes('Nuevo Hallazgo')
          );
          if (button) {
            console.log('Haciendo clic en el botón...');
            button.click();
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Tomar screenshot después del clic
        await page.screenshot({ 
          path: path.join(__dirname, '../screenshots/test_findings/after_click.png'),
          fullPage: true 
        });
        
      } catch (clickError) {
        console.error('❌ Error al hacer clic:', clickError);
      }
    }
    
    console.log('✅ Prueba completada!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testButtonClick().catch(console.error); 