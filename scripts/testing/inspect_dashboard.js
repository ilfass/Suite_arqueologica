const puppeteer = require('puppeteer');

async function inspectDashboard() {
  console.log('🔍 Inspeccionando dashboard del investigador...');
  
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
        
        console.log('✅ Login completado, inspeccionando dashboard...');
        
        // Buscar todos los elementos interactivos
        const buttons = await page.$$('button');
        const divs = await page.$$('div');
        const links = await page.$$('a');
        
        console.log(`🔘 Encontrados ${buttons.length} botones`);
        console.log(`📦 Encontrados ${divs.length} divs`);
        console.log(`🔗 Encontrados ${links.length} enlaces`);
        
        // Buscar elementos que contengan "Crear" o "Nuevo"
        const createElements = await page.$$eval('*', (elements) => {
          return elements
            .filter(el => {
              const text = el.textContent || '';
              return text.toLowerCase().includes('crear') || 
                     text.toLowerCase().includes('nuevo') ||
                     text.toLowerCase().includes('add');
            })
            .map(el => ({
              tagName: el.tagName,
              text: el.textContent?.trim().substring(0, 50),
              className: el.className,
              id: el.id,
              onclick: el.onclick ? 'present' : 'none'
            }));
        });
        
        console.log('\n🔍 Elementos que contienen "Crear", "Nuevo" o "Add":');
        createElements.forEach((el, index) => {
          console.log(`${index + 1}. ${el.tagName} - "${el.text}" - class: ${el.className} - onclick: ${el.onclick}`);
        });
        
        // Buscar elementos con onClick
        const onClickElements = await page.$$eval('*', (elements) => {
          return elements
            .filter(el => el.onclick || el.getAttribute('onclick'))
            .map(el => ({
              tagName: el.tagName,
              text: el.textContent?.trim().substring(0, 30),
              className: el.className,
              onclick: el.onclick ? 'present' : el.getAttribute('onclick')
            }));
        });
        
        console.log('\n🔍 Elementos con onClick:');
        onClickElements.forEach((el, index) => {
          console.log(`${index + 1}. ${el.tagName} - "${el.text}" - class: ${el.className}`);
        });
        
        // Buscar elementos clickeables
        const clickableElements = await page.$$eval('*', (elements) => {
          return elements
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.cursor === 'pointer' || 
                     el.onclick || 
                     el.getAttribute('onclick') ||
                     el.tagName === 'BUTTON' ||
                     el.tagName === 'A';
            })
            .map(el => ({
              tagName: el.tagName,
              text: el.textContent?.trim().substring(0, 30),
              className: el.className,
              cursor: window.getComputedStyle(el).cursor
            }));
        });
        
        console.log('\n🔍 Elementos clickeables:');
        clickableElements.forEach((el, index) => {
          console.log(`${index + 1}. ${el.tagName} - "${el.text}" - class: ${el.className} - cursor: ${el.cursor}`);
        });
        
        // Tomar screenshot
        await page.screenshot({ path: 'dashboard_inspection.png', fullPage: true });
        console.log('📸 Screenshot guardado: dashboard_inspection.png');
        
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la inspección:', error);
  } finally {
    await browser.close();
    console.log('🔒 Navegador cerrado');
  }
}

inspectDashboard(); 