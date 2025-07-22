const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔄 Reiniciando Suite Arqueológica...');

// Función para matar procesos
function killProcesses() {
  return new Promise((resolve) => {
    const pkill = spawn('pkill', ['-f', 'next dev']);
    pkill.on('close', () => {
      const pkill2 = spawn('pkill', ['-f', 'nodemon']);
      pkill2.on('close', () => {
        const pkill3 = spawn('pkill', ['-f', 'react-native']);
        pkill3.on('close', () => {
          console.log('✅ Procesos anteriores terminados');
          resolve();
        });
      });
    });
  });
}

// Función para verificar si un puerto está libre
function isPortFree(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Función para esperar a que un puerto esté libre
async function waitForPort(port, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await isPortFree(port)) {
      return true;
    }
    console.log(`⏳ Esperando que el puerto ${port} esté libre... (${i + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

// Función para iniciar el backend
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando backend...');
    const backend = spawn('npm', ['run', 'dev:backend'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Backend] ${output.trim()}`);
      if (output.includes('Server is running on port')) {
        console.log('✅ Backend iniciado correctamente');
        resolve(backend);
      }
    });

    backend.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString()}`);
    });

    backend.on('error', (error) => {
      console.error('❌ Error iniciando backend:', error);
      reject(error);
    });

    // Timeout después de 30 segundos
    setTimeout(() => {
      reject(new Error('Timeout iniciando backend'));
    }, 30000);
  });
}

// Función para iniciar el frontend
function startFrontend() {
  return new Promise((resolve, reject) => {
    console.log('🌐 Iniciando frontend...');
    const frontend = spawn('npm', ['run', 'dev:web'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Frontend] ${output.trim()}`);
      if (output.includes('Ready in') || output.includes('Local:')) {
        console.log('✅ Frontend iniciado correctamente');
        resolve(frontend);
      }
    });

    frontend.stderr.on('data', (data) => {
      console.error(`[Frontend Error] ${data.toString()}`);
    });

    frontend.on('error', (error) => {
      console.error('❌ Error iniciando frontend:', error);
      reject(error);
    });

    // Timeout después de 30 segundos
    setTimeout(() => {
      reject(new Error('Timeout iniciando frontend'));
    }, 30000);
  });
}

// Función principal
async function restartSystem() {
  try {
    // 1. Matar procesos existentes
    await killProcesses();
    
    // 2. Esperar a que los puertos estén libres
    console.log('⏳ Esperando que los puertos estén libres...');
    await waitForPort(4000);
    await waitForPort(3000);
    
    // 3. Iniciar backend
    const backend = await startBackend();
    
    // 4. Esperar un poco y luego iniciar frontend
    await new Promise(resolve => setTimeout(resolve, 3000));
    const frontend = await startFrontend();
    
    console.log('🎉 Sistema reiniciado correctamente!');
    console.log('📊 Backend: http://localhost:4000');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('');
    console.log('💡 Para detener el sistema, presiona Ctrl+C');
    
    // Manejar señales de terminación
    process.on('SIGINT', () => {
      console.log('\n🛑 Deteniendo sistema...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Deteniendo sistema...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error reiniciando sistema:', error.message);
    process.exit(1);
  }
}

// Ejecutar
restartSystem(); 