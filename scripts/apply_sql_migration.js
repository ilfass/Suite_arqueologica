const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  console.log('🚀 Aplicando migración SQL para tabla public_profiles...');
  
  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create_table_supabase.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Contenido SQL a aplicar:');
    console.log(sqlContent);
    console.log('');
    
    // Crear archivo temporal para la migración
    const tempSqlPath = path.join(__dirname, 'temp_migration.sql');
    fs.writeFileSync(tempSqlPath, sqlContent);
    
    console.log('💡 Para aplicar esta migración, ejecuta uno de estos comandos:');
    console.log('');
    console.log('1. Usando Supabase CLI:');
    console.log(`   supabase db reset --linked`);
    console.log(`   supabase db push`);
    console.log('');
    console.log('2. O copia y pega este SQL en el SQL Editor de Supabase Dashboard:');
    console.log('   https://avpaiyyjixtdopbciedr.supabase.co/project/default/sql/new');
    console.log('');
    console.log('3. O ejecuta este comando directo:');
    console.log(`   psql "postgresql://postgres:[password]@db.avpaiyyjixtdopbciedr.supabase.co:5432/postgres" -f ${tempSqlPath}`);
    console.log('');
    console.log('📝 El archivo SQL está guardado en: scripts/create_table_supabase.sql');
    console.log('✅ Una vez aplicada la migración, reinicia el Auth Service');
    
  } catch (error) {
    console.error('❌ Error preparando migración:', error);
  }
}

applyMigration(); 