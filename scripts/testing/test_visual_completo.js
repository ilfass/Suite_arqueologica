#!/usr/bin/env node

/**
 * Script de prueba visual completa para el Sistema de Contexto Unificado
 * Prueba: Login, Dashboard, Contexto, Formularios y Navegación
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Crear directorio para screenshots si no existe
const screenshotsDir = path.join(__dirname, 'screenshots', 'test_visual_completo');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Función helper para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testVisualCompleto() {
  console.log('🔍 Iniciando prueba visual completa de la Suite Arqueológica...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // 1. Página principal
    console.log('📄 1. Verificando página principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, '01_homepage.png'), fullPage: true });
    
    // Verificar elementos principales
    const title = await page.$eval('h1', el => el.textContent);
    console.log(`✅ Título encontrado: ${title}`);
    
    // 2. Navegación a login
    console.log('🔐 2. Navegando a página de login...');
    
    // Buscar botón de login usando diferentes métodos
    let loginButton = await page.$('button');
    if (loginButton) {
      const buttonText = await page.evaluate(el => el.textContent, loginButton);
      if (buttonText.includes('Iniciar sesión') || buttonText.includes('Login')) {
        await loginButton.click();
        await sleep(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '02_login_page.png'), fullPage: true });
      }
    }
    
    // Si no encontramos el botón, navegar directamente a /login
    if (!loginButton) {
      await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: path.join(screenshotsDir, '02_login_page.png'), fullPage: true });
    }
    
    // 3. Login con credenciales de prueba
    console.log('👤 3. Realizando login...');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (emailInput && passwordInput && submitButton) {
      await emailInput.type('dr.perez@unam.mx');
      await passwordInput.type('password123');
      await submitButton.click();
      await sleep(3000);
      await page.screenshot({ path: path.join(screenshotsDir, '03_after_login.png'), fullPage: true });
    }
    
    // 4. Verificar dashboard
    console.log('📊 4. Verificando dashboard...');
    await sleep(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '04_dashboard.png'), fullPage: true });
    
    // 5. Verificar sistema de contextos con cards
    console.log('🎯 5. Verificando sistema de contextos...');
    
    // Buscar cards de contexto usando diferentes selectores
    const contextCards = await page.$$('.card, [data-testid*="context"], .context-card, .project-card');
    console.log(`📋 Encontradas ${contextCards.length} cards de contexto`);
    
    if (contextCards.length > 0) {
      // Hacer screenshot de las cards
      await page.screenshot({ path: path.join(screenshotsDir, '05_context_cards.png'), fullPage: true });
      
      // Hacer clic en la primera card
      console.log('🖱️ 6. Seleccionando contexto...');
      await contextCards[0].click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '06_context_selected.png'), fullPage: true });
    }
    
    // 6. Navegar por diferentes secciones
    console.log('🧭 7. Navegando por secciones...');
    
    // Verificar menú de navegación
    const navItems = await page.$$('nav a, .sidebar a, [role="navigation"] a, a[href*="dashboard"]');
    console.log(`📱 Encontrados ${navItems.length} elementos de navegación`);
    
    // Navegar a sitios arqueológicos
    const sitesLink = await page.$('a[href*="sites"]');
    if (sitesLink) {
      await sitesLink.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '07_sites_page.png'), fullPage: true });
    }
    
    // Navegar a objetos/artefactos
    const objectsLink = await page.$('a[href*="objects"], a[href*="artifacts"]');
    if (objectsLink) {
      await objectsLink.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '08_objects_page.png'), fullPage: true });
    }
    
    // Navegar a excavaciones
    const excavationsLink = await page.$('a[href*="excavations"]');
    if (excavationsLink) {
      await excavationsLink.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '09_excavations_page.png'), fullPage: true });
    }
    
    // 7. Verificar formularios
    console.log('📝 8. Verificando formularios...');
    
    // Buscar botones de crear nuevo
    const createButtons = await page.$$('button');
    let createButtonFound = false;
    
    for (const button of createButtons) {
      const buttonText = await page.evaluate(el => el.textContent, button);
      if (buttonText.includes('Crear') || buttonText.includes('Nuevo') || buttonText.includes('Add')) {
        await button.click();
        await sleep(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '10_create_form.png'), fullPage: true });
        createButtonFound = true;
        break;
      }
    }
    
    if (createButtonFound) {
      // Volver atrás
      await page.goBack();
      await sleep(1000);
    }
    
    // 8. Verificar perfil de usuario
    console.log('👤 9. Verificando perfil de usuario...');
    const profileLink = await page.$('a[href*="profile"], .profile-button');
    if (profileLink) {
      await profileLink.click();
      await sleep(2000);
      await page.screenshot({ path: path.join(screenshotsDir, '11_profile_page.png'), fullPage: true });
    }
    
    // 9. Verificar logout
    console.log('🚪 10. Verificando logout...');
    const logoutButtons = await page.$$('button');
    let logoutButtonFound = false;
    
    for (const button of logoutButtons) {
      const buttonText = await page.evaluate(el => el.textContent, button);
      if (buttonText.includes('Cerrar sesión') || buttonText.includes('Logout') || buttonText.includes('Salir')) {
        await button.click();
        await sleep(2000);
        await page.screenshot({ path: path.join(screenshotsDir, '12_after_logout.png'), fullPage: true });
        logoutButtonFound = true;
        break;
      }
    }
    
    // 10. Verificar responsive design
    console.log('📱 11. Verificando diseño responsive...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotsDir, '13_tablet_view.png'), fullPage: true });
    
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(screenshotsDir, '14_mobile_view.png'), fullPage: true });
    
    // Restaurar vista desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('✅ Prueba visual completa finalizada exitosamente!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Error durante la prueba visual:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error_screenshot.png'), fullPage: true });
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testVisualCompleto().catch(console.error); 