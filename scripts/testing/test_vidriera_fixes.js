const puppeteer = require('puppeteer');

async function testVidrieraFixes() {
  console.log('🧪 Iniciando pruebas de correcciones de vidriera...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 1. Probar login con credenciales correctas
    console.log('📝 Probando login con credenciales correctas...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Llenar formulario de login
    await page.type('input[placeholder*="Email"]', 'fa07fa@gmail.com');
    await page.type('input[placeholder*="Contraseña"]', 'Kdmf83cy2dxw');
    
    // Hacer clic en el botón de login
    const loginButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Iniciar sesión')
      )
    );
    
    if (loginButton.asElement()) {
      await loginButton.asElement().click();
      console.log('✅ Login exitoso');
    } else {
      console.log('❌ No se encontró el botón de login');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. Verificar que estamos en el dashboard
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Redirección al dashboard exitosa');
    } else {
      console.log('❌ No se redirigió al dashboard');
    }
    
    // 3. Ir a configuración de vidriera
    console.log('🔧 Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que no aparezca "undefined" en la URL
    const pageContent = await page.content();
    if (!pageContent.includes('undefined')) {
      console.log('✅ No se encontró "undefined" en la página');
    } else {
      console.log('❌ Se encontró "undefined" en la página');
    }
    
    // 4. Verificar botón de vista previa
    const previewButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Vista previa')
      )
    );
    
    if (previewButton.asElement()) {
      console.log('✅ Botón de vista previa encontrado');
      
      // Hacer clic en vista previa
      await previewButton.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar que se abrió en nueva pestaña
      const pages = await browser.pages();
      if (pages.length > 1) {
        console.log('✅ Vista previa se abrió en nueva pestaña');
        
        // Cambiar a la nueva pestaña
        const newPage = pages[pages.length - 1];
        await newPage.bringToFront();
        
        const newPageUrl = newPage.url();
        console.log('📍 URL de vista previa:', newPageUrl);
        
        if (!newPageUrl.includes('undefined')) {
          console.log('✅ URL de vista previa no contiene "undefined"');
        } else {
          console.log('❌ URL de vista previa contiene "undefined"');
        }
        
        // Cerrar la pestaña de vista previa
        await newPage.close();
      } else {
        console.log('❌ Vista previa no se abrió en nueva pestaña');
      }
    } else {
      console.log('❌ No se encontró el botón de vista previa');
    }
    
    // 5. Verificar selector de proyectos
    console.log('📋 Verificando selector de proyectos...');
    await page.goto('http://localhost:3000/dashboard/researcher');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar el selector de contexto
    const contextSelector = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('select')).find(select => 
        select.textContent.includes('Proyecto')
      )
    );
    
    if (contextSelector.asElement()) {
      console.log('✅ Selector de proyectos encontrado');
      
      // Obtener las opciones del selector
      const options = await page.evaluate(() => {
        const select = Array.from(document.querySelectorAll('select')).find(select => 
          select.textContent.includes('Proyecto')
        );
        if (select) {
          return Array.from(select.options).map(option => option.textContent);
        }
        return [];
      });
      
      console.log('📝 Opciones en el selector:', options);
      
      if (options.length <= 1) {
        console.log('✅ Selector muestra solo opciones válidas (usuario nuevo)');
      } else {
        console.log('❌ Selector muestra proyectos incorrectos');
      }
    } else {
      console.log('❌ No se encontró el selector de proyectos');
    }
    
    // 6. Probar login con credenciales incorrectas
    console.log('🔒 Probando login con credenciales incorrectas...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.type('input[placeholder*="Email"]', 'usuario_inexistente@gmail.com');
    await page.type('input[placeholder*="Contraseña"]', 'password123');
    
    const loginButton2 = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Iniciar sesión')
      )
    );
    
    if (loginButton2.asElement()) {
      await loginButton2.asElement().click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verificar que no se redirigió al dashboard
      const currentUrl2 = page.url();
      if (!currentUrl2.includes('/dashboard')) {
        console.log('✅ Login con credenciales incorrectas fue rechazado');
      } else {
        console.log('❌ Login con credenciales incorrectas fue aceptado');
      }
    }
    
    console.log('✅ Pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await browser.close();
  }
}

testVidrieraFixes(); 