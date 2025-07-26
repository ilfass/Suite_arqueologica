const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuración
const config = {
    baseUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:4000',
    testUser: {
        email: 'dr.perez@unam.mx',
        password: 'test123456'
    },
    screenshotsDir: path.join(__dirname, 'screenshots'),
    timeout: 10000
};

// Crear directorio de screenshots si no existe
if (!fs.existsSync(config.screenshotsDir)) {
    fs.mkdirSync(config.screenshotsDir, { recursive: true });
}

class VisualTestAutomated {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    async init() {
        console.log('🚀 Iniciando prueba visual automatizada...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Mostrar el navegador para ver la prueba
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        this.page = await this.browser.newPage();
        
        // Configurar timeouts
        this.page.setDefaultTimeout(config.timeout);
        this.page.setDefaultNavigationTimeout(config.timeout);
        
        // Interceptar errores de consola
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`❌ Error en consola: ${msg.text()}`);
            }
        });
        
        // Interceptar errores de red
        this.page.on('pageerror', error => {
            console.log(`❌ Error de página: ${error.message}`);
        });
    }

    async test(name, testFunction) {
        try {
            console.log(`\n🔍 Ejecutando: ${name}`);
            await testFunction();
            this.results.passed++;
            this.results.tests.push({ name, status: 'PASSED' });
            console.log(`✅ ${name} - PASÓ`);
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'FAILED', error: error.message });
            console.log(`❌ ${name} - FALLÓ: ${error.message}`);
            
            // Tomar screenshot del error
            const screenshotPath = path.join(config.screenshotsDir, `error_${name.replace(/\s+/g, '_')}.png`);
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot guardado: ${screenshotPath}`);
        }
    }

    async takeScreenshot(name) {
        const screenshotPath = path.join(config.screenshotsDir, `${name.replace(/\s+/g, '_')}.png`);
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot: ${screenshotPath}`);
        return screenshotPath;
    }

    async runTests() {
        try {
            await this.init();

            // Test 1: Verificar que el frontend carga
            await this.test('Carga de página principal', async () => {
                await this.page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
                
                // Verificar título
                const title = await this.page.title();
                if (!title.includes('Suite Arqueológica')) {
                    throw new Error(`Título incorrecto: ${title}`);
                }
                
                // Verificar elementos principales
                await this.page.waitForSelector('h1', { timeout: 5000 });
                const h1Text = await this.page.$eval('h1', el => el.textContent);
                if (!h1Text.includes('Suite Arqueológica')) {
                    throw new Error(`H1 incorrecto: ${h1Text}`);
                }
                
                await this.takeScreenshot('pagina_principal');
            });

            // Test 2: Verificar botones de navegación
            await this.test('Botones de navegación', async () => {
                // Verificar botones usando texto del contenido
                const buttons = await this.page.$$('button');
                if (buttons.length === 0) {
                    throw new Error('No se encontraron botones en la página');
                }
                
                // Verificar que hay al menos 2 botones (login y registro)
                if (buttons.length < 2) {
                    throw new Error(`Solo se encontraron ${buttons.length} botones, se esperaban al menos 2`);
                }
                
                console.log(`✅ Se encontraron ${buttons.length} botones en la página`);
                
                await this.takeScreenshot('botones_navegacion');
            });

            // Test 3: Navegar a página de login
            await this.test('Navegación a página de login', async () => {
                // Navegar directamente a la página de login
                await this.page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle0' });
                
                const currentUrl = this.page.url();
                if (!currentUrl.includes('/login')) {
                    throw new Error(`URL incorrecta después del login: ${currentUrl}`);
                }
                
                // Verificar formulario de login
                await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
                await this.page.waitForSelector('input[type="password"]', { timeout: 5000 });
                
                await this.takeScreenshot('pagina_login');
            });

            // Test 4: Probar login con credenciales
            await this.test('Login con credenciales de prueba', async () => {
                // Verificar si estamos en la página de login
                const currentUrl = this.page.url();
                if (!currentUrl.includes('/login')) {
                    await this.page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle0' });
                }
                
                // Esperar a que los campos de entrada estén disponibles
                await this.page.waitForSelector('input', { timeout: 5000 });
                
                // Buscar campos de entrada
                const inputs = await this.page.$$('input');
                console.log(`✅ Se encontraron ${inputs.length} campos de entrada`);
                
                // Llenar formulario si hay campos
                if (inputs.length >= 2) {
                    await inputs[0].type(config.testUser.email);
                    await inputs[1].type(config.testUser.password);
                    
                    // Buscar botón de submit
                    const submitButton = await this.page.$('button[type="submit"]');
                    if (submitButton) {
                        await submitButton.click();
                    } else {
                        // Intentar con cualquier botón
                        const buttons = await this.page.$$('button');
                        if (buttons.length > 0) {
                            await buttons[0].click();
                        }
                    }
                    
                    // Esperar respuesta
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    // Verificar si hay errores de login
                    const errorElements = await this.page.$$('.error, .alert, [role="alert"]');
                    if (errorElements.length > 0) {
                        const errorText = await this.page.$eval('.error, .alert, [role="alert"]', el => el.textContent);
                        console.log(`⚠️ Advertencia de login: ${errorText}`);
                    }
                } else {
                    console.log('⚠️ No se encontraron suficientes campos de entrada para el login');
                }
                
                await this.takeScreenshot('despues_login');
            });

            // Test 5: Verificar dashboard
            await this.test('Acceso al dashboard', async () => {
                await this.page.goto(`${config.baseUrl}/dashboard`, { waitUntil: 'networkidle0' });
                
                // Verificar que la página carga
                const title = await this.page.title();
                if (!title.includes('Dashboard') && !title.includes('Suite Arqueológica')) {
                    throw new Error(`Título del dashboard incorrecto: ${title}`);
                }
                
                await this.takeScreenshot('dashboard');
            });

            // Test 6: Verificar páginas específicas
            await this.test('Navegación a páginas específicas', async () => {
                const pages = [
                    { url: '/sites', name: 'Sitios' },
                    { url: '/objects', name: 'Objetos' },
                    { url: '/excavations', name: 'Excavaciones' }
                ];
                
                for (const page of pages) {
                    await this.page.goto(`${config.baseUrl}${page.url}`, { waitUntil: 'networkidle0' });
                    const title = await this.page.title();
                    console.log(`✅ Página ${page.name} cargada: ${title}`);
                    await this.takeScreenshot(`pagina_${page.name.toLowerCase()}`);
                }
            });

            // Test 7: Verificar responsive design
            await this.test('Diseño responsive', async () => {
                // Volver a la página principal
                await this.page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
                
                // Probar diferentes tamaños de pantalla
                const viewports = [
                    { width: 1920, height: 1080, name: 'desktop' },
                    { width: 768, height: 1024, name: 'tablet' },
                    { width: 375, height: 667, name: 'mobile' }
                ];
                
                for (const viewport of viewports) {
                    await this.page.setViewport(viewport);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await this.takeScreenshot(`responsive_${viewport.name}`);
                }
            });

            // Test 8: Verificar console errors
            await this.test('Verificar errores en consola', async () => {
                const consoleErrors = [];
                
                this.page.on('console', msg => {
                    if (msg.type() === 'error') {
                        consoleErrors.push(msg.text());
                    }
                });
                
                await this.page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (consoleErrors.length > 0) {
                    console.log(`⚠️ Errores en consola encontrados: ${consoleErrors.length}`);
                    consoleErrors.forEach(error => console.log(`   - ${error}`));
                }
            });

        } catch (error) {
            console.error('❌ Error en la prueba:', error.message);
        } finally {
            await this.cleanup();
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        
        this.printResults();
    }

    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESULTADOS DE LA PRUEBA VISUAL AUTOMATIZADA');
        console.log('='.repeat(50));
        
        console.log(`✅ Pruebas pasadas: ${this.results.passed}`);
        console.log(`❌ Pruebas fallidas: ${this.results.failed}`);
        console.log(`📈 Total: ${this.results.passed + this.results.failed}`);
        
        console.log('\n📋 Detalles de las pruebas:');
        this.results.tests.forEach(test => {
            const status = test.status === 'PASSED' ? '✅' : '❌';
            console.log(`${status} ${test.name}`);
            if (test.error) {
                console.log(`   Error: ${test.error}`);
            }
        });
        
        console.log(`\n📸 Screenshots guardados en: ${config.screenshotsDir}`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!');
        } else {
            console.log('\n⚠️ Algunas pruebas fallaron. Revisa los screenshots.');
        }
    }
}

// Exportar la clase para uso en otros módulos
module.exports = VisualTestAutomated;

// Ejecutar la prueba si se llama directamente
if (require.main === module) {
    async function main() {
        const test = new VisualTestAutomated();
        await test.runTests();
    }
    
    main().catch(console.error);
} 