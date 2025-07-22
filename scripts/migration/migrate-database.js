#!/usr/bin/env node

/**
 * Script de migración automática para Supabase
 * Ejecuta todas las migraciones en orden
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuración
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://avpaiyyjixtdopbciedr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'tu-service-key-aqui';

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Función para leer archivos de migración
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../../database/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Directorio de migraciones no encontrado');
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ordenar alfabéticamente

  return files.map(file => ({
    name: file,
    path: path.join(migrationsDir, file),
    content: fs.readFileSync(path.join(migrationsDir, file), 'utf8')
  }));
}

// Función para crear tabla de migraciones si no existe
async function createMigrationsTable() {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.schema_migrations (
          id SERIAL PRIMARY KEY,
          version VARCHAR(255) UNIQUE NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (error) {
      console.log('⚠️  No se pudo crear tabla de migraciones (puede que ya exista)');
    } else {
      console.log('✅ Tabla de migraciones creada');
    }
  } catch (error) {
    console.log('⚠️  Error al crear tabla de migraciones:', error.message);
  }
}

// Función para verificar si una migración ya fue aplicada
async function isMigrationApplied(version) {
  try {
    const { data, error } = await supabase
      .from('schema_migrations')
      .select('version')
      .eq('version', version)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.log('⚠️  Error al verificar migración:', error.message);
      return false;
    }

    return !!data;
  } catch (error) {
    return false;
  }
}

// Función para marcar migración como aplicada
async function markMigrationApplied(version) {
  try {
    const { error } = await supabase
      .from('schema_migrations')
      .insert({ version });

    if (error) {
      console.log('❌ Error al marcar migración como aplicada:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Error al marcar migración como aplicada:', error.message);
    return false;
  }
}

// Función principal de migración
async function runMigrations() {
  console.log('🚀 Iniciando migraciones de base de datos...\n');

  // Crear tabla de migraciones si no existe
  await createMigrationsTable();

  // Obtener archivos de migración
  const migrations = getMigrationFiles();

  if (migrations.length === 0) {
    console.log('❌ No se encontraron archivos de migración');
    return;
  }

  console.log(`📋 Encontradas ${migrations.length} migraciones:\n`);

  let appliedCount = 0;
  let skippedCount = 0;

  for (const migration of migrations) {
    const version = migration.name.replace('.sql', '');
    
    console.log(`📝 Procesando: ${migration.name}`);

    // Verificar si ya fue aplicada
    const isApplied = await isMigrationApplied(version);
    
    if (isApplied) {
      console.log(`⏭️  Ya aplicada: ${migration.name}`);
      skippedCount++;
      continue;
    }

    try {
      // Ejecutar migración
      const { error } = await supabase.rpc('exec_sql', {
        sql: migration.content
      });

      if (error) {
        console.log(`❌ Error en migración ${migration.name}:`, error.message);
        continue;
      }

      // Marcar como aplicada
      const marked = await markMigrationApplied(version);
      
      if (marked) {
        console.log(`✅ Aplicada: ${migration.name}`);
        appliedCount++;
      } else {
        console.log(`⚠️  Aplicada pero no marcada: ${migration.name}`);
        appliedCount++;
      }

    } catch (error) {
      console.log(`❌ Error ejecutando migración ${migration.name}:`, error.message);
    }

    console.log(''); // Línea en blanco
  }

  // Resumen
  console.log('📊 Resumen de migraciones:');
  console.log(`   ✅ Aplicadas: ${appliedCount}`);
  console.log(`   ⏭️  Omitidas: ${skippedCount}`);
  console.log(`   📝 Total: ${migrations.length}`);

  if (appliedCount > 0) {
    console.log('\n🎉 ¡Migraciones completadas exitosamente!');
  } else {
    console.log('\nℹ️  No se aplicaron nuevas migraciones');
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🔧 Script de Migración de Base de Datos

Uso:
  node scripts/migrate-database.js [opción]

Opciones:
  --help, -h     Mostrar esta ayuda
  --dry-run      Mostrar qué migraciones se ejecutarían sin aplicarlas
  --reset        Resetear todas las migraciones (¡CUIDADO!)

Variables de entorno:
  SUPABASE_URL           URL de tu proyecto Supabase
  SUPABASE_SERVICE_KEY   Service key de Supabase

Ejemplo:
  SUPABASE_SERVICE_KEY=tu-key node scripts/migrate-database.js
`);
}

// Función para dry run
async function dryRun() {
  console.log('🔍 Modo dry-run: Mostrando migraciones que se aplicarían\n');

  const migrations = getMigrationFiles();

  for (const migration of migrations) {
    const version = migration.name.replace('.sql', '');
    const isApplied = await isMigrationApplied(version);
    
    if (isApplied) {
      console.log(`⏭️  ${migration.name} (ya aplicada)`);
    } else {
      console.log(`✅ ${migration.name} (se aplicaría)`);
    }
  }
}

// Función para resetear migraciones
async function resetMigrations() {
  console.log('⚠️  ¡ADVERTENCIA! Esto eliminará todas las migraciones aplicadas.\n');
  console.log('¿Estás seguro? (escribe "SI" para confirmar)');
  
  // En un script real, aquí pedirías confirmación
  console.log('Para resetear, ejecuta manualmente en Supabase:');
  console.log('DELETE FROM schema_migrations;');
}

// Manejo de argumentos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else if (args.includes('--dry-run')) {
  dryRun();
} else if (args.includes('--reset')) {
  resetMigrations();
} else {
  runMigrations();
} 