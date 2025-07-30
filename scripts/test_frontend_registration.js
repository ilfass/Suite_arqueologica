const puppeteer = require('puppeteer');
const path = require('path');

async function testFrontendRegistration() {
  let browser;
  
  try {
    console.log('🧪 TESTING FRONTEND DE REGISTRO CON IDENTIFICADORES');
    console.log('==================================================');
    console.log('ℹ️  Iniciando pruebas del frontend de registro...\n');
    
    // Iniciar navegador
    browser = await puppeteer.launch({
      headless: false, // Mostrar el navegador para ver las pruebas
      slowMo: 1000, // Ralentizar las acciones para ver mejor
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Ir a la página de registro
    console.log('🌐 Navegando a la página de registro...');
    await page.goto('http://localhost:3000/register');
    await page.waitForSelector('form', { timeout: 10000 });
    
    console.log('✅ Página de registro cargada exitosamente');
    
    // Tomar screenshot inicial
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots', '01_registro_page_loaded.png'),
      fullPage: true 
    });
    
    // Configuración de usuarios de prueba
    const testUsers = {
      INSTITUTION: {
        email: 'prueba.institucion.frontend@test.com',
        password: 'Password123!',
        firstName: 'PruebaInstitucion',
        lastName: 'TestInstitution',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata',
        role: 'INSTITUTION',
        // Campos específicos para INSTITUTION
        institutionName: 'Universidad Nacional de La Plata - Prueba',
        institutionAddress: 'Calle 50 entre 115 y 116, La Plata',
        institutionWebsite: 'https://www.unlp.edu.ar/prueba',
        institutionDepartment: 'Facultad de Ciencias Naturales y Museo',
        institutionEmail: 'institucion@unlp.edu.ar',
        institutionAlternativeEmail: 'alt.institucion@unlp.edu.ar'
      },
      DIRECTOR: {
        email: 'prueba.director.frontend@test.com',
        password: 'Password123!',
        firstName: 'PruebaDirector',
        lastName: 'TestDirector',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata',
        role: 'DIRECTOR',
        // Campos específicos para DIRECTOR
        documentId: 'DNI12345678',
        highestDegree: 'Doctorado en Arqueología',
        discipline: 'Arqueología Prehistórica',
        formationInstitution: 'Universidad Nacional de La Plata',
        currentInstitution: 'CONICET - INAPL',
        currentPosition: 'Investigador Principal',
        cvLink: 'https://orcid.org/0000-0000-0000-0001'
      },
      RESEARCHER: {
        email: 'prueba.investigador.frontend@test.com',
        password: 'Password123!',
        firstName: 'PruebaInvestigador',
        lastName: 'TestResearcher',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata',
        role: 'RESEARCHER',
        // Campos específicos para RESEARCHER
        documentId: 'DNI87654321',
        career: 'Licenciatura en Antropología',
        year: '2023',
        formationInstitution: 'Universidad Nacional de La Plata',
        role: 'Becario Doctoral',
        area: 'Arqueología de Cazadores-Recolectores'
      },
      STUDENT: {
        email: 'prueba.estudiante.frontend@test.com',
        password: 'Password123!',
        firstName: 'PruebaEstudiante',
        lastName: 'TestStudent',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata',
        role: 'STUDENT',
        // Campos específicos para STUDENT
        documentId: 'DNI11223344',
        highestDegree: 'Bachiller',
        discipline: 'Antropología',
        formationInstitution: 'Colegio Nacional de La Plata',
        currentInstitution: 'Universidad Nacional de La Plata',
        currentPosition: 'Estudiante de Grado',
        cvLink: 'https://linkedin.com/in/prueba-estudiante'
      },
      GUEST: {
        email: 'prueba.invitado.frontend@test.com',
        password: 'Password123!',
        firstName: 'PruebaInvitado',
        lastName: 'TestGuest',
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata',
        role: 'GUEST'
      }
    };
    
    const results = {};
    
    // Probar cada rol
    for (const [role, userData] of Object.entries(testUsers)) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`ℹ️  Probando registro de ${role} en el frontend...`);
      console.log(`${'='.repeat(60)}`);
      
      try {
        // Limpiar formulario (si existe)
        await page.evaluate(() => {
          const form = document.querySelector('form');
          if (form) form.reset();
        });
        
        // Esperar a que se cargue el formulario
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Seleccionar el rol
        console.log(`🎯 Seleccionando rol: ${role}`);
        await page.select('select[name="role"]', userData.role);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tomar screenshot después de seleccionar rol
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots', `02_${role.toLowerCase()}_role_selected.png`),
          fullPage: true 
        });
        
        // Llenar campos comunes
        console.log('📝 Llenando campos comunes...');
        await page.type('input[name="email"]', userData.email);
        await page.type('input[name="password"]', userData.password);
        await page.type('input[name="confirmPassword"]', userData.password);
        await page.type('input[name="firstName"]', userData.firstName);
        await page.type('input[name="lastName"]', userData.lastName);
        await page.type('input[name="country"]', userData.country);
        await page.type('input[name="province"]', userData.province);
        await page.type('input[name="city"]', userData.city);
        
        // Llenar campos específicos según el rol
        console.log(`📋 Llenando campos específicos para ${role}...`);
        
        switch (role) {
          case 'INSTITUTION':
            await page.type('input[name="institutionName"]', userData.institutionName);
            await page.type('input[name="institutionAddress"]', userData.institutionAddress);
            await page.type('input[name="institutionWebsite"]', userData.institutionWebsite);
            await page.type('input[name="institutionDepartment"]', userData.institutionDepartment);
            await page.type('input[name="institutionEmail"]', userData.institutionEmail);
            await page.type('input[name="institutionAlternativeEmail"]', userData.institutionAlternativeEmail);
            break;
            
          case 'DIRECTOR':
            await page.type('input[name="documentId"]', userData.documentId);
            await page.type('input[name="highestDegree"]', userData.highestDegree);
            await page.type('input[name="discipline"]', userData.discipline);
            await page.type('input[name="formationInstitution"]', userData.formationInstitution);
            await page.type('input[name="currentInstitution"]', userData.currentInstitution);
            await page.type('input[name="currentPosition"]', userData.currentPosition);
            await page.type('input[name="cvLink"]', userData.cvLink);
            break;
            
          case 'RESEARCHER':
            await page.type('input[name="documentId"]', userData.documentId);
            await page.type('input[name="career"]', userData.career);
            await page.type('input[name="year"]', userData.year);
            await page.type('input[name="formationInstitution"]', userData.formationInstitution);
            await page.type('input[name="role"]', userData.role);
            await page.type('input[name="area"]', userData.area);
            break;
            
          case 'STUDENT':
            await page.type('input[name="documentId"]', userData.documentId);
            await page.type('input[name="highestDegree"]', userData.highestDegree);
            await page.type('input[name="discipline"]', userData.discipline);
            await page.type('input[name="formationInstitution"]', userData.formationInstitution);
            await page.type('input[name="currentInstitution"]', userData.currentInstitution);
            await page.type('input[name="currentPosition"]', userData.currentPosition);
            await page.type('input[name="cvLink"]', userData.cvLink);
            break;
            
          case 'GUEST':
            // Solo campos básicos
            break;
        }
        
        // Marcar términos y condiciones
        await page.click('input[name="termsAccepted"]');
        
        // Tomar screenshot del formulario completo
        await page.screenshot({ 
          path: path.join(__dirname, 'screenshots', `03_${role.toLowerCase()}_form_filled.png`),
          fullPage: true 
        });
        
        console.log('✅ Formulario completado exitosamente');
        
        // Verificar que todos los campos requeridos están llenos
        const formValidation = await page.evaluate(() => {
          const requiredInputs = document.querySelectorAll('input[required], select[required]');
          let allValid = true;
          const validationResults = {};
          
          requiredInputs.forEach(input => {
            const isValid = input.checkValidity();
            validationResults[input.name] = isValid;
            if (!isValid) allValid = false;
          });
          
          return { allValid, validationResults };
        });
        
        if (formValidation.allValid) {
          console.log('✅ Validación del formulario exitosa');
          results[role] = { success: true, message: 'Formulario válido' };
        } else {
          console.log('❌ Errores de validación:', formValidation.validationResults);
          results[role] = { success: false, message: 'Errores de validación', errors: formValidation.validationResults };
        }
        
        // No enviar el formulario para evitar rate limits
        console.log('⏸️  Formulario listo para enviar (no enviado para evitar rate limits)');
        
      } catch (error) {
        console.log(`❌ Error probando ${role}: ${error.message}`);
        results[role] = { success: false, message: error.message };
      }
      
             // Esperar entre pruebas
       await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Resumen final
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RESUMEN DE PRUEBAS DEL FRONTEND');
    console.log(`${'='.repeat(60)}`);
    
    const roles = Object.keys(testUsers);
    console.log('\nROLES         | Estado   | Mensaje');
    console.log('-------------|----------|---------');
    
    roles.forEach(role => {
      const result = results[role];
      const status = result?.success ? '✅' : '❌';
      const message = result?.message || 'Sin resultado';
      console.log(`${role.padEnd(12)} | ${status.padEnd(8)} | ${message}`);
    });
    
    console.log('\n' + '='.repeat(60));
    const totalSuccess = Object.values(results).filter(r => r?.success).length;
    console.log(`Total exitosos: ${totalSuccess}/${roles.length} formularios`);
    
    if (totalSuccess === roles.length) {
      console.log('\n🎉 ¡Todas las pruebas del frontend fueron exitosas!');
      console.log('✅ El formulario de registro está funcionando correctamente');
    } else {
      console.log('\n⚠️  Algunas pruebas fallaron. Revisar los errores anteriores.');
    }
    
    console.log('\n📸 Screenshots guardados en: scripts/screenshots/');
    console.log('📋 Emails de prueba preparados:');
    roles.forEach(role => {
      console.log(`  - ${role}: ${testUsers[role].email}`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
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

// Ejecutar pruebas
testFrontendRegistration().catch(console.error); 