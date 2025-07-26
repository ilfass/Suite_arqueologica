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

class ExhaustiveVisualTest {
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
        console.log('🚀 Iniciando prueba visual exhaustiva...');
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // Configurar timeouts más largos
        await this.page.setDefaultTimeout(30000);
        await this.page.setDefaultNavigationTimeout(30000);
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

    async waitForElement(selector, timeout = 10000) {
        try {
            await this.page.waitForSelector(selector, { timeout });
            return true;
        } catch (error) {
            await this.log(`Elemento no encontrado: ${selector}`, 'error');
            return false;
        }
    }

    async testLogin() {
        await this.log('🔐 Probando login...');
        
        try {
            await this.page.goto(`${BASE_URL}/login`);
            await this.takeScreenshot('01_login_page');
            
            // Esperar a que cargue el formulario
            await this.waitForElement('input[type="email"]');
            await this.waitForElement('input[type="password"]');
            
            // Llenar formulario
            await this.page.type('input[type="email"]', LOGIN_EMAIL);
            await this.page.type('input[type="password"]', LOGIN_PASSWORD);
            
            // Hacer clic en login
            await this.page.click('button[type="submit"]');
            
            // Esperar redirección al dashboard
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.takeScreenshot('02_dashboard_after_login');
            
            // Verificar que estamos en el dashboard del investigador
            const currentUrl = this.page.url();
            if (currentUrl.includes('/dashboard/researcher')) {
                await this.log('✅ Login exitoso');
                this.results.passed++;
                return true;
            } else {
                await this.log(`❌ Login falló - URL actual: ${currentUrl}`, 'error');
                this.results.failed++;
                return false;
            }
        } catch (error) {
            await this.log(`❌ Error en login: ${error.message}`, 'error');
            this.results.failed++;
            return false;
        }
    }

    async testDashboardNavigation() {
        await this.log('🧭 Probando navegación del dashboard...');
        
        try {
            // Verificar elementos principales del dashboard
            const dashboardElements = [
                'nav[data-testid="sidebar"]',
                '[data-testid="dashboard-header"]',
                '[data-testid="stats-section"]',
                '[data-testid="quick-actions"]'
            ];

            for (const selector of dashboardElements) {
                const found = await this.waitForElement(selector);
                if (found) {
                    await this.log(`✅ Elemento encontrado: ${selector}`);
                    this.results.passed++;
                } else {
                    await this.log(`❌ Elemento no encontrado: ${selector}`, 'error');
                    this.results.failed++;
                }
            }

            await this.takeScreenshot('03_dashboard_main');
            
            // Verificar estadísticas
            await this.testStatisticsSection();
            
            return true;
        } catch (error) {
            await this.log(`❌ Error en navegación: ${error.message}`, 'error');
            this.results.failed++;
            return false;
        }
    }

    async testStatisticsSection() {
        await this.log('📊 Probando sección de estadísticas...');
        
        try {
            // Verificar título de estadísticas
            const statsTitle = await this.page.$eval('[data-testid="stats-title"]', el => el.textContent);
            if (statsTitle.includes('Mis estadísticas')) {
                await this.log('✅ Título de estadísticas correcto');
                this.results.passed++;
            } else {
                await this.log(`❌ Título incorrecto: ${statsTitle}`, 'error');
                this.results.failed++;
            }

            // Verificar estadísticas individuales
            const expectedStats = [
                { name: 'Projects', count: '10' },
                { name: 'Areas', count: '1' },
                { name: 'Sites', count: '1' },
                { name: 'Fieldwork', count: '3' },
                { name: 'Findings', count: '2' },
                { name: 'Samples', count: '4' },
                { name: 'Analysis', count: '1' },
                { name: 'Chronologies', count: '0' }
            ];

            for (const stat of expectedStats) {
                const statElement = await this.page.$(`[data-testid="stat-${stat.name.toLowerCase()}"]`);
                if (statElement) {
                    const count = await statElement.$eval('[data-testid="stat-count"]', el => el.textContent);
                    if (count === stat.count) {
                        await this.log(`✅ Estadística ${stat.name}: ${count}`);
                        this.results.passed++;
                    } else {
                        await this.log(`❌ Estadística ${stat.name}: esperado ${stat.count}, obtenido ${count}`, 'error');
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

    async testSidebarNavigation() {
        await this.log('📋 Probando navegación del sidebar...');
        
        try {
            const sidebarItems = [
                { name: 'Dashboard', href: '/dashboard/researcher' },
                { name: 'Projects', href: '/dashboard/researcher/projects' },
                { name: 'Sites', href: '/dashboard/researcher/sites' },
                { name: 'Fieldwork', href: '/dashboard/researcher/fieldwork' },
                { name: 'Findings', href: '/dashboard/researcher/findings' },
                { name: 'Samples', href: '/dashboard/researcher/samples' },
                { name: 'Analysis', href: '/dashboard/researcher/analysis' },
                { name: 'Reports', href: '/dashboard/researcher/reports' },
                { name: 'Tools', href: '/dashboard/researcher/tools' },
                { name: 'Settings', href: '/dashboard/researcher/settings' }
            ];

            for (const item of sidebarItems) {
                try {
                    // Buscar el enlace en el sidebar
                    const linkSelector = `nav a[href="${item.href}"]`;
                    const link = await this.page.$(linkSelector);
                    
                    if (link) {
                        await this.log(`✅ Enlace encontrado: ${item.name}`);
                        this.results.passed++;
                        
                        // Hacer clic en el enlace
                        await link.click();
                        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
                        
                        // Verificar que la página cargó correctamente
                        const currentUrl = this.page.url();
                        if (currentUrl.includes(item.href)) {
                            await this.log(`✅ Navegación exitosa a: ${item.name}`);
                            await this.takeScreenshot(`05_${item.name.toLowerCase()}_page`);
                            this.results.passed++;
                        } else {
                            await this.log(`❌ Navegación falló a: ${item.name}`, 'error');
                            this.results.failed++;
                        }
                        
                        // Volver al dashboard principal
                        await this.page.goto(`${BASE_URL}/dashboard/researcher`);
                        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
                    } else {
                        await this.log(`❌ Enlace no encontrado: ${item.name}`, 'error');
                        this.results.failed++;
                    }
                } catch (error) {
                    await this.log(`❌ Error navegando a ${item.name}: ${error.message}`, 'error');
                    this.results.failed++;
                }
            }
            
        } catch (error) {
            await this.log(`❌ Error en navegación del sidebar: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testToolsSection() {
        await this.log('🛠️ Probando sección de herramientas...');
        
        try {
            // Ir a la página de herramientas
            await this.page.goto(`${BASE_URL}/dashboard/researcher/tools`);
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.takeScreenshot('06_tools_page');

            const tools = [
                'AI Tools',
                'Artifact Documentation',
                'Collaboration',
                'Communication',
                'Export',
                'Fieldwork',
                'Grid Measurement',
                'Laboratory',
                'Mapping',
                'Publications',
                'Surface Mapping',
                'Tasks',
                'Visualization'
            ];

            for (const tool of tools) {
                const toolSelector = `[data-testid="tool-${tool.toLowerCase().replace(/\s+/g, '-')}"]`;
                const found = await this.waitForElement(toolSelector, 5000);
                
                if (found) {
                    await this.log(`✅ Herramienta encontrada: ${tool}`);
                    this.results.passed++;
                    
                    // Intentar hacer clic en la herramienta
                    try {
                        await this.page.click(toolSelector);
                        await this.page.waitForTimeout(2000);
                        await this.takeScreenshot(`07_tool_${tool.toLowerCase().replace(/\s+/g, '_')}`);
                        await this.log(`✅ Herramienta ${tool} accesible`);
                        this.results.passed++;
                    } catch (error) {
                        await this.log(`❌ Error accediendo a ${tool}: ${error.message}`, 'error');
                        this.results.failed++;
                    }
                } else {
                    await this.log(`❌ Herramienta no encontrada: ${tool}`, 'error');
                    this.results.failed++;
                }
            }
            
        } catch (error) {
            await this.log(`❌ Error en sección de herramientas: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testForms() {
        await this.log('📝 Probando formularios...');
        
        try {
            // Probar formulario de nuevo proyecto
            await this.page.goto(`${BASE_URL}/dashboard/researcher/projects/new`);
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.takeScreenshot('08_new_project_form');

            const formElements = [
                'input[name="name"]',
                'textarea[name="description"]',
                'input[name="startDate"]',
                'input[name="endDate"]',
                'select[name="status"]'
            ];

            for (const selector of formElements) {
                const found = await this.waitForElement(selector, 5000);
                if (found) {
                    await this.log(`✅ Campo de formulario encontrado: ${selector}`);
                    this.results.passed++;
                } else {
                    await this.log(`❌ Campo de formulario no encontrado: ${selector}`, 'error');
                    this.results.failed++;
                }
            }

            // Probar formulario de nuevo sitio
            await this.page.goto(`${BASE_URL}/sites/new`);
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.takeScreenshot('09_new_site_form');

            // Probar formulario de nueva excavación
            await this.page.goto(`${BASE_URL}/excavations/new`);
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
            await this.takeScreenshot('10_new_excavation_form');
            
        } catch (error) {
            await this.log(`❌ Error en formularios: ${error.message}`, 'error');
            this.results.failed++;
        }
    }

    async testContextNavigator() {
        await this.log('🧭 Probando navegador de contexto...');
        
        try {
            // Volver al dashboard principal
            await this.page.goto(`${BASE_URL}/dashboard/researcher`);
            await this.page.waitForNavigation({ waitUntil: 'networkidle0' });

            // Buscar el navegador de contexto
            const contextNav = await this.page.$('[data-testid="context-navigator"]');
            if (contextNav) {
                await this.log('✅ Navegador de contexto encontrado');
                this.results.passed++;
                
                // Verificar elementos del navegador
                const contextElements = [
                    '[data-testid="context-breadcrumb"]',
                    '[data-testid="context-actions"]',
                    '[data-testid="context-filters"]'
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

                await this.takeScreenshot('11_context_navigator');
            } else {
                await this.log('❌ Navegador de contexto no encontrado', 'error');
                this.results.failed++;
            }
            
        } catch (error) {
            await this.log(`❌ Error en navegador de contexto: ${error.message}`, 'error');
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
                await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
                await this.takeScreenshot(`12_responsive_${viewport.name}`);
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

        const reportPath = path.join(__dirname, '../reports/testing/exhaustive_test_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('\n📊 REPORTE FINAL:');
        console.log(`✅ Pruebas exitosas: ${this.results.passed}`);
        console.log(`❌ Pruebas fallidas: ${this.results.failed}`);
        console.log(`📈 Tasa de éxito: ${report.summary.successRate}`);
        console.log(`📁 Screenshots: ${SCREENSHOT_DIR}`);
        console.log(`📄 Reporte completo: ${reportPath}`);
    }

    async run() {
        try {
            await this.init();
            
            // Ejecutar todas las pruebas
            await this.testLogin();
            await this.testDashboardNavigation();
            await this.testSidebarNavigation();
            await this.testToolsSection();
            await this.testForms();
            await this.testContextNavigator();
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
const test = new ExhaustiveVisualTest();
test.run(); 