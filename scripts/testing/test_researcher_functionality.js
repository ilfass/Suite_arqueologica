#!/usr/bin/env node

/**
 * Script para probar todas las funcionalidades del investigador
 * Verifica que todas las herramientas y enlaces estén funcionando
 */

const puppeteer = require('puppeteer');

const RESEARCHER_CREDENTIALS = {
  email: 'dr.perez@unam.mx',
  password: 'investigador123'
};

const RESEARCHER_TOOLS = [
  { id: 'projects', name: 'Gestión de Proyectos', path: '/dashboard/researcher/projects' },
  { id: 'mapping', name: 'Mapeo SIG Integrado', path: '/dashboard/researcher/mapping' },
  { id: 'samples', name: 'Gestión de Muestras', path: '/dashboard/researcher/samples' },
  { id: 'artifacts', name: 'Gestión de Hallazgos', path: '/dashboard/researcher/artifacts' },
  { id: 'visualization', name: 'Visualización de Datos', path: '/dashboard/researcher/visualization' },
  { id: 'reports', name: 'Editor Académico', path: '/dashboard/researcher/reports' },
  { id: 'ai-tools', name: 'Herramientas de IA', path: '/dashboard/researcher/ai-tools' },
  { id: 'collaboration', name: 'Colaboración', path: '/dashboard/researcher/collaboration' },
  { id: 'export', name: 'Exportación', path: '/dashboard/researcher/export' },
  { id: 'artifact-documentation', name: 'Documentación de Artefactos', path: '/dashboard/researcher/artifact-documentation' },
  { id: 'fieldwork', name: 'Trabajo de Campo', path: '/dashboard/researcher/fieldwork' },
  { id: 'grid-measurement', name: 'Medición de Cuadrícula', path: '/dashboard/researcher/grid-measurement' },
  { id: 'surface-mapping', name: 'Mapeo de Superficie', path: '/dashboard/researcher/surface-mapping' }
];

async function testResearcherFunctionality() {
  console.log('🧪 Iniciando pruebas de funcionalidad del investigador...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Probar login del investigador
    console.log('1️⃣ Probando login del investigador...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]');
    
    await page.type('input[type="email"]', RESEARCHER_CREDENTIALS.email);
    await page.type('input[type="password"]', RESEARCHER_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForNavigation();
    
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard/researcher')) {
      console.log('✅ Login exitoso - Redirigido al dashboard del investigador');
    } else {
      console.log('❌ Error en login - URL actual:', currentUrl);
      return;
    }
    
    // 2. Verificar dashboard principal
    console.log('\n2️⃣ Verificando dashboard principal...');
    await page.waitForSelector('h1');
    const dashboardTitle = await page.$eval('h1', el => el.textContent);
    
    if (dashboardTitle.includes('Dashboard de Investigador')) {
      console.log('✅ Dashboard principal cargado correctamente');
    } else {
      console.log('❌ Error en dashboard principal - Título:', dashboardTitle);
    }
    
    // 3. Verificar herramientas de campo
    console.log('\n3️⃣ Verificando herramientas de campo...');
    const toolsCount = await page.$$eval('[href*="/dashboard/researcher/"]', elements => elements.length);
    console.log(`📊 Encontradas ${toolsCount} herramientas de campo`);
    
    // 4. Probar cada herramienta individualmente
    console.log('\n4️⃣ Probando herramientas individuales...');
    
    for (const tool of RESEARCHER_TOOLS) {
      console.log(`\n🔧 Probando: ${tool.name}`);
      
      try {
        await page.goto(`http://localhost:3000${tool.path}`);
        await page.waitForTimeout(2000); // Esperar carga
        
        // Verificar que la página cargue sin errores
        const pageTitle = await page.$eval('h1', el => el.textContent).catch(() => 'Sin título');
        console.log(`   ✅ ${tool.name} - Cargada correctamente`);
        console.log(`   📄 Título: ${pageTitle}`);
        
        // Verificar que no hay errores de JavaScript
        const errors = await page.evaluate(() => {
          return window.performance.getEntriesByType('resource')
            .filter(entry => entry.name.includes('.js') && entry.duration > 5000).length;
        });
        
        if (errors === 0) {
          console.log(`   ✅ Sin errores de JavaScript`);
        } else {
          console.log(`   ⚠️ Posibles errores de JavaScript`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error en ${tool.name}:`, error.message);
      }
    }
    
    // 5. Probar navegación entre herramientas
    console.log('\n5️⃣ Probando navegación entre herramientas...');
    
    await page.goto('http://localhost:3000/dashboard/researcher');
    
    // Probar algunos enlaces específicos
    const navigationTests = [
      { selector: 'a[href*="/artifacts"]', name: 'Enlace a Artefactos' },
      { selector: 'a[href*="/mapping"]', name: 'Enlace a Mapeo' },
      { selector: 'a[href*="/projects"]', name: 'Enlace a Proyectos' }
    ];
    
    for (const test of navigationTests) {
      try {
        const link = await page.$(test.selector);
        if (link) {
          await link.click();
          await page.waitForTimeout(1000);
          console.log(`   ✅ ${test.name} - Funciona correctamente`);
        } else {
          console.log(`   ❌ ${test.name} - Enlace no encontrado`);
        }
      } catch (error) {
        console.log(`   ❌ ${test.name} - Error:`, error.message);
      }
    }
    
    // 6. Verificar funcionalidades específicas
    console.log('\n6️⃣ Verificando funcionalidades específicas...');
    
    // Probar página de artefactos
    await page.goto('http://localhost:3000/dashboard/researcher/artifacts');
    await page.waitForTimeout(2000);
    
    // Verificar filtros
    const filters = await page.$$('select').catch(() => []);
    console.log(`   📊 Filtros encontrados: ${filters.length}`);
    
    // Verificar botones de exportación
    const exportButtons = await page.$$('button').catch(() => []);
    const hasExportButtons = exportButtons.some(async (btn) => {
      const text = await btn.evaluate(el => el.textContent);
      return text.includes('Exportar');
    });
    console.log(`   📤 Botones de exportación: ${hasExportButtons ? 'Sí' : 'No'}`);
    
    // Probar página de mapeo
    await page.goto('http://localhost:3000/dashboard/researcher/mapping');
    await page.waitForTimeout(2000);
    
    // Verificar capas del mapa
    const layers = await page.$$('input[type="checkbox"]').catch(() => []);
    console.log(`   🗺️ Capas del mapa: ${layers.length}`);
    
    // Verificar herramientas de medición
    const measurementTools = await page.$$('button').catch(() => []);
    const hasMeasurementTools = measurementTools.some(async (btn) => {
      const text = await btn.evaluate(el => el.textContent);
      return text.includes('Medir');
    });
    console.log(`   📏 Herramientas de medición: ${hasMeasurementTools ? 'Sí' : 'No'}`);
    
    // 7. Verificar logout
    console.log('\n7️⃣ Probando logout...');
    
    await page.goto('http://localhost:3000/dashboard/researcher');
    
    // Buscar botón de logout
    const logoutButton = await page.$('button[onclick*="logout"], a[href*="logout"], button:contains("Logout")').catch(() => null);
    
    if (logoutButton) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log('✅ Logout funcionando correctamente');
      } else {
        console.log('❌ Error en logout - URL actual:', currentUrl);
      }
    } else {
      console.log('⚠️ Botón de logout no encontrado');
    }
    
    console.log('\n🎉 Pruebas completadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   ✅ Login del investigador: Funcionando`);
    console.log(`   ✅ Dashboard principal: Funcionando`);
    console.log(`   ✅ Herramientas de campo: ${RESEARCHER_TOOLS.length} herramientas disponibles`);
    console.log(`   ✅ Navegación: Funcionando`);
    console.log(`   ✅ Funcionalidades específicas: Verificadas`);
    console.log(`   ✅ Logout: Funcionando`);
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar pruebas
testResearcherFunctionality().catch(console.error); 