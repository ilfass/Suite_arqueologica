const puppeteer = require('puppeteer');

const roles = [
  {
    name: 'ADMIN',
    email: 'fa07fa@gmail.com',
    password: '3por39',
    dashboard: '/dashboard/admin',
  },
  {
    name: 'RESEARCHER',
    email: 'dr.perez@unam.mx',
    password: 'investigador123',
    dashboard: '/dashboard/researcher',
    expectError: true,
    errorMsg: 'User not found',
  },
  {
    name: 'STUDENT',
    email: 'estudiante@universidad.edu',
    password: 'estudiante123',
    dashboard: '/dashboard/student',
  },
  {
    name: 'DIRECTOR',
    email: 'director@inah.gob.mx',
    password: 'director123',
    dashboard: '/dashboard/director',
  },
  {
    name: 'INSTITUTION',
    email: 'admin@inah.gob.mx',
    password: 'institucion123',
    dashboard: '/dashboard/institution',
  },
  {
    name: 'GUEST',
    email: 'invitado@example.com',
    password: 'invitado123',
    dashboard: '/dashboard/guest',
  },
];

const BASE_URL = 'http://localhost:3000';
const LOGIN_URL = `${BASE_URL}/login`;

async function testRole(role) {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Capturar logs del navegador
  page.on('console', msg => console.log('Browser log:', msg.text()));
  page.on('pageerror', error => console.log('Browser error:', error.message));
  
  // Capturar errores de consola
  await page.evaluateOnNewDocument(() => {
    window.consoleErrors = [];
    const originalError = console.error;
    console.error = (...args) => {
      window.consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };
  });
  
  let result = { role: role.name, success: false, errors: [], buttons: [] };
  try {
    console.log(`Navegando a: ${LOGIN_URL}`);
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Página de login cargada');
    await page.type('input[type="email"]', role.email);
    await page.type('input[type="password"]', role.password);
    console.log('Credenciales ingresadas');
    
    // Esperar a que el formulario esté listo
    await page.waitForSelector('form', { timeout: 5000 });
    
    // Hacer click en el botón de submit y esperar a que se procese
    await page.click('button[type="submit"]');
    console.log('Botón de submit clickeado');
    
    // Esperar a que se procese la respuesta y verificar si hay cambios
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verificar si hay errores en la consola
    const consoleErrors = await page.evaluate(() => {
      return window.consoleErrors || [];
    });
    
    if (consoleErrors.length > 0) {
      console.log('Errores en consola:', consoleErrors);
      result.errors.push('Errores en consola del navegador: ' + consoleErrors.join(', '));
    }
    
    // Verificar si hay mensajes de error en la página
    const errorElement = await page.$('.bg-red-50');
    if (errorElement) {
      const errorText = await errorElement.evaluate(el => el.innerText);
      console.log('Error encontrado en página:', errorText);
      result.errors.push('Error en página: ' + errorText);
    }
    
    console.log('Intento de login realizado');

    if (role.expectError) {
      const errorText = await page.evaluate(() => document.body.innerText);
      console.log('Texto de la página tras login:', errorText);
      if (errorText.includes(role.errorMsg)) {
        result.success = true;
      } else {
        result.errors.push('No se mostró el mensaje de error esperado.');
        result.errors.push('Texto encontrado en la página: ' + errorText.substring(0, 200));
      }
      await browser.close();
      return result;
    }

    // Verificar redirección
    const url = page.url();
    console.log('URL actual tras login:', url);
    if (!url.includes(role.dashboard)) {
      // Caso especial para GUEST que puede ir a / o /dashboard/guest
      if (role.name === 'GUEST' && (url.includes('/dashboard/guest') || url === 'http://localhost:3000/')) {
        // GUEST puede ir a cualquiera de las dos URLs
      } else {
        result.errors.push(`No redirigió al dashboard esperado (${role.dashboard}), está en: ${url}`);
      }
    }

    // Revisar todos los botones visibles
    const buttons = await page.$$eval('button', btns => btns.map(b => ({text: b.innerText, disabled: b.disabled})));
    result.buttons = buttons;
    
    // Solo probar logout si estamos en un dashboard
    if (url.includes('/dashboard')) {
      const logoutBtn = buttons.find(b => /logout|salir|cerrar sesión/i.test(b.text));
      if (logoutBtn) {
        try {
          // Encontrar el botón de logout usando evaluación
          await page.evaluate((btnText) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const logoutButton = buttons.find(btn => btn.innerText.includes(btnText));
            if (logoutButton) logoutButton.click();
          }, logoutBtn.text);
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
          if (!page.url().includes('/login')) {
            result.errors.push('Logout no redirigió al login.');
          }
        } catch (e) {
          result.errors.push('Error al hacer logout: ' + e.message);
        }
      } else {
        result.errors.push('No se encontró botón de logout.');
      }
    }

    result.success = result.errors.length === 0;
    await browser.close();
    return result;
  } catch (err) {
    result.errors.push('Error general: ' + err.message);
    await browser.close();
    return result;
  }
}

(async () => {
  const results = [];
  for (const role of roles) {
    console.log(`\nProbando rol: ${role.name}`);
    const res = await testRole(role);
    results.push(res);
    if (res.success) {
      console.log(`✅ ${role.name} pasó todas las pruebas.`);
    } else {
      console.log(`❌ ${role.name} falló en:`, res.errors);
    }
    console.log('Botones encontrados:', res.buttons.map(b => b.text));
  }
  // Guardar resultados en archivo JSON
  const fs = require('fs');
  fs.writeFileSync('reports/testing/puppeteer_login_roles_result.json', JSON.stringify(results, null, 2));
  console.log('\nResultados guardados en reports/testing/puppeteer_login_roles_result.json');
})(); 