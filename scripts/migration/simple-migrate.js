#!/usr/bin/env node

/**
 * Script simple de migración para Supabase
 * Ejecuta SQL directamente sin dependencias complejas
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://avpaiyyjixtdopbciedr.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

// Función para hacer petición HTTP
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función para ejecutar SQL en Supabase
async function executeSQL(sql) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    }
  };

  try {
    const response = await makeRequest(url, options, { sql });
    return response;
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return { status: 500, error: error.message };
  }
}

// Función para leer archivos de migración
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../database/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Directorio de migraciones no encontrado');
    console.log('   Creando directorio...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  return files.map(file => ({
    name: file,
    path: path.join(migrationsDir, file),
    content: fs.readFileSync(path.join(migrationsDir, file), 'utf8')
  }));
}

// Función principal
async function runMigrations() {
  console.log('🚀 Iniciando migraciones de base de datos...\n');

  // Verificar configuración
  if (SUPABASE_ANON_KEY === 'tu-anon-key-aqui') {
    console.log('❌ Error: Debes configurar SUPABASE_ANON_KEY');
    console.log('   Ejemplo: SUPABASE_ANON_KEY=tu-key node scripts/simple-migrate.js');
    return;
  }

  // Obtener archivos de migración
  const migrations = getMigrationFiles();

  if (migrations.length === 0) {
    console.log('❌ No se encontraron archivos de migración');
    console.log('   Crea archivos .sql en database/migrations/');
    return;
  }

  console.log(`📋 Encontradas ${migrations.length} migraciones:\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const migration of migrations) {
    console.log(`📝 Ejecutando: ${migration.name}`);

    try {
      const response = await executeSQL(migration.content);

      if (response.status === 200) {
        console.log(`✅ Éxito: ${migration.name}`);
        successCount++;
      } else {
        console.log(`❌ Error: ${migration.name}`);
        console.log(`   Status: ${response.status}`);
        if (response.data && response.data.error) {
          console.log(`   Error: ${response.data.error}`);
        }
        errorCount++;
      }

    } catch (error) {
      console.log(`❌ Error ejecutando ${migration.name}:`, error.message);
      errorCount++;
    }

    console.log(''); // Línea en blanco
  }

  // Resumen
  console.log('📊 Resumen de migraciones:');
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📝 Total: ${migrations.length}`);

  if (successCount > 0) {
    console.log('\n🎉 ¡Migraciones completadas exitosamente!');
  } else {
    console.log('\n⚠️  No se pudieron aplicar las migraciones');
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🔧 Script Simple de Migración para Supabase

Uso:
  node scripts/simple-migrate.js

Variables de entorno:
  SUPABASE_URL        URL de tu proyecto Supabase
  SUPABASE_ANON_KEY   Anon key de Supabase

Ejemplo:
  SUPABASE_ANON_KEY=tu-key node scripts/simple-migrate.js

Nota: Este script ejecuta todas las migraciones en database/migrations/
      sin verificar si ya fueron aplicadas.
`);
}

// Manejo de argumentos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  runMigrations();
} 