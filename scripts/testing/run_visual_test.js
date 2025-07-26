const { checkAllServices } = require('./check_services_before_test');
const VisualTestAutomated = require('./visual_test_automated');

async function runVisualTest() {
    console.log('🤖 PRUEBA VISUAL AUTOMATIZADA - SUITE ARQUEOLÓGICA');
    console.log('='.repeat(60));
    
    try {
        // Paso 1: Verificar servicios
        console.log('\n📋 PASO 1: Verificando servicios...');
        const servicesOk = await checkAllServices();
        
        if (!servicesOk) {
            console.log('\n❌ No se pueden ejecutar las pruebas. Verifica los servicios.');
            process.exit(1);
        }
        
        // Paso 2: Ejecutar prueba visual
        console.log('\n📋 PASO 2: Ejecutando prueba visual automatizada...');
        const test = new VisualTestAutomated();
        await test.runTests();
        
        console.log('\n🎉 ¡Prueba visual automatizada completada!');
        
    } catch (error) {
        console.error('\n❌ Error durante la prueba:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runVisualTest();
}

module.exports = { runVisualTest }; 