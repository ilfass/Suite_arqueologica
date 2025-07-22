const puppeteer = require('puppeteer');

async function testResearcherNavigation() {
  console.log('🧪 Iniciando pruebas de navegación del investigador...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Navegar a la página principal
    console.log('📱 Navegando a la página principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Hacer clic en "Iniciar sesión"
    console.log('🔐 Haciendo clic en "Iniciar sesión"...');
    await page.click('button:has-text("Iniciar sesión")');
    await page.waitForTimeout(2000);
    
    // Simular login como investigador
    console.log('👤 Simulando login como investigador...');
    await page.type('input[type="email"]', 'researcher@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Verificar que estamos en el dashboard del investigador
    console.log('🏠 Verificando dashboard del investigador...');
    await page.waitForSelector('h1:has-text("Dashboard de Investigador")');
    
    // Probar todas las herramientas del investigador
    const tools = [
      { name: 'Gestión de Proyectos', path: '/dashboard/researcher/projects' },
      { name: 'Mapeo SIG Integrado', path: '/dashboard/researcher/mapping' },
      { name: 'Gestión de Muestras', path: '/dashboard/researcher/samples' },
      { name: 'Gestión de Hallazgos', path: '/dashboard/researcher/artifacts' },
      { name: 'Visualización de Datos', path: '/dashboard/researcher/visualization' },
      { name: 'Editor Académico', path: '/dashboard/researcher/reports' },
      { name: 'Herramientas de IA', path: '/dashboard/researcher/ai-tools' },
      { name: 'Colaboración', path: '/dashboard/researcher/collaboration' },
      { name: 'Exportación', path: '/dashboard/researcher/export' }
    ];
    
    for (const tool of tools) {
      console.log(`🔧 Probando: ${tool.name}`);
      
      try {
        // Navegar a la herramienta
        await page.goto(`http://localhost:3000${tool.path}`, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Verificar que la página cargó correctamente
        const pageTitle = await page.$eval('h1', el => el.textContent);
        console.log(`✅ ${tool.name}: ${pageTitle}`);
        
        // Verificar que hay contenido en la página
        const content = await page.$eval('body', el => el.textContent);
        if (content.length < 100) {
          console.log(`⚠️ ${tool.name}: Página parece estar vacía`);
        }
        
        // Probar botones principales
        const buttons = await page.$$('button');
        console.log(`🔘 ${tool.name}: ${buttons.length} botones encontrados`);
        
        // Volver al dashboard
        await page.goto('http://localhost:3000/dashboard/researcher', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`❌ Error en ${tool.name}:`, error.message);
      }
    }
    
    // Probar navegación desde el dashboard
    console.log('🎯 Probando navegación desde el dashboard...');
    
    // Probar botones de herramientas en el dashboard
    const toolButtons = await page.$$('button:has-text("Abrir Herramienta")');
    console.log(`🔧 Encontrados ${toolButtons.length} botones de herramientas en el dashboard`);
    
    // Probar acciones rápidas
    const quickActions = await page.$$('button:has-text("Tomar Foto"), button:has-text("Medir"), button:has-text("GPS"), button:has-text("Nota de Campo")');
    console.log(`⚡ Encontradas ${quickActions.length} acciones rápidas`);
    
    // Probar estadísticas
    const stats = await page.$$('[class*="text-2xl font-semibold"]');
    console.log(`📊 Encontradas ${stats.length} estadísticas`);
    
    // Probar actividad reciente
    const activities = await page.$$('[class*="bg-gray-50 rounded-lg"]');
    console.log(`📝 Encontradas ${activities.length} actividades recientes`);
    
    console.log('✅ Pruebas de navegación completadas');
    
    // Mantener el navegador abierto para inspección manual
    console.log('🔍 Navegador abierto para inspección manual. Presiona Ctrl+C para cerrar.');
    await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutos
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await browser.close();
  }
}

// Función para verificar el estado del sistema
async function checkSystemStatus() {
  console.log('🔍 Verificando estado del sistema...');
  
  try {
    // Verificar backend
    const backendResponse = await fetch('http://localhost:4000/api/health');
    const backendData = await backendResponse.json();
    console.log('✅ Backend:', backendData.message);
    
    // Verificar frontend
    const frontendResponse = await fetch('http://localhost:3000');
    console.log('✅ Frontend: Respondiendo correctamente');
    
  } catch (error) {
    console.error('❌ Error verificando sistema:', error.message);
  }
}

// Ejecutar verificaciones
checkSystemStatus().then(() => {
  testResearcherNavigation();
}); 