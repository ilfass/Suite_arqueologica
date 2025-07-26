const http = require('http');

const services = [
    { name: 'Frontend', url: 'http://localhost:3000', port: 3000 },
    { name: 'Backend', url: 'http://localhost:4000/api/health', port: 4000 }
];

async function checkService(service) {
    return new Promise((resolve) => {
        const req = http.get(service.url, (res) => {
            if (res.statusCode === 200) {
                resolve({ name: service.name, status: 'OK', port: service.port });
            } else {
                resolve({ name: service.name, status: 'ERROR', port: service.port, error: `Status: ${res.statusCode}` });
            }
        });
        
        req.on('error', (error) => {
            resolve({ name: service.name, status: 'ERROR', port: service.port, error: error.message });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ name: service.name, status: 'TIMEOUT', port: service.port, error: 'Timeout after 5s' });
        });
    });
}

async function checkAllServices() {
    console.log('🔍 Verificando servicios antes de la prueba...\n');
    
    const results = await Promise.all(services.map(checkService));
    
    let allOk = true;
    
    results.forEach(result => {
        if (result.status === 'OK') {
            console.log(`✅ ${result.name} (puerto ${result.port}) - FUNCIONANDO`);
        } else {
            console.log(`❌ ${result.name} (puerto ${result.port}) - ERROR: ${result.error}`);
            allOk = false;
        }
    });
    
    console.log('\n' + '='.repeat(50));
    
    if (allOk) {
        console.log('🎉 Todos los servicios están funcionando');
        console.log('🚀 Listo para ejecutar la prueba visual automatizada');
        return true;
    } else {
        console.log('⚠️ Algunos servicios no están funcionando');
        console.log('💡 Asegúrate de que estén ejecutándose:');
        console.log('   - Frontend: cd frontend-web && npm run dev');
        console.log('   - Backend: cd backend && npm run dev');
        return false;
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    checkAllServices().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { checkAllServices }; 