const puppeteer = require('puppeteer');

async function inspectModal() {
  console.log('🔍 Inspeccionando modal de crear proyecto...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Login
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
        
        // Abrir modal
        const createProjectButton = await page.$('div[class*="cursor-pointer"][class*="border-dashed"]');
        if (createProjectButton) {
          await createProjectButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Inspeccionar botones en el modal
          const buttons = await page.evaluate(() => {
            const modalButtons = Array.from(document.querySelectorAll('button'));
            return modalButtons.map(btn => ({
              text: btn.textContent?.trim(),
              className: btn.className,
              type: btn.type,
              disabled: btn.disabled
            }));
          });
          
          console.log('\n🔘 Botones encontrados en el modal:');
          buttons.forEach((btn, index) => {
            console.log(`${index + 1}. "${btn.text}" - type: ${btn.type} - disabled: ${btn.disabled}`);
          });
          
          // Buscar botón específico de crear
          const createButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.find(btn => 
              btn.textContent?.includes('Crear') || 
              btn.textContent?.includes('Create') ||
              btn.textContent?.includes('Guardar') ||
              btn.textContent?.includes('Save')
            );
          });
          
          if (createButton) {
            console.log('\n✅ Botón de crear encontrado:', createButton.textContent);
          } else {
            console.log('\n❌ Botón de crear no encontrado');
          }
          
          // Tomar screenshot
          await page.screenshot({ path: 'modal_inspection.png', fullPage: true });
          console.log('📸 Screenshot guardado: modal_inspection.png');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la inspección:', error);
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

inspectModal(); 