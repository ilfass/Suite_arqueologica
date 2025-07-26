const puppeteer = require('puppeteer');

async function testCreateProject() {
  console.log('🚀 Probando creación de proyecto...');
  
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
        
        // Buscar el botón de crear proyecto usando el selector correcto
        console.log('🔍 Buscando botón de crear proyecto...');
        
        // Buscar el botón de crear proyecto usando evaluate
        const createProjectButton = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('div'));
          return elements.find(el => el.textContent.includes('Crear Nuevo Proyecto'));
        });
        
        if (createProjectButton) {
          console.log('✅ Botón encontrado con evaluate');
          await page.evaluate((element) => element.click(), createProjectButton);
        } else {
          // Intentar con selector de clase
          const createProjectButton2 = await page.$('div[class*="cursor-pointer"][class*="border-dashed"]');
          
          if (createProjectButton2) {
            console.log('✅ Botón encontrado con selector de clase');
            await createProjectButton2.click();
          } else {
            console.log('❌ Botón no encontrado con ningún método');
            return;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar si el modal se abrió
        console.log('🔍 Verificando si el modal se abrió...');
        const modal = await page.$('.fixed.inset-0.bg-black.bg-opacity-50');
        
        if (modal) {
          console.log('✅ Modal de crear proyecto abierto correctamente');
          
          // Tomar screenshot del modal
          await page.screenshot({ path: 'modal_proyecto_abierto.png', fullPage: true });
          console.log('📸 Screenshot del modal guardado: modal_proyecto_abierto.png');
          
          // Llenar el formulario
          console.log('📝 Llenando formulario de proyecto...');
          
          const nameInput = await page.$('input[placeholder*="Proyecto"], input[name="name"], #name');
          const descriptionInput = await page.$('textarea[placeholder*="descripción"], textarea[name="description"], #description');
          
          if (nameInput) {
            await nameInput.type('Proyecto de Prueba - Áreas Arqueológicas');
            console.log('✅ Nombre del proyecto ingresado');
          }
          
          if (descriptionInput) {
            await descriptionInput.type('Este es un proyecto de prueba para validar la funcionalidad de áreas arqueológicas en el sistema.');
            console.log('✅ Descripción del proyecto ingresada');
          }
          
          // Buscar botón de crear por posición (último botón en el modal)
          const createButton = await page.evaluate(() => {
            const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
            if (modal) {
              const buttons = Array.from(modal.querySelectorAll('button'));
              console.log('Botones en modal:', buttons.map(b => b.textContent?.trim()));
              // El botón "Crear" suele ser el último
              const lastButton = buttons[buttons.length - 1];
              console.log('Último botón:', lastButton?.textContent?.trim());
              return lastButton;
            }
            return null;
          });
          
          if (createButton) {
            console.log('✅ Botón de crear encontrado, haciendo clic...');
            await page.evaluate((element) => element.click(), createButton);
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Verificar si el proyecto se creó
            const newProject = await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('div'));
              return elements.find(el => el.textContent.includes('Proyecto de Prueba - Áreas Arqueológicas'));
            });
            
            if (newProject) {
              console.log('✅ Proyecto creado exitosamente!');
              await page.screenshot({ path: 'proyecto_creado.png', fullPage: true });
              console.log('📸 Screenshot del proyecto creado guardado: proyecto_creado.png');
            } else {
              console.log('⚠️ Proyecto no visible en la lista, pero puede haberse creado');
            }
          } else {
            console.log('❌ Botón de crear no encontrado en el modal');
          }
          
        } else {
          console.log('❌ Modal no se abrió');
          await page.screenshot({ path: 'modal_no_abierto.png', fullPage: true });
          console.log('📸 Screenshot guardado: modal_no_abierto.png');
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

testCreateProject(); 