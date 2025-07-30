const puppeteer = require('puppeteer');

async function testModalDOM() {
  console.log('🧪 Verificando elementos del modal en el DOM...');
  
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
      
      // Verificar elementos del modal en el DOM
      console.log('🔍 Verificando elementos del modal en el DOM...');
      const modalElements = await page.evaluate(() => {
        const elements = [];
        
        // Buscar elementos con clases específicas del modal
        const fixedElements = document.querySelectorAll('.fixed');
        fixedElements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          elements.push({
            type: 'fixed',
            index,
            className: el.className,
            textContent: el.textContent.substring(0, 100),
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height
            },
            styles: {
              zIndex: styles.zIndex,
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              backgroundColor: styles.backgroundColor
            }
          });
        });
        
        // Buscar elementos con z-index alto
        const highZIndexElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const zIndex = window.getComputedStyle(el).zIndex;
          return zIndex !== 'auto' && parseInt(zIndex) > 10;
        }).map(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent.substring(0, 100),
            zIndex: styles.zIndex,
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height
            }
          };
        });
        
        return {
          fixedElements: elements,
          highZIndexElements: highZIndexElements.slice(0, 10) // Solo los primeros 10
        };
      });
      
      console.log('📋 Elementos fixed encontrados:', modalElements.fixedElements.length);
      modalElements.fixedElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.className}`);
        console.log(`     Texto: ${el.textContent}`);
        console.log(`     Z-Index: ${el.styles.zIndex}`);
        console.log(`     Display: ${el.styles.display}`);
        console.log(`     Posición: ${el.rect.top},${el.rect.left} ${el.rect.width}x${el.rect.height}`);
      });
      
      console.log('📋 Elementos con z-index alto:', modalElements.highZIndexElements.length);
      modalElements.highZIndexElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName}.${el.className} (z-index: ${el.zIndex})`);
        console.log(`     Texto: ${el.textContent}`);
      });
      
      // Verificar si hay algún elemento que contenga "Nuevo Hallazgo"
      const findingElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.filter(el => 
          el.textContent && el.textContent.includes('Nuevo Hallazgo')
        ).map(el => ({
          tagName: el.tagName,
          className: el.className,
          textContent: el.textContent.substring(0, 200),
          rect: el.getBoundingClientRect(),
          styles: window.getComputedStyle(el)
        }));
      });
      
      console.log('🔍 Elementos que contienen "Nuevo Hallazgo":', findingElements.length);
      findingElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName}.${el.className}`);
        console.log(`     Texto: ${el.textContent}`);
        console.log(`     Visible: ${el.rect.width > 0 && el.rect.height > 0}`);
      });
      
    } else {
      console.log('❌ Botón no encontrado');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_modal_dom.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_modal_dom.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testModalDOM(); 