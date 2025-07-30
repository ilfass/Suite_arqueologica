const puppeteer = require('puppeteer');
const path = require('path');

async function debugRegistrationForm() {
  let browser;
  try {
    console.log('🔍 DEBUGGEANDO FORMULARIO DE REGISTRO');
    console.log('=====================================\n');

    browser = await puppeteer.launch({ 
      headless: false, 
      slowMo: 1000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // Navegar a la página de registro
    console.log('📱 Navegando a la página de registro...');
    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar el rol inicial
    console.log('\n🔍 VERIFICANDO ROL INICIAL...');
    const initialRole = await page.$eval('select[name="role"]', el => el.value);
    console.log(`Rol inicial: ${initialRole}`);

    // Verificar qué campos están visibles inicialmente
    console.log('\n🔍 CAMPOS VISIBLES INICIALMENTE:');
    const initialFields = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label')).map(l => l.textContent.trim());
      return labels.filter(l => l.includes('DNI') || l.includes('Carrera') || l.includes('Año') || l.includes('Título') || l.includes('Disciplina'));
    });
    console.log('Campos específicos visibles:', initialFields);

    // Cambiar a Estudiante
    console.log('\n🔄 CAMBIANDO A ESTUDIANTE...');
    await page.select('select[name="role"]', 'STUDENT');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar campos de estudiante
    console.log('\n🔍 CAMPOS DE ESTUDIANTE:');
    const studentFields = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label')).map(l => l.textContent.trim());
      return labels.filter(l => l.includes('DNI') || l.includes('Título') || l.includes('Disciplina') || l.includes('Carrera') || l.includes('Año'));
    });
    console.log('Campos específicos visibles:', studentFields);

    // Cambiar a Investigador
    console.log('\n🔄 CAMBIANDO A INVESTIGADOR...');
    await page.select('select[name="role"]', 'RESEARCHER');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar campos de investigador
    console.log('\n🔍 CAMPOS DE INVESTIGADOR:');
    const researcherFields = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label')).map(l => l.textContent.trim());
      return labels.filter(l => l.includes('DNI') || l.includes('Título') || l.includes('Disciplina') || l.includes('Carrera') || l.includes('Año'));
    });
    console.log('Campos específicos visibles:', researcherFields);

    // Tomar screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'debug_registration_form.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`\n📸 Screenshot guardado en: ${screenshotPath}`);

    console.log('\n✅ Debug completado');

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  } finally {
    if (browser) {
      console.log('\n🔄 Cerrando navegador...');
      await browser.close();
    }
  }
}

// Crear directorio de screenshots si no existe
const fs = require('fs');
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

debugRegistrationForm().catch(console.error); 