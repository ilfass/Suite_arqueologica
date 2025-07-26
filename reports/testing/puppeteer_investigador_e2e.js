const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3000';
  const screenshotsDir = './reports/testing/screenshots';
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  let step = 1;
  const snap = async (desc) => {
    await page.screenshot({ path: `${screenshotsDir}/step${step++}_${desc.replace(/\s+/g, '_')}.png` });
  };
  const log = (msg) => console.log(`🟢 ${msg}`);

  // 1. Registro o login de investigador
  await page.goto(`${baseUrl}/register`);
  await page.waitForSelector('form');
  await page.type('input[name="email"]', 'investigador.e2e@prueba.com');
  await page.type('input[name="fullName"]', 'Investigador E2E');
  await page.type('input[name="password"]', 'Test1234!');
  await page.select('select[name="role"]', 'researcher');
  await snap('registro_investigador');
  await page.click('button[type="submit"]');
  try { await page.waitForNavigation({ timeout: 5000 }); } catch {}
  if (page.url().includes('/register')) {
    await page.goto(`${baseUrl}/login`);
    await page.waitForSelector('form');
    await page.type('input[name="email"]', 'investigador.e2e@prueba.com');
    await page.type('input[name="password"]', 'Test1234!');
    await snap('login_investigador');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }
  await snap('dashboard_investigador');
  log('Login/registro exitoso');

  // 2. Ir a proyectos y crear uno nuevo
  await page.goto(`${baseUrl}/dashboard/researcher/projects`);
  await page.waitForSelector('button', { visible: true });
  await snap('proyectos_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && b.textContent.includes('Nuevo Proyecto'));
    if (nuevo) nuevo.click();
  });
  await page.waitForNavigation();
  await page.waitForSelector('form');
  await snap('formulario_nuevo_proyecto');
  await page.type('input[placeholder*="Nombre del Proyecto"]', 'Proyecto E2E Puppeteer');
  await page.type('textarea[placeholder*="Describe el proyecto"]', 'Proyecto de prueba E2E automatizada.');
  await page.type('textarea[placeholder*="metodología"]', 'Metodología E2E.');
  await page.type('input[type="date"]', '2025-01-01');
  await page.type('input[type="number"]', '10000');
  await page.type('input[placeholder="1"]', '3');
  await page.type('input[placeholder*="Nombre completo del director"]', 'Investigador E2E');
  await page.type('input[placeholder="Objetivo 1"]', 'Objetivo E2E 1');
  await page.click('button:has-text("Agregar Objetivo")');
  await page.type('input[placeholder="Objetivo 2"]', 'Objetivo E2E 2');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const area = btns.find(b => b.textContent && b.textContent.includes('Crear nueva área'));
    if (area) area.click();
  });
  await page.waitForSelector('input[placeholder*="Argentina"]', { visible: true });
  await page.type('input[placeholder*="Nombre"]', 'Área E2E');
  await page.type('input[placeholder*="Argentina"]', 'Argentina');
  await page.type('input[placeholder*="Buenos Aires"]', 'Buenos Aires');
  await page.type('input[placeholder*="Latitud"]', '-38.1234');
  await page.type('input[placeholder*="Longitud"]', '-61.5678');
  await page.type('input[placeholder*="1500"]', '1500');
  await page.type('textarea', 'Área de prueba E2E.');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const agregar = btns.find(b => b.textContent && b.textContent.includes('Agregar Área'));
    if (agregar) agregar.click();
  });
  await snap('area_agregada');
  await page.select('select[multiple]', 'Área E2E-' + new Date().getFullYear());
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  await snap('proyecto_creado');
  log('Proyecto creado');

  // 3. Editar y ver detalles de proyecto
  await page.goto(`${baseUrl}/dashboard/researcher/projects`);
  await page.waitForSelector('button', { visible: true });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const editar = btns.find(b => b.textContent && b.textContent.includes('Editar'));
    if (editar) editar.click();
  });
  await page.waitForNavigation();
  await snap('editar_proyecto');
  await page.goto(`${baseUrl}/dashboard/researcher/projects`);
  await page.waitForSelector('button', { visible: true });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ver = btns.find(b => b.textContent && b.textContent.includes('Ver Detalles'));
    if (ver) ver.click();
  });
  await page.waitForNavigation();
  await snap('ver_detalles_proyecto');
  log('Editar y ver detalles de proyecto OK');

  // 4. Probar navegación y botones en otras secciones principales
  const secciones = [
    { url: '/dashboard/researcher/fieldwork', nombre: 'Trabajo de Campo' },
    { url: '/dashboard/researcher/findings', nombre: 'Hallazgos' },
    { url: '/dashboard/researcher/artifacts', nombre: 'Artefactos' },
    { url: '/dashboard/researcher/laboratory', nombre: 'Laboratorio' },
    { url: '/dashboard/researcher/samples', nombre: 'Muestras' },
    { url: '/dashboard/researcher/tasks', nombre: 'Tareas' },
    { url: '/dashboard/researcher/publications', nombre: 'Publicaciones' },
    { url: '/dashboard/researcher/communication', nombre: 'Comunicación' },
    { url: '/dashboard/researcher/tools', nombre: 'Herramientas' },
    { url: '/dashboard/researcher/visualization', nombre: 'Visualización' },
    { url: '/dashboard/researcher/surface-mapping', nombre: 'Mapeo de Superficie' },
    { url: '/dashboard/researcher/mapping', nombre: 'Mapeo SIG' },
    { url: '/dashboard/researcher/projects/timeline', nombre: 'Cronograma' }
  ];
  for (const sec of secciones) {
    await page.goto(`${baseUrl}${sec.url}`);
    await page.waitForTimeout(1000);
    await snap(`seccion_${sec.nombre.replace(/\s+/g, '_')}`);
    log(`Navegación a ${sec.nombre}`);
    // Probar todos los botones visibles
    const botones = await page.$$('button');
    for (const btn of botones) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim().length > 0) {
        try {
          await btn.hover();
          // No hacer clic en logout ni en navegación principal
          if (!/cerrar sesión|logout|dashboard|volver|cancelar/i.test(text)) {
            await btn.click();
            await page.waitForTimeout(500);
            await snap(`boton_${text.trim().replace(/\s+/g, '_')}_${sec.nombre.replace(/\s+/g, '_')}`);
            log(`Botón probado: ${text.trim()} en ${sec.nombre}`);
          }
        } catch (e) {
          log(`Botón no clickeable o sin acción visible: ${text.trim()} en ${sec.nombre}`);
        }
      }
    }
  }

  // 5. Logout y login de nuevo para probar persistencia
  await page.goto(`${baseUrl}/dashboard/researcher`);
  await page.waitForSelector('button', { visible: true });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const logout = btns.find(b => b.textContent && /cerrar sesión|logout/i.test(b.textContent));
    if (logout) logout.click();
  });
  await page.waitForTimeout(2000);
  await snap('logout');
  await page.goto(`${baseUrl}/login`);
  await page.waitForSelector('form');
  await page.type('input[name="email"]', 'investigador.e2e@prueba.com');
  await page.type('input[name="password"]', 'Test1234!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  await snap('login_post_logout');
  log('Logout y login de persistencia OK');

  // 6. Crear y verificar hallazgo
  await page.goto(`${baseUrl}/dashboard/researcher/findings`);
  await page.waitForSelector('button', { visible: true });
  await snap('hallazgos_lista');
  // Buscar botón de crear nuevo hallazgo
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Nombre del Hallazgo"]', 'Hallazgo E2E');
  await page.type('textarea', 'Descripción hallazgo E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('hallazgo_creado');
  // Verificar en la lista
  const hallazgoExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Hallazgo E2E'));
  });
  log(hallazgoExiste ? 'Hallazgo creado OK' : '❌ Hallazgo no encontrado');

  // 7. Crear y verificar artefacto
  await page.goto(`${baseUrl}/dashboard/researcher/artifacts`);
  await page.waitForSelector('button', { visible: true });
  await snap('artefactos_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Nombre del Artefacto"]', 'Artefacto E2E');
  await page.type('textarea', 'Descripción artefacto E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('artefacto_creado');
  const artefactoExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Artefacto E2E'));
  });
  log(artefactoExiste ? 'Artefacto creado OK' : '❌ Artefacto no encontrado');

  // 8. Crear y verificar muestra
  await page.goto(`${baseUrl}/dashboard/researcher/laboratory`);
  await page.waitForSelector('button', { visible: true });
  await snap('laboratorio_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Nombre de la muestra"]', 'Muestra E2E');
  await page.type('textarea', 'Descripción muestra E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('muestra_creada');
  const muestraExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Muestra E2E'));
  });
  log(muestraExiste ? 'Muestra creada OK' : '❌ Muestra no encontrada');

  // 9. Crear y verificar tarea
  await page.goto(`${baseUrl}/dashboard/researcher/tasks`);
  await page.waitForSelector('button', { visible: true });
  await snap('tareas_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Nombre de la tarea"]', 'Tarea E2E');
  await page.type('textarea', 'Descripción tarea E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('tarea_creada');
  const tareaExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Tarea E2E'));
  });
  log(tareaExiste ? 'Tarea creada OK' : '❌ Tarea no encontrada');

  // 10. Crear y verificar publicación
  await page.goto(`${baseUrl}/dashboard/researcher/publications`);
  await page.waitForSelector('button', { visible: true });
  await snap('publicaciones_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Título"]', 'Publicación E2E');
  await page.type('textarea', 'Resumen publicación E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('publicacion_creada');
  const publicacionExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Publicación E2E'));
  });
  log(publicacionExiste ? 'Publicación creada OK' : '❌ Publicación no encontrada');

  // 11. Crear y verificar comunicación
  await page.goto(`${baseUrl}/dashboard/researcher/communication`);
  await page.waitForSelector('button', { visible: true });
  await snap('comunicacion_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Asunto"]', 'Comunicación E2E');
  await page.type('textarea', 'Mensaje comunicación E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('comunicacion_creada');
  const comunicacionExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Comunicación E2E'));
  });
  log(comunicacionExiste ? 'Comunicación creada OK' : '❌ Comunicación no encontrada');

  // 12. Crear y verificar herramienta
  await page.goto(`${baseUrl}/dashboard/researcher/tools`);
  await page.waitForSelector('button', { visible: true });
  await snap('herramientas_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Nombre de la herramienta"]', 'Herramienta E2E');
  await page.type('textarea', 'Descripción herramienta E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('herramienta_creada');
  const herramientaExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Herramienta E2E'));
  });
  log(herramientaExiste ? 'Herramienta creada OK' : '❌ Herramienta no encontrada');

  // 13. Crear y verificar visualización
  await page.goto(`${baseUrl}/dashboard/researcher/visualization`);
  await page.waitForSelector('button', { visible: true });
  await snap('visualizacion_lista');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nuevo = btns.find(b => b.textContent && /nuevo|crear|agregar/i.test(b.textContent));
    if (nuevo) nuevo.click();
  });
  await page.waitForSelector('form');
  await page.type('input[placeholder*="Título"]', 'Visualización E2E');
  await page.type('textarea', 'Descripción visualización E2E');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await snap('visualizacion_creada');
  const visualizacionExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent && td.textContent.includes('Visualización E2E'));
  });
  log(visualizacionExiste ? 'Visualización creada OK' : '❌ Visualización no encontrada');

  await browser.close();
})(); 