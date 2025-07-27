const puppeteer = require('puppeteer');

async function diagnosticoContexto() {
  console.log('🔍 DIAGNÓSTICO RÁPIDO DEL SISTEMA DE CONTEXTO\n');
  console.log('===============================================\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Verificar acceso al sistema
    console.log('📝 Paso 1: Verificando acceso al sistema...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    console.log('✅ Sistema accesible');
    
    // 2. Login como investigador
    console.log('🔐 Paso 2: Haciendo login...');
    await page.type('input[type="email"]', 'dr.perez@unam.mx');
    await page.type('input[type="password"]', 'investigador123');
    await page.click('button[type="submit"]');
    
    // 3. Esperar dashboard
    console.log('⏳ Paso 3: Cargando dashboard...');
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Dashboard cargado');
    
    // 4. Verificar estado inicial
    console.log('🔍 Paso 4: Verificando estado inicial...');
    const estadoInicial = await page.evaluate(() => {
      const banner = document.querySelector('.bg-yellow-50');
      const contexto = localStorage.getItem('investigator-context');
      const herramientas = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      const habilitadas = herramientas.filter(tool => 
        !tool.className.includes('opacity-50') && !tool.className.includes('cursor-not-allowed')
      );
      
      return {
        bannerPresente: !!banner,
        bannerColor: banner ? 'amarillo' : 'no encontrado',
        contextoGuardado: contexto ? JSON.parse(contexto) : null,
        totalHerramientas: herramientas.length,
        herramientasHabilitadas: habilitadas.length
      };
    });
    
    console.log('📊 Estado inicial:', estadoInicial);
    
    // 5. Establecer contexto de prueba
    console.log('🧪 Paso 5: Estableciendo contexto de prueba...');
    await page.evaluate(() => {
      localStorage.setItem('investigator-context', JSON.stringify({
        project: 'Proyecto de Diagnóstico',
        area: 'Área de Diagnóstico',
        site: 'Sitio de Diagnóstico'
      }));
    });
    
    // 6. Recargar página
    console.log('🔄 Paso 6: Recargando página...');
    await page.reload();
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 7. Verificar estado después de contexto
    console.log('🔍 Paso 7: Verificando estado con contexto...');
    const estadoFinal = await page.evaluate(() => {
      const bannerVerde = document.querySelector('.bg-green-50');
      const bannerAzul = document.querySelector('.bg-blue-50');
      const bannerAmarillo = document.querySelector('.bg-yellow-50');
      const contexto = localStorage.getItem('investigator-context');
      const herramientas = Array.from(document.querySelectorAll('div[data-testid*="tool-"]'));
      const habilitadas = herramientas.filter(tool => 
        !tool.className.includes('opacity-50') && !tool.className.includes('cursor-not-allowed')
      );
      
      let bannerColor = 'no encontrado';
      if (bannerVerde) bannerColor = 'verde';
      else if (bannerAzul) bannerColor = 'azul';
      else if (bannerAmarillo) bannerColor = 'amarillo';
      
      return {
        bannerPresente: !!(bannerVerde || bannerAzul || bannerAmarillo),
        bannerColor: bannerColor,
        contextoGuardado: contexto ? JSON.parse(contexto) : null,
        totalHerramientas: herramientas.length,
        herramientasHabilitadas: habilitadas.length
      };
    });
    
    console.log('📊 Estado final:', estadoFinal);
    
    // 8. Verificar duplicación
    console.log('🔍 Paso 8: Verificando duplicación...');
    const duplicacion = await page.evaluate(() => {
      const bannersVerdes = document.querySelectorAll('.bg-green-50.border-green-400');
      const bannersAzules = document.querySelectorAll('.bg-blue-50.border-blue-400');
      const bannersAmarillos = document.querySelectorAll('.bg-yellow-50.border-yellow-400');
      
      return {
        bannersVerdes: bannersVerdes.length,
        bannersAzules: bannersAzules.length,
        bannersAmarillos: bannersAmarillos.length,
        hayDuplicacion: bannersVerdes.length > 1 || bannersAzules.length > 1 || bannersAmarillos.length > 1
      };
    });
    
    console.log('📊 Verificación de duplicación:', duplicacion);
    
    // 9. Generar reporte
    console.log('\n🎯 REPORTE DE DIAGNÓSTICO');
    console.log('==========================');
    
    // Estado inicial
    console.log('\n📋 ESTADO INICIAL:');
    console.log(`- Banner presente: ${estadoInicial.bannerPresente ? '✅' : '❌'}`);
    console.log(`- Color del banner: ${estadoInicial.bannerColor}`);
    console.log(`- Contexto guardado: ${estadoInicial.contextoGuardado ? '✅' : '❌'}`);
    console.log(`- Herramientas totales: ${estadoInicial.totalHerramientas}`);
    console.log(`- Herramientas habilitadas: ${estadoInicial.herramientasHabilitadas}`);
    
    // Estado final
    console.log('\n📋 ESTADO CON CONTEXTO:');
    console.log(`- Banner presente: ${estadoFinal.bannerPresente ? '✅' : '❌'}`);
    console.log(`- Color del banner: ${estadoFinal.bannerColor}`);
    console.log(`- Contexto guardado: ${estadoFinal.contextoGuardado ? '✅' : '❌'}`);
    console.log(`- Herramientas totales: ${estadoFinal.totalHerramientas}`);
    console.log(`- Herramientas habilitadas: ${estadoFinal.herramientasHabilitadas}`);
    
    // Duplicación
    console.log('\n📋 VERIFICACIÓN DE DUPLICACIÓN:');
    console.log(`- Banners verdes: ${duplicacion.bannersVerdes}`);
    console.log(`- Banners azules: ${duplicacion.bannersAzules}`);
    console.log(`- Banners amarillos: ${duplicacion.bannersAmarillos}`);
    console.log(`- Hay duplicación: ${duplicacion.hayDuplicacion ? '❌ PROBLEMA' : '✅ CORRECTO'}`);
    
    // Diagnóstico final
    console.log('\n🔍 DIAGNÓSTICO FINAL:');
    
    let problemas = [];
    let exitos = [];
    
    // Verificar estado inicial
    if (!estadoInicial.bannerPresente) {
      problemas.push('Banner no presente en estado inicial');
    } else {
      exitos.push('Banner presente en estado inicial');
    }
    
    if (estadoInicial.bannerColor !== 'amarillo') {
      problemas.push('Banner inicial no es amarillo');
    } else {
      exitos.push('Banner inicial es amarillo (correcto)');
    }
    
    if (estadoInicial.herramientasHabilitadas > 0) {
      problemas.push('Herramientas habilitadas sin contexto');
    } else {
      exitos.push('Herramientas deshabilitadas sin contexto (correcto)');
    }
    
    // Verificar estado final
    if (!estadoFinal.bannerPresente) {
      problemas.push('Banner no presente con contexto');
    } else {
      exitos.push('Banner presente con contexto');
    }
    
    if (estadoFinal.bannerColor !== 'verde') {
      problemas.push('Banner no es verde con contexto completo');
    } else {
      exitos.push('Banner es verde con contexto completo (correcto)');
    }
    
    if (estadoFinal.herramientasHabilitadas < 8) {
      problemas.push('No todas las herramientas están habilitadas');
    } else {
      exitos.push('Todas las herramientas habilitadas (correcto)');
    }
    
    // Verificar duplicación
    if (duplicacion.hayDuplicacion) {
      problemas.push('Hay duplicación de banners');
    } else {
      exitos.push('No hay duplicación de banners (correcto)');
    }
    
    // Mostrar resultados
    if (exitos.length > 0) {
      console.log('\n✅ ÉXITOS:');
      exitos.forEach(exito => console.log(`  - ${exito}`));
    }
    
    if (problemas.length > 0) {
      console.log('\n❌ PROBLEMAS ENCONTRADOS:');
      problemas.forEach(problema => console.log(`  - ${problema}`));
      console.log('\n🔧 RECOMENDACIONES:');
      console.log('  1. Revisar el documento SISTEMA_CONTEXTO_ARQUEOLOGICO.md');
      console.log('  2. Ejecutar scripts de prueba específicos');
      console.log('  3. Verificar logs del navegador');
    } else {
      console.log('\n🎉 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!');
      console.log('   Todos los componentes están operativos.');
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    await browser.close();
  }
}

diagnosticoContexto().catch(console.error); 