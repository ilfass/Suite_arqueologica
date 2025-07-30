const { spawn } = require('child_process');
const path = require('path');

// Configuración de servicios
const services = [
  {
    name: 'Auth Service',
    path: 'apps/auth-service',
    command: 'npm',
    args: ['run', 'dev'],
    port: 4001
  },
  {
    name: 'API Gateway',
    path: 'gateway',
    command: 'npm',
    args: ['run', 'dev'],
    port: 4000
  }
];

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para imprimir con color
function log(service, message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[${timestamp}] ${service}: ${message}${colors.reset}`);
}

// Función para iniciar un servicio
function startService(service) {
  log(service.name, `🚀 Iniciando en puerto ${service.port}...`, 'cyan');
  
  const child = spawn(service.command, service.args, {
    cwd: path.join(__dirname, '..', service.path),
    stdio: 'pipe',
    shell: true
  });

  // Capturar salida del servicio
  child.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      log(service.name, output, 'green');
    }
  });

  child.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('Warning')) {
      log(service.name, output, 'red');
    }
  });

  child.on('error', (error) => {
    log(service.name, `❌ Error: ${error.message}`, 'red');
  });

  child.on('close', (code) => {
    if (code !== 0) {
      log(service.name, `❌ Proceso terminado con código ${code}`, 'red');
    } else {
      log(service.name, '✅ Proceso terminado exitosamente', 'green');
    }
  });

  return child;
}

// Función principal
async function startAllServices() {
  console.log(`${colors.bright}🏗️  Iniciando Suite Arqueológica - Arquitectura de Microservicios${colors.reset}\n`);
  
  console.log(`${colors.yellow}📋 Servicios a iniciar:${colors.reset}`);
  services.forEach(service => {
    console.log(`  • ${service.name} (puerto ${service.port})`);
  });
  console.log('');

  // Iniciar todos los servicios
  const processes = services.map(service => startService(service));

  // Manejar señales de terminación
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}🛑 Recibida señal de terminación...${colors.reset}`);
    processes.forEach(process => {
      process.kill('SIGINT');
    });
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log(`\n${colors.yellow}🛑 Recibida señal de terminación...${colors.reset}`);
    processes.forEach(process => {
      process.kill('SIGTERM');
    });
    process.exit(0);
  });

  // Esperar a que todos los procesos terminen
  await Promise.all(processes.map(process => {
    return new Promise((resolve) => {
      process.on('close', resolve);
    });
  }));
}

// Función para verificar dependencias
function checkDependencies() {
  console.log(`${colors.blue}🔍 Verificando dependencias...${colors.reset}`);
  
  const fs = require('fs');
  
  for (const service of services) {
    const packageJsonPath = path.join(__dirname, '..', service.path, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`${colors.red}❌ No se encontró package.json en ${service.path}${colors.reset}`);
      return false;
    }
    
    const nodeModulesPath = path.join(__dirname, '..', service.path, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`${colors.yellow}⚠️  node_modules no encontrado en ${service.path}${colors.reset}`);
      console.log(`${colors.cyan}💡 Ejecutando npm install...${colors.reset}`);
      
      const installProcess = spawn('npm', ['install'], {
        cwd: path.join(__dirname, '..', service.path),
        stdio: 'inherit'
      });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`${colors.green}✅ Dependencias instaladas para ${service.name}${colors.reset}`);
        } else {
          console.log(`${colors.red}❌ Error instalando dependencias para ${service.name}${colors.reset}`);
        }
      });
    }
  }
  
  return true;
}

// Función para mostrar información de uso
function showUsage() {
  console.log(`${colors.bright}📖 Uso:${colors.reset}`);
  console.log(`  node scripts/start_microservices.js`);
  console.log('');
  console.log(`${colors.bright}🔧 Comandos disponibles:${colors.reset}`);
  console.log(`  • Iniciar todos los servicios`);
  console.log(`  • Ctrl+C para detener todos los servicios`);
  console.log('');
  console.log(`${colors.bright}🌐 URLs de acceso:${colors.reset}`);
  console.log(`  • API Gateway: http://localhost:4000`);
  console.log(`  • Auth Service: http://localhost:4001`);
  console.log(`  • Health Check: http://localhost:4000/health`);
  console.log('');
  console.log(`${colors.bright}🧪 Probar servicios:${colors.reset}`);
  console.log(`  • node scripts/test_microservices.js`);
  console.log('');
}

// Función principal
async function main() {
  showUsage();
  
  if (!checkDependencies()) {
    console.log(`${colors.red}❌ Error verificando dependencias${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Dependencias verificadas${colors.reset}\n`);
  
  try {
    await startAllServices();
  } catch (error) {
    console.log(`${colors.red}❌ Error iniciando servicios: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = { startAllServices, checkDependencies }; 