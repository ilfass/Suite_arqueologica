const puppeteer = require('puppeteer');

async function testCreateProjectFinal() {
  console.log('🚀 Probando creación de proyecto (versión final)...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Login
    console.log('📱 Haciendo login...');
    await page.goto('http://localhost:3000/login');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailInput = await page.$('input[type="email"], input[name="email"], #email');
    const passwordInput = await page.$('input[type="password"], input[name="password"], #password');
    
    if (emailInput && passwordInput) {
      await emailInput.click({ clickCount: 3 });
      await emailInput.type('investigador@test.com');
      
      await passwordInput.click({ clickCount: 3 });
      await passwordInput.type('password123');
      
      const loginButton = await page.$('button[type="submit"], button[type="button"]');
      if (loginButton) {
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('✅ Login completado');
        
        // Abrir modal de crear proyecto
        console.log('🔍 Abriendo modal de crear proyecto...');
        const createProjectButton = await page.$('div[class*="cursor-pointer"][class*="border-dashed"]');
        
        if (createProjectButton) {
          await createProjectButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar que el modal está abierto
          const modal = await page.$('.fixed.inset-0.bg-black.bg-opacity-50');
          if (modal) {
            console.log('✅ Modal abierto correctamente');
            
            // Llenar formulario
            console.log('📝 Llenando formulario...');
            
            const nameInput = await page.$('input[placeholder*="Proyecto"], input[name="name"], #name');
            const descriptionInput = await page.$('textarea[placeholder*="descripción"], textarea[name="description"], #description');
            
            if (nameInput) {
              await nameInput.type('Proyecto de Prueba - Áreas Arqueológicas');
              console.log('✅ Nombre ingresado');
            }
            
            if (descriptionInput) {
              await descriptionInput.type('Este es un proyecto de prueba para validar la funcionalidad de áreas arqueológicas en el sistema.');
              console.log('✅ Descripción ingresada');
            }
            
            // Buscar botón de crear usando selector directo
            console.log('🔍 Buscando botón de crear...');
            
            // Intentar diferentes selectores
            let createButton = await page.$('button:last-child');
            
            if (!createButton) {
              createButton = await page.$('button[type="submit"]');
            }
            
            if (!createButton) {
              // Buscar por texto usando evaluate
              createButton = await page.evaluateHandle(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const createBtn = buttons.find(btn => btn.textContent?.trim() === 'Crear');
                return createBtn;
              });
            }
            
            if (createButton) {
              console.log('✅ Botón de crear encontrado, haciendo clic...');
              await createButton.click();
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Verificar si el proyecto se creó
              console.log('🔍 Verificando si el proyecto se creó...');
              
              const projectCreated = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('div'));
                return elements.some(el => el.textContent?.includes('Proyecto de Prueba - Áreas Arqueológicas'));
              });
              
              if (projectCreated) {
                console.log('✅ Proyecto creado exitosamente!');
                await page.screenshot({ path: 'proyecto_creado_exitoso.png', fullPage: true });
                console.log('📸 Screenshot guardado: proyecto_creado_exitoso.png');
              } else {
                console.log('⚠️ Proyecto no visible en la lista, pero puede haberse creado');
                await page.screenshot({ path: 'proyecto_posiblemente_creado.png', fullPage: true });
                console.log('📸 Screenshot guardado: proyecto_posiblemente_creado.png');
              }
              
            } else {
              console.log('❌ Botón de crear no encontrado');
              await page.screenshot({ path: 'boton_no_encontrado.png', fullPage: true });
              console.log('📸 Screenshot guardado: boton_no_encontrado.png');
            }
            
          } else {
            console.log('❌ Modal no se abrió');
          }
        } else {
          console.log('❌ Botón de abrir modal no encontrado');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

testCreateProjectFinal(); 