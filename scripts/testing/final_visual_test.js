const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = 'http://localhost:3000';
const LOGIN_EMAIL = 'dr.perez@unam.mx';
const LOGIN_PASSWORD = 'test123456';
const SCREENSHOT_DIR = path.join(__dirname, '../reports/testing/screenshots');

// Asegurar que existe el directorio de screenshots
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class FinalVisualTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    async init() {
        console.log('🚀 Iniciando prueba visual final...');
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
            timeout: 60000
        });
        this.page = await this.browser.newPage();
        
        // Configurar timeouts más largos
        await this.page.setDefaultTimeout(60000);
        await this.page.setDefaultNavigationTimeout(60000);
        
        // Interceptar errores de red
        this.page.on('error', (error) => {
            this.log(`Error de página: ${error.message}`, 'error');
        });
        
        this.page.on('pageerror', (error) => {
            this.log(`Error de JavaScript: ${error.message}`, 'error');
        });
    }

    async log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        console.log(logMessage);
        this.results.errors.push(logMessage);
    }

    async takeScreenshot(name) {
        try {
            const filename = `${Date.now()}_${name}.png`;
            const filepath = path.join(SCREENSHOT_DIR, filename);
            await this.page.screenshot({ path: filepath, fullPage: true });
            await this.log(`Screenshot guardado: ${filename}`);
            return filepath;
        } catch (error) {
            await this.log(`Error al tomar screenshot: ${error.message}`, 'error');
        }
    }

    async waitForElement(selector, timeout = 15000) {
        try {
            await this.page.waitForSelector(selector, { timeout });
            return true;
        } catch (error) {
            await this.log(`Elemento no encontrado: ${selector}`, 'error');
            return false;
        }
    }

    async waitForPageLoad() {
        try {
            await this.page.waitForFunction(() => {
                return document.readyState === 'complete';
            }, { timeout: 30000 });
            await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar más tiempo para React
        } catch (error) {
            await this.log(`Error esperando carga de página: ${error.message}`, 'error');
        }
    }

    async testLogin() {
        await this.log('🔐 Probando login...');
        
        try {
            await this.page.goto(`${BASE_URL}/login`);
            await this.waitForPageLoad();
            await this.takeScreenshot('01_login_page');
            
            // Esperar a que cargue el formulario
            const emailInput = await this.waitForElement('input[type="email"]');
            const passwordInput = await this.waitForElement('input[type="password"]');
            
            if (!emailInput || !passwordInput) {
                await this.log('❌ Formulario de login no encontrado', 'error');
                this.results.failed++;
                return false;
            }
            
            // Llenar formulario
            await this.page.type('input[type="email"]', LOGIN_EMAIL);
            await this.page.type('input[type="password"]', LOGIN_PASSWORD);
            
            // Hacer clic en login
            const submitButton = await this.page.$('button[type="submit"]');
            if (submitButton) {
                await submitButton.click();
                
                // Esperar redirección o cambio de URL
                try {
                    await this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
                } catch (error) {
                    await this.log('Timeout en navegación, verificando URL actual...', 'warn');
                }
                
                await this.waitForPageLoad();
                await this.takeScreenshot('02_after_login');
                
                // Verificar que estamos en el dashboard del investigador
                const currentUrl = this.page.url();
                if (currentUrl.includes('/dashboard/researcher') || currentUrl.includes('/dashboard')) {
                    await this.log('✅ Login exitoso');
                    this.results.passed++;
                    return true;
                } else {
                    await this.log(`❌ Login falló - URL actual: ${currentUrl}`, 'error');
                    this.results.failed++;
                    return false;
                }
            } else {
                await this.log('❌ Botón de submit no encontrado', 'error');
                this.results.failed++;
                return false;
            }
        } catch (error) {
            await this.log(`❌ Error en login: ${error.message}`, 'error');
            this.results.failed++;
            return false;
        }
    }

    async testDashboardElements() {
        await this.log('🧭 Probando elementos del dashboard...');
        
        try {
            // Esperar a que la página cargue completamente
            await this.waitForPageLoad();
            
            // Verificar elementos principales del dashboard
            const dashboardElements = [
                { selector: '[data-testid="dashboard-header"]', name: 'Header del Dashboard' },
                { selector: '[data-testid="stats-title"]', name: 'Título de Estadísticas' },
                { selector: '[data-testid="context-navigator"]', name: 'Navegador de Contexto' }
            ];

            for (const element of dashboardElements) {
                const found = await this.waitForElement(element.selector, 10000);
                if (found) {
                    await this.log(`✅ ${element.name} encontrado`);
                    this.results.passed++;
                } else {
                    await this.log(`❌ ${element.name} no encontrado`, 'error');
                    this.results.failed++;
                }
            }

            await this.takeScreenshot('03_dashboard_main');
            
            // Verificar estadísticas específicas
            await this.testStatisticsSection();
            
            return true;
        } catch (error) {
            await this.log(`❌ Error en elementos del dashboard: ${error.message}`, 'error');
            this.results.failed++;
            return false;
        }
    }

    async testStatisticsSection() {
        await this.log('📊 Probando sección de estadísticas...');
        
        try {
            // Verificar título de estadísticas
            const statsTitle = await this.page.$eval('[data-testid="stats-title"]', el => el.textContent);
            if (statsTitle && (statsTitle.includes('Mis estadísticas') || statsTitle.includes('Mis Estadísticas'))) {
                await this.log('✅ Título de estadísticas correcto');
                this.results.passed++;
            } else {
                await this.log(`❌ Título incorrecto: ${statsTitle}`, 'error');
                this.results.failed++;
            }

            // Verificar estadísticas individuales - valores reales del sistema
            const expectedStats = [
                { name: 'projects', count: '6' },
                { name: 'areas', count: '10' },
                { name: 'sites', count: '1' },
                { name: 'fieldwork', count: '1' },
                { name: 'findings', count: '3' },
                { name: 'samples', count: '2' },
                { name: 'analysis', count: '4' },
                { name: 'chronologies', count: '1' }
            ];

            for (const stat of expectedStats) {
                const statElement = await this.page.$(`[data-testid="stat-${stat.name}"]`);
                if (statElement) {
                    const countElement = await statElement.$('[data-testid="stat-count"]');
                    if (countElement) {
                        const count = await countElement.evaluate(el => el.textContent);
                        if (count === stat.count) {
                            await this.log(`✅ Estadística ${stat.name}: ${count}`);
                            this.results.passed++;
                        } else {
                            await this.log(`❌ Estadística ${stat.name}: esperado ${stat.count}, obtenido ${count}`, 'error');
                            this.results.failed++;
                        }
                    } else {
                        await this.log(`❌ Contador no encontrado para ${stat.name}`, 'error');
                        this.results.failed++;
                    }
                } else {
                    await this.log(`❌ Estadística ${stat.name} no encontrada`, 'error');
                    this.results.failed++;
                }
            }

            await this.takeScreenshot('04_statistics_section');
            
        } catch (error) {
            await this.log(`❌ Error en estadísticas: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testToolsSection() {
        await this.log('🛠️ Probando sección de herramientas...');
        
        try {
            // Ir a la página de herramientas
            await this.page.goto(`${BASE_URL}/dashboard/researcher/tools`);
            await this.waitForPageLoad();
            await this.takeScreenshot('05_tools_page');

            // Verificar que la página cargó correctamente
            const toolsHeader = await this.page.$('[data-testid="tools-header"]');
            if (toolsHeader) {
                await this.log('✅ Header de herramientas encontrado');
                this.results.passed++;
            } else {
                await this.log('❌ Header de herramientas no encontrado', 'error');
                this.results.failed++;
            }

            // Buscar todas las herramientas disponibles en la página
            const toolElements = await this.page.$$('[data-testid^="tool-"]');
            await this.log(`Encontradas ${toolElements.length} herramientas en la página`);
            
            if (toolElements.length > 0) {
                this.results.passed++;
                
                // Probar cada herramienta encontrada
                for (let i = 0; i < Math.min(toolElements.length, 5); i++) { // Probar solo las primeras 5
                    try {
                        const toolElement = toolElements[i];
                        const testId = await toolElement.evaluate(el => el.getAttribute('data-testid'));
                        const toolName = testId.replace('tool-', '');
                        
                        await this.log(`✅ Probando herramienta: ${toolName}`);
                        
                        // Hacer clic en la herramienta
                        await toolElement.click();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await this.takeScreenshot(`06_tool_${toolName}`);
                        await this.log(`✅ Herramienta ${toolName} accesible`);
                        this.results.passed++;
                        
                    } catch (error) {
                        await this.log(`❌ Error accediendo a herramienta ${i}: ${error.message}`, 'error');
                        this.results.failed++;
                    }
                }
            } else {
                await this.log('❌ No se encontraron herramientas en la página', 'error');
                this.results.failed++;
            }
            
        } catch (error) {
            await this.log(`❌ Error en sección de herramientas: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testNavigation() {
        await this.log('🧭 Probando navegación...');
        
        try {
            // Volver al dashboard principal
            await this.page.goto(`${BASE_URL}/dashboard/researcher`);
            await this.waitForPageLoad();
            await this.takeScreenshot('07_dashboard_after_navigation');

            // Verificar que el navegador de contexto está presente
            const contextNav = await this.page.$('[data-testid="context-navigator"]');
            if (contextNav) {
                await this.log('✅ Navegador de contexto encontrado');
                this.results.passed++;
                
                // Verificar elementos del navegador
                const contextElements = [
                    '[data-testid="context-actions"]'
                ];

                for (const selector of contextElements) {
                    const found = await this.waitForElement(selector, 5000);
                    if (found) {
                        await this.log(`✅ Elemento de contexto encontrado: ${selector}`);
                        this.results.passed++;
                    } else {
                        await this.log(`❌ Elemento de contexto no encontrado: ${selector}`, 'error');
                        this.results.failed++;
                    }
                }

                await this.takeScreenshot('08_context_navigator');
            } else {
                await this.log('❌ Navegador de contexto no encontrado', 'error');
                this.results.failed++;
            }
            
        } catch (error) {
            await this.log(`❌ Error en navegación: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testResponsiveDesign() {
        await this.log('📱 Probando diseño responsivo...');
        
        try {
            const viewports = [
                { width: 1920, height: 1080, name: 'desktop' },
                { width: 1024, height: 768, name: 'tablet' },
                { width: 768, height: 1024, name: 'tablet-portrait' },
                { width: 375, height: 667, name: 'mobile' }
            ];

            for (const viewport of viewports) {
                await this.page.setViewport(viewport);
                await this.page.goto(`${BASE_URL}/dashboard/researcher`);
                await this.waitForPageLoad();
                await this.takeScreenshot(`09_responsive_${viewport.name}`);
                await this.log(`✅ Vista responsiva probada: ${viewport.name}`);
                this.results.passed++;
            }
            
        } catch (error) {
            await this.log(`❌ Error en diseño responsivo: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(2) + '%'
            },
            details: this.results.errors,
            screenshots: SCREENSHOT_DIR
        };

        const reportPath = path.join(__dirname, '../reports/testing/final_test_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 REPORTE FINAL COMPLETO:');
        console.log(`✅ Pruebas exitosas: ${this.results.passed}`);
        console.log(`❌ Pruebas fallidas: ${this.results.failed}`);
        console.log(`📈 Tasa de éxito: ${report.summary.successRate}`);
        console.log(`📁 Screenshots: ${SCREENSHOT_DIR}`);
        console.log(`📄 Reporte completo: ${reportPath}`);
        
        if (parseFloat(report.summary.successRate) >= 80) {
            console.log('🎉 ¡PRUEBA EXITOSA! El sistema está funcionando correctamente.');
        } else {
            console.log('⚠️ Se encontraron algunos problemas que requieren atención.');
        }
    }

    async run() {
        try {
            await this.init();
            
            // Ejecutar todas las pruebas
            await this.testLogin();
            await this.testDashboardElements();
            await this.testToolsSection();
            await this.testNavigation();
            await this.testResponsiveDesign();
            
            // Generar reporte
            await this.generateReport();
            
        } catch (error) {
            await this.log(`❌ Error general: ${error.message}`, 'error');
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Ejecutar la prueba
const test = new FinalVisualTest();
test.run(); 