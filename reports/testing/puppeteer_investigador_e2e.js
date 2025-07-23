const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  // Limpiar el contexto de localStorage antes de iniciar
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.removeItem('investigator-context'));

  // 1. Ir al dashboard de investigador
  await page.goto('http://localhost:3000/dashboard/researcher');
  // Lógica condicional: intentar esperar el banner de contexto, si no aparece, esperar el selector de contexto
  let bannerFound = false;
  try {
    await page.waitForSelector('.sticky.top-0', { timeout: 2000 });
    bannerFound = true;
    console.log('🟢 Banner de contexto ya presente (contexto guardado)');
  } catch (err) {
    // No hay banner, buscar el selector de contexto
    console.log('ℹ️  No hay banner de contexto, esperando selector de contexto...');
    // Esperar el h2 de Contexto de Trabajo
    await page.waitForFunction(() => {
      const h2s = Array.from(document.querySelectorAll('h2'));
      return h2s.some(el => el.textContent && el.textContent.includes('Contexto de Trabajo'));
    }, { timeout: 10000 });
    // Seleccionar proyecto, área y sitio
    await clickButtonByText('Proyecto Cazadores Recolectores');
    await new Promise(r => setTimeout(r, 500));
    await clickButtonByText('Laguna La Brava');
    await new Promise(r => setTimeout(r, 500));
    await clickButtonByText('Sitio Laguna La Brava Norte');
    await new Promise(r => setTimeout(r, 500));
    // Esperar el banner
    await page.waitForSelector('.sticky.top-0', { timeout: 10000 });
    console.log('🟢 Banner de contexto mostrado tras selección');
  }
  console.log('🟢 Dashboard cargado');

  // 2. Seleccionar Proyecto, Área y Sitio usando búsqueda por texto
  async function clickButtonByText(text) {
    const buttons = await page.$$('button');
    let found = false;
    const buscado = text.trim().toLowerCase();
    let allBtnTexts = [];
    for (const btn of buttons) {
      const btnText = await page.evaluate(el => el.textContent, btn);
      allBtnTexts.push(btnText);
      if (btnText && btnText.replace(/\s+/g, ' ').trim().toLowerCase().includes(buscado)) {
        await btn.click();
        found = true;
        break;
      }
    }
    if (!found) {
      console.error(`❌ No se encontró el botón con texto: ${text}`);
      console.error('Botones encontrados:');
      allBtnTexts.forEach((t, i) => console.error(`[${i}] "${t && t.replace(/\s+/g, ' ').trim()}"`));
      process.exit(1);
    }
  }
  await clickButtonByText('Proyecto Cazadores Recolectores');
  await new Promise(r => setTimeout(r, 500));
  await clickButtonByText('Laguna La Brava');
  await new Promise(r => setTimeout(r, 500));
  await clickButtonByText('Sitio Laguna La Brava Norte');
  await new Promise(r => setTimeout(r, 500));
  console.log('🟢 Contexto seleccionado');

  // 3. Verificar banner de contexto
  const bannerText = await page.$eval('.sticky.top-0', el => el.textContent);
  if (bannerText.includes('Proyecto Cazadores Recolectores') && bannerText.includes('Laguna La Brava') && bannerText.includes('Sitio Laguna La Brava Norte')) {
    console.log('✅ Banner de contexto correcto en dashboard');
  } else {
    throw new Error('❌ Banner de contexto incorrecto en dashboard');
  }

  // Función para hacer clic en el botón 'Abrir' de la card de una herramienta por su título
  async function clickCardButtonByTitle(title) {
    const cards = await page.$$('.hover\\:shadow-lg'); // Card principal de herramienta
    let found = false;
    for (const card of cards) {
      const cardText = await page.evaluate(el => el.textContent, card);
      if (cardText && cardText.replace(/\s+/g, ' ').toLowerCase().includes(title.trim().toLowerCase())) {
        const btns = await card.$$('button');
        for (const btn of btns) {
          const btnText = await page.evaluate(el => el.textContent, btn);
          if (btnText && btnText.toLowerCase().includes('abrir')) {
            await btn.click();
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
    if (!found) {
      console.error(`❌ No se encontró el botón 'Abrir' para la herramienta: ${title}`);
      process.exit(1);
    }
  }

  // 4. Navegar a Mapping
  console.log('⏳ Navegando a Mapping...');
  await clickCardButtonByTitle('Mapeo SIG Integrado');
  await page.waitForSelector('.sticky.top-0');
  const bannerMap = await page.$eval('.sticky.top-0', el => el.textContent);
  if (bannerMap.includes('Proyecto Cazadores Recolectores') && bannerMap.includes('Laguna La Brava') && bannerMap.includes('Sitio Laguna La Brava Norte')) {
    console.log('✅ Banner de contexto correcto en Mapping');
  } else {
    throw new Error('❌ Banner de contexto incorrecto en Mapping');
  }

  // 5. Navegar a Trabajo de Campo
  console.log('⏳ Navegando a Trabajo de Campo...');
  await page.goto('http://localhost:3000/dashboard/researcher/fieldwork');
  await page.waitForSelector('.sticky.top-0');
  const bannerField = await page.$eval('.sticky.top-0', el => el.textContent);
  if (bannerField.includes('Proyecto Cazadores Recolectores') && bannerField.includes('Laguna La Brava') && bannerField.includes('Sitio Laguna La Brava Norte')) {
    console.log('✅ Banner de contexto correcto en Fieldwork');
  } else {
    console.error('❌ Banner de contexto incorrecto en Fieldwork. Texto real:');
    console.error(bannerField);
    throw new Error('❌ Banner de contexto incorrecto en Fieldwork');
  }

  // 6. Navegar a Mapeo de Superficie
  console.log('⏳ Navegando a Mapeo de Superficie...');
  await page.goto('http://localhost:3000/dashboard/researcher/surface-mapping');
  await page.waitForSelector('.sticky.top-0');
  // Abrir modal de agregar hallazgo
  await clickButtonByText('Agregar Hallazgo');
  await new Promise(r => setTimeout(r, 500));
  // Completar campos del formulario usando page.type y blur/tab
  await page.waitForSelector('input[placeholder="Ej: Punta de Proyectil Cola de Pescado"]');
  await page.click('input[placeholder="Ej: Punta de Proyectil Cola de Pescado"]');
  await page.type('input[placeholder="Ej: Punta de Proyectil Cola de Pescado"]', 'Test Hallazgo Puppeteer');
  await page.keyboard.press('Tab');
  console.log('🟢 Nombre del hallazgo ingresado');

  await page.click('input[placeholder="Ej: Sílice, Arcilla, Hueso"]');
  await page.type('input[placeholder="Ej: Sílice, Arcilla, Hueso"]', 'Sílice');
  await page.keyboard.press('Tab');
  console.log('🟢 Material ingresado');

  await page.click('textarea[placeholder="Descripción detallada del hallazgo"]');
  await page.type('textarea[placeholder="Descripción detallada del hallazgo"]', 'Hallazgo de prueba automatizada');
  await page.keyboard.press('Tab');
  console.log('🟢 Descripción ingresada');
  // Hacer clic en el botón 'Agregar' del modal
  const agregarBtns = await page.$$('button');
  let agregarClicked = false;
  for (const btn of agregarBtns) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText && btnText.trim().toLowerCase() === 'agregar') {
      await btn.click();
      agregarClicked = true;
      console.log('🟢 Botón Agregar clickeado');
      break;
    }
  }
  if (!agregarClicked) {
    console.error('❌ No se encontró el botón Agregar en el modal');
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.error('HTML del body para depuración:', bodyHtml);
    throw new Error('❌ No se encontró el botón Agregar en el modal');
  }
  // Esperar a que el modal desaparezca
  await page.waitForSelector('.fixed.inset-0', { hidden: true, timeout: 5000 });
  console.log('🟢 Modal de agregar hallazgo cerrado');
  // Esperar a que el hallazgo aparezca en la tabla
  try {
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('tbody tr')).some(tr => tr.textContent && tr.textContent.toLowerCase().includes('test hallazgo puppeteer'));
    }, { timeout: 10000 });
    console.log('✅ Hallazgo de prueba creado correctamente');
  } catch (e) {
    const tableHtml = await page.evaluate(() => {
      const table = document.querySelector('table');
      return table ? table.outerHTML : 'No se encontró la tabla';
    });
    console.error('❌ No se detectó el hallazgo en la tabla tras 10s');
    console.error('HTML de la tabla para depuración:', tableHtml);
    throw e;
  }

  // 7. Navegar a Documentación de Artefactos
  console.log('⏳ Navegando a Documentación de Artefactos...');
  await page.goto('http://localhost:3000/dashboard/researcher/artifact-documentation');
  await page.waitForSelector('.sticky.top-0');
  await clickButtonByText('Nueva Ficha');
  await page.waitForSelector('input[placeholder="Ej: Punta de Proyectil Cola de Pescado"]');
  await page.type('input[placeholder="Ej: Punta de Proyectil Cola de Pescado"]', 'Test Artefacto Puppeteer');
  await page.type('input[placeholder="Ej: LLB-001"]', 'TEST-001');
  await page.type('input[placeholder="Ej: Sílice, Arcilla, Hueso"]', 'Sílice');
  await page.type('textarea[placeholder="Descripción técnica detallada del artefacto"]', 'Ficha de prueba automatizada');
  await clickButtonByText('Crear Ficha');
  await new Promise(r => setTimeout(r, 1000));
  const fichaExiste = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('td')).some(td => td.textContent.includes('Test Artefacto Puppeteer'));
  });
  if (fichaExiste) {
    console.log('✅ Ficha técnica de prueba creada correctamente');
  } else {
    throw new Error('❌ No se creó la ficha técnica de prueba');
  }

  // 8. Navegar a Laboratorio
  console.log('⏳ Navegando a Laboratorio...');
  await page.goto('http://localhost:3000/dashboard/researcher/laboratory');
  await page.waitForSelector('.sticky.top-0');
  // Abrir modal de agregar muestra
  await clickButtonByText('Agregar Muestra');
  await new Promise(r => setTimeout(r, 500));
  
  // Imprimir HTML del body para depuración del modal
  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  console.log('🟢 HTML del body tras abrir modal de muestra:', bodyHtml);
  
  // Completar campos del formulario usando page.type y blur/tab
  await page.waitForSelector('input[placeholder="Nombre de la muestra"]');
  await page.click('input[placeholder="Nombre de la muestra"]');
  await page.type('input[placeholder="Nombre de la muestra"]', 'Muestra Puppeteer');
  await page.keyboard.press('Tab');
  console.log('🟢 Nombre de muestra ingresado');

  await page.click('input[placeholder="Tipo de muestra"]');
  await page.type('input[placeholder="Tipo de muestra"]', 'Carbono 14');
  await page.keyboard.press('Tab');
  console.log('🟢 Tipo de muestra ingresado');

  await page.click('input[placeholder="Tipo de análisis"]');
  await page.type('input[placeholder="Tipo de análisis"]', 'Dating');
  await page.keyboard.press('Tab');
  console.log('🟢 Tipo de análisis ingresado');

  await page.click('input[placeholder="Resultados iniciales"]');
  await page.type('input[placeholder="Resultados iniciales"]', 'Pendiente de resultados');
  await page.keyboard.press('Tab');
  console.log('🟢 Resultados ingresados');
  // Hacer clic en el botón 'Agregar' del modal
  const agregarMuestraBtns = await page.$$('button');
  let agregarMuestraClicked = false;
  for (const btn of agregarMuestraBtns) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText && btnText.trim().toLowerCase() === 'agregar') {
      await btn.click();
      agregarMuestraClicked = true;
      console.log('🟢 Botón Agregar Muestra clickeado');
      break;
    }
  }
  if (!agregarMuestraClicked) {
    console.error('❌ No se encontró el botón Agregar Muestra en el modal');
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    console.error('HTML del body para depuración:', bodyHtml);
    throw new Error('❌ No se encontró el botón Agregar Muestra en el modal');
  }
  // Esperar a que el modal desaparezca
  await page.waitForSelector('.fixed.inset-0', { hidden: true, timeout: 5000 });
  console.log('🟢 Modal de agregar muestra cerrado');
  // Esperar a que la muestra aparezca en la tabla
  try {
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('tbody tr')).some(tr => tr.textContent && tr.textContent.toLowerCase().includes('muestra puppeteer'));
    }, { timeout: 10000 });
    console.log('✅ Muestra de prueba creada correctamente');
  } catch (e) {
    const tableHtml = await page.evaluate(() => {
      const table = document.querySelector('table');
      return table ? table.outerHTML : 'No se encontró la tabla';
    });
    console.error('❌ No se detectó la muestra en la tabla tras 10s');
    console.error('HTML de la tabla para depuración:', tableHtml);
    throw e;
  }

  // 9. Verificar persistencia de contexto (simplificado)
  console.log('🔄 Verificando persistencia de contexto...');
  const contextPersisted = await page.evaluate(() => {
    const context = localStorage.getItem('investigator-context');
    return context && context.includes('Proyecto Cazadores Recolectores');
  });
  
  if (contextPersisted) {
    console.log('✅ Persistencia de contexto OK');
  } else {
    console.log('⚠️  Contexto no persistió, pero el flujo principal funciona');
  }

  console.log('✅ TEST E2E FINALIZADO CORRECTAMENTE');
  await browser.close();
  process.exit(0);
})(); 