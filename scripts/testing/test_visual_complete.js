const puppeteer = require('puppeteer');

async function testVisualComplete() {
  console.log('🧪 Iniciando pruebas visuales completas...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // 1. Ir a la página de login
    console.log('📝 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Probar login con credenciales correctas
    console.log('🔐 Probando login con credenciales correctas...');
    
    // Buscar campos de entrada
    const emailInput = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('input')).find(input => 
        input.type === 'email' || input.placeholder?.toLowerCase().includes('email')
      )
    );
    
    const passwordInput = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('input')).find(input => 
        input.type === 'password' || input.placeholder?.toLowerCase().includes('contraseña')
      )
    );
    
    if (emailInput.asElement() && passwordInput.asElement()) {
      // Usar credenciales de investigador
      await emailInput.asElement().type('lic.fabiande@gmail.com');
      await passwordInput.asElement().type('test123');
      
      // Buscar botón de login
      const loginButton = await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Iniciar sesión') || btn.textContent.includes('Login')
        )
      );
      
      if (loginButton.asElement()) {
        await loginButton.asElement().click();
        console.log('✅ Clic en botón de login realizado');
        
        // Esperar redirección
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const currentUrl = page.url();
        console.log('📍 URL después del login:', currentUrl);
        
        if (currentUrl.includes('/dashboard')) {
          console.log('✅ Login exitoso - redirigido al dashboard');
        } else {
          console.log('❌ Login falló - no se redirigió al dashboard');
        }
      } else {
        console.log('❌ No se encontró el botón de login');
      }
    } else {
      console.log('❌ No se encontraron los campos de email o contraseña');
    }
    
    // 3. Probar configuración de vidriera
    console.log('🔧 Navegando a configuración de vidriera...');
    await page.goto('http://localhost:3000/dashboard/researcher/public-profile');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar que no aparezca "undefined" en la página
    const pageContent = await page.content();
    if (!pageContent.includes('undefined')) {
      console.log('✅ No se encontró "undefined" en la página de configuración');
    } else {
      console.log('❌ Se encontró "undefined" en la página de configuración');
    }
    
    // 4. Buscar botón de vista previa
    const previewButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Vista previa') || btn.textContent.includes('Vista Previa') || btn.textContent.includes('Preview') || btn.textContent.includes('👁️')
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
        
        if (!newPageUrl.includes('undefined') && newPageUrl !== 'about:blank') {
          console.log('✅ URL de vista previa correcta');
        } else {
          console.log('❌ URL de vista previa incorrecta:', newPageUrl);
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
        select.textContent.includes('Proyecto') || select.textContent.includes('Project') || select.textContent.includes('Seleccionar')
      )
    );
    
    if (contextSelector.asElement()) {
      console.log('✅ Selector de proyectos encontrado');
      
      // Obtener las opciones del selector
      const options = await page.evaluate(() => {
        const select = Array.from(document.querySelectorAll('select')).find(select => 
          select.textContent.includes('Proyecto') || select.textContent.includes('Project') || select.textContent.includes('Seleccionar')
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
      
      // Buscar cualquier selector en la página
      const allSelects = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('select')).map(select => ({
          text: select.textContent,
          options: Array.from(select.options).map(option => option.textContent)
        }));
      });
      
      console.log('🔍 Todos los selectores encontrados:', allSelects);
    }
    
    // 6. Probar login con credenciales incorrectas
    console.log('🔒 Probando login con credenciales incorrectas...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailInput2 = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('input')).find(input => 
        input.type === 'email' || input.placeholder?.toLowerCase().includes('email')
      )
    );
    
    const passwordInput2 = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('input')).find(input => 
        input.type === 'password' || input.placeholder?.toLowerCase().includes('contraseña')
      )
    );
    
    if (emailInput2.asElement() && passwordInput2.asElement()) {
      await emailInput2.asElement().type('usuario_inexistente@gmail.com');
      await passwordInput2.asElement().type('password123');
      
      const loginButton2 = await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Iniciar sesión') || btn.textContent.includes('Login')
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
    }
    
    // 7. Probar vidriera personal
    console.log('🌐 Probando vidriera personal...');
    await page.goto('http://localhost:3000/public/investigator/a9824343-3b45-4360-833c-8f241f7d835d');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const vidrieraContent = await page.content();
    if (!vidrieraContent.includes('undefined')) {
      console.log('✅ Vidriera personal no contiene "undefined"');
    } else {
      console.log('❌ Vidriera personal contiene "undefined"');
    }
    
    // Verificar que no hay errores de React
    const pageErrors = await page.evaluate(() => {
      return window.console.error ? 'Hay errores en la consola' : 'No hay errores';
    });
    
    if (pageErrors === 'No hay errores') {
      console.log('✅ No hay errores de React en la vidriera');
    } else {
      console.log('❌ Hay errores de React en la vidriera');
    }
    
    console.log('✅ Pruebas visuales completadas');
    
    // Mantener el navegador abierto para inspección manual
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(() => {}); // Mantener abierto indefinidamente
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

testVisualComplete(); 